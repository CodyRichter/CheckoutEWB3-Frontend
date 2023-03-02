import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { amber, indigo } from "@mui/material/colors";

const root = createRoot(document.getElementById("root"));

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
  typography: {
    fontFamily: [
      'Nunito',
      'sans-serif',
    ].join(','),
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
