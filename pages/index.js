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
  const { width, isMobile, isTablet } = useResponsive();
  const { columns: numColumns, cardWidth, margin } = getResponsiveValues(width, isMobile, isTablet);
  
  const columns = splitIntoColumns(books, numColumns);
  const totalWidth = calculateTotalWidth(numColumns, cardWidth, margin);

  const handlePlayPausePress = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <ListHeader
        title="Read Books"
        isPlaying={isPlaying}
        onPlayPausePress={handlePlayPausePress}
      />
      <ScrollView>
        <View style={[
          styles.contentContainer,
          { 
            maxWidth: totalWidth,
            marginHorizontal: 'auto',
            paddingHorizontal: margin,
          }
        ]}>
          <View style={[styles.row, { gap: margin }]}>
            {columns.map((column, index) => (
              <View key={index} style={styles.column}>
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
    position: 'relative', // Ensure absolute positioning works correctly
  },
  contentContainer: {
    width: '100%',
    paddingTop: 80, // Add space for the header
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  column: {
    flex: 1,
  },
});
