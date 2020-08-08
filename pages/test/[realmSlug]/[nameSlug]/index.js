import React from "react";
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container, Grid, Divider,
    Typography, Avatar, Button,
    Table, TableBody, TableCell,
    TableContainer, TableHead,
    TableRow, Paper, Modal,
    Backdrop, Fade, List, ListItemText, ListItem
} from "@material-ui/core";
import Link from "../../../../src/Link";


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
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    titleBlock: {
        padding: theme.spacing(10, 0, 10),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'inherit'
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    cardTitle: {
        fontSize: '1.1em',
        fontWeight: 600
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    table: {
        minWidth: 650
    },
    guild_history: {
        marginTop: theme.spacing(4),
        maxHeight: 440,
    },
    modal: {
        margin: theme.spacing(15, 60, 30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        textTransform: 'uppercase'
    },
    large: {
        width: theme.spacing(36),
        height: theme.spacing(14),
    },
    full: {
        width: 'auto',
        height: 'auto',
    },
}));

function CharacterPage(json) {
    const {
        _id,
        ilvl,
        hash,
        media,
        logs,
        id,
        name,
        gender,
        faction,
        race,
        spec,
        character_class,
        realm,
        level,
        lastOnline,
        lastModified,
        statusCode,
        guild,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt
    } = json;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Grid container>
            { (media) ? (
                <Grid item xs={false} sm={5} md={5} className={classes.image} style={{backgroundImage: `url(${media.render_url}`}}/>
            ) : ('')}
            <Grid item xs={12} sm={7} md={7} elevation={6} square>
                <div className={classes.paper} style={{alignItems: 'left'}}>
                    <Grid>
                        <Typography variant="h2" component="h2" color="textPrimary" className={classes.title}>
                            {name}
                        </Typography>
                        <Typography variant="h3" component="h2" color="textPrimary" className={classes.title}>
                            @{realm.name}
                        </Typography>
                        { (guild) ? (
                            <Typography variant="h3" component="h3" color="textPrimary" className={classes.title}>
                                #{guild.name}
                            </Typography>
                        ) : ('')}
                        <Divider light className={classes.icon} />
                    </Grid>
                </div>
            </Grid>
        </Grid>
    )
}

export async function getServerSideProps({query}) {
    const {realmSlug, nameSlug} = query;
    const res = await fetch(encodeURI(`http://${process.env.api}/characters/${(nameSlug)}@${realmSlug}`));
    const json = await res.json();
    return { props: json }
}

export default CharacterPage