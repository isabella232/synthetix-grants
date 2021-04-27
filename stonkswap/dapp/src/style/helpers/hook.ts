import { Theme } from "../themes/theme";
import { ThemeContext } from "styled-components";
import { useContext } from "react";

export const useTheme = () => {
  return useContext<Theme>(ThemeContext);
};
