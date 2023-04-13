import {
    Alert,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { has, isEmpty, isEqual } from "lodash";
import React, { memo } from "react";
import { Edit } from "@mui/icons-material";
import DeleteItemDialog from "./admin/DeleteItemDialog";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Blurhash } from "react-blurhash";

function AuctionItemCard({ item, selectItemToOpen, bidStatus = undefined, userProfile, token, refreshItems }) {

    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

    React.useEffect(() => {
        console.log("Item card updated");
    }, [item, selectItemToOpen, bidStatus, userProfile, token, refreshItems]);

    const navigate = useNavigate();

    function truncateString(str, num) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + "...";
    }

    function markItemAsSelected() {
        selectItemToOpen(item["name"]);
    }

    function selectItemToEdit() {
        navigate(`/edit_item/${item["name"]}`);
    }

    return (
        <Card elevation={5}>
            <CardActionArea>
                <CardMedia title={"Picture of " + item["name"]}>
                    <LazyLoadImage
                        src={item["image"]}
                        alt={item["description"]}
                        width="100%"
                        height="300px"
                        key={item["image_placeholder"]}
                        placeholder={<Blurhash
                            hash={item["image_placeholder"]}
                            height='350px'
                            width='100%'
                        />}
                    />
                </CardMedia>
            </CardActionArea>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {item["name"]}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Current Bid: ${
                        has(item, "winning_bid") && !isEmpty(item["winning_bid"]) ?
                            parseFloat(item["winning_bid"]["bid"]).toFixed(2) :
                            parseFloat(item["original_bid"]).toFixed(2)
                    }
                </Typography>

                {isEmpty(item["winning_bid"]) && (
                    <Typography variant={"body2"} style={{ color: "darkgray" }}>
                        No Bids Placed Yet
                    </Typography>
                )}


                <Divider style={{ marginTop: "1em", marginBottom: "1em" }} />

                <Typography variant="body2" color="textSecondary" component="div">
                    {truncateString(item["description"], 50)}
                </Typography>

                {!isEmpty(bidStatus) && bidStatus.includes("You are not the highest bidder") && (
                    <Alert elevation={6} variant="filled" severity="error" className='mt-3'>
                        {bidStatus}
                    </Alert>
                )}

                {!isEmpty(bidStatus) && bidStatus.includes("You are the highest bidder") && (
                    <Alert elevation={6} variant="filled" severity="success" className='mt-3'>
                        {bidStatus}
                    </Alert>
                )}

            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    style={{ marginLeft: "auto" }}
                    onClick={markItemAsSelected}
                >
                    Place Bid
                </Button>

                {!isEmpty(token) && userProfile.admin &&
                    <Button size="small" variant="outlined" startIcon={<Edit />} color='info' onClick={selectItemToEdit}>
                        Edit
                    </Button>
                }

                {!isEmpty(token) && userProfile.admin &&
                    <Button size="small" variant="outlined" startIcon={<DeleteIcon />} color='error' onClick={() => setDeleteConfirmOpen(true)}>
                        Delete
                    </Button>
                }

                <DeleteItemDialog open={deleteConfirmOpen} setOpen={setDeleteConfirmOpen} itemName={item.name} token={token} refreshItems={refreshItems} />

            </CardActions>
        </Card>
    );
}

export default memo(AuctionItemCard, (prevProps, nextProps) => {
    return isEqual(prevProps.item, nextProps.item) && isEqual(prevProps.bidStatus, nextProps.bidStatus) && isEqual(prevProps.token, nextProps.token);
});