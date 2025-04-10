import React from "react";
import { useRouter } from "next/router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Sidebar = () => {
  const router = useRouter();
  const { userId } = router.query;

  const links = [
    { name: "Profile", path: `/${userId}` },
    { name: "Integrations", path: `/${userId}/integrations` },
    { name: "Shelves", path: `/${userId}/shelves` },
  ];

  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>DigiShelf</Text>
      <View style={styles.linkContainer}>
        {links.map((link) => (
          <TouchableOpacity
            key={link.name}
            onPress={() => router.push(link.path)}
            style={[
              styles.link,
              router.pathname === link.path && styles.activeLink,
            ]}
          >
            <Text
              style={[
                styles.linkText,
                router.pathname === link.path && styles.activeLinkText,
              ]}
            >
              {link.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: "100vh",
    padding: 20,
    position: "fixed",
    top: 0,
    left: 0,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 10,
  },
  link: {
    marginBottom: 15,
    paddingVertical: 5,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
  },
  activeLink: {
    // No additional styles for the active link container
  },
  activeLinkText: {
    fontWeight: "bold",
    color: "#4caf50",
  },
});

export default Sidebar;
