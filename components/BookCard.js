import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { shadowColor } from "../utils/colors";
import Rating from "./Rating";
import Review from "./Review";

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
        <Rating rating={book.rating} />
        <Review review={book.review} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    width: 250,
    height: 500,
    borderRadius: 8,
    overflow: "hidden",
    margin: 10,
    shadowColor: shadowColor,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  coverImage: {
    width: "100%",
    height: 320,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 15,
    flex: 1,
    overflow: "scroll",
  },
});

export default BookCard;
