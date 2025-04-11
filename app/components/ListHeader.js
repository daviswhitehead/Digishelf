import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ListHeader = ({ title, subtitle, isPlaying, onPlayPausePress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.background, { height: "100%" }]} />
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <Pressable onPress={onPlayPausePress} style={styles.iconButton}>
          {({ pressed }) => (
            <Icon
              name={isPlaying ? "pause-outline" : "play-outline"}
              size={20}
              color={pressed ? "#808080" : "#000000"}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 20,
    left: 20,
    zIndex: 1000,
    height: "auto",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    opacity: 0.8,
    clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    padding: 10,
    marginRight: 10,
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 5,
    whiteSpace: "nowrap",
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
    marginTop: 2,
    whiteSpace: "nowrap",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonPressed: {
    backgroundColor: "gray",
  },
});

export default ListHeader;
