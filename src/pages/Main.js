import React, {useState} from "react";
import {CardContent, Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CloseIcon from '@material-ui/icons/Close';
import Chip from "@material-ui/core/Chip";
import AddIcon from '@material-ui/icons/Add';

export default function App() {

    let [items, setItems] = useState([
        {name: 'Kenyan Bowl', tags: ['Kenya'], description: 'A wonderful handmade Maasai salad bowl', image: 'https://material-ui.com/static/images/cards/contemplative-reptile.jpg', bid: 0.1},
        {name: 'Ghanaian Tongs', tags: ['Ghana'], description: 'For your salad. Need I say more?', image: 'https://material-ui.com/static/images/cards/contemplative-reptile.jpg', bid: 10.5},
        {name: 'Piri Piri Collection', tags: ['Kenya'], description: 'A delicious collection of piri piri peppers', image: 'https://material-ui.com/static/images/cards/contemplative-reptile.jpg', bid: 15.2},
        {name: '$50 Chipotle Gift Card', tags: ['Amherst', 'Donated'], description: 'This is more than we ever got from our Chipotle fundraisers...', image: 'https://material-ui.com/static/images/cards/contemplative-reptile.jpg', bid: 21.3},

    ]);

    let [tags, setTags] = useState(['Kenya', 'Ghana', 'Amherst', 'Donated']);
    let [searchTags, setSearchTags] = useState([]);

    let [backdropOpen, setBackdropOpen] = useState(false);

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

    return (
        <Container>
            <Grid container spacing={4} style={{marginTop: '1vh'}} alignItems="stretch">

                <Grid item xs={12}>
                    <Card variant={'outlined'}>
                        <CardContent>
                            <Typography variant={'h6'}>
                                Filter Auction Items
                            </Typography>

                            {tags.map((tag, i) =>
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
                            <CardActionArea>
                                <CardMedia
                                    style={{height: '20vh'}}
                                    image={item.image}
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.name}
                                    </Typography>
                                    <Typography variant='body1'>Current Bid: ${item.bid}</Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary" variant="contained">
                                    Bid
                                </Button>
                                <Button size="small" color="primary" onClick={() => setBackdropOpen(true)}>
                                    Learn More
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>

            <Dialog fullScreen open={backdropOpen} onClose={() => setBackdropOpen(false)}>
                <AppBar>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setBackdropOpen(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6">
                            Sound
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => setBackdropOpen(false)}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                    </ListItem>
                </List>
            </Dialog>


        </Container>

    );
}