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

export default function App() {

    let [items, setItems] = useState([
        {name: 'itemA', description: 'foo bar a', bid: 0.1},
        {name: 'itemB', description: 'foo bar b', bid: 10.5},
        {name: 'itemC', description: 'foo bar c', bid: 15.2},
        {name: 'itemD', description: 'foo bar d', bid: 21.3},
        ]);

    let [backdropOpen, setBackdropOpen] = useState(false);


    return (
        <Container>
            <Grid container spacing={4} style={{marginTop: '1vh'}}>

                {items.map( (item) =>
                    <Grid item xs={4}>
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                    style={{height: '20vh'}}
                                    image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
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