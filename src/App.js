import Main from "./pages/Main";
import WebsiteHeader from "./components/WebsiteHeader"
import React from "react";
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from "@material-ui/styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#bf360c',
        },
        secondary: {
            main: '#00796b',
        },
    },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
        <WebsiteHeader />
        <Main />
    </ThemeProvider>
  );
}

export default App;
