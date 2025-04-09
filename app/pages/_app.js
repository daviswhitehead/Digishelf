import React, { useEffect } from "react";
import { AppRegistry, View, StyleSheet } from "react-native";
import { UserProvider } from "../utils/useUser";

// Import the icon font loader only on client side
function loadIconFont() {
  if (typeof window !== "undefined") {
    require("../utils/iconFont");
  }
}

function App({ Component, pageProps }) {
  useEffect(() => {
    loadIconFont();
  }, []);

  return (
    <UserProvider>
      <View style={styles.root}>
        <Component {...pageProps} />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
    minHeight: "100vh", // Ensure full viewport height
  },
});

// Register your app
if (typeof window !== "undefined") {
  AppRegistry.registerComponent("App", () => App);
}

export default App;
