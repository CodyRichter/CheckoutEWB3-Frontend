import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import React from "react";
import { useState } from "react";
import Network from "../../utils/network";


export default function DeleteItemDialog({ open, setOpen, itemName, token, refreshItems }) {

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        Network.deleteItem(itemName, token).then(() => {
            handleClose();
            refreshItems();
        });
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {itemName}? This will also
                        delete all bids for this item.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}