import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import OSINT_Logs from '../../../../src/OsintLogs'
import CharacterProfile from '../../../../src/CharacterProfile'
import CharacterButtons from '../../../../src/CharacterButtons'
import Link from '../../../../src/Link'
import Head from 'next/head'
import {
    Grid, Divider, Typography, Container,
} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    root: {
        height: '93vh',
        padding: 0,
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '93vh',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column'
    },
    hr: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        textTransform: 'uppercase'
    }
}));

function CharacterPage({character}) {

    const [ info, logs ] = character;

    let media,
        name,
        realm,
        guild,
        title = 'Test'

    if (info.value) {
        ({
            media,
            name,
            realm,
            guild,
        } = info.value);

        title = `${name}@${realm.name}`

        if (media && media.render_url) {
            /** TODO If media true then return pic */
        }
        /** Else - placeholder */
    }

    const classes = useStyles();

    return (
        <main>
            <Head>
                <title>{title}</title>

                <meta name="description" content="Conglomerat — In-game decision-making superiority starts here."/>
                {<!-- Open Graph / Facebook -->}
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://conglomerat.group/"/>
                <meta property="og:title" content={title}/>
                <meta property="og:description" content="Conglomerat — In-game decision-making superiority starts here."/>
                <meta property="og:image" content="https://conglomerat.group/logo.svg"/>

                {<!-- Twitter -->}
                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="og:url" content="https://conglomerat.group/"/>
                <meta property="twitter:title" content={title}/>
                <meta property="twitter:description" content="Conglomerat — In-game decision-making superiority starts here."/>
                <meta property="twitter:image" content="https://conglomerat.group/logo.svg"/>
            </Head>
            <Container maxWidth={false} className={classes.root} >
                <Grid container>
                    { (media && media.render_url) ? (
                        <Grid key={0} item xs={12} sm={5} md={5} className={classes.image} style={{backgroundImage: `url(${media.render_url}`}}/>
                    ) : ('')}
                    <Grid key={1} item xs={12} sm={7} md={7} elevation={6}>
                        <div className={classes.paper} style={{alignItems: 'left'}}>
                            <Grid>
                                <Typography variant="h3" component="h3" color="textPrimary" className={classes.title}>
                                    {name}
                                </Typography>
                                { (guild && realm.slug && guild.slug) ? (
                                    <Typography variant="h4" component="h4" color="textPrimary" className={classes.title}>
                                        #<Link href={`/guild/${realm.slug}/${guild.slug}`} color="textPrimary" underline="hover">{guild.name}</Link> // {(parseInt(guild.rank) === 0) ? (`GM`) : (`R${guild.rank}`)}
                                    </Typography>
                                ) : ('')}
                                <Typography variant="h4" component="h4" color="textPrimary" className={classes.title}>
                                    @{realm.name}
                                </Typography>
                                <CharacterButtons name={name} realm={realm.slug}/>
                            </Grid>
                            <Divider light className={classes.hr}/>
                            <CharacterProfile character={info.value}/>
                        </div>
                    </Grid>
                </Grid>
                { (logs.value && logs.value.length) ? (
                    <Grid container alignItems="center" justify="center">
                        <Grid item xs={12} className={classes.paper}>
                            <OSINT_Logs data={logs.value} pageSize={5}/>
                        </Grid>
                    </Grid>
                ) : ('')}
            </Container>
        </main>
    )
}

export async function getServerSideProps({query}) {
    const { realmSlug, nameSlug } = query;

    const character = await Promise.allSettled([
        fetch(encodeURI(`http://${process.env.api}/characters/character/${(nameSlug)}@${realmSlug}`)).then(res => res.json()),
        fetch(encodeURI(`http://${process.env.api}/characters/character_logs/${(nameSlug)}@${realmSlug}`)).then(res => res.json())
    ])
    return { props: { character } }
}

export default CharacterPage
