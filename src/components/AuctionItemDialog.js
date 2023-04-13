import { AttachMoney } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { has, isEmpty } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Network from "../utils/network";

export default function AuctionItemDialog({ token, setSuccessTagOpen, refreshItems }) {
  const [currentItem, setCurrentItem] = React.useState(null);
  const [bidAmount, setBidAmount] = React.useState("0");

  const [loading, setLoading] = React.useState(true);
  const [itemLoadError, setItemLoadError] = React.useState("");

  const [bidButtonLoading, setBidButtonLoading] = React.useState(false);

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
          if (has(item, "winning_bid") && !isEmpty(item["winning_bid"])) {
            setBidAmount(item["winning_bid"]["bid"] + defaultBidDelta);
          } else {
            setBidAmount(item["original_bid"]);
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
    setBidButtonLoading(true);

    const bidAmountFloat = parseFloat(bidAmount);

    if (isNaN(bidAmountFloat)) {
      setBidError("Unable to place bid. Please ensure bid is a valid number.");
      setBidButtonLoading(false);
      return;
    }

    Network.placeBid(itemName, bidAmountFloat, token)
      .then((bidInfo) => {
        setSuccessTagOpen(true);
        refreshItems();
        setBidButtonLoading(false);
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
            setBidButtonLoading(false);
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

            <Typography className="mt-4" variant="h6" align="center">
              Auction Item
            </Typography>
            <Typography variant="h4" align="center">{currentItem["name"]}</Typography>

            <DialogContent>

              <Divider className="mb-2" />

              <Typography variant="h6" align="center">Description</Typography>
              <Typography variant="body1" align="center">{currentItem["description"]}</Typography>


              <Divider className="mt-2 mb-2" />

              <Typography variant="h6" component='div' align="center">
                {
                  has(currentItem, "winning_bid") && !isEmpty(currentItem["winning_bid"]) ?
                    "Current Bid" :
                    "Starting Bid"
                }
              </Typography>
              <Typography variant="h4" component='div' align="center">
                ${
                  has(currentItem, "winning_bid") && !isEmpty(currentItem["winning_bid"]) ?
                    parseFloat(currentItem["winning_bid"]["bid"]).toFixed(2) :
                    parseFloat(currentItem["original_bid"]).toFixed(2)
                }
              </Typography>

              <Divider className="mt-2 mb-2" />

              <Typography variant="h6" component='div' align="center" className="mb-3">
                Place New Bid
              </Typography>

              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    variant="standard"
                    id="newBid"
                    label="Bid Amount"
                    value={bidAmount}
                    type="text"
                    fullWidth
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
                  />
                </Grid>
                {(isEmpty(token) || !isEmpty(bidError)) &&
                  <Grid item xs={12}>
                    <Typography variant="body2" align="center" color="error">
                      {isEmpty(token)
                        ? "Please login to place bid."
                        : isEmpty(bidError)
                          ? ""
                          : bidError
                      }
                    </Typography>
                  </Grid>
                }
              </Grid>



              {!Object.keys(currentItem).includes("winning_bid") && (
                <Typography
                  style={{ marginBottom: "1em", color: "darkgray" }}
                  variant={"body2"}
                >
                  No Bids Placed Yet
                </Typography>
              )}


            </DialogContent>
          </>
        )}

        <DialogActions>
          <Button onClick={closeDialog} color="warning" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={placeBid}
            color="primary"
            variant="contained"
            disabled={isEmpty(token) || bidButtonLoading}
          >
            {bidButtonLoading ? <CircularProgress size={24} /> : "Place Bid"}

          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
}
