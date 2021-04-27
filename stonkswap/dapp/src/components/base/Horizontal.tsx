import styled from "styled-components";

export interface HorizontalProps {
  flex?: boolean;
}

const Horizontal = styled.div<HorizontalProps>`
  ${(props) =>
    props.flex
      ? `
    width: 100%;
    display: flex;
    justify-content: center;
  `
      : `
    margin: 0 auto;
  `};
`;

export default Horizontal;
