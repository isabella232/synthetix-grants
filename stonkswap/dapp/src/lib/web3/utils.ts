import {
  CContract,
  SentTransaction,
  UseContract,
  useDelegatorAbi,
  useERC20Abi,
  useTeslaAbi,
} from "./contract";
import { DependencyList, useEffect, useState } from "react";
import { delegateContract, teslaContract, usdcDecimals } from "./addresses";

import { ethers } from "ethers";
import { promisify } from "util";
import { toast } from "react-hot-toast";
import { toastStyle } from "../../style/toastStyle";
import { useWeb3 } from "../../state/WalletProvider";

const sleep = promisify(setTimeout);

export const useTokenWatch = (address: string) => {
  const { value } = useContractFunction(
    address,
    useERC20Abi,
    async (contract, library, account) =>
      address === "eth"
        ? await library.getBalance(account)
        : (await contract?.balanceOf(account)) || "0",
    "...",
    5000
  );

  return value;
};

export const useApprovalWatch = () => {
  const [approving, setApproving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { library, error } = useWeb3();
  const contract = useDelegatorAbi(delegateContract, library?.getSigner());
  const [tx, setTx] = useState<SentTransaction | null>();

  const { value, run } = useContractFunction(
    delegateContract,
    useDelegatorAbi,
    async (contract, _library, account) =>
      !contract ? false : await contract.canExchangeFor(account, teslaContract),
    false,
    5000
  );

  return {
    approved: value,
    approving,
    errorMsg,
    tx,
    approve: async () => {
      if (error || !contract || approving || !run) return;

      try {
        setApproving(true);
        setErrorMsg(null);

        const tx = await contract.approveExchangeOnBehalf(teslaContract);
        setTx(tx);
        await tx.wait();
        const p = await run();

        if (p) {
          toast.success(`Successfully approved Swap!`, toastStyle);
        }
      } catch (e) {
        const msg = (() => {
          switch (e.code) {
            case 4001:
              return "User cancelled the transaction";
            case -32603:
              return "Error formatting outputs from RPC";
            default:
              return "An unknown error has occured";
          }
        })();

        setErrorMsg(msg);
      } finally {
        setApproving(false);
        setTx(null);
      }
    },
  };
};

export const useTeslaOut = (amount: string, useBalancer: boolean) => {
  const { value } = useContractFunction(
    teslaContract,
    useTeslaAbi,
    async (contract) =>
      !contract || amount === "" || parseFloat(amount) <= 0
        ? 0
        : parseFloat(
            ethers.utils.formatUnits(
              await (useBalancer ? contract.balancerOut : contract.syntheticsOut)(
                ethers.utils.parseUnits(amount, usdcDecimals)
              ),
              18
            )
          ),
    0,
    10000,
    [useBalancer, amount]
  );

  return value;
};

export const useContractFunction = <T, S>(
  address: string,
  useFunction: UseContract<S>,
  readContract: (
    contract: CContract<S>,
    library: ethers.providers.Web3Provider,
    account: string
  ) => Promise<T> | T,
  df: T,
  refreshInterval: number,
  deps?: DependencyList
) => {
  const [value, setValue] = useState<T>(df);
  const [run, setRun] = useState<(() => Promise<T | undefined>) | null>(null);

  const { library, active, account, error } = useWeb3();

  const contract = useFunction(address, library?.getSigner());

  useEffect(() => {
    let stop = false;
    setValue(df);
    setRun(null);

    if (!active || !account || !library || error) return;

    const run = async () => {
      const val = await readContract(contract, library, account);
      if (stop) return;
      setValue(val);
      return val;
    };

    setRun(() => async () => await run());

    (async () => {
      while (!stop) {
        await run();
        await sleep(refreshInterval);
      }
    })();

    window.addEventListener("focus", run);

    return () => {
      stop = true;
      window.removeEventListener("focus", run);
    };
  }, [active, account, address, ...(deps || [])]);

  return { value, run };
};
