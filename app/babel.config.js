module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['react-native-web', { commonjs: true }],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-transform-class-properties'],
    ['@babel/plugin-transform-export-namespace-from'],
  ],
};
