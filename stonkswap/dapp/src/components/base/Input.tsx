import {
  ComponentType,
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";
import { SizeProps, rem, sizeMap, sizeNoMap } from "../../style/helpers/measurements";
import styled, { StyledComponentBase } from "styled-components";

import { Icon } from "../../types/icon";
import { alphaList } from "../../style/constants/alpha";
import { color } from "../../style/constants/color";
import { text } from "../../style/themes/theme";

interface InputProps extends SizeProps {
  radius?: number;
  active?: boolean;
  noFlex?: boolean;
  error?: boolean;
  customPadding?: string;
}

interface IconProps extends SizeProps {
  rounded?: boolean;
}

const weightMap = sizeNoMap("medium", 400, 500, 500);
const paddingMap = sizeNoMap("medium", "0.5rem 0.8rem", "0.6rem 0.8rem", "0.7rem 1rem");
const fontSizeMap = sizeMap("medium", rem, 1, 1.2, 1.8);
const lineHeightMap = sizeMap("medium", rem, 1.5, 2, 3);

export const Inputify = <T extends keyof JSX.IntrinsicElements | ComponentType<any>>(
  comp: T
): StyledComponentBase<T, any, InputProps, never> => styled(comp)<InputProps>`
  width: 100%;
  border: none;
  ${(props) => (props.noFlex ? "" : "display: flex")};
  box-sizing: border-box;
  background: ${(props) => `${color("blue")(props)}${alphaList["15"]}`};
  color: ${text};
  border-radius: ${(props) => rem(props.radius || 1)};
  font-weight: ${weightMap};
  padding: ${(props) => props.customPadding || paddingMap(props)};
  font-size: ${fontSizeMap};
  line-height: ${lineHeightMap};

  &:focus {
    outline: none;
  }
`;

export const EmptyInputify = <T extends keyof JSX.IntrinsicElements | ComponentType<any>>(
  comp: T
): StyledComponentBase<T, any, InputProps, never> => styled(comp)<InputProps>`
  box-sizing: border-box;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;

  color: ${text};
  font-weight: ${weightMap};
  font-size: ${fontSizeMap};
  line-height: ${lineHeightMap};

  &:focus {
    outline: none;
  }
`;

const Input = Inputify(
  (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
    <input {...props} />
  )
);

export const DivInput = Inputify(
  (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
    <div {...props} />
  )
);

export const EmptyInput = EmptyInputify(
  (props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => (
    <input {...props} />
  )
);

const iconSizeMap = sizeMap("medium", rem, 1, 1.3, 1.5);
const marginRMap = sizeMap("medium", rem, 0.2, 0.3, 0.7);

export const InputIcon = styled.img<IconProps>`
  width: ${iconSizeMap};
  height: ${iconSizeMap};
  margin-right: ${marginRMap};
  ${(props) => (props.rounded ? "border-radius: 99999px;" : "")};
`;

export const InputIconify = (icon: Icon) => styled(icon)`
  color: ${text};
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.4rem 0.175rem;
  margin-right: 0.5rem;

  & * {
    color: ${text};
  }
`;

export default Input;
