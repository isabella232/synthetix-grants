import { H1Text, Text } from "../src/components/base/Text";

import BaseLink from "../src/components/base/BaseLink";
import Button from "../src/components/base/Button";
import Container from "../src/components/base/Container";
import { Divider } from "../src/components/base/Divider";
import Head from "next/head";
import Horizontal from "../src/components/base/Horizontal";
import Vertical from "../src/components/base/Vertical";
import styled from "styled-components";

const BackroundHolder = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const BackroundText = styled(Text)`
  font-size: calc(8.5rem + 400 * ((100vw - 360px) / 1264));
  font-weight: 800;

  @media (min-width: 1265px) {
    font-size: 422.076px;
  }
`;

const Content = styled.div`
  pointer-events: all;
`;

const FourOhFour = () => (
  <>
    <Head>
      <title>Page Not Found</title>
    </Head>

    <BackroundHolder>
      <Vertical>
        <BackroundText contrast color="transparent" justify="center">
          404
        </BackroundText>
      </Vertical>
    </BackroundHolder>

    <BackroundHolder>
      <Vertical>
        <Content>
          <Container maxWidth={700}>
            <H1Text bold large justify="center">
              That page could not be located
            </H1Text>
          </Container>

          <Divider size={2} vertical />

          <Horizontal flex>
            <BaseLink href="/">
              <Button color="theme">Return Home</Button>
            </BaseLink>
          </Horizontal>
        </Content>
      </Vertical>
    </BackroundHolder>
  </>
);

export default FourOhFour;
