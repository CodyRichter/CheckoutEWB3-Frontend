import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import Typography from "@material-ui/core/Typography";


export default function WebsiteHeader() {

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography variant="h6">
                    EWB Auction Online 2021
                </Typography>
            </Toolbar>
        </AppBar>
    )
}