import React from "react";
import MetaHead from "../src/MetaHead";
import { Grid, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        height: '93vh',
    },
}));

export default function Discord () {
    const classes = useStyles();
    return (
        <main>
            <MetaHead
                title={"Conglomerat: DISCORD"}
                description={"Discord bots are super cool"}
                image={"https://conglomerat.group/logo.png"}
            />
            <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
                <Typography variant="h1" component="h2" gutterBottom>
                    h1. Heading
                </Typography>
            </Grid>
        </main>
    )
}
