import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { ThemeProvider as TProvider, ThemeContext } from "styled-components";
import { Theme, themes } from "../style/themes/theme";

export type ThemeState = Theme & {
  increment: () => void;
};

export const useTheme = () => useContext<ThemeState>(ThemeContext);

const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState(0);

  useEffect(() => {
    const darkByDefault =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const newTheme =
      parseInt(localStorage.getItem("theme") || (darkByDefault ? "1" : "0")) || 0;
    newTheme;
    setTheme(0);
  }, []);

  return (
    <TProvider
      theme={{
        ...themes[theme],
        increment: () => {
          const newTheme = (theme + 1) % themes.length;
          setTheme(newTheme);
          localStorage.setItem("theme", newTheme.toString());
        },
      }}
    >
      {children}
    </TProvider>
  );
};

export default ThemeProvider;
