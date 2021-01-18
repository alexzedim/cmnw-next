import {Grid, Hidden, makeStyles, Typography} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  }
}));

export default function AtSign() {
  const classes = useStyles();
  return (
      <Hidden only="xs">
        <Grid item xs={12} md={1}>
          <div className={classes.item}>
            <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
              @
            </Typography>
          </div>
        </Grid>
      </Hidden>
    )
}
