import React from "react";
import MetaHead from '../src/MetaHead'
import {Container, Grid, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    height: '93vh',
  },
  searchField: {
    margin: theme.spacing(2, 0, 2),
  },
  searchbar: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  search: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dropdown: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
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
      <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
        <Container className={classes.searchbar}>

        </Container>
        <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
          GraphQL is here. Get ready for something new!
        </Typography>
      </Grid>
    </main>
  )
}

export default Index
