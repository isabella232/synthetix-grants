import "normalize.css/normalize.css";
import "isomorphic-fetch";
import "nprogress/nprogress.css";
import "../src/lib/tools/nprogress";
import "../src/style/font.css";

import { AppProps } from "next/app";
import { Banner } from "../src/components/header/Banner";
import { GlobalStyles } from "../src/style/globalStyle";
import Head from "next/head";
import Header from "../src/components/header/Header";
import RootProvider from "../src/state/RootProvider";
import ThemeProvider from "../src/state/ThemeProvider";
import { Toaster } from "react-hot-toast";
import WalletProvider from "../src/state/WalletProvider";
import WaveBG from "../src/components/stylistic/WaveBG";
import styled from "styled-components";

const BodyDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <RootProvider>
      <ThemeProvider>
        <Toaster />
        <GlobalStyles />

        <WalletProvider>
          <WaveBG />

          <BodyDiv>
            <Banner />
            <Header />
            <Content>
              <Component {...pageProps} />
            </Content>
          </BodyDiv>
        </WalletProvider>
      </ThemeProvider>
    </RootProvider>
  </>
);

export default App;
