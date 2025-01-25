import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useResponsive } from "../utils/useResponsive";
import { getResponsiveValues, calculateTotalWidth } from "../utils/layoutUtils";
import books from "../data/booksWithColors.json";
import BookCard from "../components/BookCard";
import ListHeader from "../components/ListHeader";

const splitIntoColumns = (data, numColumns) => {
  const columns = Array.from({ length: numColumns }, () => []);
  data.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });
  return columns;
};

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { width, isLoading } = useResponsive();
  
  if (isLoading) return null; // Or a loading spinner component
  
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
      <ScrollView>
        <View style={[styles.contentContainer, { maxWidth: totalWidth, marginHorizontal: 'auto' }]}>
          <View style={[styles.row, { gap: margin }]}>
            {columns.map((column, index) => (
              <View key={index} style={[styles.column, { width: cardWidth }]}>
                {column.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginVertical: 20,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: 'nowrap',
  },
  column: {
    flexShrink: 0,
  },
});
