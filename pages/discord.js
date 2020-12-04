import React from "react";
import MetaHead from "../src/MetaHead";
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import Image from 'next/image'

const useStyles = makeStyles(() => ({
  root: {
    height: '300vh',
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
          <Typography variant="h1" component="h5" align="center" gutterBottom>
            REVEAL SHADOWS IN SHADOWLANDS
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4} align="center">
          <Image
            src="https://i.imgur.com/o9jDD9S.png"
            alt="item flask.power@gordunni"
            width={610}
            height={458}
            layout='intrinsic'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="h2" component="h2">
            > DON'T BE FOOLED
          </Typography>
          <Typography variant="h2" component="h2" gutterBottom>
            BY DERIVATIVE SALES
          </Typography>
          <Typography variant="subtitle1" style={{textTransform: 'uppercase'}} gutterBottom>
            We are ready to supply auction house data
            and decision making information right to you
            by request or via event subscription
          </Typography>
          <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
            {"sub {\"type\":\"orders\", \"id\": 171276, \"realm\":\"gordunni\"}"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Image
            src="https://i.imgur.com/ikhoclG.png?2"
            alt="sub orders"
            width={338}
            height={467}
            layout='intrinsic'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} align="center">
          <Image
            src="https://i.imgur.com/DTXW8H8.png"
            alt="sub wowprogress"
            width={547}
            height={764}
            layout='intrinsic'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="h1" component="h3">
            > NOTHING
          </Typography>
          <Typography variant="h2" component="h5" gutterBottom>
            WILL REMAIN HIDDEN
          </Typography>
          <Typography variant="subtitle1" style={{textTransform: 'uppercase'}} gutterBottom>
            We always knew and receive notifications without delay
            when a new candidate appears in wowprogress LFG queue
            or a new sell order with BoE item has been created or removed
            on the auction house
          </Typography>
          <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
            {"sub {\"type\":\"recruiting\", \"realm\":\"Europe\", \"faction\":\"horde\"}"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Image
            src="https://i.imgur.com/fV12ic0.png"
            alt="Picture of the author"
            width={616}
            height={635}
            layout='intrinsic'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} align="center">
          <Image
            src="https://i.imgur.com/QlTG1MH.png"
            alt="character инициатива@gordunni"
            width={429}
            height={404}
            layout='intrinsic'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="h5" component="h3">
            >[BEYOND: THE CUTTING EDGE]
          </Typography>
          <Typography variant="subtitle1" component="h5" gutterBottom>
            ALL THIS AND A BIT MORE, SO WHAT ARE YOU WAITING FOR?
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Image
            src="https://i.imgur.com/ty1RnYD.png"
            alt="guild pieces@draenor"
            width={565}
            height={448}
            layout='intrinsic'
            className={classes.media}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} align="center">
          <Button
            href="https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot"
            size="large"
            variant="outlined"
            color="secondary"
            align="center"
            style={{
              maxWidth: '300px',
              maxHeight: '70px',
              minWidth: '300px',
              minHeight: '70px'
            }}>
            > Invite Link
          </Button>
        </Grid>
      </Grid>
    </main>
  )
}
