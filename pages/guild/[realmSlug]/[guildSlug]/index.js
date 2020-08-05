import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Divider, Typography,
} from "@material-ui/core";
import GuildMembers from "../../../../src/GuildMembers";
import OSINT_Logs from "../../../../src/OsintLogs";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column'
    },
    hr: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    left: {
        paddingLeft: theme.spacing(3),
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        textTransform: 'uppercase'
    }
}));

function GuildPage({guild}) {

    const [ info, logs ] = guild;

    let name,
        realm,
        members,
        created_timestamp

    if (info.value) {
        ({
            name,
            realm,
            members,
            created_timestamp
        } = info.value);
    }

    /**
     * TODO
     * + add more guild information, faction!
     * + xs 12 as 6 + 6 for lg
     * + guild crest
     */

    const classes = useStyles();

    return (
        <main>
            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <div className={classes.paper}>
                        <Grid container direction="column" justify="center" alignItems="center">
                            <Typography variant="h3" component="h3" color="textPrimary" className={classes.title}>
                                #{name}
                            </Typography>
                            <Typography variant="h4" component="h4" color="textPrimary" className={classes.title}>
                                @{realm.name}
                            </Typography>
                            <Typography variant="overline">
                                Created: {new Date(created_timestamp).toLocaleString('en-GB')}
                            </Typography>
                        </Grid>
                        <Divider light className={classes.hr}/>
                    </div>
                </Grid>
                <Grid container className={classes.left} item xs={12} sm={12} md={12} spacing={5}>
                    <Grid container item xs={12} sm={6} md={6}>
                        <GuildMembers data={members}/>
                    </Grid>
                    <Grid container item xs={12} sm={6} md={6}>
                        <OSINT_Logs data={logs.value} pageSize={15}/>
                    </Grid>
                </Grid>
            </Grid>
        </main>
    )
}

export async function getServerSideProps({query}) {
    const { realmSlug, guildSlug } = query;

    const guild = await Promise.allSettled([
        fetch(encodeURI(`http://${process.env.api}/guilds/guild/${(guildSlug)}@${realmSlug}`)).then(res => res.json()),
        fetch(encodeURI(`http://${process.env.api}/guilds/guild_logs/${(guildSlug)}@${realmSlug}`)).then(res => res.json())
    ])
    return { props: { guild } }
}

export default GuildPage