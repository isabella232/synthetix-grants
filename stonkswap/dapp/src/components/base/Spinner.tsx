import { Colors, color } from "../../style/constants/color";

import React from "react";
import styled from "styled-components";

interface SpinnerProps {
  color?: Colors;
}

const SpinnerSvg = styled.svg`
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

const SpinnerCircle = styled.circle<SpinnerProps>`
  stroke: ${(props) => color(props.color || "theme")(props)};
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
`;

const Spinner = ({
  color,
  size,
  stroke = 5,
}: SpinnerProps & {
  size: number;
  stroke?: number;
}) => (
  <SpinnerSvg width={size} height={size} viewBox="0 0 50 50">
    <SpinnerCircle
      color={color}
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth={stroke}
    ></SpinnerCircle>
  </SpinnerSvg>
);

export default Spinner;
