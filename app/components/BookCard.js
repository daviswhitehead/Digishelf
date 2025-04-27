import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SPACING } from '../constants/layout';
import Rating from './Rating';
import Review from './Review';
import { shadowColor } from '../utils/colors';

const getContrastColor = hexColor => {
  // Ensure the hexColor is valid and has 6 characters
  if (!hexColor || hexColor.length !== 7 || hexColor[0] !== '#') {
    return '#000000'; // Default to black if invalid
  }

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate relative luminance using WCAG formula
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const BookCard = ({ book, cardWidth, margin }) => {
  const [imageHeight, setImageHeight] = useState(null);
  const backgroundColor = book.primaryColor
    ? `${book.primaryColor}E6` // Add 90% opacity (E6 in hex)
    : '#f8f8f8';
  const textColor = book.primaryColor ? getContrastColor(book.primaryColor) : '#000';

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
          backgroundColor,
          marginBottom: margin,
        },
      ]}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {imageHeight && (
          <Image
            source={{ uri: book.coverImage }}
            style={[styles.coverImage, { height: imageHeight }]}
            resizeMode='cover'
            alt={`Cover of ${book.title || 'book'}`}
          />
        )}
      </View>

      {/* Book Details */}
      {(book.userRating !== null || book.userReview !== '') && (
        <View style={styles.detailsContainer}>
          {book.userRating !== null && <Rating rating={book.userRating} />}
          {book.userReview !== '' && <Review review={book.userReview} color={textColor} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.1,
    borderColor: '#374151',
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
    width: '100%', // Fixed width
    borderRadius: 10,
  },
  detailsContainer: {
    padding: SPACING.CARD_PADDING,
  },
});

export default BookCard;
