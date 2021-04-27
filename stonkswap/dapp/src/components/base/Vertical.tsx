import styled from "styled-components";

type Justify = "center" | "left" | "right" | "space-between" | "flex-end";

interface VerticalProps {
  justify?: Justify;
}

const Vertical = styled.div<VerticalProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: ${(props) => (props.justify ? props.justify : "center")};
`;

export default Vertical;
