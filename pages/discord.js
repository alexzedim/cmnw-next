import React from "react";
import MetaHead from "../src/MetaHead";
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    height: '93vh',
  },
}));

export default function Discord() {
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
          >be ahead the curve
        </Typography>
        <Button href="https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot" variant="outlined"
                color="secondary">
          Invite Link
        </Button>
      </Grid>
    </main>
  )
}
