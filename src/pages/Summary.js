import { Alert, colors, Grid, Paper, Snackbar, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { has, isEmpty } from "lodash";
import React, { useEffect } from "react";
import Network from "../utils/network";


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: colors.grey[300],
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function fetchItems() {
    return Network.getItems().then((items) => {
        return items;
    });
}

export default function Summary({ token, userProfile, refreshItems, refreshItemToken }) {

    const [items, setItems] = React.useState([]);
    const [refreshOpen, setRefreshOpen] = React.useState(false);

    useEffect(() => {
        fetchItems().then((items) => {
            setItems(items);
        });
        const interval = setInterval(() => {
            fetchItems().then((items) => {
                setItems(items);
                setRefreshOpen(true);
            });
        }, 10 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Only allow admins to access this page
        if (isEmpty(token) || isEmpty(userProfile) || !has(userProfile, "admin") || !userProfile["admin"]) {
            window.location.href = "/";
        }
    }, [token, userProfile]);



    return (
        <>
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
                        Bidding Summary
                    </Typography>
                </Grid>

                <Grid item xs={7}>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell align="left">Current Bid</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <StyledTableRow
                                        key={`${item['name']}-row`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <b>{item['name']}</b>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            ${has(item, "winning_bid") && !isEmpty(item["winning_bid"]) ?
                                                parseFloat(item["winning_bid"]["bid"]).toFixed(2) :
                                                <>
                                                    {parseFloat(item["original_bid"]).toFixed(2)}
                                                    <Typography variant="caption" display="block" color="error" gutterBottom>
                                                        No bids yet
                                                    </Typography>
                                                </>
                                            }

                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <Snackbar open={refreshOpen} autoHideDuration={3000} onClose={() => setRefreshOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    Bids Refreshed!
                </Alert>
            </Snackbar>
        </>
    );
}