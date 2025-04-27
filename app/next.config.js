/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    // Modify the module rules
    config.module.rules.push(
      // Handle asset imports
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/_next/static/fonts/',
            outputPath: 'static/fonts/',
          },
        },
      },
      // Handle React Native Web
      {
        test: /\.js$/,
        include: [/node_modules\/react-native-/, /node_modules\/@react-native/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      }
    );

    // Alias react-native to react-native-web
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    };

    return config;
  },
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-svg',
    'react-native-svg-web',
    '@react-native/assets-registry',
    '@react-native-community/art',
  ],
};

module.exports = nextConfig;
