import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Container, Grid,
    Typography, Divider,
    Avatar, Box, ButtonGroup, Button
} from '@material-ui/core';
import ClusterChart from "../../../../src/ClusterChart";
import Clock from "../../../../src/Clock";
import ItemValuations from "../../../../src/ItemValuations";
import QuotesTable from "../../../../src/QuotesTable";
import WtWiget from "../../../../src/WtWiget";
import useSWR from 'swr'
import Router from "next/router";

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 400,
        maxHeight: '760px',
    },
    divider: {
        margin: `${theme.spacing(2)}px auto`,
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(2),
    },
    cardTitle: {
        fontSize: '1.1em',
        fontWeight: 600
    },
    titleBlock: {
        padding: theme.spacing(10, 0, 10),
    },
}));

const ItemPage = ({item_data}) => {

    const contractButtons = [
        {
            name: "intraday", value: "tod"
        },
        {
            name: "yesterday", value: "ytd"
        },
        {
            name: "week", value: "week"
        },
        {
            name: "last week", value: "last_week"
        },
        {
            name: "month", value: "month"
        },
        {
            name: "last month", value: "last_month"
        },
    ]

    const [item, eva] = item_data

    let realm, chart, quotes, data, _id, icon, name, quality, item_class, item_subclass, ilvl, inventory_type, level, ticker, asset_class, contracts, connected_realm_id, auctions, gold, wowtoken;

    if (item.value) {
        ({ realm, chart, quotes, wowtoken } = item.value);
        ({ _id, name, quality, icon, item_class, item_subclass, ilvl, inventory_type, level, ticker, asset_class, contracts } = item.value.item);
        if (_id === 1) {
            gold = true;
        }
        ({ connected_realm_id, auctions } = realm);
    }
    if (eva.value) {
        ({ data } = useSWR(`http://localhost:3030/api/items/eva/${item.value.item._id}@${connected_realm_id}`, fetch, { initialData: eva.value.valuations }))
    }

    const classes = useStyles();

    return (
        <Container maxWidth={false}>
            {/** TITLE BLOCK */}
            <Container maxWidth={false} className={classes.titleBlock}>
                <Grid container direction="column" justify="space-around" alignItems="center" spacing={2}>
                    <Grid item>
                        <Box alignItems="center" display="flex" justifyContent="center">
                            <Avatar alt="Item Icon" variant="rounded" src={icon} className={classes.large} />
                            <Typography component="h1" variant="h2" color="textPrimary" className={classes.title}>
                                {(ticker) ? (ticker) : (name["en_GB"])}@{(realm.ticker) ? (realm.ticker) : (realm.name)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        {(auctions) ? (
                            <Clock time={auctions*1000}/>
                        ) : ('')}
                    </Grid>
                    <ButtonGroup color="secondary" aria-label="outlined primary button group">
                        {asset_class.includes('COMMDTY') ? (
                            <Button onClick={() => Router.push(`/XRS/${_id}`)}>XRS</Button>
                        ) : ('')}
                        {(wowtoken) ? (
                            <Button onClick={() => Router.push(`/gold/${connected_realm_id}`)}>GOLD</Button>
                        ) : ('')}
                        {(contracts) ? (
                            contractButtons.map(({name, value}) => (
                                <Button onClick={() => Router.push(`/contract/${connected_realm_id}/${_id}/${value}`)}>{name}</Button>
                            ))
                        ) : ('')}
                    </ButtonGroup>
                    <Grid item>
                        {(wowtoken) ? (
                            <WtWiget data={wowtoken}/>
                        ) : ('')}
                    </Grid>
                </Grid>
            </Container>

            {/** CARD BLOCK */}
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography gutterBottom variant="overline" display="block" component="h2" className={classes.cardTitle}>
                            Summary
                        </Typography>
                        <Divider light />
                        <Typography variant="caption" display="block">
                            ID: {_id}
                        </Typography>
                        {(ticker) ? (
                            <Typography variant="caption" display="block">
                                Name: {name["en_GB"]}
                            </Typography>
                        ) : ('')}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography gutterBottom variant="overline" display="block" component="h2" className={classes.cardTitle}>
                            Class
                        </Typography>
                        <Divider light />
                        <Typography variant="caption" display="block">
                            {item_class} {item_subclass}
                        </Typography>
                        {(asset_class && asset_class.length) ? (
                        <Typography variant="caption" display="block">
                            {asset_class.toString().replace(/,/g, ' ')}
                        </Typography>
                        ) : ('')}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography gutterBottom variant="overline" display="block" component="h2" className={classes.cardTitle}>
                            Inventory
                        </Typography>
                        <Divider light />
                        <Typography variant="caption" display="block">
                            {quality} {inventory_type}
                        </Typography>
                        {(ilvl && level) ? (
                            <Typography variant="caption" display="block">
                                {ilvl} {level}
                            </Typography>
                        ) : ("")}
                    </Grid>
                </Grid>
            </Container>
            {/** MARKET BLOCK */}
            {(chart && quotes) ? (
                <React.Fragment>
                <Divider className={classes.divider} />
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <ClusterChart data={chart}/>
                    </Grid>
                    <Grid item xs={3}>
                        <QuotesTable data={quotes} gold={gold}/>
                    </Grid>
                </Grid>
                </React.Fragment>
            ) : (
                ''
            )}
            <Divider className={classes.divider} />
            <ItemValuations data={data}/>
            <Divider className={classes.divider} />
        </Container>
    )
};


export async function getServerSideProps({query}) {
    const {realmSlug, itemQuery} = query;
    const item_data = await Promise.allSettled([
        fetch(encodeURI(`http://${process.env.api}/items/item/${itemQuery}@${realmSlug}`)).then(res => res.json()),
        fetch(encodeURI(`http://${process.env.api}/items/eva/${itemQuery}@${realmSlug}`)).then(res => res.json())
    ])
    return { props: { item_data }}
}


export default ItemPage