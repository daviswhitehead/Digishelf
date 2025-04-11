import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { SPACING } from "../constants/layout";
import Rating from "./Rating";
import Review from "./Review";
import { shadowColor } from "../utils/colors";

const BookCard = ({ book, cardWidth, margin }) => {
  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    if (book.coverImage) {
      Image.getSize(
        book.coverImage,
        (imgWidth, imgHeight) => {
          const dynamicHeight = (imgHeight / imgWidth) * cardWidth;

          setImageHeight(dynamicHeight);
        },
        () => {
          setImageHeight(null); // Handle error by not setting height
        }
      );
    }
  }, [book.coverImage, cardWidth]);

  if (!book.coverImage) {
    // Do not render if coverImage is null or an empty string
    return null;
  }

  return (
    <View
      style={[
        styles.bookCard,
        {
          width: cardWidth,
          backgroundColor: book.primaryColor || "#f8f8f8",
          marginBottom: margin,
        },
      ]}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {imageHeight && ( // Only render the Image if height is calculated
          <Image
            source={{ uri: book.coverImage }}
            style={[styles.coverImage, { height: imageHeight }]}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Book Details */}
      {(book.userRating !== null || book.userReview !== "") && (
        <View style={styles.detailsContainer}>
          {book.userRating !== null && <Rating rating={book.userRating} />}
          {book.userReview !== "" && <Review review={book.userReview} />}
        </View>
      )}
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
    width: "100%", // Fixed width
    borderRadius: 5,
  },
  detailsContainer: {
    padding: SPACING.CARD_PADDING,
  },
});

export default BookCard;
