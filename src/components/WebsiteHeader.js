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
import {Lock, Person} from "@material-ui/icons";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";


export default function WebsiteHeader(props) {

    let [loginDialogOpen, setLoginDialogOpen] = useState(false);
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    function login() {

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
                    <Typography variant="body2">Logged in as {props.user.name} &nbsp; &nbsp; &nbsp; </Typography>
                }
                {props.user.authenticated &&
                    <Button color="inherit" variant={"outlined"} onClick={() =>
                        props.setUser(currentUser => ({authenticated: false}))
                    }>
                        Logout
                    </Button>
                }


            </Toolbar>
        </AppBar>


        <Dialog maxWidth={"md"} fullWidth open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>

            <DialogTitle id="form-dialog-title">Log In</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Login to participate in the 2021 UMass Engineers Without Borders fundraiser. Please check the
                    email address that you used to register to find your login credentials.
                </DialogContentText>
                <Divider />
                <Grid container spacing={3} justify={'center'} style={{paddingTop: '2em', paddingBottom: '2em'}}>
                    <Grid item xs={7} >
                        <TextField
                            autoFocus
                            id="username"
                            label="Username"
                            type="text"
                            fullWidth
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person fontSize={"small"} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            autoFocus
                            id="password"
                            label="Password"
                            fullWidth
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock fontSize={"small"} />
                                    </InputAdornment>
                                ),
                            }}
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