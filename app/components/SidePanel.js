import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SidePanel = ({ isVisible, onClose, title, subtitle, scrollPosition }) => {
  return (
    <View
      style={[styles.container, isVisible ? styles.visible : styles.hidden]}
    >
      {/* Header - Matching ShelfHeader style */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.iconButton}>
            <Icon name="close-outline" size={24} color="#FFFFFF" />
          </Pressable>

          {/* Title and Subtitle */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Empty View for layout balance */}
          <View style={styles.iconButton} />
        </View>

        {/* Progress Bar - Matching ShelfHeader */}
        <View style={styles.scrollBarContainer}>
          <View
            style={[styles.scrollBarIndicator, { width: `${scrollPosition}%` }]}
          />
        </View>
      </View>

      {/* Panel Content */}
      <View style={styles.content}>
        {/* User Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon name="person-circle-outline" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.sectionTitle}>Steve Jorbs</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <View style={styles.menuItem}>
            <Icon name="share-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Share</Text>
          </View>
          <View style={styles.menuItem}>
            <Icon name="search-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Search</Text>
          </View>
          <View style={styles.menuItem}>
            <Icon name="filter-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Filter</Text>
          </View>
          <View style={styles.menuItem}>
            <Icon name="swap-vertical-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Sort</Text>
          </View>
          <View style={styles.menuItem}>
            <Icon name="pause-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Pause</Text>
          </View>
          <View style={styles.menuItem}>
            <Icon name="refresh-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Refresh</Text>
          </View>
          <View style={styles.menuItem}>
            <Icon name="settings-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Settings</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: 300,
    backgroundColor: "#1C1C1C",
    zIndex: 2000,
    transform: [{ translateX: -300 }],
    transition: "transform 0.3s ease-in-out",
  },
  visible: {
    transform: [{ translateX: 0 }],
  },
  hidden: {
    transform: [{ translateX: -300 }],
  },
  header: {
    paddingTop: 20,
  },
  headerContent: {
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
    justifyContent: "center",
    marginHorizontal: 8,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    fontSize: 20,
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
    backgroundColor: "white",
  },
  scrollBarIndicator: {
    height: "100%",
    backgroundColor: "#EAB308",
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  profileSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
  },
});

export default SidePanel;

