import {
    Alert,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Snackbar,
    Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { isEmpty } from "lodash";
import React from "react";
import { Edit } from "@mui/icons-material";
import DeleteItemDialog from "./admin/DeleteItemDialog";
import { EditItemDialog } from "./admin/EditItemDialog";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Blurhash } from "react-blurhash";

export default function AuctionItemCard({ item, selectItemToOpen, bidStatus, userProfile, token, refreshItems }) {

    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [editItemSuccessOpen, setEditItemSuccessOpen] = React.useState(false);
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
        navigate(`/items/${item["name"]}/edit`);
    }

    return (
        <Card elevation={5}>
            <CardActionArea>
                <CardMedia title={"Picture of " + item["name"]}>
                    <LazyLoadImage
                        src={item["image"]}
                        alt={item["description"]}
                        width="100%"
                        height="auto"
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
                    Current Bid: ${parseFloat(item["bid"]).toFixed(2)}
                </Typography>

                {!item["bids_placed"] && (
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


                <Routes>
                    <Route
                        path="items/:itemName/edit"
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

            </CardActions>
        </Card>
    );
}
