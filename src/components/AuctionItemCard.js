import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";

export default function AuctionItemCard({ item, selectItemToOpen, bidStatus }) {
    function truncateString(str, num) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + "...";
    }

    function markItemAsSelected() {
        selectItemToOpen(item["name"]);
    }

    return (
        <Card elevation={5}>
            <CardMedia title={"Picture of " + item["name"]}>
                <img
                    src={item["image"]}
                    alt={item["description"]}
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                    }}
                />
            </CardMedia>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {item["name"]}
                </Typography>

                <Typography variant="body1">
                    Current Bid: ${parseFloat(item["bid"]).toFixed(2)}
                </Typography>

                {!item["bids_placed"] && (
                    <Typography variant={"body2"} style={{ color: "darkgray" }}>
                        No Bids Placed Yet
                    </Typography>
                )}
                {!isEmpty(bidStatus) &&
                    bidStatus.includes("You are not the highest bidder") && (
                        <Alert elevation={6} variant="filled" severity="error">
                            {bidStatus}
                        </Alert>
                    )}

                {!isEmpty(bidStatus) &&
                    bidStatus.includes("You are the highest bidder") && (
                        <Alert elevation={6} variant="filled" severity="success">
                            {bidStatus}
                        </Alert>
                    )}

                <Divider style={{ marginTop: "1em", marginBottom: "1em" }} />

                <Typography variant="body2" color="textSecondary" component="p">
                    {truncateString(item["description"], 50)}
                </Typography>
            </CardContent>
            <CardActions>
                {item["additional_images"] !== "" && (
                    <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        target="_blank"
                        href={item["additional_images"]}
                    >
                        More Photos
                    </Button>
                )}
                <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={markItemAsSelected}
                >
                    Place Bid
                </Button>
            </CardActions>
        </Card>
    );
}
