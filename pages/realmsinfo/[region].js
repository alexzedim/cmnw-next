import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Container, Divider, Typography } from "@material-ui/core";
import RealmsTable from "../../src/RealmsTable";
import { useRouter } from "next/router";
import MetaHead from '../../src/MetaHead'


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
    let title = `REALMSINFO:${query.region}`.toUpperCase();
    let description = `${title} — return information about realms and it's population`
    const classes = useStyles();
    return (
        <main>
            <MetaHead
                title={title}
                description={description}
            />
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

export async function getServerSideProps ({query}) {
    const { region } = query;
    const gql = `query Realms($region: String) {
        realms(name: $region) {
            _id
            name
            slug
            name_locale
            locale
            connected_realm_id
            players {
                total
                alliance
                horde
                max_level
                unique
            }
            guilds {
                total
                alliance
                horde
            }
            golds
            valuations
            auctions
        }
    }`
    let { data: { realms} } = await fetch(`http://${process.env.api}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: gql,
            variables: { region },
        })
    }).then(res => res.json())
    return { props: { realms: realms }}
}

export default RealmsInfo
