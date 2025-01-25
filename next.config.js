const withTM = require("next-transpile-modules")([
  "react-native-web",
  "@mindinventory/react-native-stagger-view",
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
  // Enable responsive image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
});
