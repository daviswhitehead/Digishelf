import React from "react";
import { Text, StyleSheet } from "react-native";
import { textBlack } from "../utils/colors";

const Star = ({ review }) => <Text style={styles.review}>{review}</Text>;

const styles = StyleSheet.create({
  review: {
    fontSize: 12,
    color: textBlack,
  },
});

export default Star;
