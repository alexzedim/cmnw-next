import React from 'react';
import MetaHead from '../libs/components/MetaHead';
import { Button, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { DISCORD } from '../libs';

const useStyles = makeStyles(() => ({
  main: {
    marginTop: '65px',
  },
  root: {
    overflow: 'hidden',
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  discord: {
    maxWidth: '300px',
    maxHeight: '70px',
    minWidth: '300px',
    minHeight: '70px',
    margin: 'auto',
  }
}));

const Discord = () => {
  const classes = useStyles();
  return (
    <main className={classes.main}>
      <MetaHead
        title={'Discord Bot'}
        description={DISCORD.description}
        wowhead={false}
      />
      <Container maxWidth={false} className={classes.root}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h1" component="h5" align="center" gutterBottom>
              REVEAL SHADOWS IN SHADOWLANDS
            </Typography>
          </Grid>
          <Button
            className={classes.discord}
            href="https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot"
            size="large"
            variant="outlined"
            color="secondary"
          >
            {'>'} Invite Link
          </Button>
        </Grid>
      </Container>
    </main>
  )
}

export default Discord;
