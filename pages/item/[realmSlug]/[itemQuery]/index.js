import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Container, Grid,
    Typography, Divider,
    Avatar, Table,
    TableContainer,
    TableHead, TableRow,
    TableCell, TableBody,
    Paper, Box
} from '@material-ui/core';
import ItemContractButtons from "../../../../src/ItemContractButtons";
import ClusterChart from "../../../../src/ClusterChart";
import Clock from "../../../../src/Clock";
import ItemValuations from "../../../../src/ItemValuations";
import useSWR from 'swr'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        overflowX: 'auto',
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    table: {
        minWidth: 400,
        maxHeight: '760px',
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
    divider: {
        margin: `${theme.spacing(2)}px auto`,
    },
    title: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(2),
    },
    container: {
        maxHeight: 'auto',
        margin: `auto ${theme.spacing(1)}px`,
    },
    cardTitle: {
        fontSize: '1.1em',
        fontWeight: 600
    },
    chip: {
        margin: theme.spacing(1)
    },
    titleBlock: {
        padding: theme.spacing(10, 0, 10),
    },
    totalRow: {
        backgroundColor: '#ebe7ee',
    }
}));

const Item = ({item_data}) => {

    const [item, eva] = item_data

    let realm, chart, quotes, data, error, _id, icon, name, quality, item_class, item_subclass, ilvl, inventory_type, level, ticker, asset_class, contracts;

    if (item.value) {
        ({ realm, chart, quotes } = item.value);
        ({_id, name, quality, icon, item_class, item_subclass, ilvl, inventory_type, level, ticker, asset_class, contracts } = item.value.item)
    }

    if (eva.value) {
        ({ data, error } = useSWR(`http://localhost:3030/api/items/eva/${item.value.item._id}@${realm.connected_realm_id}`, fetch, { initialData: eva.value.valuations }))
    }

    const classes = useStyles();

    return (
        <Container maxWidth={false} alignContent="center">
            {/** TITLE BLOCK */}
            <Container maxWidth={false} className={classes.titleBlock}>
                <Grid container direction="column" justify="space-around" alignItems="center" spacing={2}>
                    <Grid item>
                        <Box alignItems="center" display="flex" justifyContent="center">
                            <Avatar alt="Item Icon" variant="rounded" src={icon} className={classes.large} />
                            <Typography component="h1" variant="h2" color="textPrimary" className={classes.title}>
                                {(ticker) ? (ticker) : (name["en_GB"])}@{(realm.ticker) ? (realm.ticker) : (ticker.name)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        {(realm && realm.auctions) ? (
                            <Clock time={realm.auctions*1000}/>
                        ) : ('')}
                    </Grid>
                    {(contracts) ? (
                        <ItemContractButtons item={item._id} realm={realm.connected_realm_id}/>
                    ) : ('')}
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
                        <TableContainer component={Paper} className={classes.table}>
                            <Table stickyHeader size="small" aria-label="Quotes">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Price</TableCell>
                                        <TableCell align="left">Quantity</TableCell>
                                        <TableCell align="right">Value</TableCell>
                                        <TableCell align="right">Orders</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quotes.map(({_id, quantity, open_interest, orders}, i) => (
                                        <TableRow key={i}>
                                            <TableCell component="th" scope="row">{_id.toLocaleString('ru-RU')}</TableCell>
                                            <TableCell align="right">{quantity.toLocaleString('ru-RU')}</TableCell>
                                            <TableCell align="right">{Math.round(open_interest).toLocaleString('ru-RU')}</TableCell>
                                            <TableCell align="right">{orders.length}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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


export default Item