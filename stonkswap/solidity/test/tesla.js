const { accountPool, parseTokens, drain, useApproval, hoursToSeconds } = require("./_tools.js");
const { ethers } = require("ethers");

const { mainArgs, testArgs } = require("../lib/args.js");

const IERC20Approvable = artifacts.require("IERC20Approvable");
const IDelegator = artifacts.require("IDelegator");
const IERC20 = artifacts.require("IERC20");
const Tesla = artifacts.require("Tesla");

contract(`Test $TESLA contract`, async (accounts) => {
  const pool = accountPool(accounts);

  let setup = false;

  let delegator;
  let tesla;
  let stsla;
  let usdc;

  const args = process.argv;
  const isTestnet = args.join(" ").includes("kovan");

  async function setupCoreProtocol() {
    if (setup) return;
    setup = true;
    const argList = isTestnet ? testArgs : mainArgs;

    tesla = await Tesla.new(...argList, { gas: 2000000 });
    delegator = await IDelegator.at(
      !isTestnet ? "0x15fd6e554874b9e70f832ed37f231ac5e142362f" : "0xB8CFB40B4c66533cD8f760c1b15cc228452bB03E"
    );
    stsla = await IERC20.at(argList[2]);
    usdc = await IERC20Approvable.at(argList[0]);
  }

  beforeEach(async () => {
    await setupCoreProtocol();
  });

  pool("Should successfully swap USDC to sTSLA", async (account, _) => {
    const baseAmount = isTestnet ? 100 : 10000;
    const amount = parseTokens(baseAmount, isTestnet ? 18 : 6);

    await drain(
      usdc,
      !isTestnet ? "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8" : "0x175023d52584a5E29e6c33e88592851359941508",
      account,
      amount
    );

    const deadline = Math.round(new Date().getTime() / 1000 + hoursToSeconds(48));

    const signature = await new Promise(async (resolve) => {
      web3.currentProvider.send(
        {
          method: "eth_signTypedData",
          params: [
            accounts[0],
            {
              types: {
                EIP712Domain: [
                  {
                    name: "name",
                    type: "string",
                  },
                  {
                    name: "version",
                    type: "string",
                  },
                  {
                    name: "chainId",
                    type: "uint256",
                  },
                  {
                    name: "verifyingContract",
                    type: "address",
                  },
                ],
                Permit: [
                  {
                    name: "owner",
                    type: "address",
                  },
                  {
                    name: "spender",
                    type: "address",
                  },
                  {
                    name: "value",
                    type: "uint256",
                  },
                  {
                    name: "nonce",
                    type: "uint256",
                  },
                  {
                    name: "deadline",
                    type: "uint256",
                  },
                ],
              },
              domain: {
                version: "2",
                name: "USD Coin",
                chainId: !isTestnet ? 1 : 42,
                verifyingContract: usdc.address,
              },
              primaryType: "Permit",
              message: {
                owner: accounts[0],
                spender: tesla.address,
                value: amount,
                nonce: await usdc.nonces(accounts[0]),
                deadline,
              },
            },
          ],
          from: accounts[0],
        },
        (e, { result }) => {
          resolve(result);
        }
      );
    });

    const signatureArr = signature.match(/.{1,2}/g);
    const R_HEX = signatureArr.slice(1, 33);
    const S_HEX = signatureArr.slice(33, 65);
    const V_HEX = signatureArr.slice(65, 66);

    const R_HEX_JOINED = "0x" + R_HEX.join("");
    const S_HEX_JOINED = "0x" + S_HEX.join("");
    const V_HEX_JOINED = "0x" + V_HEX.join("");

    console.log("");
    console.log("Signed USDC spending permit");
    console.log("R signed bytes32: " + R_HEX_JOINED);
    console.log("S signed bytes32: " + S_HEX_JOINED);
    console.log("V signed uint8: " + V_HEX_JOINED);
    console.log("");

    console.log("Approving exchange delegation...");
    await delegator.approveExchangeOnBehalf(tesla.address);
    console.log("Approved!");
    console.log("");

    console.log(`Exchanging ${baseAmount} USDC for sTSLA...`);
    await tesla.exchange(
      amount,
      await tesla.marketClosed(),
      deadline,
      parseInt(V_HEX_JOINED),
      R_HEX_JOINED,
      S_HEX_JOINED
    );
    console.log("Done!");
    console.log("");

    const balance = await stsla.balanceOf(account);

    assert.notEqual(0, parseInt(balance));
    console.log(
      `Final $sTSLA Balance: ${parseFloat(ethers.utils.formatEther(parseInt(balance).toString())).toFixed(6)}`
    );
  });
});
