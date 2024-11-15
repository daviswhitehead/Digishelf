import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import books from "../data/booksWithColors.json";
import BookCard from "../components/BookCard";

export default function Home() {
  const renderItem = ({ item }) => <BookCard book={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  list: {
    alignItems: "center",
  },
});
