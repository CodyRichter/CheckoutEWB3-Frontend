import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { isEmpty } from "lodash";
import React from "react";
import Network from "../../utils/network";
import { useNavigate } from "react-router-dom";

export function CreateItemDialog({ token, refreshItems, setNewItemSuccessOpen }) {
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [bid, setBid] = useState("");
    const [image, setImage] = useState("");
    const [additionalImages, setAdditionalImages] = useState("");

    const [pendingTag, setPendingTag] = useState("");
    const [tags, setTags] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/");
        setItemName("");
        setItemDescription("");
        setBid("");
        setImage("");
        setAdditionalImages("");
        setTags([]);
        setLoading(false);
        setErrorMessages([]);
    };

    function validateForm() {
        let errorMessages = [];
        if (isEmpty(itemName)) {
            errorMessages.push("- Item name is required");
        }
        if (isEmpty(itemDescription)) {
            errorMessages.push("- Item description is required");
        }

        const bidAmountFloat = parseFloat(bid);
        if (isEmpty(bid)) {
            errorMessages.push("- Starting bid is required.");
        }
        else if (isNaN(bidAmountFloat)) {
            errorMessages.push("- Starting bid must be a valid number.");
        } else if (bidAmountFloat < 0) {
            errorMessages.push("- Starting bid must be a positive number.");
        }

        if (isEmpty(image)) {
            errorMessages.push("- Image URL is required");
        }
        setErrorMessages(errorMessages);
        return errorMessages.length === 0;
    }

    function triggerItemCreate() {
        // Validate the form before submitting.
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        // name, description, bid, tags, image, additionalImages, token
        Network.createItem(itemName, itemDescription, bid, tags, image, additionalImages, token)
            .then(() => {
                setLoading(false);
                setNewItemSuccessOpen(true);
                handleClose();
                refreshItems();
            })
            .catch((error) => {
                setErrorMessages(["- ".concat(error.message)]);
                setLoading(false);
            });
    }

    return (
        <>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle>Create Item</DialogTitle>
                <DialogContent>
                    <DialogContentText className="mb-2">
                        Enter details below to create a new auction item.
                    </DialogContentText>
                    <Grid container spacing={2} className="mt-3">
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                autoFocus
                                id="name"
                                label="Item Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="bid"
                                label="Starting Bid"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setBid(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                multiline
                                margin="dense"
                                id="description"
                                label="Item Description"
                                type="text"
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setItemDescription(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                required
                                margin="dense"
                                id="image"
                                label="Image URL"
                                type="text"
                                fullWidth
                                variant="outlined"
                                helperText="Image URL for the item. This must be a direct link to the image. You can use a service like Imgur to host your images."
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id="additionalImages"
                                label="Additional Images Album Link"
                                type="text"
                                fullWidth
                                variant="outlined"
                                helperText="Link to external album for additional images. This does not need to be a direct link to an image."
                                onChange={(e) => setAdditionalImages(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={2}
                                divider={<Divider orientation="vertical" flexItem />}
                            >
                                <TextField
                                    margin="dense"
                                    id="tags"
                                    label="Add Tags to Item"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={pendingTag}
                                    helperText="Add tags to the item. Tags are used to filter items in the auction."
                                    onChange={(e) => setPendingTag(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        if (!isEmpty(pendingTag) && !tags.includes(pendingTag)) {
                                            setTags([...tags, pendingTag]);
                                            setPendingTag("");
                                        }
                                    }}
                                >Add</Button>
                            </Stack>
                        </Grid>
                        {tags.length > 0 && (
                            <Grid item xs={12}>
                                <Paper className="p-3" elevation={5}>
                                    <Typography variant="body1">Tags</Typography>
                                    {tags.map((tag, index) => (
                                        <Chip key={`create-${itemName}-${tag}`} label={tag} variant="outlined" className="m-1" onDelete={
                                            () => setTags(tags.filter((_, i) => i !== index))
                                        } />
                                    ))}
                                </Paper>
                            </Grid>
                        )}




                    </Grid>
                    {errorMessages.length > 0 && (
                        <Alert severity="error" className="mt-4" data-testid="signupError">
                            {errorMessages.map((error, index) => (
                                <Typography variant="body1" key={"signup" + error + index}>
                                    {error}
                                </Typography>
                            ))}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="warning">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={triggerItemCreate}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Create Item"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
