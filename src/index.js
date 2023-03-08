import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { green, indigo } from "@mui/material/colors";
import './index.css';

const root = createRoot(document.getElementById("root"));

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: green,
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
