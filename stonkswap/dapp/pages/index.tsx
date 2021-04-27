import { BigNumber, ethers, utils } from "ethers";
import Card, { CardContainer } from "../src/components/base/Card";
import { H1Text, H3Text, HugeText, Span, Text } from "../src/components/base/Text";
import { SentTransaction, useERC20Abi, useTeslaAbi } from "../src/lib/web3/contract";
import {
  chainID,
  etherscan,
  teslaContract,
  teslaTokenAddress,
  usdcDecimals,
  usdcTokenAddress,
} from "../src/lib/web3/addresses";
import { useApprovalWatch, useTeslaOut, useTokenWatch } from "../src/lib/web3/utils";
import { useWallet, useWeb3 } from "../src/state/WalletProvider";

import Button from "../src/components/base/Button";
import Cleave from "cleave.js/react";
import Container from "../src/components/base/Container";
import { Divider } from "../src/components/base/Divider";
import { Flex } from "../src/components/base/Flex";
import Head from "next/head";
import { Inputify } from "../src/components/base/Input";
import { OneInchQuote } from "../src/lib/types/quote";
import Spinner from "../src/components/base/Spinner";
import { SynthetixLogo } from "../src/components/stylistic/SynthetixLogo";
import Vertical from "../src/components/base/Vertical";
import { link } from "../src/lib/tools/link";
import { siteName } from "../src/data/site";
import styled from "styled-components";
import toast from "react-hot-toast";
import { toastStyle } from "../src/style/toastStyle";
import { useInput } from "../src/lib/tools/text";
import useModal from "../src/components/base/Modal";
import useSWR from "swr";
import { useState } from "react";

const Input = Inputify(Cleave);

const MemeHolder = styled.div`
  position: relative;
  height: 12rem;
  user-select: none;

  @media (max-width: 650px) {
    height: 8rem;
  }

  @media (max-width: 470px) {
    height: 6rem;
  }
`;

const Meme = styled.img`
  height: 12rem;
  user-select: none;

  @media (max-width: 650px) {
    height: 8rem;
  }

  @media (max-width: 470px) {
    height: 6rem;
  }
`;

const MemeArrow = styled.img`
  height: 5rem;
  user-select: none;

  @media (max-width: 650px) {
    height: 3.5rem;
  }

  @media (max-width: 470px) {
    height: 3rem;
  }
`;

const FireGif = styled.img`
  position: absolute;
  z-index: -2;
  height: 27rem;
  left: -108%;
  top: -140%;
  user-select: none;

  @media (max-width: 650px) {
    height: 18rem;
  }

  @media (max-width: 470px) {
    height: 13.5rem;
  }
`;

const DoitGif = styled.img`
  position: absolute;
  height: 10rem;
  right: 0;
  bottom: 0;
  user-select: none;
`;

const PriceHolder = styled.div`
  position: absolute;
  right: -7rem;
  top: -7rem;
  z-index: 11;
  user-select: none;
  pointer-events: none;
`;

const PriceTagHolder = styled.div`
  position: relative;
  height: 15rem;
  width: 15rem;
  transform: rotate(15deg);

  @media (max-width: 650px) {
    transform: rotate(15deg) scale(0.6);
    margin-right: 1.25rem;
  }
`;

const PriceTag = styled.img`
  position: absolute;
  height: 15rem;
  width: 15rem;
  z-index: -1;
`;

const SponsorFlex = styled(Flex)`
  @media (max-width: 650px) {
    flex-wrap: wrap;

    & > * {
      flex-basis: 100%;
      margin-top: 1rem;
    }
  }
`;

