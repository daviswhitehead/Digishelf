import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { starColor, starFilledColor } from '../utils/colors';

interface StarProps {
  filled: boolean;
}

const Star: React.FC<StarProps> = ({ filled }) => (
  <View style={styles.star}>
    <Text style={[styles.starText, filled && styles.filledStar]}>★</Text>
  </View>
);

const styles = StyleSheet.create({
  star: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledStar: {
    color: starFilledColor,
  },
  starText: {
    fontSize: 16,
    color: starColor,
  },
});

export default Star;
