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
        authenticated: localStorage.getItem('firstName') !== null && localStorage.getItem('lastName') !== null && localStorage.getItem('email') !== null,
        first_name: localStorage.getItem('firstName') !== null ? localStorage.getItem('firstName') : '',
        last_name: localStorage.getItem('lastName') !== null ? localStorage.getItem('lastName') : '',
        email: localStorage.getItem('email') !== null ? localStorage.getItem('email') : '',
    })

  return (
    <ThemeProvider theme={theme}>
        <WebsiteHeader user={currentUser} setUser={setCurrentUser} />
        <Main user={currentUser} />
    </ThemeProvider>
  );
}

export default App;
