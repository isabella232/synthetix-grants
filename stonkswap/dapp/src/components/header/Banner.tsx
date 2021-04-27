import { useEffect, useState } from "react";

import { Divider } from "../base/Divider";
import { Flex } from "../base/Flex";
import IconC from "../base/Icon";
import { Text } from "../base/Text";
import Vertical from "../base/Vertical";
import { X } from "heroicons-react";
import styled from "styled-components";

const BannerContainer = styled.div`
  width: 100vw;
  padding: 0.5rem 0.5rem;
  box-sizing: border-box;
  background: #5599ff;
`;

const IconContainer = styled.div`
  margin-top: -2px;
`;

export const Banner = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!localStorage) return;
    if (!localStorage.getItem("closed_banner")) return;
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <BannerContainer>
      <Flex justify="center">
        <div>
          <Vertical>
            <Text color="white" thin small>
              Trade responsibly and <strong>Never share your private key</strong>
            </Text>
          </Vertical>
        </div>

        <Divider size={0.35} />

        <IconContainer>
          <Vertical>
            <IconC
              icon={X}
              color="white"
              clickable
              onClick={() => {
                setOpen(false);
                localStorage.setItem("closed_banner", "closed successfully");
              }}
              size={16}
            />
          </Vertical>
        </IconContainer>
      </Flex>
    </BannerContainer>
  );
};
