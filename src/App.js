import Main from "./pages/Main";
import WebsiteHeader from "./components/WebsiteHeader"
import React, {useState} from "react";
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

    let [currentUser, setCurrentUser] = useState({
        authenticated: true,
        name: 'John Doe',
        key: 'abc123'
    })

  return (
    <ThemeProvider theme={theme}>
        <WebsiteHeader user={currentUser} setUser={setCurrentUser} />
        <Main user={currentUser} />
    </ThemeProvider>
  );
}

export default App;
