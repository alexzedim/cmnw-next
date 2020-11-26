import React from "react";
import {Avatar, Grid} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import Link from "./Link";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2)
  },
  wp: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
    color: '#fff',
    backgroundColor: '#313131',
  },
  v_large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: theme.spacing(1),
  },
  pvp: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
    color: '#80c7f6',
    backgroundColor: '#8a0d0d',
  },
}));

export default function CharacterButtons({name, realm}) {

  const classes = useStyles();
  if (!name || !realm) return ('')
  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Link href={`https://www.warcraftlogs.com/character/eu/${realm}/${name}`} prefetch={false}><Avatar
          variant="square" alt="WarcraftLogs" src="https://assets.rpglogs.com/img/warcraft/favicon.png?v=2"
          className={classes.large}/></Link>
        <Link href={`https://raider.io/characters/eu/${realm}/${name}`} prefetch={false}><Avatar variant="square"
                                                                                                 alt="RaiderIO"
                                                                                                 src="https://cdnassets.raider.io/images/brand/Icon_FullColor.png"
                                                                                                 className={classes.large}/></Link>
        <Link href={`https://www.wowprogress.com/character/eu/${realm}/${name}`} prefetch={false}><Avatar
          alt="WoWProgress" className={classes.wp}>WP</Avatar></Link>
        <Link href={`https://worldofwarcraft.com/en-gb/character/eu/${realm}/${name}`} prefetch={false}><Avatar
          alt="BattleNet" src="https://conglomerat.group/wow.svg" className={classes.v_large}/></Link>
        <Link href={`https://check-pvp.fr/eu/${realm}/${name}`} prefetch={false}><Avatar alt="Check PvP"
                                                                                         className={classes.pvp}>PvP</Avatar></Link>
      </Grid>
    </React.Fragment>
  )
}
