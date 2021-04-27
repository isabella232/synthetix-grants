import { Theme } from "../themes/theme";
import { ThemedStyledProps } from "styled-components";

export type Colors =
  | "transparent"
  | "text"
  | "green"
  | "red"
  | "white"
  | "yellow"
  | "blue"
  | "theme";

export interface Color {
  normal: string;
  dark: string;
}

type ColorFunction = (c: Colors) => (props: ThemedStyledProps<{}, Theme>) => string;

const colorMap = new Map<Colors, Color>([
  [
    "green",
    {
      normal: "#2CE375",
      dark: "#1CD968",
    },
  ],
  [
    "red",
    {
      normal: "#F64049",
      dark: "#F52933",
    },
  ],
  [
    "theme",
    {
      normal: "#FF9900",
      dark: "#eb8d00",
    },
  ],
  [
    "white",
    {
      normal: "#FFFFFF",
      dark: "#CCCCCC",
    },
  ],
  [
    "yellow",
    {
      normal: "#F7EF04",
      dark: "#F7EF04",
    },
  ],
  [
    "blue",
    {
      normal: "#1F23DE",
      dark: "#1F23DE",
    },
  ],
  [
    "text",
    {
      normal: "#000000",
      dark: "#000000",
    },
  ],
]);

export const color: ColorFunction = (c) => (props) => {
  if (c === "transparent") {
    return "transparent";
  }

  if (c === "text") {
    return props.theme.text;
  }

  return colorMap.get(c)?.normal || "";
};

export const darkColor: ColorFunction = (c) => (props) => {
  if (c === "transparent") {
    return props.theme.transparentHighlight;
  }

  if (c === "text") {
    return props.theme.contrastText;
  }

  return colorMap.get(c)?.dark || "";
};

export const getColor = (c: Colors) => colorMap.get(c)?.normal || "";
export const getDarkColor = (c: Colors) => colorMap.get(c)?.dark || "";
