/* eslint-disable camelcase */
import { ThemeProvider } from "react-jss";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { ConfigContextProvider } from "../providers/ConfigContextProvider";
import { getDefaultTheme } from "../theme";
import useThemeType from "../hooks/useThemeType";
import CBridgeHome from "../views/CBridgeHome";
import "./app.less";
import { useWindowWidth } from "../hooks";

export default function App(): JSX.Element {
  const [themeType, toggleTheme] = useThemeType();
  useWindowWidth();

  return (
    <ConfigContextProvider>
      <ColorThemeContext.Provider value={{ themeType, toggleTheme }}>
        <ThemeProvider theme={getDefaultTheme(themeType)}>
          <CBridgeHome />
        </ThemeProvider>
      </ColorThemeContext.Provider>
    </ConfigContextProvider>
  );
}
