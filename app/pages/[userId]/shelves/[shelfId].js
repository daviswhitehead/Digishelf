import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useResponsive } from "../../../utils/useResponsive";
import {
  getResponsiveValues,
  calculateTotalWidth,
} from "../../../utils/layoutUtils";
import { fetchItemsByShelfId } from "../../../utils/firestoreUtils";
import { db } from "../../../utils/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import BookCard from "../../../components/BookCard";
import ShelfHeader from "../../../components/ShelfHeader";
import QRCodeComponent from "../../../components/QRCode";
import { useRouter } from "next/router";
import ColorThief from "colorthief";
import { throttle, debounce } from "lodash"; // Import lodash for throttling and debouncing
import SidePanel from "../../../components/SidePanel"; // Add this import

const splitIntoColumns = (data, numColumns) => {
  // Distributes data evenly across the specified number of columns
  const columns = Array.from({ length: numColumns }, () => []);
  data.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });
  return columns;
};

const fetchBooksWithPrimaryColor = async (shelfId) => {
  const booksData = await fetchItemsByShelfId(shelfId);
  const batch = writeBatch(db); // Initialize Firestore batch

  const updatedBooks = await Promise.all(
    booksData.map(async (book) => {
      if (!book.primaryColor && book.coverImage) {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = book.coverImage;

        const primaryColor = await new Promise((resolve) => {
          img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            const hexColor = `#${dominantColor
              .map((c) => c.toString(16).padStart(2, "0"))
              .join("")}`;
            resolve(hexColor);
          };
          img.onerror = () => resolve(null); // No fallback color
        });

        if (primaryColor) {
          const itemDocRef = doc(db, "items", book.id);
          batch.update(itemDocRef, {
            primaryColor,
            updatedAt: serverTimestamp(), // Use Firestore server timestamp
          });
          return { ...book, primaryColor };
        }
      }
      return book;
    })
  );

  try {
    await batch.commit(); // Commit all batched updates
  } catch (error) {
    console.error("Failed to commit Firestore batch:", error);
  }

  return updatedBooks;
};

const BookGrid = ({ columns, cardWidth, margin }) => (
  <View style={[styles.row, { gap: margin }]}>
    {columns.map((column, index) => (
      <View key={index} style={[styles.column, { width: cardWidth }]}>
        {column.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            cardWidth={cardWidth}
            margin={margin}
          />
        ))}
      </View>
    ))}
  </View>
);

