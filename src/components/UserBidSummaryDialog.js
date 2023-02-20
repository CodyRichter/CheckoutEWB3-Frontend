import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";
import Network from "../utils/network";

export default function UserBidSummaryDialog({
    bidDialogOpen,
    setBidDialogOpen,
    token,
}) {
    const [bids, setBids] = React.useState({ winning_bids: [], losing_bids: [] });
    const [bidOpenLoading, setBidOpenLoading] = React.useState(false);

    React.useEffect(() => {
        if (bidDialogOpen && !isEmpty(token)) {
            setBidOpenLoading(true);
            Network.getUserBids(token)
                .then((response) => {
                    setBids(response);
                })
                .finally(() => {
                    setBidOpenLoading(false);
                });
        }
    }, [bidDialogOpen, token]);

    return (
        <Dialog
            maxWidth={"md"}
            fullWidth
            open={bidDialogOpen}
            onClose={() => setBidDialogOpen(false)}
        >
            <DialogTitle id="form-dialog-title">Your Bidding Information</DialogTitle>
            <DialogContent>
                {bidOpenLoading ? (
                    <LinearProgress />
                ) : (
                    <div>
                        <DialogContentText>
                            You are bidding on{" "}
                            <b>{bids.winning_bids.length + bids.losing_bids.length}</b> item
                            {bids.winning_bids.length + bids.losing_bids.length === 1
                                ? ""
                                : "s"}
                            . You are the highest bidder on
                            <b> {bids.winning_bids.length}</b> item
                            {bids.winning_bids.length === 1 ? "" : "s"}. You have placed
                            <b> {bids.losing_bids.length}</b> other bid
                            {bids.losing_bids.length === 1 ? "" : "s"}.
                        </DialogContentText>
                        <Divider />
                        <br />
                        <Typography variant="h5" component="h5">
                            Current Highest Bidder on:
                        </Typography>
                        <br />
                        {bids.winning_bids.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Your Bid</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bids.winning_bids.map((bid, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{bid["name"]}</TableCell>
                                                <TableCell>${bid["bid"]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography
                                variant="body2"
                                component="p"
                                style={{ color: "red" }}
                            >
                                You are not the highest bidder on any items.
                            </Typography>
                        )}

                        <br />
                        <Typography variant="h5" component="h5">
                            Other Bids
                        </Typography>
                        <Typography variant="body2" component="p">
                            The bids in this section are the ones that you have placed, but
                            that are not currently winning.
                        </Typography>
                        <br />
                        {bids.losing_bids.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Current Winning Bid</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bids.losing_bids.map((bid, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{bid["name"]}</TableCell>
                                                <TableCell>${bid["bid"]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : bids.winning_bids.length > 0 ? (
                            <Typography
                                variant="body2"
                                component="p"
                                style={{ color: "red" }}
                            >
                                You are the highest bidder on all of your items.
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                component="p"
                                style={{ color: "red" }}
                            >
                                You have not placed any bids yet.
                            </Typography>
                        )}

                        <Grid
                            spacing={3}
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            style={{ paddingTop: "2em", paddingBottom: "2em" }}
                        ></Grid>
                    </div>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setBidDialogOpen(false)} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
