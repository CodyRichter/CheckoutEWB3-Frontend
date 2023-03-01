import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert, Divider, FormControlLabel, Switch, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Network from "../../utils/network";


export default function ToggleBiddingDialog({ token, userProfile }) {

    const navigate = useNavigate();

    const [isBiddingOpen, setIsBiddingOpen] = useState(false);
    const [toggleError, setToggleError] = useState('');

    const handleClose = () => {
        navigate("/");
    };

    useEffect(() => {
        Network.getBiddingEnabled().then((is_enabled) => {
            setIsBiddingOpen(is_enabled);
        });
    }, [isBiddingOpen]);

    const toggleBidding = () => {
        Network.setBiddingEnabled(!isBiddingOpen, token).then((is_enabled) => {
            setIsBiddingOpen(is_enabled);
            setToggleError('');
        }).catch((error) => {
            setToggleError(error.message);
        });
    }

    return (
        <>
            <Dialog open={true} onClose={handleClose} maxWidth='md'>
                <DialogTitle>Toggle User Bidding</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {!userProfile.admin ? (
                            <Alert severity="error">
                                You do not have permission to toggle bidding.
                            </Alert>
                        ) : (
                            <>
                                <Alert severity={isBiddingOpen ? "success" : "error"}>
                                    {isBiddingOpen ? "Bidding is currently enabled" : "Bidding is currently disabled"}
                                </Alert>

                                <Divider className="mt-2 mb-2" />

                                <FormControlLabel
                                    style={{ display: "block" }}
                                    checked={isBiddingOpen}
                                    onClick={toggleBidding}
                                    control={<Switch color="primary" />}
                                    label="Toggle Bidding Mode"
                                    labelPlacement="bottom"
                                />

                                {!isEmpty(toggleError) && (
                                    <Typography variant="body1" color="error" className="mt-2">
                                        {toggleError}
                                    </Typography>
                                )}

                            </>
                        )}


                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}