const withTM = require("next-transpile-modules")([
  "react-native-web",
  "react-native-vector-icons",
  "react-native-paper",
]);

module.exports = withTM({
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
    };
    // Support for .web.js extensions in React Native Web
    config.resolve.extensions = [
      ".web.js",
      ".web.tsx",
      ".web.ts",
      ".js",
      ".tsx",
      ".ts",
    ];
    return config;
  },
});
