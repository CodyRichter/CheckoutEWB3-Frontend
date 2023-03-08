import { Launch } from "@mui/icons-material";
import { Alert, Button, Card, Divider, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import { has, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import Network from "../utils/network";


export default function Admin({ token, userProfile, refreshItems, refreshItemToken }) {

    const [isBiddingOpen, setIsBiddingOpen] = useState(false);
    const [toggleError, setToggleError] = useState('');

    useEffect(() => {
        Network.getBiddingEnabled().then((is_enabled) => {
            setIsBiddingOpen(is_enabled);
        });
    }, [isBiddingOpen]);

    useEffect(() => {
        // Only allow admins to access this page
        if (isEmpty(token) || isEmpty(userProfile) || !has(userProfile, "admin") || !userProfile["admin"]) {
            window.location.href = "/";
        }
    }, [token, userProfile]);

    const toggleBidding = () => {
        Network.setBiddingEnabled(!isBiddingOpen, token).then((is_enabled) => {
            setIsBiddingOpen(is_enabled);
            setToggleError('');
        }).catch((error) => {
            setToggleError(error.message);
        });
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="mt-5 ml-2 mr-2"
            spacing={3}
        >
            <Grid item xs={7} textAlign='center'>
                <Typography variant="h4" component="div" gutterBottom>
                    Auction Administration
                </Typography>

                <Divider sx={{ borderBottomWidth: 5 }} />
            </Grid>


            <Grid item xs={12} md={7} textAlign='left' className='mb-3 pb-2 pt-2' component={Card} elevation={4}>

                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item xs={12} textAlign='center'>
                        <Typography variant="h5" component="div" gutterBottom>
                            Enable or Disable Bidding
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8} textAlign='center'>
                        <Alert severity={isBiddingOpen ? "success" : "error"}>
                            {isBiddingOpen ? "Bidding is currently enabled" : "Bidding is currently disabled"}
                        </Alert>
                    </Grid>

                    <Grid item xs={12} md={8} textAlign='center'>
                        <FormControlLabel
                            style={{ display: "block" }}
                            checked={isBiddingOpen}
                            onClick={toggleBidding}
                            control={<Switch color="primary" />}
                            label="Toggle Bidding"
                            labelPlacement="bottom"
                        />
                    </Grid>

                    {!isEmpty(toggleError) && (
                        <Grid item xs={12} textAlign='center'>
                            <Typography variant="body1" color="error" className="mt-2">
                                {toggleError}
                            </Typography>
                        </Grid>
                    )}

                </Grid>
            </Grid>

            <Grid item xs={12} md={7} textAlign='left' className='mb-3 pb-2 pt-2' component={Card} elevation={4}>
                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item xs={12} textAlign='center'>
                        <Typography variant="h5" component="div" gutterBottom>
                            Bidding Summary
                        </Typography>

                        <Typography variant="body1" component="div" gutterBottom>
                            This page will show a summary of all bids that have been placed, and is designed
                            to be projected on a screen for all guests at the event to see. The page will
                            automatically refresh every 10 seconds to show the latest bids.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} textAlign='center'>
                        <Button variant="contained" color="primary" href="/#/summary" startIcon={<Launch />}>
                            View Summary
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} md={7} textAlign='left' className='mb-3 pb-2 pt-2' component={Card} elevation={4}>
                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item xs={12} textAlign='center'>
                        <Typography variant="h5" component="div" gutterBottom>
                            Generate Item Cards
                        </Typography>

                        <Typography variant="body1" component="div" gutterBottom>
                            This page is will generate cards for each item that can be printed and placed next to the item.
                            Unique QR codes are generated per-card and guests can scan the QR code to place bids
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} textAlign='center'>
                        <Button variant="contained" color="primary" href="/#/generate-codes" startIcon={<Launch />}>
                            View Cards
                        </Button>
                    </Grid>
                </Grid>
            </Grid>


        </Grid>
    );
}