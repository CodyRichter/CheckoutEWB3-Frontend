import { Download, Launch } from "@mui/icons-material";
import { Alert, Button, Card, CircularProgress, Divider, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import { has, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Network from "../utils/network";

function csvClean(str) {
    return str.replace(/,/g, '');
}


export default function Admin({ token, userProfile, refreshItems, refreshItemToken }) {

    const [isBiddingOpen, setIsBiddingOpen] = useState(false);
    const [toggleError, setToggleError] = useState('');

    const [loadingWinningBids, setLoadingWinningBids] = useState(false);
    const [winningBidError, setWinningBidError] = useState('');

    const navigate = useNavigate();

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

    function downloadWinningBids() {
        setLoadingWinningBids(true);
        setWinningBidError('');
        Network.getWinningBids(token).then((winningBids) => {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Item Name,Winning Bid,Email,First Name,Last Name";
            winningBids.forEach((winningBid) => {
                csvContent += "\n";
                csvContent += csvClean(winningBid["item_name"]) + "," + winningBid["winning_bid"] + "," + csvClean(winningBid["email"]) + "," + csvClean(winningBid["first_name"]) + "," + csvClean(winningBid["last_name"]);
            });
            console.log(csvContent);
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "winning_bids.csv");
            document.body.appendChild(link); // Required for FF
            link.click();
            setLoadingWinningBids(false);

        }).catch((error) => {
            setLoadingWinningBids(false);
            setWinningBidError(error.message);
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
                        <Button variant="contained" color="primary" onClick={() => navigate('/summary')} startIcon={<Launch />}>
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
                        <Button variant="contained" color="primary" onClick={() => navigate('/generate-codes')} startIcon={<Launch />}>
                            View Cards
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} md={7} textAlign='left' className='mb-3 pb-2 pt-2' component={Card} elevation={4}>
                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                    <Grid item xs={12} textAlign='center'>
                        <Typography variant="h5" component="div" gutterBottom>
                            Export Winning Bids
                        </Typography>

                        <Typography variant="body1" component="div" gutterBottom>
                            Generate a spreadsheet that lists all winning bids and the contact information
                            of the winning bidder. You may then use this spreadsheet to contact the winning
                            bidders and arrange for them to pick up their items.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} textAlign='center'>
                        <Button variant="contained" color="primary" onClick={downloadWinningBids} startIcon={<Download />} disabled={loadingWinningBids}>
                            {loadingWinningBids ? <CircularProgress size={24} /> : "Export"}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>


        </Grid>
    );
}