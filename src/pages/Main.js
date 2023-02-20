import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import Network from "../utils/network";
import AuctionItemDialog from "../components/AuctionItemDialog";
import AuctionItemCard from "../components/AuctionItemCard";

export default function Main({ token, userProfile }) {
    let [items, setItems] = useState([]);

    let [tags, setTags] = useState([]);
    let [searchTags, setSearchTags] = useState([]);

    let [selectedItem, setSelectedItem] = useState(null);
    let [itemDialogOpen, setItemDialogOpen] = useState(false);

    let [bidStatus, setBidStatus] = useState({});

    function selectItem(item) {
        setSelectedItem(item);
        setItemDialogOpen(true);
    }

    useEffect(() => {
        //
        // let itemsFromServer = [
        //     { "name": "Kenyan Bowl", "tags": ["Kenya"], "description": "A wonderful handmade Maasai salad bowl", "image": "https://cdn20.pamono.com/p/g/5/0/506188_3zfnpi2eio/vintage-japanese-bowl-by-kei-fujiwara-1960s-1.jpg", "bid": 15, "bids_placed": false},
        //     { "name": "Ghanaian Tongs", "tags": ["Ghana"], "description": "For your salad. Need I say more?", "image": "https://www.ubuy.com.gh/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzUxc2J0aW5CdGRMLl9TUzQwMF8uanBn.jpg", "bid": 10.5, "bids_placed": false},
        //     { "name": "Piri Piri Collection", "tags": ["Kenya"], "description": "A delicious collection of piri piri peppers", "image": "https://images.ricardocuisine.com/services/recipes/1074x1074_3621-background.jpg", "bid": 15.2, "bids_placed": false},
        //     { "name": "$50 Chipotle Gift Card", "tags": ["Amherst", "Donated"], "description": "This is more than we ever got from our Chipotle fundraisers...", "image": "https://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/chipotle_5.gif?itok=Irzzw2re", "bid": 21.3, "bids_placed": false},
        // ];

        Network.getItems().then((itemsFromServer) => {
            setItems(itemsFromServer);
            // Gets unique tags from all items for the search filter
            let x = itemsFromServer.map((serverItemObj, idx) => {
                return serverItemObj["tags"];
            });
            let uniqueTagsFromItems = Array.from(new Set([].concat.apply([], x)));
            setTags(uniqueTagsFromItems);
        });

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
    }, [itemDialogOpen, token]);

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
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12} md={9}>
                    <Card
                        variant={"outlined"}
                        style={{ display: "flex" }}
                        className="mt-3"
                    >
                        <CardContent>
                            <Typography variant={"h6"}>Filter Auction Items</Typography>

                            {Object.keys(tags).length > 0 &&
                                tags.map((tag, i) => (
                                    <Chip
                                        // style={{ marginRight: 8 }}
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

                <Grid item xs={12} md={3} style={{ display: "flex" }} className="mt-3">
                    <Card variant={"outlined"}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                            className="pb-2 pt-2"
                        >
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    rel="noreferrer"
                                    target="_blank"
                                    color="secondary"
                                    fullWidth
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSd8TeBNO7_MmWLLh0Ge8KtP5epoD3roQ88MOqaNqfcsMNg7CA/viewform?usp=sf_link"
                                >
                                    T-Shirts and Masks
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    rel="noreferrer"
                                    target="_blank"
                                    color="secondary"
                                    fullWidth
                                    href="https://ewbumass.weebly.com/donate"
                                >
                                    Our Sponsors
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {items.filter((item) => matchTagFilter(item)).length === 0 && (
                    <Grid item xs={12}>
                        <Card elevation={1}>
                            <CardContent>
                                <Typography variant="h4" component="h4">
                                    No auction items matching search criteria found
                                </Typography>
                                <Typography variant="body1" component="p">
                                    The search function uses an AND filter. This means that it
                                    will search for items that match all of the selected tags. For
                                    example, if your selected tags are <strong>Kenya</strong> and{" "}
                                    <strong>Donated</strong>, it will search for items from Kenya
                                    that have been donated.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {items
                    .filter((item) => matchTagFilter(item))
                    .map((item, index) => (
                        <Grid item xs={12} md={4} key={index} style={{ display: "flex" }}>
                            <AuctionItemCard
                                item={item}
                                selectItemToOpen={selectItem}
                                bidStatus={bidStatus[item["name"]]}
                            />
                        </Grid>
                    ))}
                <Grid item xs={12} style={{ paddingTop: "1em" }}>
                    <Typography variant="subtitle1">
                        Website created by{" "}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.linkedin.com/in/Cody-Richter"
                        >
                            Cody Richter
                        </a>
                        . This auction webpage is open source and available to view on
                        Github. &nbsp;
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://github.com/CodyRichter/CheckoutEWB3-Frontend"
                        >
                            [Client]
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
                </Grid>
            </Grid>

            <AuctionItemDialog
                open={itemDialogOpen}
                setOpen={setItemDialogOpen}
                itemName={selectedItem}
                resetItem={() => setSelectedItem(null)}
                token={token}
            />
        </Container>
    );
}
