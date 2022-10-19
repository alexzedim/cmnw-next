import React from 'react';
import MetaHead from '../libs/components/MetaHead';
import { Button, Container, Grid, Typography } from '@mui/material';
import { DISCORD } from '../libs';

const styleCss = {
  root: {
    paddingTop: '40vh',
    overflow: 'hidden',
    minHeight: '94vh',
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
}

const Discord = () => {
  return (
    <main>
      <MetaHead
        title={'Discord Bot'}
        description={DISCORD.description}
        wowhead={false}
      />
      <Container maxWidth={false} sx={styleCss.root}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h1" component="h5" align="center" gutterBottom>
              REVEAL SHADOWS IN SHADOWLANDS
            </Typography>
          </Grid>
          <Button
            sx={styleCss.discord}
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
