import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add the favicon */}
          <link rel="icon" href="/digishelf_favicon.ico" />
          <link
            href="https://unpkg.com/ionicons@5.5.2/dist/css/ionicons.min.css"
            rel="stylesheet"
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
