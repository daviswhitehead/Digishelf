import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useResponsive } from '../../../utils/useResponsive';
import { getResponsiveValues, calculateTotalWidth } from '../../../utils/layoutUtils';
import { fetchItemsByShelfId } from '../../../utils/firestoreUtils';
import { db } from '../../../utils/firebase';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { BookCard } from '../../../components/BookCard';
import { ShelfHeader } from '../../../components/ShelfHeader';
import QRCode from '../../../components/QRCode';
import { useRouter } from 'next/router';
import ColorThief from 'colorthief';
import { throttle } from 'lodash'; // Import lodash for throttling and debouncing
import { SidePanel } from '../../../components/SidePanel'; // Add this import
import type { Book } from '../../../types/book';

const splitIntoColumns = (data: Book[], numColumns: number): Book[][] => {
  // Distributes data evenly across the specified number of columns
  const columns = Array.from({ length: numColumns }, () => [] as Book[]);
  data.forEach((item: Book, index: number) => {
    columns[index % numColumns].push(item);
  });
  return columns;
};

const fetchBooksWithPrimaryColor = async (shelfId: string): Promise<Book[]> => {
  const booksData = await fetchItemsByShelfId(shelfId);
  const batch = writeBatch(db); // Initialize Firestore batch

  const updatedBooks = await Promise.all(
    booksData.map(async book => {
      if (!book.primaryColor && book.coverImage) {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = book.coverImage;

        const primaryColor = await new Promise<string | null>(resolve => {
          img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            const hexColor = `#${dominantColor.map(c => c.toString(16).padStart(2, '0')).join('')}`;
            resolve(hexColor);
          };
          img.onerror = () => resolve(null); // No fallback color
        });

        if (primaryColor) {
          const itemDocRef = doc(db, 'shelves', shelfId, 'items', book.id);
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
    console.error('Failed to commit Firestore batch:', error);
  }

  return updatedBooks;
};

interface BookGridProps {
  columns: Book[][];
  cardWidth: number;
  margin: number;
}

const BookGrid: React.FC<BookGridProps> = ({ columns, cardWidth, margin }) => (
  <View style={[styles.row, { gap: margin }]}>
    {columns.map((column, index) => (
      <View key={index} style={[styles.column, { width: cardWidth }]}>
        {column.map(book => (
          <BookCard key={book.id} book={book} width={cardWidth} onPress={() => {}} />
        ))}
      </View>
    ))}
  </View>
);

export default function Shelf() {
  const router = useRouter();
  const { shelfId } = router.query;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false); // Track SidePanel visibility
  const { width, isLoading } = useResponsive();
  const [currentUrl, setCurrentUrl] = useState('');
  const [shelfDetails, setShelfDetails] = useState({
    displayName: '',
    sourceDisplayName: '',
    userId: '',
  });

  const isAutoscrolling = useRef(false); // Track if autoscroll is active
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

  // Autoscroll logic using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const autoScroll = () => {
      if (isPlaying) {
        isAutoscrolling.current = true;
        window.scrollBy(0, 2); // Scroll down by 2px per frame

        // Throttled update of scrollPosition during autoscroll
        throttledUpdateScrollPosition();

        animationFrameId = requestAnimationFrame(autoScroll);
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
    if (typeof window !== 'undefined') {
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

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        handleScroll.cancel();
      };
    }
  }, []);

  useEffect(() => {
    if (!shelfId || typeof shelfId !== 'string') return;

    const fetchShelfDetails = async () => {
      try {
        const shelfDoc = await getDoc(doc(db, 'shelves', shelfId));
        if (shelfDoc.exists()) {
          const shelfData = shelfDoc.data();
          setShelfDetails({
            displayName: shelfData.displayName || 'Shelf',
            sourceDisplayName: shelfData.sourceDisplayName || 'Unknown Source',
            userId: shelfData.userId,
          });
        } else {
          throw new Error('Shelf not found.');
        }

        const booksWithColors = await fetchBooksWithPrimaryColor(shelfId);
        setBooks(booksWithColors);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch shelf details or books.');
      } finally {
        setLoading(false);
      }
    };

    fetchShelfDetails();
  }, [shelfId]);

  if (isLoading || loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (books.length === 0) return <Text>No books available.</Text>;

  const {
    columns: numColumns,
    cardWidth,
    margin,
  } = getResponsiveValues(isPanelVisible ? width - 350 : width);
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
        userId={shelfDetails.userId}
        shelfId={typeof shelfId === 'string' ? shelfId : ''}
      />
      <QRCode url={currentUrl} />
      <View
        style={[
          styles.contentContainer,
          { maxWidth: totalWidth, marginHorizontal: 'auto' },
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
    position: 'relative',
    marginVertical: 20,
    backgroundColor: '#000000',
    minHeight: '100vh',
    transition: 'all 0.3s ease-in-out', // Smooth transition for all changes
  },
  containerShift: {
    marginLeft: 350, // Space for the side panel
    width: 'calc(100% - 350px)', // Reduce width by panel width
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    transition: 'all 0.3s ease-in-out', // Smooth transition for content
  },
  contentContainerShift: {
    width: 'calc(100% - 350px)', // Adjust width when panel is open
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
  column: {
    flexShrink: 0,
  },
  url: {
    color: '#FFFFFF',
    padding: 20,
    fontSize: 14,
  },
});
