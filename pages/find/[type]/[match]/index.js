import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Link from "../../../../src/Link";
import TableIcons from "../../../../src/TableIcons"
import MaterialTable from 'material-table';
import { Container, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
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

function CharacterPage({ _id, match }) {
    const classes = useStyles();
    return (
        <main>
            <div className={classes.titleBlock}>
                <Container maxWidth="lg">
                    <Typography component="h1" variant="h2" align="center" color="secondary" className={classes.title} gutterBottom>
                        {_id}
                    </Typography>
                </Container>
            </div>
            <Container maxWidth={false}>
                <MaterialTable
                    title="Match table"
                    icons={TableIcons}
                    columns={[
                        { title: 'Avatar', field: 'media', render: ({media}) => ((media) ? (<img src={media.avatar_url} style={{width: 50, borderRadius: '50%'}}/>) : (""))},
                        { title: 'Name', field: 'name', render: ({name, realm}) => (<Link href={encodeURI(`/character/${realm.slug}/${name}`)} color="secondary" underline="hover">{name}</Link>) },
                        {
                            field: 'realm',
                            title: 'Realm',
                            render: ({realm}) => realm.name
                        },
                        {
                            field: 'guild',
                            title: 'Guild',
                            render: ({realm, guild}) => ((realm && guild) ? (<Link href={encodeURI(`/guild/${realm.slug}/${guild.slug}`)} color="secondary" underline="hover">{guild.name}</Link>) : (""))
                        },
                        { title: 'Class', field: 'character_class' },
                        { title: 'Level', field: 'level' },
                        { title: 'Faction', field: 'faction' },
                        { title: 'Race', field: 'race' },
                        { title: 'Gender', field: 'gender' },
                    ]}
                    data={match}
                    style={{
                        backgroundColor: '#ebe7ee',
                        marginBottom: "32px",
                    }}
                    options={{
                        sorting: true,
                        pageSize: 10,
                        pageSizeOptions: [5,10,25,50],
                        showTitle: false,
                        headerStyle: { backgroundColor:'#ebe7ee', padding: '5px' }
                    }}
                />
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

export default CharacterPage
