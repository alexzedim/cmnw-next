import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Container, Divider, Typography } from "@material-ui/core";
import RealmsTable from "../../../src/RealmsTable";
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

function RealmsInfo ({ realms }) {
    const { query } = useRouter()
    let title = `REALMSINFO:${query.locale}`.toUpperCase();
    let description = `${title} — return information about realms and it's population`
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
                        {title}
                    </Typography>
                </Container>
            </div>
            <Divider className={classes.divider} />
            <Container maxWidth={false}>
                <RealmsTable data={realms}/>
                <Divider className={classes.divider} />
            </Container>
        </main>
    )
}

export async function getServerSideProps({query}) {
    const { locale } = query;
    const realms = await fetch(encodeURI(`http://${process.env.api}/realms/${locale}`)).then(res => res.json());
    return { props: { realms: realms }}
}

export default RealmsInfo
