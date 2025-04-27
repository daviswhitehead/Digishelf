/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@react-native',
    'react-native-vector-icons',
    'react-native-svg',
    '@mindinventory/react-native-stagger-view',
  ],
  experimental: {
    esmExternals: 'loose',
  },
  compiler: {
    styledComponents: false,
    emotion: false,
    reactRemoveProperties: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable static optimization and exports
  output: 'standalone',
  webpack: config => {
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Add loader for react-native-vector-icons
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['url-loader'],
    });

    // Alias react-native to react-native-web
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    // Ensure modules can resolve correctly
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    return config;
  },
  // Enable responsive image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    disableStaticImages: true,
  },
};

module.exports = nextConfig;
