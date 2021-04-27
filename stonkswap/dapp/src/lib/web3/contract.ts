import { BigNumberish, ContractReceipt, Transaction, ethers } from "ethers";

import { useMemo } from "react";

export interface SentTransaction extends Transaction {
  wait: (confirmations?: number) => Promise<ContractReceipt>;
}

export type CContract<T> = (T & ethers.Contract) | null;

export type UseContract<T> = (address: string, signer?: ethers.Signer) => CContract<T>;

export const useContract = <T>(
  address: string,
  contractAbi: string[],
  signer?: ethers.Signer
) => {
  return useMemo(
    () =>
      signer && address !== "eth"
        ? <T & ethers.Contract>new ethers.Contract(address, contractAbi, signer)
        : null,
    [signer, address, contractAbi]
  );
};

const contractHelper = <T>(contractAbi: string[]): UseContract<T> => (
  address,
  signer
) => {
  return useContract<T>(address, contractAbi, signer);
};

export const useERC20Abi = contractHelper<{
  allowance: (owner: string, spender: string) => Promise<number>;
  approve: (spender: string, amount: number) => Promise<SentTransaction>;
  balanceOf: (who: string) => Promise<BigNumberish>;
  nonces: (who: string) => Promise<BigNumberish>;
}>([
  "function allowance(address owner, address spender) external view returns (uint256)",

  "function approve(address spender, uint256 amount) external returns (bool)",

  "function balanceOf(address who) external view returns (uint256)",

  "function nonces(address who) external view returns (uint256)",
]);

export const useTeslaAbi = contractHelper<{
  exchange: (
    _sourceAmount: BigNumberish,
    _balancer: boolean,
    _deadline: BigNumberish,
    _v: number,
    _r: string,
    _s: string
  ) => Promise<SentTransaction>;
  marketClosed: () => Promise<boolean>;
  balancerOut: (_amountIn: BigNumberish) => Promise<BigNumberish>;
  syntheticsOut: (_amountIn: BigNumberish) => Promise<BigNumberish>;
}>([
  "function exchange(uint256 _sourceAmount, bool _balancer, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s) external returns (uint256 amountReceived)",

  "function marketClosed() external view returns (bool closed)",

  "function balancerOut(uint256 _amountIn) external view returns (uint256 amount)",

  "function syntheticsOut(uint256 _amountIn) external view returns (uint256 amount)",
]);

export const useDelegatorAbi = contractHelper<{
  canExchangeFor: (authoriser: string, delegate: string) => Promise<boolean>;
  approveExchangeOnBehalf: (delegate: string) => Promise<SentTransaction>;
}>([
  "function canExchangeFor(address authoriser, address delegate) external view returns (bool)",

  "function approveExchangeOnBehalf(address delegate) external",
]);
