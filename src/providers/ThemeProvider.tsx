import React from 'react';

export const ColorThemeContext = React.createContext<{themeType: "dark" | "light", toggleTheme: ()=>void}>({themeType: "dark", toggleTheme: ()=>{}});