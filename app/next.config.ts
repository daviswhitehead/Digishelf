import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const config: NextConfig = {
  transpilePackages: [
    'react-native-web',
    '@mindinventory/react-native-stagger-view',
    'react-native-paper',
    'react-native-vector-icons',
  ],
  webpack: (config: WebpackConfig) => {
    // Initialize resolve if it doesn't exist
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    // Support for .web.js extensions in React Native Web
    config.resolve.extensions = ['.web.js', '.web.tsx', '.web.ts', '.js', '.tsx', '.ts'];

    // Initialize module and rules if they don't exist
    if (!config.module) {
      config.module = { rules: [] };
    }
    if (!config.module.rules) {
      config.module.rules = [];
    }

    // Add loader for react-native-vector-icons
    config.module.rules.push({
      test: /\.ttf$/,
      loader: 'url-loader', // or directly file-loader
      include: /node_modules\/react-native-vector-icons/,
    });

    return config;
  },
  // Enable responsive image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default config;
