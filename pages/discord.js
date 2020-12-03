import React from "react";
import MetaHead from "../src/MetaHead";
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import Image from 'next/image'

const useStyles = makeStyles(theme => ({
  root: {
    height: '250vh',
  },
  media: {
    borderRadius: 10,
    mixBlendMode: 'multiply',
    filter: 'blur(0.2px) opacity(91%) drop-shadow(0 0 0.1rem grey)',
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
      <Grid container justify="center" alignItems="center" className={classes.root}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="h1" component="h2" align="center" gutterBottom>
            REVEAL SHADOWS IN SHADOWLANDS
          </Typography>
          <Button href="https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot" variant="outlined" color="secondary">
            Invite Link
          </Button>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Image
            src="https://i.imgur.com/o9jDD9S.png"
            alt="item flask.power@gordunni"
            width={610}
            height={458}
            layout='fixed'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <Typography variant="h2" component="h2">
            > DON'T BE FOOLED
          </Typography>
          <Typography variant="h2" component="h2" gutterBottom>
            BY DERIVATIVE SALES
          </Typography>
          <Typography variant="h5" style={{textTransform: 'uppercase'}} gutterBottom>
            We are ready to supply auction house data<br/>
            and decision making information right to you<br/>
            by request or via event subscription
          </Typography>
          <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
            {"sub {\"type\":\"orders\", \"id\": 171276, \"realm\":\"gordunni\"}"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Image
            src="https://i.imgur.com/ikhoclG.png?2"
            alt="sub orders"
            width={338}
            height={467}
            layout='fixed'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Image
            src="https://i.imgur.com/DTXW8H8.png"
            alt="Picture of the author"
            width={547}
            height={764}
            layout='fixed'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Typography variant="h1" component="h2">
            > NOTHING
          </Typography>
          <Typography variant="h3" component="h2" gutterBottom>
            WILL REMAIN HIDDEN
          </Typography>
          <Typography variant="subtitle1" style={{textTransform: 'uppercase'}} gutterBottom>
            We always knew and receive notifications without delay<br/>
            when a new candidate appears in wowprogress LFG queue<br/>
            or a new sell order with BoE item has been created, expired or filled <br/>
            at the auction house
          </Typography>
          <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
            {"sub {\"type\":\"recruiting\", \"realm\":\"Europe\"}"}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Image
            src="https://i.imgur.com/fV12ic0.png"
            alt="Picture of the author"
            width={616}
            height={635}
            layout='fixed'
            className={classes.media}
          />
        </Grid>
      </Grid>

    </main>
  )
}
