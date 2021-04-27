import { Colors, color } from "../../style/constants/color";
import { secondaryBg, text } from "../../style/themes/theme";

import styled from "styled-components";

interface ContainerProps {
  color?: Colors;
  top?: boolean;
}

const Card = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: ${secondaryBg};
  border: ${text} 3px solid;
  z-index: 10;
  border-radius: 3rem;
  overflow: hidden;
`;

export const CardContainer = styled.div<ContainerProps>`
  background: ${(props) => color(props.color || "white")(props)};
  ${(props) => (props.top ? `border-top: 3px ${text(props)} solid` : "")};
  padding: ${(props) => (!props.top ? "2rem 2rem 0 2rem" : "2rem")};
  overflow: hidden;
`;

export default Card;
