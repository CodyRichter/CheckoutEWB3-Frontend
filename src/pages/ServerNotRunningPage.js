import { Divider, Grid, ThemeProvider, Typography } from "@mui/material";
import React from "react";

export default function ServerNotRunningPage() {

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '80vh' }}
            >

                <Grid item xs={7} textAlign='center'>
                    <Typography variant="h2" component="div" gutterBottom>
                        Auction Servers Are Not Running
                    </Typography>
                    <Typography variant="h6" component="div" gutterBottom>
                        Thank you for a great auction this year! We hope you had a great time and
                        enjoyed the auction. Keep posted for next year's auction!
                    </Typography>

                    <Divider variant="middle" className="mt-5 mb-5" />

                    <Typography variant="subtitle1" component="div" gutterBottom>
                        If you're a developer, you may have noticed that the server is not running
                        since we only keep it up during the auction. If you'd like
                        to run the server locally, please see the README.md file in the root of the
                        repository. If you have any questions, please contact Cody Richter at &nbsp;
                        <a href="mailto:cody@richter.codes">cody@richter.codes</a>.
                    </Typography>
                </Grid>

            </Grid>
            <Typography variant="subtitle1" align="center">
                Website created by &nbsp;
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://cody.richter.codes"
                >
                    Cody Richter
                </a> for the Engineers Without Borders - UMass Amherst Student Chapter.

                This website and the code behind it are open source and available on
                Github. &nbsp;
                <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://github.com/CodyRichter/CheckoutEWB3-Frontend"
                >
                    [Website]
                </a>
                &nbsp; &nbsp;
                <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://github.com/CodyRichter/CheckoutEWB3-Backend"
                >
                    [Server]
                </a>
            </Typography>
        </>
    );
}