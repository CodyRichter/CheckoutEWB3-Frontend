import React, { useState } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { ExitToApp, MenuBook } from "@mui/icons-material";
import LoginDialog from "./auth/LoginDialog";
import UserBidSummaryDialog from "./UserBidSummaryDialog";
import { isEmpty } from "lodash";
import { SignupDialog } from "./auth/SignupDialog";
import useIsMobile from "../utils/useIsMobile";

export default function WebsiteHeader({
    token,
    updateAndSaveToken,
    userProfile,
}) {
    let [loginDialogOpen, setLoginDialogOpen] = useState(false);
    let [signupDialogOpen, setSignupDialogOpen] = useState(false);
    let [bidDialogOpen, setBidDialogOpen] = useState(false);

    let isMobile = useIsMobile();

    function checkBidStatus() {
        setBidDialogOpen(true);
    }

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
                            : "UMass Amherst Engineers Without Borders - Annual Auction"}
                    </Typography>
                    {isEmpty(token) && (
                        <>
                            <Button
                                color="inherit"
                                variant={"outlined"}
                                onClick={() => setSignupDialogOpen(true)}
                                style={{ marginRight: "1em" }}
                            >
                                Sign Up
                            </Button>
                            <Button
                                color="inherit"
                                variant={"outlined"}
                                onClick={() => setLoginDialogOpen(true)}
                            >
                                Login
                            </Button>
                        </>
                    )}
                    {!isEmpty(token) && !isMobile && (
                        <Typography variant="body2" style={{ marginRight: "1em" }}>
                            Logged in as{" "}
                            {userProfile.first_name + " " + userProfile.last_name}
                        </Typography>
                    )}
                    {!isEmpty(token) && (
                        <>
                            <Button
                                color="inherit"
                                style={{ marginRight: "1em" }}
                                variant={"outlined"}
                                onClick={checkBidStatus}
                                startIcon={<MenuBook />}
                            >
                                Bidding Status
                            </Button>
                            <Button
                                color="inherit"
                                variant={"outlined"}
                                onClick={() => updateAndSaveToken(null)}
                                startIcon={<ExitToApp />}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <LoginDialog
                loginDialogOpen={loginDialogOpen}
                setLoginDialogOpen={setLoginDialogOpen}
                updateAndSaveToken={updateAndSaveToken}
            />

            <UserBidSummaryDialog
                bidDialogOpen={bidDialogOpen}
                setBidDialogOpen={setBidDialogOpen}
                token={token}
            />

            <SignupDialog open={signupDialogOpen} setOpen={setSignupDialogOpen} />
        </div>
    );
}
