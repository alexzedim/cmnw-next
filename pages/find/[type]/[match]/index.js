import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Container, Divider, Typography} from "@material-ui/core";
import CharactersTable from "../../../../src/CharactersTable";
import { useRouter } from "next/router";
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
    divider: {
        margin: `${theme.spacing(2)}px auto`,
    },
    titleBlock: {
        padding: theme.spacing(10, 0, 5),
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        textTransform: 'uppercase'
    }
}));

function FindPage ({ _id, match }) {
    const { query } = useRouter()
    let title = `${query.type}:${query.match}`.toUpperCase();
    let description = `FIND ${query.type.toUpperCase()} — return all available hash matches for dynamic hash value. Don't bookmark this page!`
    const classes = useStyles();
    return (
        <main>
            <Head>
                <title>{title}</title>

                <meta name="description" content={description}/>

                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://conglomerat.group/"/>
                <meta property="og:title" content={title}/>
                <meta property="og:description" content={description}/>

                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="og:url" content="https://conglomerat.group/"/>
                <meta property="twitter:title" content={title}/>
                <meta property="twitter:description" content={description}/>
            </Head>
            <div className={classes.titleBlock}>
                <Container maxWidth="lg">
                    <Typography component="h1" variant="h2" align="center" color="secondary" className={classes.title} gutterBottom>
                        {_id}
                    </Typography>
                </Container>
            </div>
            <Divider className={classes.divider} />
            <Container maxWidth={false}>
                <CharactersTable data={match} members={false}/>
                <Divider className={classes.divider} />
            </Container>
        </main>
    )
}

export async function getServerSideProps({query}) {
    const {type, match} = query;
    const res = await fetch(encodeURI(`http://${process.env.api}/find/${type}/${match}`));
    const json = await res.json();
    return { props: json }
}

export default FindPage
