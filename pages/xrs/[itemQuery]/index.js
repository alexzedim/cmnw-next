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

const ItemPage = ({xrs_data}) => {

    const [item, valuation] = xrs_data;

    let data, _id, icon, chart, name, quality, item_class, item_subclass, ilvl, inventory_type, level, ticker, asset_class, valuations;

    if (item.value) {
        ({ _id, icon, name, quality, item_class, item_subclass, ilvl, inventory_type, level, ticker, asset_class } = item.value.item)
        chart = item.value.chart
    }

    if (valuation.value) {
        ({valuations} = valuation.value)
        if (valuations && valuations.length) {
            data = valuations
        }
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
                                {(ticker) ? (ticker) : (name["en_GB"])}
                            </Typography>
                        </Box>
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
            {(chart) ? (
                <React.Fragment>
                    <Divider className={classes.divider} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <XRSClusterChart data={chart}/>
                        </Grid>
                    </Grid>
                </React.Fragment>
            ) : (
                ''
            )}
            {(data) ? (
                <React.Fragment>
                    <Divider className={classes.divider} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ItemValuations data={data} pageSize={20}/>
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


export default ItemPage