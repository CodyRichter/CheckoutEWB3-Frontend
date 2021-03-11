import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {Divider} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Mail} from "@material-ui/icons";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";


export default function WebsiteHeader(props) {

    let [loginDialogOpen, setLoginDialogOpen] = useState(false);
    let [firstName, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
    let [email, setEmail] = useState('');

    let [firstNameError, setFirstNameError] = useState(false);
    let [lastNameError, setLastNameError] = useState(false);
    let [emailError, setEmailError] = useState(false);


    function login() {

        let errors = 0

        if (firstName.length === 0) {
            setFirstNameError(true);
            errors += 1;
        }

        if (lastName.length === 0) {
            setLastNameError(true);
            errors += 1;

        }

        let emailMatchPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (email.length === 0 || !emailMatchPattern.test(email)) {
            setEmailError(true);
            errors += 1;
        }

        if (errors > 0) {
            return;
        }

        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);

        // Update the logged in user
        props.setUser({
            authenticated: true,
            first_name: firstName,
            last_name: lastName,
            email: email
        });

        // Reset fields for next usage

        setFirstName('');
        setLastName('');
        setEmail('');

        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);

        setLoginDialogOpen(false);

    }

    function logout() {
        props.setUser(currentUser => ({authenticated: false}))
        localStorage.clear();
    }

    const loginOnEnterPress = (event) => {
        if (event.key === 'Enter') {
            login();
        }
    }

    return (
        <div style={{
            flexGrow: 1,
        }}>
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography variant="h6" style={{
                    flexGrow: 1,
                }}>
                    UMass Amherst Engineers Without Borders - 2021 Spring Auction
                </Typography>
                {!props.user.authenticated &&
                    <Button color="inherit" variant={"outlined"} onClick={() => setLoginDialogOpen(true)}>Login to Participate</Button>
                }
                {props.user.authenticated &&
                    <Typography variant="body2">Logged in as {props.user.first_name + ' ' + props.user.last_name} &nbsp; &nbsp; &nbsp; </Typography>
                }
                {props.user.authenticated &&
                    <Button color="inherit" variant={"outlined"} onClick={logout} >
                        Logout
                    </Button>
                }


            </Toolbar>
        </AppBar>


        <Dialog maxWidth={"md"} fullWidth open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>

            <DialogTitle id="form-dialog-title">Log In</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Login to participate in the 2021 UMass Engineers Without Borders fundraiser. The information that
                    you enter on this page will be used for keeping track of bids that you place.
                </DialogContentText>
                <Divider />
                <Grid container spacing={3} justify={'center'} style={{paddingTop: '2em', paddingBottom: '2em'}}>
                    <Grid item xs={4} >
                        <TextField
                            autoFocus
                            id="first"
                            label="First Name"
                            type="text"
                            fullWidth
                            onKeyDown={loginOnEnterPress}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={firstNameError}
                            helperText={firstNameError ? 'Please provide a valid first name' : ''}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            id="last"
                            label="Last Name"
                            type="text"
                            fullWidth
                            onKeyDown={loginOnEnterPress}
                            onChange={(e) => setLastName(e.target.value)}
                            error={lastNameError}
                            helperText={lastNameError ? 'Please provide a valid last name' : ''}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="email"
                            label="Email Address"
                            fullWidth
                            type="email"
                            onKeyDown={loginOnEnterPress}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail fontSize={"small"} />
                                    </InputAdornment>
                                ),
                            }}
                            error={emailError}
                            helperText={emailError ? 'Please provide a valid email address' : ''}

                        />
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setLoginDialogOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={login} color="secondary" variant={'outlined'}>
                    Login
                </Button>
            </DialogActions>
        </Dialog>

        </div>
    )
}