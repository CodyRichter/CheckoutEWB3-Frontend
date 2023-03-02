import React, { useState } from "react";
import { Alert, AppBar, Button, ButtonGroup, Grid, Snackbar, SwipeableDrawer, Toolbar, Typography } from "@mui/material";
import { AddShoppingCart, AppRegistration, ExitToApp, Gavel, Login, Menu, MenuBook } from "@mui/icons-material";
import LoginDialog from "./auth/LoginDialog";
import UserBidSummaryDialog from "./UserBidSummaryDialog";
import { isEmpty } from "lodash";
import { SignupDialog } from "./auth/SignupDialog";
import useIsMobile from "../utils/useIsMobile";
import { CreateItemDialog } from "./admin/CreateItemDialog";
import { Route, Routes, useNavigate } from "react-router-dom";
import ToggleBiddingDialog from "./admin/ToggleBiddingDialog";

export default function WebsiteHeader({
    token,
    updateAndSaveToken,
    userProfile,
    refreshItems,
}) {

    const [newItemSuccessOpen, setNewItemSuccessOpen] = useState(false);
    const [registerSuccessOpen, setRegisterSuccessOpen] = useState(false);
    const [mobileNavDrawerOpen, setMobileNavDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const toggleDrawer = (open) =>
        (event) => {
            if (
                event &&
                event.type === 'keydown' &&
                (event.key === 'Tab' || event.key === 'Shift' || event.key === 'Enter')
            ) {
                return;
            }
            setMobileNavDrawerOpen(open);
        };

    let isMobile = useIsMobile();

    const authButtons =
        isEmpty(token) && (
            <>
                <Button
                    color="inherit"
                    variant={"outlined"}
                    onClick={() => navigate("/register")}
                    style={{ marginRight: "1em" }}
                    startIcon={<AppRegistration />}
                >
                    Sign Up
                </Button>
                <Button
                    color="inherit"
                    variant={"outlined"}
                    onClick={() => navigate("/login")}
                    startIcon={<Login />}
                >
                    Login
                </Button>
            </>
        );


    const _loginLabel = <Typography variant="body2" style={{ marginRight: "1em" }}>
        Logged in as{" "}
        {userProfile.first_name + " " + userProfile.last_name}
        &nbsp; &nbsp;
        |
    </Typography>

    const desktopNavigationButtons = (
        <>
            {!isEmpty(token) && !isMobile && _loginLabel}
            <ButtonGroup variant="text">
                {!isEmpty(token) && userProfile.admin && (
                    <>
                        <Button
                            color="inherit"
                            style={isMobile ? { marginRight: "1em" } : {}}
                            variant={"outlined"}
                            onClick={() => navigate("/toggle_bidding")}
                            startIcon={<Gavel />}
                        >
                            Toggle Bidding
                        </Button>

                        <Button
                            color="inherit"
                            style={isMobile ? { marginRight: "1em" } : {}}
                            variant={"outlined"}
                            onClick={() => navigate("/create_item")}
                            startIcon={<AddShoppingCart />}
                        >
                            Create Item
                        </Button>
                    </>
                )}

                {!isEmpty(token) && (
                    <>
                        <Button
                            color="inherit"
                            variant={"outlined"}
                            onClick={() => navigate("/status")}
                            startIcon={<MenuBook />}
                        >
                            Bidding Status
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => updateAndSaveToken(null)}
                            startIcon={<ExitToApp />}
                        >
                            Logout
                        </Button>
                    </>
                )
                }
            </ButtonGroup>
        </>
    );

    const mobileNavigationButtons = (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            className="mt-3 mb-5"
        >
            <Grid item xs={9}>
                {!isEmpty(token) && userProfile.admin && (
                    <Button
                        color="primary"
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/toggle_bidding")}
                        startIcon={<Gavel />}
                    >
                        Toggle Bidding
                    </Button>
                )}
            </Grid>

            <Grid item xs={9}>
                {!isEmpty(token) && userProfile.admin && (
                    <Button
                        color="primary"
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/create_item")}
                        startIcon={<AddShoppingCart />}
                    >
                        Create Item
                    </Button>
                )}
            </Grid>

            <Grid item xs={9}>
                {!isEmpty(token) && (
                    <Button
                        color="primary"
                        fullWidth
                        variant="contained"
                        onClick={() => navigate("/status")}
                        startIcon={<MenuBook />}
                    >
                        Bidding Status
                    </Button>
                )}
            </Grid>

            <Grid item xs={9}>
                {!isEmpty(token) && (
                    <Button
                        color="primary"
                        fullWidth
                        variant="contained"
                        onClick={() => updateAndSaveToken(null)}
                        startIcon={<ExitToApp />}
                    >
                        Logout
                    </Button>
                )}
            </Grid>
        </Grid>
    );

    return (
        <div
            style={{
                flexGrow: 1,
            }}
        >
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        style={{
                            flexGrow: 1,
                        }}
                    >
                        {isMobile
                            ? "EWB Auction"
                            : "UMass Amherst Engineers Without Borders - Annual Auction"
                        }
                    </Typography>

                    {isEmpty(token) ? authButtons :
                        isMobile ? (
                            <>
                                <Button color="inherit" variant="outlined" endIcon={<Menu />} onClick={toggleDrawer(true)}>
                                    Actions
                                </Button>
                                <SwipeableDrawer
                                    anchor='top'
                                    open={mobileNavDrawerOpen}
                                    onClose={toggleDrawer(false)}
                                    onOpen={toggleDrawer(true)}
                                >
                                    {mobileNavigationButtons}
                                </SwipeableDrawer>
                            </>
                        ) :
                            desktopNavigationButtons
                    }
                </Toolbar>
            </AppBar>


            <Routes>
                <Route
                    path="login"
                    element={<LoginDialog
                        updateAndSaveToken={updateAndSaveToken}
                    />}
                />
            </Routes>

            <Routes>
                <Route
                    path="toggle_bidding"
                    element={<ToggleBiddingDialog token={token} userProfile={userProfile} />}
                />
            </Routes>

            <Routes>
                <Route
                    path="register"
                    element={<SignupDialog setRegisterSuccessOpen={setRegisterSuccessOpen} />}
                />
            </Routes>

            <Routes>
                <Route
                    path="status"
                    element={<UserBidSummaryDialog token={token} />}
                />
            </Routes>


            <Routes>
                <Route
                    path="create_item"
                    element={<CreateItemDialog
                        token={token}
                        setNewItemSuccessOpen={setNewItemSuccessOpen}
                        refreshItems={refreshItems}
                    />}
                />
            </Routes>



            <Snackbar
                open={registerSuccessOpen}
                autoHideDuration={6000}
                onClose={() => setRegisterSuccessOpen(false)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert
                    onClose={() => setRegisterSuccessOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Account creation successful! You may now log in with your new account.
                </Alert>
            </Snackbar>

            <Snackbar
                open={newItemSuccessOpen}
                autoHideDuration={6000}
                onClose={() => setNewItemSuccessOpen(false)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert
                    onClose={() => setNewItemSuccessOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Item successfully created!
                </Alert>
            </Snackbar>
        </div >
    );
}
