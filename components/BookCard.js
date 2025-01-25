import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useResponsive } from "../utils/useResponsive";
import { getResponsiveValues } from "../utils/layoutUtils";
import { SPACING } from "../constants/layout";
import Rating from "./Rating";
import Review from "./Review";
import { shadowColor } from "../utils/colors";

const BookCard = ({ book }) => {
  const { width, isMobile } = useResponsive();
  const [imageHeight, setImageHeight] = useState(0);
  
  const { cardWidth, margin } = getResponsiveValues(width, isMobile);

  useEffect(() => {
    Image.getSize(book.coverImage, (imgWidth, height) => {
      const dynamicHeight = (height / imgWidth) * cardWidth;
      setImageHeight(dynamicHeight);
    });
  }, [book.coverImage, cardWidth]);

  return (
    <View
      style={[
        styles.bookCard,
        { 
          width: cardWidth,
          backgroundColor: book.dominantColor || "#f8f8f8",
          marginBottom: margin,
        },
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
    shadowColor: shadowColor,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    padding: SPACING.IMAGE_PADDING,
  },
  coverImage: {
    width: "100%", // Fills the container width
    borderRadius: 5, // Slight border radius for the image
  },
  detailsContainer: {
    padding: SPACING.CARD_PADDING,
  },
});

export default BookCard;
