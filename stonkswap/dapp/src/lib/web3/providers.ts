import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { chainID } from "./addresses";

export interface Provider {
  connector: AbstractConnector;
  color: string;
  name: string;
  logo: string;
}

export const providers: Provider[] = [
  {
    connector: new InjectedConnector({
      supportedChainIds: [chainID],
    }),
    color: "#F5841F",
    name: "Metamask",
    logo: "metamask",
  },
  {
    connector: new WalletConnectConnector({
      rpc: { 1: process.env.API_URL! },
    }),
    color: "#3B99FC",
    name: "WalletConnect",
    logo: "walletconnect",
  },
];
