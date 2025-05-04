import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { AppRegistry } from 'react-native-web';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    // Register main app for RNW
    AppRegistry.registerComponent('Main', () => Main);

    const originalRenderPage = ctx.renderPage;

    let reactNativeStyles;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => {
          const { getStyleElement } = AppRegistry.getApplication('Main');
          reactNativeStyles = getStyleElement();
          return <App {...props} />;
        },
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {reactNativeStyles}
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang='en'>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
