import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Divider, Typography, Container,
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
    divider: {
        margin: `${theme.spacing(2)}px auto`,
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
        created_timestamp,
        achievement_points,
        member_count

    if (info.value) {
        ({
            name,
            realm,
            members,
            achievement_points,
            member_count,
            created_timestamp
        } = info.value);
    }

    /**
     * TODO
     * + add more guild information, faction!
     * + guild crest
     */

    const classes = useStyles();

    return (
        <main>
            <Container maxWidth={false}>
                <Container maxWidth={false}>
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
                            <Typography variant="overline">
                                Members: {member_count} Achievements: {achievement_points}
                            </Typography>
                        </Grid>
                    </div>
                </Container>
                <Divider className={classes.divider} />
                <Container maxWidth={false}>
                    <GuildMembers data={members}/>
                    <Divider className={classes.divider} />
                    <OSINT_Logs data={logs.value} pageSize={15}/>
                    <Divider className={classes.divider} />
                </Container>
            </Container>
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