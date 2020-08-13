import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Clock from "../../../../../src/Clock";
import ContractsTable from "../../../../../src/ContractsTable";
import LineChart from "../../../../../src/LineChart"
import {
    Container, Grid, Typography,
    Divider, ButtonGroup, Button, Avatar, Box,
} from '@material-ui/core';
import Router from "next/router";
import ItemData from "../../../../../src/ItemData";
import ContractData from "../../../../../src/ContractData";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        overflowX: 'auto',
        margin: `${theme.spacing(1)}px auto`,
        padding: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    table: {
        minWidth: 300,
        textTransform: 'uppercase'
    },
    divider: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(2),
    },
    container: {
        maxHeight: 500,
    },
    cardTitle: {
        fontSize: '0.9em',
        fontWeight: 600
    },
    titleBlock: {
        padding: theme.spacing(10, 0, 5),
    },
}));

/***
 * TODO cluster chart for sellers OR orders
 * @param contracts
 * @returns {*}
 * @constructor
 */

const ContractPage = ({contracts_data}) => {

    let { item, realm, snapshot, contracts } = contracts_data

    const classes = useStyles();

    return (
        <Container maxWidth={false}>
            <Container className={classes.titleBlock}>
                <Grid container direction="column" justify="space-around" alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Box alignItems="center" display="flex" justifyContent="center">
                            <Avatar alt="Item Icon" variant="rounded" src={item.icon} className={classes.large} />
                            <Typography variant="h2" className={classes.title} style={{textTransform: 'uppercase'}}>
                                {(item.ticker) ? (item.ticker) : (item.name["en_GB"])}@{(realm.ticker) ? (realm.ticker) : (realm.name)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs>
                        <Clock time={realm.auctions*1000}/>
                    </Grid>
                    <Grid item xs>
                        <ButtonGroup color="secondary" aria-label="outlined primary button group">
                            <Button onClick={() => Router.push(`/item/${realm.connected_realm_id}/${item._id}`)}>Underlying Item</Button>
                            <Button onClick={() => Router.push(`/xrs/${item._id}`)}>XRS</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth={false}>
                <Divider className={classes.divider} />
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} elevation={6}>
                        <ContractData data={snapshot}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} elevation={6}>
                        <ItemData data={item}/>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <LineChart data={contracts}/>
                <Divider className={classes.divider} />
                <ContractsTable data={contracts}/>
                <Divider className={classes.divider} />
            </Container>
        </Container>
    )
};

export async function getServerSideProps({query}) {
    const { realmSlug, itemSlug, tenor } = query;
    const contracts_data = await fetch(encodeURI(`http://${process.env.api}/contracts/${tenor}/${itemSlug}@${realmSlug}`)).then(res => res.json());
    return { props: { contracts_data } }
}

export default ContractPage