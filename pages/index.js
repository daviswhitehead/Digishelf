import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import books from "../data/booksWithColors.json";
import BookCard from "../components/BookCard";

const NUM_COLUMNS = 5;

// Helper to split data into columns
const splitIntoColumns = (data, numColumns) => {
  const columns = Array.from({ length: numColumns }, () => []);
  data.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });
  return columns;
};

export default function Home() {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 20 * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  const columns = splitIntoColumns(books, NUM_COLUMNS);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        {columns.map((column, index) => (
          <View key={index} style={styles.column}>
            {column.map((book) => (
              <BookCard key={book.id} book={book} cardWidth={cardWidth} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
});
