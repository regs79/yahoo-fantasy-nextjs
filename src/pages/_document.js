import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => <App {...props} />
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
          </>
        )
      };
    } finally {}
  }

  render() {
    return (
      <Html>
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
          <style global jsx>{`
            *, *:before, *:after {
              box-sizing: border-box;
              font-family: sans-serif;
            }
            body {
              margin: 0;
            }
            .wrapper {
              padding: 20px;
            }
          `}</style>
        </body>
      </Html>
    );
  }
}
