import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import Network from "../../utils/network";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

export default function LoginDialog({
    updateAndSaveToken,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();

    function closeDialog() {
        navigate("/");
    }

    function login() {
        setLoginError("");

        let errors = false;

        if (isEmpty(password)) {
            setPasswordError(true);
            errors = true;
        } else {
            setPasswordError(false);
        }

        const validEmailRegex =
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if (isEmpty(email) || !validEmailRegex.test(email)) {
            setEmailError(true);
            errors = true;
        } else {
            setEmailError(false);
        }

        if (errors) {
            return;
        }

        Network.login(email, password)
            .then((token) => {
                updateAndSaveToken(token);
                closeDialog();
            })
            .catch((e) => {
                setLoginError(e.message);
            });
    }

    const loginOnEnterPress = (event) => {
        if (event.key === "Enter") {
            login();
        }
    };

    return (
        <Dialog
            maxWidth={"md"}
            fullWidth
            open={true}
            onClose={closeDialog}
        >
            <DialogTitle id="form-dialog-title">Log In</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Login to participate in the annual UMass Engineers Without Borders
                    fundraiser. Your information will be kept private and is only used to
                    verify your identity for bidding.
                </DialogContentText>
                <Divider />
                <Grid
                    spacing={3}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{ paddingTop: "2em", paddingBottom: "2em" }}
                >
                    <Grid item xs={12} md={8}>
                        <TextField
                            autoFocus
                            id="emailInput"
                            label="Email Address"
                            type="text"
                            fullWidth
                            onKeyDown={loginOnEnterPress}
                            onChange={(e) => setEmail(e.target.value)}
                            error={emailError}
                            helperText={
                                emailError ? "Please provide a valid email address" : ""
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <TextField
                            id="passwordInput"
                            label="Password"
                            type="password"
                            fullWidth
                            onKeyDown={loginOnEnterPress}
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordError}
                            helperText={passwordError ? "Please provide a password" : ""}
                        />
                    </Grid>

                    {!isEmpty(loginError) && (
                        <Grid item xs={12} md={8}>
                            <Typography color="error" variant="h6">
                                {loginError}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={login} color="secondary" variant={"outlined"}>
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}
