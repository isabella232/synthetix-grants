import Button, { ButtonImg, Iconify } from "../components/base/Button";
import Card, { CardContainer } from "../components/base/Card";
import { CheckCircleOutline, ExclamationCircleOutline, X } from "heroicons-react";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { animated, useTransition } from "react-spring";
import { color, getColor } from "../style/constants/color";

import { Divider } from "../components/base/Divider";
import Horizontal from "../components/base/Horizontal";
import IconC from "../components/base/Icon";
import Spinner from "../components/base/Spinner";
import { Text } from "../components/base/Text";
import Vertical from "../components/base/Vertical";
import { createPortal } from "react-dom";
import { dev } from "../lib/web3/addresses";
import { ethers } from "ethers";
import { providers } from "../lib/web3/providers";
import { px } from "../style/helpers/measurements";
import { springConfig } from "../style/constants/spring";
import styled from "styled-components";
import { text } from "../style/themes/theme";
import { useOutsideAlerter } from "../lib/hooks/use-outside-alerter";
import { useRoot } from "./RootProvider";

interface Context {
  open: () => void;
}

export const WalletContext = createContext<Context>({
  open: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const useWeb3 = () => useWeb3React<ethers.providers.Web3Provider>();

const ProviderHolder = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000090;
  z-index: 20;
  transition: none;
`;

const ProviderCard = styled(Card)<{ width: number }>`
  position: relative;
  width: 100%;
  max-width: ${(props) => px(props.width)};
  margin: 0 auto;
`;

const ProviderButton = styled(Button)<{ index: number }>`
  ${(props) => (props.index !== 0 ? "margin-top: 1rem" : "")};
`;

const BackButton = styled(Button)`
  width: 100%;
`;

const HeaderHolder = styled.div`
  height: 3.2rem;
  display: flex;
`;

const ActiveProvider = styled.div`
  border-radius: 1rem;
  background: ${color("theme")};
  border: 3px solid ${text};
  padding: 1rem;
`;

const ExitHolder = styled.div`
  position: absolute;
  right: 2rem;
  top: 1rem;
`;

const XIcon = Iconify(X);

const CustomProvider = ({ children }: PropsWithChildren<{}>) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState(-1);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const root = useRoot();

  const {
    activate,
    active,
    connector,
    deactivate,
    account,
  } = useWeb3React<ethers.providers.Web3Provider>();

  const loadingActive =
    active && loading !== -1 && providers[loading].connector === connector;

  const transitions = useTransition(open, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
  });

  const activeProvider = active
    ? providers.find((v) => v.connector === connector) || null
    : null;

  useOutsideAlerter(
    cardRef,
    () => {
      if (loading !== -1) return;
      setOpen(false);
    },
    loading
  );

  useEffect(() => {
    if (loading === -1) return;

    (async () => {
      try {
        await activate(providers[loading].connector, undefined, true);
        setOpen(false);
      } catch (e) {
        setError(e);
        console.log(e);
      }
    })();
  }, [loading]);

  return (
    <>
      <WalletContext.Provider
        value={{
          open: () => {
            setOpen(true);
            setError(null);
            setLoading(-1);
          },
        }}
      >
        {children}
      </WalletContext.Provider>

      {root &&
        root.ref &&
        createPortal(
          <>
            {transitions.map(
              ({ item, key, props }) =>
                item && (
                  <ProviderHolder key={key} style={props}>
                    <Vertical>
                      <ProviderCard width={400} ref={cardRef}>
                        <ExitHolder>
                          <Button
                            color="transparent"
                            onClick={() => {
                              setOpen(false);
                            }}
                            disableBorder
                          >
                            <XIcon crossOrigin="" path="" />
                          </Button>
                        </ExitHolder>

                        <CardContainer>
                          <HeaderHolder>
                            <Text lineHeight={1.5} large bold>
                              Provider
                            </Text>
                          </HeaderHolder>
                        </CardContainer>

                        <CardContainer color="yellow" top>
                          {loading === -1 && (
                            <>
                              {activeProvider && (
                                <>
                                  <ActiveProvider>
                                    <Text flex>
                                      <img
                                        src={`connectors/${activeProvider.logo}.png`}
                                        alt=""
                                        width={24}
                                        height={24}
                                      />
                                      <Divider size={0.75} />
                                      <div>
                                        <Vertical>
                                          Connected with {activeProvider.name}
                                        </Vertical>
                                      </div>
                                    </Text>

                                    <Divider size={1} vertical />

                                    <Text wrap>{account}</Text>
                                  </ActiveProvider>

                                  <Divider size={2} vertical />
                                </>
                              )}

                              {providers
                                .filter((provider) => provider !== activeProvider)
                                .map((provider, index) => {
                                  return (
                                    <ProviderButton
                                      index={index}
                                      key={provider.name}
                                      onClick={() => {
                                        if (provider.connector === connector) return;
                                        setLoading(index);
                                      }}
                                      large
                                      active={false}
                                      fullWidth
                                    >
                                      <ButtonImg
                                        src={`connectors/${provider.logo}.png`}
                                        alt=""
                                        large
                                      />

                                      {provider.name}
                                    </ProviderButton>
                                  );
                                })}

                              {active && (
                                <ProviderButton
                                  index={2}
                                  onClick={() => {
                                    deactivate();
                                  }}
                                  fullWidth
                                >
                                  <XIcon
                                    crossOrigin=""
                                    path=""
                                    color={getColor("text")}
                                  />
                                  <Divider size={0.25} />
                                  Disconnect
                                </ProviderButton>
                              )}
                            </>
                          )}

                          {loading !== -1 && (
                            <>
                              <Horizontal flex>
                                {error ? (
                                  <IconC
                                    icon={ExclamationCircleOutline}
                                    color={"text"}
                                    size={80}
                                    sWidth={1}
                                  />
                                ) : loadingActive ? (
                                  <IconC
                                    icon={CheckCircleOutline}
                                    color={"text"}
                                    size={80}
                                    sWidth={1}
                                  />
                                ) : (
                                  <Spinner size={80} stroke={2.5} color="text" />
                                )}
                              </Horizontal>

                              <Divider size={1.5} vertical />

                              <Text justify="center" large color="text">
                                {error ? (
                                  `Connected to the wrong chain. Please use ${dev(
                                    "Mainnet",
                                    "Kovan"
                                  )}`
                                ) : loadingActive ? (
                                  "Connected"
                                ) : (
                                  <>
                                    Connecting to{" "}
                                    <span
                                      style={{
                                        color: providers[loading].color,
                                      }}
                                    >
                                      {providers[loading].name}
                                    </span>
                                  </>
                                )}
                              </Text>

                              <Divider size={4} vertical />

                              {error && (
                                <>
                                  <BackButton
                                    onClick={() => {
                                      setError(null);
                                      setLoading(-1);
                                    }}
                                  >
                                    Dismiss
                                  </BackButton>
                                </>
                              )}
                            </>
                          )}
                        </CardContainer>
                      </ProviderCard>
                    </Vertical>
                  </ProviderHolder>
                )
            )}
          </>,
          root.ref
        )}
    </>
  );
};

const WalletProvider = ({ children }: PropsWithChildren<{}>) => (
  <Web3ReactProvider
    getLibrary={(provider, _connector) => {
      return new ethers.providers.Web3Provider(provider);
    }}
  >
    <CustomProvider>{children}</CustomProvider>
  </Web3ReactProvider>
);

export default WalletProvider;
