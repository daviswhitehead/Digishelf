import '../utils/iconFont';
import React from 'react';
import type { AppProps } from 'next/app';
import { View } from 'react-native';
import { UserProvider } from '../hooks/useUser';

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Initialize React Native Web on the client side
    if (typeof window !== 'undefined') {
      require('react-native-web');
    }
  }, []);

  return (
    <UserProvider>
      <View style={styles.container}>
        <Component {...pageProps} />
      </View>
    </UserProvider>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
    minHeight: '100vh',
  },
} as const;
