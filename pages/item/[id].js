import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Container, Grid,
    Typography, Divider,
    Avatar, Box, ButtonGroup, Button
} from '@material-ui/core';
import ClusterChart from "../../src/ClusterChart";
import Clock from "../../src/Clock";
import ItemValuations from "../../src/ItemValuations";
import QuotesTable from "../../src/QuotesTable";
import WtWiget from "../../src/WtWiget";
import ItemData from '../../src/ItemData';
import ItemChart from "../../src/ItemChart";
import WtLineChart from "../../src/WtLineChart";
import Router from "next/router";
import MetaHead from '../../src/MetaHead'


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
        padding: theme.spacing(10, 0, 5),
    },
    content: {
        height: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }
}));

const ItemPage = ({ item }) => {

    const {
        realm, chart, quotes, _id, icon,
        name, ticker, wowtoken, feed,
        valuations
    } = item

    const { connected_realm_id, auctions } = realm

    const title = `${ticker || name['en_GB']}@${realm.ticker || realm.name}`

    let gold = false

    if (_id === 1) {
        gold = true;
    }

    const classes = useStyles();

    return (
        <main>
            <MetaHead
                title={`ITEM:${title}`}
                description={"ITEM — Provides an up-to-date market data with evaluation methods and its values, for a certain item within a selected realm."}
                image={icon}
            />
            <Container maxWidth={false}>
                {/** TITLE BLOCK */}
                <Container maxWidth={false} className={classes.titleBlock}>
                    <Grid container direction="column" justify="space-around" alignItems="center" spacing={2}>
                        <Grid item>
                            <Box alignItems="center" display="flex" justifyContent="center">
                                <Avatar alt="Item Icon" variant="rounded" src={icon} className={classes.large} />
                                <Typography component="h1" variant="h2" color="textPrimary" className={classes.title}>
                                    {title}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            {(auctions) ? (
                                <Clock time={auctions*1000}/>
                            ) : ('')}
                        </Grid>
                        <ButtonGroup color="secondary" aria-label="outlined primary button group">
                            {(wowtoken) ? (
                                <Button onClick={() => Router.push(`/item/GOLD@${connected_realm_id}`)}>GOLD</Button>
                            ) : ('')}
                        </ButtonGroup>
                    </Grid>
                </Container>
                <Container maxWidth={false}>
                    <Divider className={classes.divider} />
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={6} elevation={6}>
                            <QuotesTable data={quotes} gold={gold}/>
                            {(wowtoken) ? (
                                <Box display="flex" alignItems="center" justifyContent="center" m={1} p={1} className={classes.content}>
                                    <WtWiget data={wowtoken[0]}/>
                                </Box>
                            ) : ('')}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} elevation={6}>
                            <ItemData data={item}/>
                        </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                    {(chart) ? (
                        <React.Fragment>
                            <ClusterChart data={chart}/>
                            <Divider className={classes.divider} />
                        </React.Fragment>
                    ) : ('')}
                    {(feed) ? (
                        <React.Fragment>
                            <ItemChart name={name['en_GB']} data={feed}/>
                            <Divider className={classes.divider} />
                        </React.Fragment>
                    ) : ('')}
                    {(wowtoken) ? (
                        <React.Fragment>
                            <WtLineChart data={wowtoken}/>
                            <Divider className={classes.divider} />
                        </React.Fragment>
                    ) : ('')}
                    <ItemValuations data={valuations}/>
                    <Divider className={classes.divider} />
                </Container>
            </Container>
        </main>
    )
};


export async function getServerSideProps ({ query }) {
    const { id } = query;
    const gql = `query Item($id: ID!) {
        item(id: $id, valuations: true, webpage: true) {
            _id
            name {
              en_GB
            }
            realm {
              _id
              name
              slug
              auctions
              ticker
            }
            quality
            level
            icon
            item_class
            item_subclass
            purchase_price
            sell_price
            is_equippable
            is_stackable
            inventory_type
            purchase_quantity
            loot_type
            contracts
            asset_class
            expansion
            stackable
            profession_class
            ticker
            tags
            createdAt
            updatedAt
            valuations {
              name
              item_id
              connected_realm_id
              type
              last_modified
              value
              flag
              details {
                queue_cost
                queue_quantity
                rank
                reagent_items {
                  quality
                  level
                  name {
                    en_GB
                  }
                  icon
                  item_class
                  item_subclass
                  purchase_price
                  sell_price
                  is_equippable
                  is_stackable
                  inventory_type
                  purchase_quantity
                  loot_type
                  contracts
                  expansion
                  stackable
                  profession_class
                  ticker
                  createdAt
                  updatedAt
                  value
                  quantity
                }
                premium_items {
                  quality
                  name {
                    en_GB
                  }
                  level
                  icon
                  item_class
                  item_subclass
                  purchase_price
                  sell_price
                  is_equippable
                  is_stackable
                  inventory_type
                  purchase_quantity
                  loot_type
                  contracts
                  expansion
                  stackable
                  profession_class
                  ticker
                  createdAt
                  updatedAt
                  value
                  quantity
                }
                unsorted_items {
                  name {
                    en_GB
                  }
                  quality
                  level
                  icon
                  item_class
                  item_subclass
                  purchase_price
                  sell_price
                  is_equippable
                  is_stackable
                  inventory_type
                  purchase_quantity
                  loot_type
                  contracts
                  expansion
                  stackable
                  profession_class
                  ticker
                  createdAt
                  updatedAt
                  value
                  quantity
                }
                wi
                quotation
                swap_type
                description
                price_size
                quantity
                open_interest
              }
            }
            chart {
              price_range
              timestamps
              dataset {
                x
                y
                value
                oi
                orders
              }
            }
            quotes {
              price
              quantity
              open_interest
              size
            }
            wowtoken {
              region
              price
              lastModified
              createdAt
              updatedAt
            }
        }      
    }`
    const { data: { item } } = await fetch(`http://${process.env.api}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: gql,
            variables: { id },
        })
    }).then(res => res.json())
    return { props: { item }}
}


export default ItemPage
