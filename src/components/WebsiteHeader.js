import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import Typography from "@material-ui/core/Typography";


export default function WebsiteHeader() {

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <Typography variant="h6">
                    UMass Amherst Engineers Without Borders - 2021 Spring Auction
                </Typography>
            </Toolbar>
        </AppBar>
    )
}