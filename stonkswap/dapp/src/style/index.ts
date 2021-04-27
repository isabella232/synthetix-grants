import { Theme } from "./themes/theme";
import { ThemedStyledProps } from "styled-components";

export interface StyleFunction<T = {}> {
  (props: ThemedStyledProps<T, Theme>): string;
}
