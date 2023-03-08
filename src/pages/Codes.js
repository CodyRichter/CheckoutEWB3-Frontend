import { Button, Card, Chip, Divider, Grid, LinearProgress, Slider, Typography } from "@mui/material";
import { has, isEmpty } from "lodash";
import React from "react";
import { QRCode } from "react-qrcode-logo";
import gavelB64 from "../utils/gavel";
import Network from "../utils/network";


export default function Codes({ token, userProfile, refreshItems, refreshItemToken }) {

    const [items, setItems] = React.useState([]);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [numCards, setNumCards] = React.useState(3);

    const handleSliderChange = (event, newValue, activeThumb) => {
        if (Array.isArray(newValue)) {
            return;
        }

        setNumCards(newValue);
    };

    React.useEffect(() => {
        setLoading(true);
        Network.getItems().then((items) => {
            setLoading(false);
            setError('');
            setItems(items);
        }).catch((e) => {
            setLoading(false);
            setError("Unable to load items from server!");
        });
    }, []);

    React.useEffect(() => {
        // Only allow admins to access this page
        if (isEmpty(token) || isEmpty(userProfile) || !has(userProfile, "admin") || !userProfile["admin"]) {
            window.location.href = "/";
        }
    }, [token, userProfile]);

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="mt-5"
            spacing={3}
        >
            <Grid item xs={7} textAlign='center'>
                <Typography variant="h4" component="div" gutterBottom>
                    Generate Auction Item QR Codes
                </Typography>
                <Typography variant="body1" component="div" gutterBottom>
                    This page is designed to be used to print QR codes for each item in the auction.
                    The QR codes will be used to allow guests to bid on items, and the papers should
                    be placed adjacent to the items.

                    <br /><br />

                    To print the cards on this page, press the button below. You can select the
                    number of item cards that will appear on each page. The default is 3, but you can
                    change this by using the slider below so that none of the cards are cut off.
                </Typography>

                <Slider
                    defaultValue={3}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                    disabled={loading || !isEmpty(error)}
                    onChange={handleSliderChange}
                />

                <Button
                    variant="contained"
                    color="primary"
                    className="m-3"
                    disabled={loading || !isEmpty(error)}
                    onClick={() => window.print()}
                    size="large"
                >
                    Print
                </Button>

                <Divider sx={{ borderBottomWidth: 5 }} />
            </Grid>

            {loading &&
                <Grid item xs={6} textAlign='center'>
                    <LinearProgress />
                </Grid>
            }



            {error && !loading &&
                <Grid item xs={6} textAlign='center'>
                    <Typography variant="h4" component="div" color='error' gutterBottom>
                        {error}
                    </Typography>
                </Grid>
            }

            <Grid item xs={10} textAlign='center' className='m-3 pb-3'>
                {items.map((item, index) => (
                    <div className={index % numCards === 0 ? 'pagebreak' : ''}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                            component={Card}
                            elevation={4}
                            className="m-3 p-3"
                        >
                            <Grid item xs={4} textAlign='center'>
                                <QRCode
                                    value={window.location.origin + "/#/items/" + item["name"]}
                                    qrStyle='dots'
                                    eyeRadius={5}
                                    logoWidth={35}
                                    logoHeight={35}
                                    logoOpacity={0.6}
                                    ecLevel='H'
                                    removeQrCodeBehindLogo={true}
                                    logoImage={gavelB64}
                                    bgColor='#f5f7fb'
                                />
                            </Grid>

                            <Grid item xs={8} textAlign='center'>
                                <Typography variant="h4" component="div" gutterBottom>
                                    {item.name}
                                </Typography>
                                <Typography variant="body1" component="div" gutterBottom>
                                    {item.description}
                                </Typography>
                                {item['tags'].map((tag, index) => (
                                    <Chip key={`item-${item['name']}-${tag}`} label={tag} variant="outlined" className="m-1" />
                                ))}
                            </Grid>
                        </Grid>
                    </div>
                ))}
            </Grid>
        </Grid>
    );
}