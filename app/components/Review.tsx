import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ReviewProps {
  review: string;
  color: string;
}

const Review: React.FC<ReviewProps> = ({ review, color }) => (
  <Text style={[styles.review, { color }]}>{review}</Text>
);

const styles = StyleSheet.create({
  review: {
    fontSize: 12,
  },
});

export default Review;
