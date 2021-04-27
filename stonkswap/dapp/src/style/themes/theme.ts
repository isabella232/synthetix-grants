import { Moon, Sun } from "heroicons-react";

import { StyleFunction } from "..";
import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";

export interface Theme {
  primaryBg: string;
  secondaryBg: string;
  text: string;
  contrastText: string;
  transparentHighlight: string;
}

export type ThemeState = Theme & {
  increment: () => void;
};

export const primaryBg: StyleFunction = (props) => props.theme.primaryBg;
export const secondaryBg: StyleFunction = (props) => props.theme.secondaryBg;
export const text: StyleFunction = (props) => props.theme.text;
export const contrastText: StyleFunction = (props) => props.theme.contrastText;

export const themes = [lightTheme, darkTheme];
export const themeIcons = [Sun, Moon];
