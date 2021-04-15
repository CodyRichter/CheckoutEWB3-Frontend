import React, {useEffect, useState} from "react";
import {CardContent, Divider, Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from '@material-ui/icons/Close';
import Chip from "@material-ui/core/Chip";
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {AttachMoney} from "@material-ui/icons";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios";

const defaultBidDelta = 2;

export default function Main(props) {

    let [items, setItems] = useState([]);
    let [currentItem, setCurrentItem] = useState({name: '', tags: [], description: '', bid: '', image: '', additional_images: '', bid_name: '', original_bid: ''});

    let [tags, setTags] = useState([]);
    let [searchTags, setSearchTags] = useState([]);

    let [bidAmount, setBidAmount] = useState(0);
    let [itemDialogOpen, setItemDialogOpen] = useState(false);


    let [successTagOpen, setSuccessTagOpen] = useState(false);
    let [failureTagOpen, setFailureTagOpen] = useState(false);
    let [failureTagMessage, setFailureTagMessage] = useState('');


    useEffect(() => {

        // let itemsFromServer = [
        //     {"name": "Kenyan Bowl", "tags": ["Kenya"], "description": "A wonderful handmade Maasai salad bowl", "image": "https://cdn20.pamono.com/p/g/5/0/506188_3zfnpi2eio/vintage-japanese-bowl-by-kei-fujiwara-1960s-1.jpg", "bid": 15, "bid_name": "No Bids Placed"},
        //     {"name": "Ghanaian Tongs", "tags": ["Ghana"], "description": "For your salad. Need I say more?", "image": "https://www.ubuy.com.gh/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzUxc2J0aW5CdGRMLl9TUzQwMF8uanBn.jpg", "bid": 10.5, "bid_name": "No Bids Placed"},
        //     {"name": "Piri Piri Collection", "tags": ["Kenya"], "description": "A delicious collection of piri piri peppers", "image": "https://images.ricardocuisine.com/services/recipes/1074x1074_3621-background.jpg", "bid": 15.2, "bid_name": "No Bids Placed"},
        //     {"name": "$50 Chipotle Gift Card", "tags": ["Amherst", "Donated"], "description": "This is more than we ever got from our Chipotle fundraisers...", "image": "https://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/chipotle_5.gif?itok=Irzzw2re", "bid": 21.3, "bid_name": "No Bids Placed"},
        // ];

        axios.get('https://checkoutewb-backend.herokuapp.com/items').then((res) => {

            let itemsFromServer = res.data;
            setItems(itemsFromServer);


            // Gets unique tags from all items for the search filter
            let x = itemsFromServer.map((serverItemObj, idx) => {
                return serverItemObj['tags'];
            });
            let uniqueTagsFromItems = Array.from(new Set([].concat.apply([], x)));
            setTags(uniqueTagsFromItems);
        }).catch((e) => {
            console.log('Unable to load items!')
        })

    }, []);

    function toggleTag(tag) {
        let newSearchTags = [...searchTags];
        if (newSearchTags.includes(tag)) {  // Remove tag if in list
            newSearchTags.splice(newSearchTags.indexOf(tag), 1);
        } else {  // Add tag if not already in list
            newSearchTags.push(tag);
        }
        setSearchTags(newSearchTags);
    }

    function matchTagFilter(item) {
        if (searchTags.length <= 0) {
            return true;
        }
        return searchTags.every(r=> item.tags.includes(r))
    }

    function selectItemToOpen(item) {
        axios.get('https://checkoutewb-backend.herokuapp.com/item',
            {params: {'item_name': item.name}
        }).then((res) => {

            let itemFromServer = res.data;
            setCurrentItem(itemFromServer);
            setItemDialogOpen(true);

            if (itemFromServer.bid === itemFromServer.original_bid && itemFromServer.bid_name === 'No bids placed.') {
                setBidAmount(itemFromServer.bid);
            } else {
                setBidAmount(itemFromServer.bid + defaultBidDelta);
            }

        }).catch((e) => {
            console.log('Unable to load item from server!')
        })
    }

    function placeBid() {
        if (isNaN(bidAmount)) {
            setFailureTagOpen(true);
            setFailureTagMessage('Unable to place bid. Please ensure bid is a valid number.');
            return;
        }

        axios.post('https://checkoutewb-backend.herokuapp.com/bid', {
            'first_name': props.user.first_name,
            'last_name': props.user.last_name,
            'email': props.user.email,
            'item_name': currentItem.name,
            'bid': bidAmount
        }).then((res) => {

            let bidInfo = res.data;

            if (bidInfo['status'] === 'failure') {
                setFailureTagOpen(true);
                setFailureTagMessage(bidInfo['detail']);
                axios.get('https://checkoutewb-backend.herokuapp.com/item',
                    {params: {'item_name': currentItem.name}
                    }).then((res) => {

                    let itemFromServer = res.data;
                    setCurrentItem(itemFromServer);

                }).catch((e) => {
                    console.log('Unable to load item from server (2)!')
                })
            } else {
                axios.get('https://checkoutewb-backend.herokuapp.com/items').then((res) => {
                    let itemsFromServer = res.data;
                    setItems(itemsFromServer);
                });

                setSuccessTagOpen(true);
                setBidAmount(0);
                setItemDialogOpen(false);
            }

        }).catch((e) => {
            setFailureTagOpen(true);
            setFailureTagMessage('Unable to place bid. Please try again in a minute.');
        });
    }

    function cancelBid() {
        setBidAmount(0);
        setItemDialogOpen(false);
    }

    const bidOnEnterPress = (event) => {
        if (event.key === 'Enter' && itemDialogOpen) {
            placeBid();
        }
    }

    function truncateString(str, num) {
        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...'
    }

    return (
        <Container>
            <Grid container spacing={4} style={{marginTop: '1vh'}} alignItems="stretch" direction={"row"}>

                <Grid item xs={9}>
                    <Card variant={'outlined'} style={{height: '100%'}}>
                        <CardContent>
                            <Typography variant={'h6'}>
                                Filter Auction Items
                            </Typography>

                            {Object.keys(tags).length > 0 && tags.map((tag, i) =>
                                <Chip
                                    style={{marginRight: 8}}
                                    label={tag}
                                    clickable
                                    onClick={() => toggleTag(tag)}
                                    color={searchTags.includes(tag) ? 'secondary' : 'primary'}
                                    icon={searchTags.includes(tag) ?  <CloseIcon /> : <AddIcon />}
                                    key={i}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={3}>
                    <Card variant={'outlined'} style={{height: '100%'}}>
                            <Grid
                                container
                                spacing={1}
                                direction="column"
                                alignItems="center"
                                justify="center"
                                style={{ minHeight: '100%' }}
                            >
                                <Grid item xs={12}>
                                    <Button
                                        variant='contained'
                                        rel='noreferrer'
                                        target='_blank'
                                        color='secondary'
                                        href='https://docs.google.com/forms/d/e/1FAIpQLSd8TeBNO7_MmWLLh0Ge8KtP5epoD3roQ88MOqaNqfcsMNg7CA/viewform?usp=sf_link'
                                    >
                                        T-Shirts and Masks
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant='contained'
                                        rel='noreferrer'
                                        target='_blank'
                                        color='secondary'
                                        href='http://ewbumass.org/donate'
                                    >
                                        Our Sponsors
                                    </Button>
                                </Grid>
                            </Grid>
                    </Card>
                </Grid>

                {items.filter((item) => matchTagFilter(item)).length === 0 &&
                <Grid item xs={12} >
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant="h4" component="h4">
                                No auction items matching search criteria found
                            </Typography>
                            <Typography variant="body1" component="p">
                                The search function uses an AND filter. This means that it will search for items that
                                match all of the selected tags. For example, if your selected tags
                                are <strong>Kenya</strong> and <strong>Donated</strong>, it will search for items
                                from Kenya that have been donated.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                }

                {items.filter((item) => matchTagFilter(item)).map( (item, index) =>
                    <Grid item xs={4} key={index}>
                        <Card elevation={5}>
                            <CardMedia
                                title={'Picture of ' + item.name}
                            >
                                <img src={item.image} alt={item.description} style={{
                                    maxWidth: '100%',
                                    height: 'auto'
                                }} />
                            </CardMedia>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {item.name}
                                </Typography>

                                <Typography variant='body1'>Current Bid: ${parseFloat(item.bid).toFixed(2)}</Typography>

                                {item.bid === item.original_bid && item.bid_name === 'No bids placed.' ?
                                    <Typography variant={'body2'} style={{color: 'darkgray'}}>No Bids Placed Yet</Typography>
                                    :
                                    item.bid_name === props.user.first_name + ' ' + props.user.last_name ?
                                        <Typography style={{marginBottom: '1em'}} variant={'body2'} color={'secondary'}>You are the highest bidder</Typography>
                                        :
                                        <Typography style={{marginBottom: '1em'}} variant={'body2'} color={'primary'}>Someone else is the highest bidder</Typography>
                                }

                                <Divider style={{marginTop: '1em', marginBottom: '1em'}} />

                                <Typography variant="body2" color="textSecondary" component="p">
                                    {truncateString(item.description, 50)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {item.additional_images !== '' &&
                                <Button size="small" color="secondary" variant="outlined"  target="_blank" href={item.additional_images}>
                                    More Photos
                                </Button>
                                }
                                <Button size="small" color="secondary" variant="contained" onClick={() => selectItemToOpen(item)}>
                                    Place Bid
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
                <Grid item xs={12} style={{paddingTop: '1em'}}>
                    <Typography variant="subtitle1">
                        Website created by <a target='_blank' rel='noreferrer' href='https://www.linkedin.com/in/Cody-Richter'>Cody Richter</a>.
                        This auction webpage is open source and available to view on Github.
                        &nbsp;
                        <a rel='noreferrer' target='_blank' href='https://github.com/CodyRichter/CheckoutEWB3-Frontend'>[Client]</a>
                        &nbsp; &nbsp;
                        <a rel='noreferrer' target='_blank' href='https://github.com/CodyRichter/CheckoutEWB3-Backend'>[Server]</a>
                    </Typography>
                </Grid>
            </Grid>


            <Dialog maxWidth={"md"} fullWidth open={itemDialogOpen} onClose={cancelBid}>

                <DialogTitle id="form-dialog-title">{currentItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {currentItem.description}
                    </DialogContentText>
                    <Divider />
                    <Typography style={{marginTop: '1em'}} variant={'body1'}>Current Bid: ${parseFloat(currentItem.bid).toFixed(2)}</Typography>
                    {currentItem.bid === currentItem.original_bid && currentItem.bid_name === 'No bids placed.' ?
                        <Typography style={{marginBottom: '1em', color: 'darkgray'}} variant={'body2'}>No Bids Placed Yet</Typography>
                        :
                        currentItem.bid_name === props.user.first_name + ' ' + props.user.last_name ?
                            <Typography style={{marginBottom: '1em'}} variant={'body2'} color={'secondary'}>You are the highest bidder</Typography>
                            :
                            <Typography style={{marginBottom: '1em'}} variant={'body2'} color={'primary'}>Someone else is the highest bidder</Typography>
                    }


                    <TextField
                        autoFocus
                        margin="dense"
                        id="newBid"
                        label="Place New Bid"
                        defaultValue={
                            currentItem.bid === currentItem.original_bid && currentItem.bid_name === 'No bids placed.' ?
                                currentItem.bid :
                                currentItem.bid + defaultBidDelta
                        }
                        type="text"
                        onKeyDown={bidOnEnterPress}
                        onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney fontSize={"small"} />
                                </InputAdornment>
                            ),
                        }}
                        disabled={!props.user.authenticated}
                        error={!props.user.authenticated}
                        helperText={!props.user.authenticated ? "Please login to place bid." : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelBid} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={placeBid} color="secondary" variant={'contained'} disabled={!props.user.authenticated}>
                        Bid
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={successTagOpen} autoHideDuration={6000} onClose={() => setSuccessTagOpen(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setSuccessTagOpen(false)} severity="success">
                    Bid Successfully Placed!
                </MuiAlert>
            </Snackbar>

            <Snackbar open={failureTagOpen} autoHideDuration={6000} onClose={() => setFailureTagOpen(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setFailureTagOpen(false)} severity="error">
                    {failureTagMessage}
                </MuiAlert>
            </Snackbar>

        </Container>

    );
}