import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { AppRegistry } from 'react-native-web';

// Register the app
AppRegistry.registerComponent('Digishelf', () => Main);

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: App => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: Component => Component,
      });

    // Get the styles from RNW
    const { getStyleElement } = AppRegistry.getApplication('Digishelf');

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {getStyleElement()}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Add the favicon */}
          <link rel='icon' href='/digishelf_favicon.ico' />
          <link
            href='https://unpkg.com/ionicons@5.5.2/dist/css/ionicons.min.css'
            rel='stylesheet'
          />
          <meta
            name='viewport'
            content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
