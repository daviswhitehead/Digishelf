import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Rating from "./Rating";
import Review from "./Review";
import { shadowColor } from "../utils/colors";

const BookCard = ({ book, cardWidth }) => {
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    // Retrieve image dimensions and calculate dynamic height
    Image.getSize(book.coverImage, (width, height) => {
      const dynamicHeight = (height / width) * cardWidth;
      setImageHeight(dynamicHeight);
    });
  }, [book.coverImage]);

  return (
    <View
      style={[
        styles.bookCard,
        { width: cardWidth, backgroundColor: book.dominantColor || "#f8f8f8" },
      ]}
    >
      {/* Image Container with Padding */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.coverImage }}
          style={[styles.coverImage, { height: imageHeight }]}
          resizeMode="cover"
        />
      </View>

      {/* Book Details */}
      <View style={styles.detailsContainer}>
        <Rating rating={book.rating} />
        <Review review={book.review} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: shadowColor,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    padding: 3, // Adds spacing around the image
  },
  coverImage: {
    width: "100%", // Fills the container width
    borderRadius: 5, // Slight border radius for the image
  },
  detailsContainer: {
    padding: 10,
  },
});

export default BookCard;
