import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Container, Divider, Typography } from "@material-ui/core";
import CharactersTable from "../../src/CharactersTable";
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

function FindPage ({ hash }) {
    const { query: { query_hash } } = useRouter()
    const classes = useStyles();
    return (
        <main>
            <MetaHead
                title={query_hash.toUpperCase()}
                description={`FIND ${query_hash.split('@')[0].toUpperCase()} — return all available hash matches for dynamic hash value. Don't bookmark this page!`}
            />
            <div className={classes.titleBlock}>
                <Container maxWidth="lg">
                    <Typography component="h1" variant="h2" align="center" color="secondary" className={classes.title} gutterBottom>
                        {query_hash.toUpperCase()}
                    </Typography>
                </Container>
            </div>
            <Divider className={classes.divider} />
            <Container maxWidth={false}>
                <CharactersTable data={hash} members={false}/>
                <Divider className={classes.divider} />
            </Container>
        </main>
    )
}

export async function getServerSideProps({ query }) {
    const { query_hash } = query;
    const gql = `query Hash($query_hash: String!) {
        hash(query: $query_hash) {
            _id
            name
            realm {
              name
              slug
            }
            guild {
              name
              slug
            }
            hash {
              a
              b
              c
              t
            }
            ilvl {
              eq
            }
            level
            media {
              avatar_url
            }
            faction
            race
            gender
            character_class
            spec
            level
            lastModified
        } 
    }`
    const { data: { hash } } = await fetch(`http://${process.env.api}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: gql,
            variables: { query_hash },
        })
    }).then(res => res.json())
    return { props: { hash } }
}

export default FindPage
