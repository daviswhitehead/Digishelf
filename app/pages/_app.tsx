import type { AppProps } from 'next/app';
import React from 'react';
import { StyleRegistry } from 'styled-jsx';
import { AppRegistry } from 'react-native-web';
import Head from 'next/head';

// Register the app
AppRegistry.registerComponent('Main', () => App);

// Get the styles before rendering the app
const styles = AppRegistry.getApplication('Main').getStyleElement();

function App({ Component, pageProps }: AppProps) {
  return (
    <StyleRegistry>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {/* Include React Native Web styles */}
        {styles}
      </Head>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
      <style jsx global>{`
        /* Reset default styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Set root font size for rem units */
        html {
          font-size: 16px;
          -webkit-text-size-adjust: 100%;
        }

        /* Basic body styles */
        body {
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
            sans-serif;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Make images responsive */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Remove list styles */
        ul,
        ol {
          list-style: none;
        }

        /* Basic link styles */
        a {
          color: inherit;
          text-decoration: none;
        }

        /* Make sure elements with "hidden" attribute are hidden */
        [hidden] {
          display: none !important;
        }
      `}</style>
    </StyleRegistry>
  );
}

export default App;
