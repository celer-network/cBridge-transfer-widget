import { ThemeProvider } from "react-jss";
import { ColorThemeContext } from "../providers/ThemeProvider";
import { ConfigContextProvider } from "../providers/ConfigContextProvider";
import { getDefaultTheme } from "../theme";
import useThemeType from "../hooks/useThemeType";
import CBridgeTransferHome from "../views/CBridgeTransferHome";
import "./app.less";
import { useWindowWidth } from "../hooks";

export default function App(): JSX.Element {
  const [themeType, toggleTheme] = useThemeType();
  useWindowWidth();

  return (
    <ConfigContextProvider>
      <ColorThemeContext.Provider value={{ themeType, toggleTheme }}>
        <ThemeProvider theme={getDefaultTheme(themeType)}>
          <CBridgeTransferHome />
        </ThemeProvider>
      </ColorThemeContext.Provider>
    </ConfigContextProvider>
  );
}
