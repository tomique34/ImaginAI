import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1B3A57" },
    secondary: { main: "#F0A202" },
    background: { default: "#F7F5F2" },
  },
  typography: {
    fontFamily: "var(--font-text)",
    h1: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
  },
});