export default function Shelf() {
  const router = useRouter();
  const { shelfId, autoplay } = router.query;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false); // Track SidePanel visibility
  const { width, isLoading } = useResponsive();
  const [currentUrl, setCurrentUrl] = useState("");
  const [shelfDetails, setShelfDetails] = useState({
    displayName: "",
    sourceDisplayName: "",
    userId: "",
  });
  const hasAutoPlayedRef = useRef(false); // Track if we've already auto-played

  const isAutoscrolling = useRef(false); // Track if autoscroll is active
  const isResettingRef = useRef(false); // Track if we're resetting to top
  const throttledUpdateScrollPosition = useRef(
    throttle(() => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollableHeight = scrollHeight - clientHeight;

      const position = (scrollTop / scrollableHeight) * 100;
      setScrollPosition(Math.min(Math.max(position, 0), 100)); // Clamp between 0 and 100
    }, 1000) // Throttle updates to every 200ms
  ).current;

  // Autoscroll logic using requestAnimationFrame with bottom detection and reset
  useEffect(() => {
    let animationFrameId;

    const getScrollPositions = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      return {
        currentOffset: scrollTop,
        maxScroll: scrollHeight - clientHeight,
      };
    };

    const handleScrollReset = () => {
      isResettingRef.current = true;
      
      // Smoothly scroll to the very top (position 0)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      let checkCount = 0;
      const maxChecks = 100; // Maximum number of checks (5 seconds max wait)

      // Poll to check when scroll has reached the top, then wait 1 second before resuming
      const checkScrollComplete = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If we're at the top (within 1px threshold for precision)
        if (scrollTop <= 1) {
          // Ensure we're exactly at 0 (fallback in case smooth scroll didn't complete perfectly)
          if (scrollTop > 0) {
            window.scrollTo(0, 0);
          }
          
          // We've reached the top, now wait 1 second before resuming
          setTimeout(() => {
            isResettingRef.current = false;
            if (isPlaying) {
              animationFrameId = requestAnimationFrame(autoScroll);
            }
          }, 1000); // 1 second pause at the top before resuming
        } else if (checkCount < maxChecks) {
          // Still scrolling up, check again in a short interval
          checkCount++;
          setTimeout(checkScrollComplete, 50);
        } else {
          // Fallback: if smooth scroll takes too long, force to top and continue
          window.scrollTo(0, 0);
          setTimeout(() => {
            isResettingRef.current = false;
            if (isPlaying) {
              animationFrameId = requestAnimationFrame(autoScroll);
            }
          }, 1000);
        }
      };

      // Start checking after a brief delay to allow smooth scroll animation to begin
      setTimeout(checkScrollComplete, 100);
    };

    const autoScroll = () => {
      if (isPlaying) {
        isAutoscrolling.current = true;
        const { currentOffset, maxScroll } = getScrollPositions();

        // Check if we've reached the bottom
        if (currentOffset >= maxScroll && !isResettingRef.current) {
          handleScrollReset();
        } else if (!isResettingRef.current) {
          // Continue scrolling down
          window.scrollBy(0, 2); // Scroll down by 2px per frame

          // Throttled update of scrollPosition during autoscroll
          throttledUpdateScrollPosition();

          animationFrameId = requestAnimationFrame(autoScroll);
        }
      } else {
        isAutoscrolling.current = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    autoScroll();

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [isPlaying, throttledUpdateScrollPosition]);

  // Throttled scroll handler for manual scrolling
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);

      const handleScroll = throttle(() => {
        if (isAutoscrolling.current) return; // Skip updates during autoscroll

        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollableHeight = scrollHeight - clientHeight;

        const position = (scrollTop / scrollableHeight) * 100;
        setScrollPosition(Math.min(Math.max(position, 0), 100));
      }, 100); // Throttle to run every 100ms

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        handleScroll.cancel();
      };
    }
  }, []);

  // Reset auto-play flag when shelf changes
  useEffect(() => {
    hasAutoPlayedRef.current = false;
  }, [shelfId]);

  useEffect(() => {
    if (!shelfId) return;

    const fetchShelfDetails = async () => {
      try {
        const shelfDoc = await getDoc(doc(db, "shelves", shelfId));
        if (shelfDoc.exists()) {
          const shelfData = shelfDoc.data();
          setShelfDetails({
            displayName: shelfData.displayName || "Shelf",
            sourceDisplayName: shelfData.sourceDisplayName || "Unknown Source",
            userId: shelfData.userId,
          });
        } else {
          throw new Error("Shelf not found.");
        }

        const booksWithColors = await fetchBooksWithPrimaryColor(shelfId);
        setBooks(booksWithColors);
      } catch (err) {
        setError("Failed to fetch shelf details or books.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShelfDetails();
  }, [shelfId]);

  // Auto-play functionality when autoplay query parameter is present
  useEffect(() => {
    // Only auto-play if:
    // 1. autoplay query param is 'true'
    // 2. Books are loaded (not loading and books exist)
    // 3. We haven't already auto-played for this page load
    // 4. Currently not playing
    if (
      autoplay === 'true' &&
      !loading &&
      books.length > 0 &&
      !hasAutoPlayedRef.current &&
      !isPlaying
    ) {
      // Small delay to ensure layout is ready
      const autoPlayTimer = setTimeout(() => {
        setIsPlaying(true);
        hasAutoPlayedRef.current = true;
      }, 500); // 500ms delay to ensure layout is ready

      return () => clearTimeout(autoPlayTimer);
    }
  }, [autoplay, loading, books.length, isPlaying, router]);

  if (isLoading || loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (books.length === 0) return <Text>No books available.</Text>;

  const { columns: numColumns, cardWidth, margin } = getResponsiveValues(
    isPanelVisible ? width - 350 : width
  );
  const columns = splitIntoColumns(books, numColumns);
  const totalWidth = calculateTotalWidth(numColumns, cardWidth, margin);

  return (
    <View style={[styles.container, isPanelVisible && styles.containerShift]}>
      <ShelfHeader
        title={shelfDetails.displayName}
        subtitle={shelfDetails.sourceDisplayName}
        isPlaying={isPlaying}
        onPlayPausePress={() => setIsPlaying(!isPlaying)}
        scrollPosition={scrollPosition}
        onMenuToggle={() => setIsPanelVisible(true)}
        isPanelVisible={isPanelVisible}
      />
      <SidePanel
        isVisible={isPanelVisible}
        onClose={() => setIsPanelVisible(false)}
        title={shelfDetails.displayName}
        subtitle={shelfDetails.sourceDisplayName}
        scrollPosition={scrollPosition}
        userId={shelfDetails.userId}
      />
      <QRCodeComponent url={currentUrl} />
      <View
        style={[
          styles.contentContainer,
          { maxWidth: totalWidth, marginHorizontal: "auto" },
          isPanelVisible && styles.contentContainerShift,
        ]}
      >
        <BookGrid columns={columns} cardWidth={cardWidth} margin={margin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    marginVertical: 20,
    backgroundColor: "#000000",
    minHeight: "100vh",
    transition: "all 0.3s ease-in-out", // Smooth transition for all changes
  },
  containerShift: {
    marginLeft: 350, // Space for the side panel
    width: "calc(100% - 350px)", // Reduce width by panel width
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 20,
    transition: "all 0.3s ease-in-out", // Smooth transition for content
  },
  contentContainerShift: {
    width: "calc(100% - 350px)", // Adjust width when panel is open
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  column: {
    flexShrink: 0,
  },
  url: {
    color: "#FFFFFF",
    padding: 20,
    fontSize: 14,
  },
});
