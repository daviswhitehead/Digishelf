import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Rating from "./Rating";
import Review from "./Review";

const BookCard = ({ book }) => {
  return (
    <View style={styles.bookCard}>
      {/* Book Cover */}
      <Image
        source={{ uri: book.coverImage }}
        style={styles.coverImage}
        resizeMode="cover" // Ensures proper aspect ratio
      />

      {/* Book Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Rating rating={book.rating} />
        <Review review={book.review} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  coverImage: {
    width: "100%",
    height: 200, // Fixed height for the image
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
});

export default BookCard;
