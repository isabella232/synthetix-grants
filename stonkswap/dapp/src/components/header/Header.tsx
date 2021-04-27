import BaseLink from "../base/BaseLink";
import Container from "../base/Container";
import { Divider } from "../base/Divider";
import React from "react";
import WalletButton from "./WalletButton";
import { siteName } from "../../data/site";
import styled from "styled-components";

const Head = styled.header`
  padding: 1.5rem 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Title = styled.p`
  display: flex;
  color: white;
  font-weight: 700;
  font-size: 2rem;
  line-height: 3.25rem;
  background: transparent;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const Logo = styled.img`
  width: 3.25rem;
  height: 3.25rem;
`;

const Header = () => (
  <Head>
    <Container>
      <HeaderWrapper>
        <BaseLink href="/">
          <Title>
            <Logo src="logo/Logo.png" alt="" />
            <Divider size={0.5} />
            {siteName}
          </Title>
        </BaseLink>

        <WalletButton />
      </HeaderWrapper>
    </Container>
  </Head>
);

export default Header;
