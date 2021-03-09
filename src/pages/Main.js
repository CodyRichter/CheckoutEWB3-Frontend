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

export default function Main(props) {

    let [items, setItems] = useState([]);
    let [currentItem, setCurrentItem] = useState({name: '', tags: [], description: '', bid: '', image: ''});

    let [tags, setTags] = useState([]);
    let [searchTags, setSearchTags] = useState([]);

    let [bidAmount, setBidAmount] = useState(0);
    let [itemDialogOpen, setItemDialogOpen] = useState(false);


    let [successTagOpen, setSuccessTagOpen] = useState(false);
    let [failureTagOpen, setFailureTagOpen] = useState(false);


    useEffect(() => {

        let itemsFromServer = [
            {name: 'Kenyan Bowl', tags: ['Kenya'], description: 'A wonderful handmade Maasai salad bowl', image: 'https://cdn20.pamono.com/p/g/5/0/506188_3zfnpi2eio/vintage-japanese-bowl-by-kei-fujiwara-1960s-1.jpg', bid: 0.1},
            {name: 'Ghanaian Tongs', tags: ['Ghana'], description: 'For your salad. Need I say more?', image: 'https://www.ubuy.com.gh/productimg/?image=aHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9JLzUxc2J0aW5CdGRMLl9TUzQwMF8uanBn.jpg', bid: 10.5},
            {name: 'Piri Piri Collection', tags: ['Kenya'], description: 'A delicious collection of piri piri peppers', image: 'https://images.ricardocuisine.com/services/recipes/1074x1074_3621-background.jpg', bid: 15.2},
            {name: '$50 Chipotle Gift Card', tags: ['Amherst', 'Donated'], description: 'This is more than we ever got from our Chipotle fundraisers...', image: 'https://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/chipotle_5.gif?itok=Irzzw2re', bid: 21.3},
        ];

        setItems(itemsFromServer);

        // Gets unique tags from all items for the search filter
        let x = itemsFromServer.map((serverItemObj, idx) => {
            return serverItemObj['tags'];
        });
        let uniqueTagsFromItems = Array.from(new Set([].concat.apply([], x)));
        setTags(uniqueTagsFromItems);


    }, [])



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
        return searchTags.some(r=> item.tags.includes(r))
    }

    function selectItemToOpen(item) {
        setCurrentItem(item);
        setItemDialogOpen(true);
    }

    function placeBid() {
        // TODO: Place Bid With Server
        if (isNaN(bidAmount)) {
            setFailureTagOpen(true);
            return;
        }
        console.log(bidAmount);
        setSuccessTagOpen(true);
        setBidAmount(0);
        setItemDialogOpen(false);
    }

    function cancelBid() {
        setBidAmount(0);
        setItemDialogOpen(false);
    }

    return (
        <Container>
            <Grid container spacing={4} style={{marginTop: '1vh'}} alignItems="stretch">

                <Grid item xs={12}>
                    <Card variant={'outlined'}>
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

                {items.filter((item) => matchTagFilter(item)).map( (item, index) =>
                    <Grid item xs={4} key={index}>
                        <Card>
                            <CardMedia
                                style={{height: '30vh'}}
                                image={item.image}
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {item.name}
                                </Typography>
                                <Typography variant='body1'>Current Bid: ${parseFloat(item.bid).toFixed(2)}</Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="secondary" variant="contained" onClick={() => selectItemToOpen(item)}>
                                    Learn More
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>

            <Dialog maxWidth={"md"} fullWidth open={itemDialogOpen} onClose={cancelBid}>

                <DialogTitle id="form-dialog-title">{currentItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {currentItem.description}
                    </DialogContentText>
                    <Divider />
                    <Typography style={{marginTop: '1em', marginBottom: '1em'}} variant={'body1'}>Current Bid: ${parseFloat(currentItem.bid).toFixed(2)}</Typography>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="newBid"
                        label="Place New Bid"
                        defaultValue={currentItem.bid + 2}
                        type="text"
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
                    Unable to place bid. Please ensure bid is a valid number.
                </MuiAlert>
            </Snackbar>

        </Container>

    );
}