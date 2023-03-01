import { AttachMoney } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Network from "../utils/network";

export default function AuctionItemDialog({ token, setSuccessTagOpen }) {
  const [currentItem, setCurrentItem] = React.useState(null);
  const [bidAmount, setBidAmount] = React.useState("0");

  const [loading, setLoading] = React.useState(true);
  const [itemLoadError, setItemLoadError] = React.useState("");

  const [defaultBidDelta, setDefaultBidDelta] = React.useState(0);

  let [bidError, setBidError] = React.useState("");

  const navigate = useNavigate();

  let { itemName } = useParams();

  React.useEffect(() => {
    Network.getBidDelta().then((delta) => {
      setDefaultBidDelta(delta);
    });
  }, []);

  React.useEffect(() => {
    if (!isEmpty(itemName)) {
      setLoading(true);
      setItemLoadError("");
      setBidError("");
      Network.getItem(itemName)
        .then((item) => {
          setCurrentItem(item);
          if (item.bids_placed) {
            setBidAmount(item["bid"] + defaultBidDelta);
          } else {
            setBidAmount(item["bid"]);
          }
        })
        .catch((e) => {
          setItemLoadError("Unable to load item from server!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [itemName, defaultBidDelta]);

  function closeDialog() {
    navigate("/");
  }

  function placeBid() {
    const bidAmountFloat = parseFloat(bidAmount);

    if (isNaN(bidAmountFloat)) {
      setBidError("Unable to place bid. Please ensure bid is a valid number.");
      return;
    }

    Network.placeBid(itemName, bidAmountFloat, token)
      .then((bidInfo) => {
        setSuccessTagOpen(true);
        closeDialog();
      })
      .catch((e) => {
        setBidError(e.message);

        Network.getItem(itemName)
          .then((item) => {
            setCurrentItem({ ...currentItem, bid: item["bid"] });
          })
          .catch((e) => {
            setItemLoadError("Unable to load item from server!");
          })
          .finally(() => {
            setLoading(false);
          });
      });
  }

  const bidOnEnterPress = (event) => {
    if (event.key === "Enter") {
      placeBid();
    }
  };

  return (
    <>
      <Dialog maxWidth={"md"} fullWidth open={true} onClose={closeDialog}>
        {loading || currentItem === null || !isEmpty(itemLoadError) ? (
          !isEmpty(itemLoadError) ? (
            <DialogContent>
              <Alert elevation={6} variant="filled" severity="error">
                {itemLoadError}
              </Alert>
            </DialogContent>
          ) : (
            <DialogContent>
              <LinearProgress />
            </DialogContent>
          )
        ) : (
          <>
            <DialogTitle id="form-dialog-title">
              {currentItem["name"]}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {currentItem["description"]}
              </DialogContentText>
              <Divider />
              <Typography style={{ marginTop: "1em" }} variant={"body1"}>
                Current Bid: ${parseFloat(currentItem["bid"]).toFixed(2)}
              </Typography>

              {!currentItem["bids_placed"] && (
                <Typography
                  style={{ marginBottom: "1em", color: "darkgray" }}
                  variant={"body2"}
                >
                  No Bids Placed Yet
                </Typography>
              )}

              <TextField
                autoFocus
                margin="dense"
                id="newBid"
                label="Place New Bid"
                value={bidAmount}
                type="text"
                onKeyDown={bidOnEnterPress}
                onChange={(e) => setBidAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney fontSize={"small"} />
                    </InputAdornment>
                  ),
                }}
                disabled={isEmpty(token)}
                error={isEmpty(token) || !isEmpty(bidError)}
                helperText={
                  isEmpty(token)
                    ? "Please login to place bid."
                    : isEmpty(bidError)
                      ? ""
                      : bidError
                }
              />
            </DialogContent>
          </>
        )}

        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={placeBid}
            color="secondary"
            variant={"contained"}
            disabled={isEmpty(token)}
          >
            Bid
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
