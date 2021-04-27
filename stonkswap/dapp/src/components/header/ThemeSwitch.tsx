import { animated, useSprings } from "react-spring";
import { themeIcons, themes } from "../../style/themes/theme";

import Button from "../base/Button";
import React from "react";
import styled from "styled-components";
import { useTheme } from "../../state/ThemeProvider";

const IconHolder = styled.div`
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.4rem 0.2rem;
`;

const ThemeIcon = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  & > div {
    transition: none;
  }
`;

const ThemeSwitch = () => {
  const { increment, primaryBg } = useTheme();

  const springs = useSprings(
    themes.length,
    themes.map((t) => {
      const is = t.primaryBg === primaryBg;
      const translate = `translate3d(0, ${is ? 0 : 40}px, 0)`;
      const scale = `scale(${is ? 1 : 0.5})`;

      return {
        transform: `${translate} ${scale}`,
        opacity: is ? 1 : 0,
        config: {
          mass: 1.5,
          tension: 500,
          friction: 25,
        },
      };
    })
  );

  return (
    <div>
      <Button color="transparent" onClick={increment}>
        <IconHolder>
          {springs.map((props, index) => {
            const { text } = themes[index];
            const Icon = themeIcons[index];

            return (
              <ThemeIcon key={index}>
                <animated.div style={props}>
                  <Icon
                    crossOrigin=""
                    path=""
                    size={20}
                    color={text}
                    style={{
                      display: "block",
                    }}
                  />
                </animated.div>
              </ThemeIcon>
            );
          })}
        </IconHolder>
      </Button>
    </div>
  );
};

export default ThemeSwitch;
