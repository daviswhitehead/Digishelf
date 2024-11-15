import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const BookCard = ({ book }) => {
  return (
    <View style={styles.bookCard}>
      {/* Book Cover */}
      <Image
        source={{ uri: book.coverImage }}
        style={styles.coverImage}
        resizeMode="contain"
      />

      {/* Book Details */}
      <View
        style={[
          styles.detailsContainer,
          { backgroundColor: book.dominantColor },
        ]}
      >
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        {/* Additional Book Details */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    width: 300,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  coverImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 8,
  },
});

export default BookCard;
