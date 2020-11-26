import React from "react";
import MetaHead from '../src/MetaHead'
import {Card, CardMedia, CardContent, Grid, makeStyles, Typography} from "@material-ui/core";
import Link from "../src/Link";

const useStyles = makeStyles(theme => ({
  root: {
    height: '93vh',
    width: '100%'
  },
  index: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  card: {
    paddingTop: theme.spacing(5),
    padding: theme.spacing(5),
    backgroundColor: 'transparent',
    border: "none",
    boxShadow: "none"
  },
  media: {
    borderRadius: 10,
    height: 600,
    filter: 'grayscale(75%) opacity(30%)',
    '&:hover': {
      filter: 'none',
    },
  },
}));

function Index() {
  const classes = useStyles();
  return (
    <main>
      <MetaHead
        title={"Conglomerat"}
        description={"World of Warcraft: In-game decision-making superiority starts here"}
        image={"https://conglomerat.group/logo.png"}
      />
      <Grid container direction="row" justify="center" alignItems="baseline" className={classes.root}>
        <Grid item xs={12} sm={6} md={6}>
          <Link href={"/osint"} underline="none">
            <Card className={classes.card} align="center">
              <CardMedia
                className={classes.media}
                component="img"
                alt="OSINT"
                image="https://i.imgur.com/BnWGWJA.jpg"
                title="OSINT"
                src={'/osint.jpg'}
              />
              <CardContent>
                <Typography variant="overline" color="textSecondary" component="p">
                  Use OSINT module for requesting an extended information about characters and guilds. <br/>
                  Track similarities between them and certain events with realm statistics.
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Link href={"/dma"} underline="none">
            <Card className={classes.card} align="center">
              <CardMedia
                className={classes.media}
                component="img"
                alt="Direct Market Access"
                image="https://i.imgur.com/GWYaAgz.jpg"
                title="Direct Market Access"
                src={'/dma.jpg'}
              />
              <CardContent>
                <Typography variant="overline" color="textSecondary" component="p">
                  The Direct Market Access provides you  transparent picture of the auction houses with capability to evaluate any item and find difference between their market and derivative prices not just only on one realm, but within the whole region.
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={12} align="center">
          <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
            More things to come, stay tuned!
          </Typography>
        </Grid>
      </Grid>
    </main>
  )
}

export default Index
