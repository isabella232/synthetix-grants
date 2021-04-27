import { useWallet, useWeb3 } from "../../state/WalletProvider";

import Button from "../base/Button";
import { Flex } from "../base/Flex";
import { Jazzicon } from "@ukstv/jazzicon-react";
import React from "react";
import styled from "styled-components";

const WalletAvatar = styled(Jazzicon)`
  margin-left: 0 !important;
  margin-right: 0.75rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
`;

const WalletButton = () => {
  const { active, account } = useWeb3();
  const { open } = useWallet();

  return active && account ? (
    <Button onClick={open}>
      <Flex
        style={{
          margin: "0 -0.25rem",
        }}
      >
        <WalletAvatar address={account} />
        {account.substr(0, 6)}...{account.substring(account.length - 4)}
      </Flex>
    </Button>
  ) : (
    <Button onClick={open}>Connect Wallet</Button>
  );
};

export default WalletButton;
