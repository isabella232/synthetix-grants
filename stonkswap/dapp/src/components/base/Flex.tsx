import styled from "styled-components";

type Justify = "center" | "left" | "right" | "space-between";

export interface FlexProps {
  justify?: Justify;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  ${(props) => (props.justify ? `justify-content: ${props.justify};` : "")};
`;
