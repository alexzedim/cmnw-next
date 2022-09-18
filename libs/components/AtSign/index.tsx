import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  }
}));

const AtSign: FC<unknown> = () => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={1}>
      <div className={classes.item}>
        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
          @
        </Typography>
      </div>
    </Grid>
  )
}

export default AtSign;
