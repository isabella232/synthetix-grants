import { Colors, color } from "../../style/constants/color";
import Horizontal, { HorizontalProps } from "./Horizontal";
import { px, rem } from "../../style/helpers/measurements";

import { PropsWithChildren } from "react";
import styled from "styled-components";

interface ContainerProps {
  maxWidth?: number;
  noPadding?: boolean;
  paddingY?: number;
}

const Container = styled(Horizontal)<ContainerProps & HorizontalProps>`
  max-width: ${(props) => px(props.maxWidth || 1200)};
  box-sizing: border-box;
  width: 100%;

  ${(props) =>
    !props.noPadding
      ? `
    padding: ${rem(props.paddingY || 0)} 2rem;

    @media (max-width: 400px) {
      padding: ${rem(props.paddingY || 0)} 1rem;
    }
  `
      : ""};
`;

const ColorBG = styled.div<{ color: Colors }>`
  width: 100%;
  background: ${(props) => color(props.color)(props)};
`;

export const ColoredContainer = (
  props: PropsWithChildren<
    {
      color: Colors;
    } & ContainerProps
  >
) => (
  <ColorBG {...props}>
    <Container {...props}>{props.children}</Container>
  </ColorBG>
);

export default Container;