const ConfirmationModal = useModal<{
  usdc: number;
  tesla: number;
  useBalancer: boolean;
}>(({ usdc, tesla, useBalancer, close }) => {
  const [errorMessage, setErrorMsg] = useState<string | null>(null);
  const [tx, setTx] = useState<SentTransaction | null>();
  const [signature, setSignature] = useState("");
  const [deadline, setDeadline] = useState(0);

  const [transacting, setTransacting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const { active, error, library, account } = useWeb3();

  const usdcContract = useERC20Abi(usdcTokenAddress, library?.getSigner());
  const teslaContr = useTeslaAbi(teslaContract, library?.getSigner());

  return (
    <>
      {!tx && (
        <>
          <CardContainer>
            <HugeText
              style={{
                marginTop: "-0.75rem",
              }}
              thicc
              large
            >
              Swap
            </HugeText>

            <Divider size={2} vertical />

            <Text large bold contrast>
              USDC
            </Text>
            <HugeText thicc>{usdc}</HugeText>

            <Divider size={1.5} vertical />

            <Text large bold contrast>
              sTSLA
            </Text>
            <HugeText thicc>~{tesla.toFixed(8)}</HugeText>

            <Divider size={2} vertical />

            <Text contrast bold large>
              The amount you receive might not match the number on the screen. You might
              receive more or less of sTSLA.
            </Text>

            <Divider size={2} vertical />
          </CardContainer>

          <CardContainer top color="yellow">
            <Flex>
              <Button
                fullWidth
                inactive={
                  signed || !active || error !== undefined || library === undefined
                }
                disabled={
                  signed || !active || error !== undefined || library === undefined
                }
                onClick={async () => {
                  if (
                    signed ||
                    !active ||
                    !account ||
                    error !== undefined ||
                    library === undefined
                  )
                    return;

                  try {
                    setSigning(true);
                    setErrorMsg(null);

                    //const deadline = Math.round(new Date().getTime() / 1000 + 48 * 60 * 60);
                    const deadline = 99999999999999;
                    const signer = library.getSigner();

                    setDeadline(deadline);

                    if (signer) {
                      const signature = await signer._signTypedData(
                        {
                          version: "2",
                          name: "USD Coin",
                          chainId: chainID,
                          verifyingContract: usdcTokenAddress,
                        },
                        {
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
                        {
                          owner: account,
                          spender: teslaContract,
                          value: ethers.utils.parseUnits(usdc.toString(), usdcDecimals),
                          nonce: (await usdcContract?.nonces(account || "")) || 0,
                          deadline,
                        }
                      );

                      setSigned(true);
                      setSignature(signature);
                    }
                  } catch (e) {
                    const msg = (() => {
                      switch (e.code) {
                        case 4001:
                          return "User cancelled the permit";
                        case -32603:
                          return "Error formatting outputs from RPC";
                        default:
                          return "An unknown error has occured";
                      }
                    })();

                    setErrorMsg(msg);
                  } finally {
                    setSigning(false);
                  }
                }}
              >
                {signing && <Spinner color="text" size={24} />}

                {!signing && "Sign Permit"}
              </Button>

              <Divider size={3} />

              <Button
                fullWidth
                inactive={
                  !signed || !active || error !== undefined || library === undefined
                }
                disabled={
                  !signed || !active || error !== undefined || library === undefined
                }
                onClick={async () => {
                  if (
                    !signed ||
                    !active ||
                    !account ||
                    error !== undefined ||
                    library === undefined ||
                    transacting ||
                    tx ||
                    !teslaContr
                  )
                    return;

                  try {
                    setErrorMsg(null);
                    setTransacting(true);

                    const signatureArr = signature.match(/.{1,2}/g) || [];
                    const R_HEX = signatureArr.slice(1, 33);
                    const S_HEX = signatureArr.slice(33, 65);
                    const V_HEX = signatureArr.slice(65, 66);

                    const R_HEX_JOINED = "0x" + R_HEX.join("");
                    const S_HEX_JOINED = "0x" + S_HEX.join("");
                    const V_HEX_JOINED = "0x" + V_HEX.join("");

                    const tx = await teslaContr.exchange(
                      ethers.utils.parseUnits(usdc.toString(), usdcDecimals),
                      useBalancer,
                      deadline,
                      parseInt(V_HEX_JOINED),
                      R_HEX_JOINED,
                      S_HEX_JOINED
                    );

                    setTx(tx);

                    const receipt = await tx.wait(1);
                    const events = receipt.events || [];
                    const event = events[events.length - 1];
                    const result = utils.defaultAbiCoder.decode(
                      ["uint256", "uint256"],
                      event.data
                    );
                    const number = result[1] as BigNumber;

                    toast.success(
                      `Successfully swapped ${usdc} USDC for ${parseFloat(
                        utils.formatUnits(number, 18)
                      ).toFixed(6)} sTSLA!`,
                      toastStyle
                    );
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
                    setTransacting(false);
                  }
                }}
              >
                {transacting && <Spinner color="text" size={24} />}

                {!transacting && "Swap"}
              </Button>
            </Flex>

            {errorMessage && (
              <>
                <Divider size={0.75} vertical />

                <Text color="red" bold>
                  {errorMessage}
                </Text>
              </>
            )}
          </CardContainer>
        </>
      )}

      {tx && (
        <>
          <CardContainer>
            <Divider size={2} vertical />

            <HugeText justify="center" small bold>
              Transaction Submitted!
            </HugeText>

            <Divider size={1} vertical />

            <Text
              contrast
              justify="center"
              bold
              clickable
              onClick={link(`https://${etherscan}/tx/${tx.hash || ""}`)}
            >
              View on{" "}
              <Span color="theme" link>
                Etherscan
              </Span>
            </Text>

            <Divider size={3} vertical />

            <Container maxWidth={300}>
              <img
                style={{
                  width: "100%",
                  marginBottom: "-10px",
                }}
                src="art/nicebob.png"
                alt=""
              />
            </Container>
          </CardContainer>

          <CardContainer top color="yellow">
            <Button onClick={close} fullWidth>
              Close
            </Button>
          </CardContainer>
        </>
      )}
    </>
  );
});

const Index = () => {
  const { open } = useWallet();
  const { active, error } = useWeb3();

  const [amount, setAmount] = useState("");

  const usdcBalance = useTokenWatch(usdcTokenAddress);
  const tslaBalance = useTokenWatch(teslaTokenAddress[0]);

  const connected = active && !error;

  const balancerOut = useTeslaOut(amount, true);
  const synthetixOut = useTeslaOut(amount, false);

  const priceBalancerOut = useTeslaOut("1", true);
  const priceSynthetixOut = useTeslaOut("1", false);

  const { approved, approve, approving, errorMsg, tx } = useApprovalWatch();

  const isZero = balancerOut === 0 && synthetixOut === 0;
  const balancerHigher = balancerOut > synthetixOut;

  const zeroPrice = priceBalancerOut === 0 && priceSynthetixOut === 0;
  const balancerPrice = priceBalancerOut > priceSynthetixOut;

  const { data } = useSWR<OneInchQuote>(
    `https://api.1inch.exchange/v3.0/1/quote?fromTokenAddress=0x918dA91Ccbc32B7a6A0cc4eCd5987bbab6E31e6D&toTokenAddress=0x57Ab1ec28D129707052df4dF418D58a2D46d5f51&amount=${utils.parseUnits(
      "1",
      18
    )}`,
    (url: string) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const isAbove =
    parseInt(
      ethers.utils.parseUnits(amount === "" ? "0" : amount, usdcDecimals).toString()
    ) > parseInt(usdcBalance.toString());

  return (
    <>
      <Head>
        <title>{siteName}</title>
      </Head>

      <ConfirmationModal
        header="Confirm"
        width={400}
        usdc={amount === "" ? 0 : parseFloat(amount)}
        tesla={balancerHigher ? balancerOut : synthetixOut}
        useBalancer={balancerHigher}
      >
        {({ setState }) => (
          <Container maxWidth={800}>
            <Divider size={3} vertical />

            <H1Text
              large
              thicc
              justify="center"
              color="white"
              badaboom
              border="text"
              borderWidth={4}
            >
              Just Swap It
            </H1Text>

            <Divider size={2} vertical />

            <Container maxWidth={625}>
              <Flex justify="space-between">
                <Meme src="art/spicycry.png" />

                <div>
                  <Vertical>
                    <MemeArrow src="art/toarrow.png" />
                  </Vertical>
                </div>

                <MemeHolder>
                  <Meme src="art/muskowo.png" />
                  <FireGif src="art/fire.gif" />
                </MemeHolder>
              </Flex>
            </Container>

            <Divider size={2} vertical />

            <Container maxWidth={500}>
              <H3Text justify="center" small color="white">
                Grab your sTSLA, a Synthetix Synth for Tesla stocks!
              </H3Text>
            </Container>

            <Divider size={3} vertical />

            <Container
              noPadding
              maxWidth={475}
              style={{
                position: "relative",
              }}
            >
              <PriceHolder>
                <PriceTagHolder>
                  <PriceTag src="art/pricetag.png" />

                  <Vertical>
                    <div>
                      <Text justify="center">sTSLA Price</Text>
                      <HugeText justify="center" small thicc>
                        $
                        {!data && zeroPrice
                          ? "..."
                          : zeroPrice
                          ? parseFloat(
                              utils.formatUnits((data ?? ({} as any)).toTokenAmount, 18)
                            ).toFixed(2)
                          : (
                              1 / (balancerPrice ? priceBalancerOut : priceSynthetixOut)
                            ).toFixed(2)}
                      </HugeText>
                    </div>
                  </Vertical>
                </PriceTagHolder>
              </PriceHolder>

              <Card>
                <CardContainer
                  style={{
                    position: "relative",
                  }}
                >
                  {connected && (
                    <>
                      {/* <HugeText small bold>
                        $sTSLA Price:
                      </HugeText>
                      <HugeText large thicc>
                        {!data
                          ? "..."
                          : `${parseFloat(
                              (
                                parseInt(data.fromTokenAmount || "1") /
                                parseInt(data.toTokenAmount || "1")
                              ).toString()
                            ).toFixed(2)}$`}
                      </HugeText>

                      <Divider size={2} vertical /> */}

                      <DoitGif src="art/doit.gif" />

                      <Flex justify="space-between">
                        <div>
                          <HugeText bold small>
                            USDC
                          </HugeText>
                        </div>

                        <div>
                          <Text
                            bold
                            contrast
                            clickable
                            justify="right"
                            flex
                            onClick={() => {
                              if (usdcBalance === "...") return;
                              setAmount(
                                parseFloat(
                                  ethers.utils.formatUnits(usdcBalance, usdcDecimals)
                                ).toFixed(6)
                              );
                            }}
                          >
                            <Divider size={0.5} />
                            {usdcBalance === "..." ? (
                              <Spinner color="text" size={18} />
                            ) : (
                              `Balance: ${parseFloat(
                                ethers.utils.formatUnits(usdcBalance, usdcDecimals)
                              ).toFixed(6)} USDC`
                            )}
                            <Divider size={3.5} />
                          </Text>
                        </div>
                      </Flex>

                      <Divider size={1} vertical />

                      <Input
                        aria-label="investment"
                        placeholder="0.00"
                        options={{
                          numeral: true,
                          numeralThousandsGroupStyle: "none",
                          numeralDecimalScale: 6,
                        }}
                        value={amount}
                        onChange={useInput(
                          setAmount,
                          (v) => !v.includes("-") && !(v.length === 1 && v === ".")
                        )}
                        large
                      />

                      {isAbove && (
                        <>
                          <Divider size={0.5} vertical />

                          <Text color="red" bold>
                            Not enough tokens
                          </Text>
                        </>
                      )}

                      <Divider size={1.5} vertical />

                      <Flex justify="left">
                        <img
                          src="art/arrow.png"
                          alt=""
                          style={{
                            height: "50px",
                          }}
                        />
                      </Flex>

                      <Divider size={1.5} vertical />

                      <Flex justify="space-between">
                        <div>
                          <HugeText thicc small>
                            sTSLA
                          </HugeText>
                        </div>

                        <div>
                          <Text bold contrast justify="right" flex>
                            <Divider size={0.5} />
                            {tslaBalance === "..." ? (
                              <Spinner color="text" size={18} />
                            ) : (
                              `Balance: ${parseFloat(
                                ethers.utils.formatUnits(tslaBalance, 18)
                              ).toFixed(6)} sTSLA`
                            )}
                          </Text>
                        </div>
                      </Flex>

                      <Divider size={0.5} vertical />

                      <HugeText large thicc>
                        {!connected || isZero || amount === "" || parseFloat(amount) <= 0
                          ? "0"
                          : (balancerHigher ? balancerOut : synthetixOut).toFixed(4)}
                      </HugeText>

                      <Divider size={0.5} vertical />

                      <Text contrast large bold>
                        Best price from{" "}
                        <Span
                          color="theme"
                          onClick={() => {
                            if (isZero) return;
                            link(
                              balancerHigher
                                ? "https://balancer.exchange/#/swap"
                                : "https://kwenta.io/"
                            )();
                          }}
                          link={!isZero}
                        >
                          {isZero ? "..." : balancerHigher ? "Balancer" : "Synthetix"}
                        </Span>
                      </Text>

                      <Divider size={2} vertical />
                    </>
                  )}

                  {!connected && (
                    <>
                      <Divider size={2} vertical />

                      <Container maxWidth={400}>
                        <HugeText thicc justify="center">
                          Make sure to connect your wallet
                        </HugeText>
                      </Container>

                      <Divider size={4} vertical />

                      <Container maxWidth={300}>
                        <img
                          style={{
                            width: "100%",
                            marginBottom: "-10px",
                          }}
                          src="art/spongebob.png"
                          alt=""
                        />
                      </Container>
                    </>
                  )}
                </CardContainer>

                <CardContainer color="yellow" top>
                  <Button
                    fullWidth
                    large
                    onClick={() => {
                      if (!connected) return open();

                      if (
                        approving ||
                        isAbove ||
                        (connected &&
                          (isZero || amount === "" || parseFloat(amount) <= 0))
                      )
                        return;

                      if (!approved && !balancerHigher) return approve();

                      setState(true);
                    }}
                    disabled={
                      approving ||
                      isAbove ||
                      (connected && (isZero || amount === "" || parseFloat(amount) <= 0))
                    }
                    inactive={
                      approving ||
                      isAbove ||
                      (connected && (isZero || amount === "" || parseFloat(amount) <= 0))
                    }
                  >
                    {!connected ? (
                      "Connect Wallet"
                    ) : approving ? (
                      <Spinner color={approving ? "text" : "white"} size={24} />
                    ) : !approved && !balancerHigher ? (
                      "Approve Swap"
                    ) : (
                      "Swap!"
                    )}
                  </Button>

                  {errorMsg && (
                    <>
                      <Divider size={0.75} vertical />

                      <Text color="red" bold>
                        {errorMsg}
                      </Text>
                    </>
                  )}

                  {tx && approving && (
                    <>
                      <Divider size={0.75} vertical />

                      <Text
                        contrast
                        bold
                        clickable
                        onClick={link(`https://${etherscan}/tx/${tx.hash || ""}`)}
                      >
                        Approving Synthetix swap on{" "}
                        <Span color="theme" link>
                          Etherscan
                        </Span>
                      </Text>
                    </>
                  )}
                </CardContainer>
              </Card>
            </Container>

            <Divider size={3} vertical />

            <SponsorFlex justify="center">
              <div>
                <Text large justify="center" color="white" thin>
                  Powered by
                </Text>

                <Divider size={1} vertical />

                <div>
                  <Flex justify="center">
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={link("https://affax.link/synthetix")}
                    >
                      <Divider size={0.625} vertical />
                      <SynthetixLogo height={20} />
                    </div>
                  </Flex>
                </div>
              </div>

              <Divider size={4} />

              <div>
                <Text large justify="center" color="white" thin>
                  Sponsored by
                </Text>

                <Divider size={1} vertical />

                <Flex justify="center">
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={link("https://affax.link/gdao")}
                  >
                    <Flex>
                      <img
                        src="art/gdao.png"
                        style={{
                          height: "40px",
                        }}
                      />

                      <Divider size={0.5} />

                      <div>
                        <Vertical>
                          <HugeText color="white" small thin clickable>
                            grantsDAO
                          </HugeText>
                        </Vertical>
                      </div>
                    </Flex>
                  </div>
                </Flex>
              </div>
            </SponsorFlex>

            <Divider size={3} vertical />
          </Container>
        )}
      </ConfirmationModal>
    </>
  );
};

export default Index;
