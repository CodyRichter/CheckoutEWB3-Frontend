import { ArrowBack } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import React from "react";
import useIsMobile from "../utils/useIsMobile";

export default function AdminHeader({ pageName, exitURL, exitPageName }) {

    const isMobile = useIsMobile();

    return (
        <AppBar position="static">
            <Toolbar>
                <Button
                    size="large"
                    color="warning"
                    variant="contained"
                    href={exitURL}
                    sx={{ mr: 2 }}
                    startIcon={<ArrowBack />}
                >
                    {isMobile ? "Back" : `Return to ${exitPageName}`}

                </Button>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {pageName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}