import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SidePanel from "./SidePanel";

const ShelfHeader = ({
  title,
  subtitle,
  isPlaying,
  onPlayPausePress,
  scrollPosition,
  onMenuToggle,
  isPanelVisible,
}) => {
  if (isPanelVisible) return null; // Hide ShelfHeader when SidePanel is visible

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Hamburger Menu */}
        <Pressable onPress={onMenuToggle} style={styles.iconButton}>
          <Icon name="menu-outline" size={24} color="#000000" />
        </Pressable>

        {/* Title and Subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Play/Pause Button */}
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

      {/* Horizontal Scroll Bar */}
      <View style={styles.scrollBarContainer}>
        <View
          style={[styles.scrollBarIndicator, { width: `${scrollPosition}%` }]}
        />
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
    backgroundColor: "white",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "gray",
    fontSize: 20,
    fontWeight: "light",
    textAlign: "center",
    marginLeft: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBarContainer: {
    height: 4,
    backgroundColor: "#000000",
  },
  scrollBarIndicator: {
    height: "100%",
    backgroundColor: "#EAB308",
  },
});

export default ShelfHeader;
