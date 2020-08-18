import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Container, Grid,
    Typography, Divider,
    Avatar, Box
} from '@material-ui/core';
import XRSClusterChart from "../../../src/XRSClusterChart";
import ItemValuations from "../../../src/ItemValuations";
import XRSScatterPlot from "../../../src/XRSScatterPlot";
import ItemData from "../../../src/ItemData";
import XRSRates from "../../../src/XRSRates";
import ItemChart from "../../../src/ItemChart";
import Head from 'next/head'

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
}));

const XRSPage = ({xrs_data}) => {

    const [item, valuation] = xrs_data;

    let data, icon, chart, name, ticker, valuations, item_info, stackable, feed;

    if (item.value) {
        item_info = item.value.item;
        ({ icon, name, ticker, stackable } = item_info)
        chart = item.value.chart
        feed = item.value.feed
    }

    if (valuation.value) {
        ({valuations} = valuation.value)
        if (valuations && valuations.length) {
            data = valuations
        }
    }

    const classes = useStyles();

    return (
        <main>
            <Head>
                <title>My page title</title>
                <meta property="og:title" content="My page title" key="title" />
                <script src="/power.js" type="text/javascript"/>
            </Head>
            <Container maxWidth={false}>
                <Container maxWidth={false} className={classes.titleBlock}>
                    <Grid container direction="column" justify="space-around" alignItems="center" spacing={2}>
                        <Grid item>
                            <Box alignItems="center" display="flex" justifyContent="center">
                                <Avatar alt="Item Icon" variant="rounded" src={icon} className={classes.large} />
                                <Typography component="h1" variant="h2" color="textPrimary" className={classes.title}>
                                    {(ticker) ? (ticker) : (name["en_GB"])}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Divider className={classes.divider} />
                <Container maxWidth={false}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={6} elevation={6}>
                            <XRSRates stackSize={stackable}/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} elevation={6}>
                            <ItemData data={item_info}/>
                        </Grid>
                    </Grid>
                </Container>
                {(chart) ? (
                    <React.Fragment>
                        <Divider className={classes.divider} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <XRSClusterChart data={chart}/>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ) : ('')}
                {(feed) ? (
                    <React.Fragment>
                        <Divider className={classes.divider} />
                        <ItemChart name={name['en_GB']} data={feed}/>
                    </React.Fragment>
                ) : ('')}
                {(data) ? (
                    <React.Fragment>
                        <Divider className={classes.divider} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <ItemValuations data={data} pageSize={5}/>
                            </Grid>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <XRSScatterPlot data={data}/>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ) : (
                ''
                )}
            </Container>
        </main>
    )
};


export async function getServerSideProps({query}) {
    const { itemQuery } = query;
    const xrs_data = await Promise.allSettled([
        fetch(encodeURI(`http://${process.env.api}/items/xrs_item/${itemQuery}`)).then(res => res.json()),
        fetch(encodeURI(`http://${process.env.api}/items/xrs_eva/${itemQuery}`)).then(res => res.json())
    ])
    return { props: { xrs_data }}
}


export default XRSPage