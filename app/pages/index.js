import React from "react";
import { useRouter } from "next/router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DigiShelf</Text>
      <Text style={styles.subtitle}>
        Your digital shelf for managing books, games, and more.
      </Text>
      <TouchableOpacity onPress={handleGetStarted} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    padding: 50,
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    marginBottom: 20,
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 40,
    color: "#fff",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#4caf50",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
