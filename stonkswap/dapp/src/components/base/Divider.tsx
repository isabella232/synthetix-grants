import { rem } from "../../style/helpers/measurements";
import styled from "styled-components";

interface DividerProps {
  size: number;
  vertical?: boolean;
}

export const Divider = styled.div<DividerProps>`
  ${(props) => `${props.vertical ? "height" : "width"}: ${rem(props.size)}`};
`;
