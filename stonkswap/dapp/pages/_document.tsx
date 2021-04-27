import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import { siteDescription, siteName } from "../src/data/site";

import { ServerStyleSheet } from "styled-components";
import { getColor } from "../src/style/constants/color";

const scriptTxt = `
(() => {
  const { pathname } = window.location;
  const ipfsMatch = /.*\\/((Qm\\w{44})|(\\w{62}))\\//.exec(pathname);
  const base = document.createElement('base');

  base.href = ipfsMatch ? ipfsMatch[0] : '/';
  document.head.append(base);
})();
`;

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: scriptTxt }} />

          <meta name="application-name" content={siteName} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={siteName} />
          <meta name="description" content={siteDescription} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content={getColor("theme")} />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content={getColor("theme")} />

          <link rel="icon" type="image/png" sizes="512x512" href="logo/Logo.png" />
          <link rel="manifest" href="manifest.json" />
          <link rel="shortcut icon" href="favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={siteName} />
          <meta name="twitter:description" content={siteDescription} />
          <meta name="twitter:image" content="banners/Banner1.png" />
          <meta name="twitter:creator" content="@CryptoAffax" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content={siteName} />
          <meta property="og:description" content={siteDescription} />
          <meta property="og:site_name" content={siteName} />
          <meta property="og:image" content="banners/Banner1.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
