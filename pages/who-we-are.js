import React from 'react';
import Link from "../src/Link";
import {
    List, ListItem, ListItemText,
    Divider, Typography, Grid,
    makeStyles
} from '@material-ui/core';
import MetaHead from '../src/MetaHead'

const useStyles = makeStyles(theme => ({
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column'
    }
}));

const ListItemLink = props => <ListItem button component="a" {...props} />;

export default function SignInSide() {
    const classes = useStyles();
    return (
        <main>
            <MetaHead
                title={"Conglomerat: Who we are"}
                description={"World of Warcraft: In-game decision-making superiority starts here."}
                image={"https://conglomerat.group/logo.png"}
            />
            <Grid container>
                <Grid item xs={false} sm={5} md={5} className={classes.image} style={{backgroundImage: `url(https://i.imgur.com/poOeOqP.jpg`}}/>
                <Grid item xs={12} sm={7} md={7} elevation={6}>
                    <div className={classes.paper} style={{alignItems: 'left'}}>
                        <Grid>
                            <Typography variant="h1" component="h2" gutterBottom>
                                AlexZeDim
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                I started to play World of Warcraft since WotLK release, right after russian realms were opened. My very first character was a druid on a god-forgotten realm like Ashenvale.
                                Then I created this rogue, that outlived all inactive periods and deletion. I have played on EU-Outland during WoD, and Legion expansions.
                                After that I was invited to russian #2 PvE guild: <Link href={`/guild/soulflayer/фьюжн`} color="secondary" underline="hover">Фьюжн@Свежеватель-Душ</Link> (<Link href="https://www.wowprogress.com/pve/ru/rating.tier19" prefetch={false} color="secondary" underline="hover">WoWProgress</Link>) as a treasurer.
                                Thanks to <Link href={`/character/gordunni/йошх`} color="secondary" underline="hover">Йош</Link> (founder of russian druid class discord) and <Link href={`/character/gordunni/лапочка`} color="secondary" underline="hover">Лапочка</Link> (<Link href="https://www.twitch.tv/holy_moley" prefetch={false} color="secondary" underline="hover">HolyMoley</Link>, co-founder of russian paladin class discord) who have belived in me.
                                As for now, I am representing <Link href={`/guild/gordunni/депортация`} color="secondary" underline="hover">Депортация@Гордунни</Link> as Head of Treasury.
                            </Typography>
                            <Divider />
                            <List component="nav" aria-label="initiative">
                                <ListItemLink href="/character/gordunni/инициатива">
                                    <ListItemText primary="Main Character: инициатива@гордунни" />
                                </ListItemLink>
                                <ListItemLink href="https://twitter.com/alexzedim2812">
                                    <ListItemText primary="Twitter: @alexzedim2812" />
                                </ListItemLink>
                                <ListItem>
                                    <ListItemText primary="Discord: AlexZeDim#2645" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="BNet: AlexZeDim#2812" />
                                </ListItem>
                            </List>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12} sm={7} md={7} elevation={6}>
                    <div className={classes.paper} style={{alignItems: 'right'}}>
                        <Grid>
                            <Typography variant="h1" component="h2" gutterBottom>
                                Bluratella
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                «She is just like me, but a woman»<br />
                                <br />
                                She is playing World of Warcraft since Cataclysm. Pet lover, long range mount collector. #Casual player with [Ahead the Curve] in World Top 100 PvE guild. She is capable to buy WC3 Reforge Deluxe Edition but hasn't played a single mission in it. As a part of Conglomerat, she is a co-author of various algorithmic patterns, for DMA and OSINT modules.
                            </Typography>
                            <Divider />
                            <List component="nav" aria-label="initiative">
                                <ListItemLink href="/character/gordunni/блюрателла">
                                    <ListItemText primary="Main Character: блюрателла@гордунни" />
                                </ListItemLink>
                            </List>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={false} sm={5} md={5} className={classes.image} style={{backgroundImage: `url(https://i.imgur.com/75bI6Rr.jpg)`}} />
            </Grid>
        </main>
    );
}
