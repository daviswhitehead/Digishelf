import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useResponsive } from "../../../utils/useResponsive";
import {
  getResponsiveValues,
  calculateTotalWidth,
} from "../../../utils/layoutUtils";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { fetchItemsByShelfId } from "../../../utils/firestoreUtils";
import BookCard from "../../../components/BookCard";
import ListHeader from "../../../components/ListHeader";
import QRCodeComponent from "../../../components/QRCode";

const splitIntoColumns = (data, numColumns) => {
  // Distributes data evenly across the specified number of columns
  const columns = Array.from({ length: numColumns }, () => []);
  data.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });
  return columns;
};

const BookGrid = ({ columns, cardWidth, margin }) => (
  <View style={[styles.row, { gap: margin }]}>
    {columns.map((column, index) => (
      <View key={index} style={[styles.column, { width: cardWidth }]}>
        {column.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </View>
    ))}
  </View>
);

export default function Shelf() {
  // Removed unused state variables and added comments for clarity
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { width, isLoading } = useResponsive();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await fetchItemsByShelfId("EXVQcLV39wYB3PIt8JCY");
        setBooks(booksData);
      } catch (err) {
        setError("Failed to fetch books.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useAutoScroll(isPlaying);

  if (isLoading || loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (books.length === 0) return <Text>No books available.</Text>; // Handle empty state

  const { columns: numColumns, cardWidth, margin } = getResponsiveValues(width);
  const columns = splitIntoColumns(books, numColumns);
  const totalWidth = calculateTotalWidth(numColumns, cardWidth, margin);

  return (
    <View style={styles.container}>
      <ListHeader
        title="Read Books"
        isPlaying={isPlaying}
        onPlayPausePress={() => setIsPlaying(!isPlaying)}
      />

      <QRCodeComponent url={currentUrl} />

      <View
        style={[
          styles.contentContainer,
          { maxWidth: totalWidth, marginHorizontal: "auto" },
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
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 20,
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
