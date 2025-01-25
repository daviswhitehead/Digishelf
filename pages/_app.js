import { useEffect } from 'react';
import { AppRegistry } from 'react-native';

// Import the icon font loader only on client side
function loadIconFont() {
  if (typeof window !== 'undefined') {
    require('../utils/iconFont');
  }
}

function App({ Component, pageProps }) {
  useEffect(() => {
    loadIconFont();
  }, []);

  return <Component {...pageProps} />;
}

// Register your app
if (typeof window !== 'undefined') {
  AppRegistry.registerComponent('App', () => App);
}

export default App; 