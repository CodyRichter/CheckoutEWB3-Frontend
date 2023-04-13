import React, { useEffect, useState } from "react";
import {
    Alert,
    Card,
    CardContent,
    Chip,
    Container,
    createTheme,
    Divider,
    Grid,
    LinearProgress,
    Snackbar,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import Network from "../utils/network";
import AuctionItemDialog from "../components/AuctionItemDialog";
import AuctionItemCard from "../components/AuctionItemCard";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import { EditItemDialog } from "../components/admin/EditItemDialog";

export default function Main({ token, refreshItems, refreshItemToken, userProfile }) {
    const [loadingItems, setLoadingItems] = useState(true);
    let [items, setItems] = useState([]);

    let [tags, setTags] = useState([]);
    let [searchTags, setSearchTags] = useState([]);

    let [bidSuccessTagOpen, setBidSuccessTagOpen] = React.useState(false);

    let [bidStatus, setBidStatus] = useState({});

    let [isBiddingOpen, setIsBiddingOpen] = useState(false);

    // Item Dialog State
    const [editItemSuccessOpen, setEditItemSuccessOpen] = React.useState(false);

    const navigate = useNavigate();


    function selectItem(itemName) {
        navigate(`/items/${itemName}`);
    }

    const footerFont = createTheme({
        typography: {
            fontFamily: [
                'Montserrat',
                'sans-serif',
            ].join(','),
        },
    });

    useEffect(() => {
        Network.getBiddingEnabled().then((is_enabled) => {
            setIsBiddingOpen(is_enabled);
        });
    }, []);

    useEffect(() => {
        if (token) {
            Network.getUserBids(token).then((response) => {
                let bidStatusMap = {};
                response.winning_bids.forEach((bid) => {
                    bidStatusMap[bid.name] = "You are the highest bidder on this item!";
                });
                response.losing_bids.forEach((bid) => {
                    bidStatusMap[bid.name] =
                        "You are not the highest bidder on this item.";
                });
                setBidStatus(bidStatusMap);
            });
        }
    }, [token, items]);



    useEffect(() => {
        Network.getItems().then((itemsFromServer) => {
            setItems(itemsFromServer);

            // Gets unique tags from all items for the search filter
            let x = itemsFromServer.map((serverItemObj, idx) => {
                return serverItemObj["tags"];
            });
            let uniqueTagsFromItems = Array.from(new Set([].concat.apply([], x)));
            setTags(uniqueTagsFromItems);
            setLoadingItems(false);
        });
    }, [refreshItemToken]);

    function toggleTag(tag) {
        let newSearchTags = [...searchTags];
        if (newSearchTags.includes(tag)) {
            // Remove tag if in list
            newSearchTags.splice(newSearchTags.indexOf(tag), 1);
        } else {
            // Add tag if not already in list
            newSearchTags.push(tag);
        }
        setSearchTags(newSearchTags);
    }

    function matchTagFilter(item) {
        if (searchTags.length <= 0) {
            return true;
        }
        return searchTags.every((r) => item.tags.includes(r));
    }

    return (
        <Container>

            {loadingItems &&
                <LinearProgress className="mt-5 mb-5" />
            }

            {!loadingItems &&
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >

                    <Grid item xs={12} className="mt-2">
                        <Card className="p-3">
                            <Typography variant="h4" fontWeight={400}>
                                View the Auction Tutorial: <a href="https://ewb-auction-images-prod.s3.amazonaws.com/Hybrid+Auction+Guide.pdf" target="_blank">Click Here</a>
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        {isBiddingOpen ? (
                            <Alert severity="success" className="mt-3">
                                Bidding is currently open! &nbsp;
                                {!isEmpty(token) && ('You may bid on items below by clicking the "Place Bid" button on an item card.')}
                                {isEmpty(token) && (
                                    <>
                                        You must first <Link to="/login">login</Link> or <Link to="/register">register</Link> to bid on items.
                                    </>
                                )}

                            </Alert>
                        ) : (
                            <Alert severity="error" className="mt-3">
                                Bidding is currently closed. Please check back later!
                            </Alert>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Card
                            variant={"outlined"}
                            style={{ display: "flex" }}
                            className="mt-3"
                        >
                            <CardContent>
                                <Typography variant="h6">Search Auction Items by Tag</Typography>
                                <Typography variant="body2">Use the tags below to narrow down which items are visible. If multiple tags are applied, only items containing all of the selected tags will appear.</Typography>

                                {Object.keys(tags).length > 0 &&
                                    tags.map((tag, i) => (
                                        <Chip
                                            className="m-2"
                                            label={tag}
                                            clickable
                                            onClick={() => toggleTag(tag)}
                                            color={searchTags.includes(tag) ? "secondary" : "primary"}
                                            icon={searchTags.includes(tag) ? <Close /> : <Add />}
                                            key={i}
                                        />
                                    ))}
                            </CardContent>
                        </Card>
                    </Grid>


                    {items.filter((item) => matchTagFilter(item)).length === 0 && (
                        <Grid item xs={12}>
                            <Card elevation={1}>
                                <CardContent>
                                    <Typography variant="h3" component="h3" color="error">
                                        No Auction Items Found
                                    </Typography>
                                    <br />
                                    <Typography variant="body1" component="div">
                                        No items found with the tags that you have selected. Make sure that you're using
                                        them correctly!

                                        For example, if your selected tags are &nbsp;
                                        {<Chip label="Kenya" color="secondary" icon={<Close />} />}&nbsp;
                                        and&nbsp;
                                        {<Chip label="Donated" color="secondary" icon={<Close />} />}&nbsp;
                                        it will search for items that are both from Kenya and have been donated.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {items
                        .filter((item) => matchTagFilter(item))
                        .map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <AuctionItemCard
                                    item={item}
                                    selectItemToOpen={selectItem}
                                    bidStatus={bidStatus[item["name"]]}
                                    userProfile={userProfile}
                                    token={token}
                                    refreshItems={refreshItems}
                                />
                            </Grid>
                        ))}
                    <Grid item xs={12} className='mt-3 mb-5'>

                        <Divider className='mb-3' />

                        <ThemeProvider theme={footerFont}>
                            <Typography variant="subtitle1">
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
                        </ThemeProvider>
                    </Grid>
                </Grid>
            }

            <Snackbar
                open={bidSuccessTagOpen}
                autoHideDuration={6000}
                onClose={() => setBidSuccessTagOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    elevation={6}
                    variant="filled"
                    onClose={() => setBidSuccessTagOpen(false)}
                    severity="success"
                >
                    Bid Successfully Placed!
                </Alert>
            </Snackbar>

            <Routes>
                <Route
                    path="items/:itemName"
                    element={<AuctionItemDialog
                        token={token}
                        setSuccessTagOpen={setBidSuccessTagOpen}
                        refreshItems={refreshItems}
                    />}
                />

                <Route
                    path="edit_item/:itemName"
                    element={<EditItemDialog setEditSuccessOpen={setEditItemSuccessOpen} token={token} refreshItems={refreshItems} />}
                />
            </Routes>

            <Snackbar
                open={editItemSuccessOpen}
                autoHideDuration={6000}
                onClose={() => setEditItemSuccessOpen(false)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert
                    onClose={() => setEditItemSuccessOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Auction item edited successfully!
                </Alert>
            </Snackbar>

        </Container >
    );
}
