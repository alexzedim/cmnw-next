import { Avatar, Grid } from '@mui/material';
import { characterButtons } from '../../types';
import React, { FC, Fragment } from 'react';
import Link from '../Link';
import { DOMAINS } from '../../constants';
import { theme } from '../../styles/theme';

const styleCss = {
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    margin: theme.spacing(2),
  }
};


const CharacterButtons: FC<characterButtons> = ({ name, realm }) => {
  return (
    <Fragment>
      <Grid
        container
        direction='row'
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Link href={`${DOMAINS.warcraftLogs}/character/eu/${realm}/${name}`} prefetch={false}>
          <Avatar variant="square" alt="WarcraftLogs" src={'/static/wcl.svg'} sx={styleCss.large}/>
        </Link>
        <Link href={`${DOMAINS.raiderIo}/characters/eu/${realm}/${name}`} prefetch={false}>
          <Avatar variant="square" alt="RaiderIO" src={'/static/rio.svg'} sx={styleCss.large}/>
        </Link>
        <Link href={`${DOMAINS.wowProgress}/character/eu/${realm}/${name}`} prefetch={false}>
          <Avatar variant="square" alt="WoWProgress" src={'/static/wp.svg'} sx={styleCss.large} />
        </Link>
        <Link href={`${DOMAINS.battleNet}/en-gb/character/eu/${realm}/${name}`} prefetch={false}>
          <Avatar variant="square" alt="BattleNet" src={'/static/armory.svg'} sx={styleCss.large}/>
        </Link>
        <Link href={`${DOMAINS.checkPvp}/eu/${realm}/${name}`} prefetch={false}>
          <Avatar variant="square" alt="Check PvP" src={'/static/check_pvp.svg'} sx={styleCss.large} />
        </Link>
      </Grid>
    </Fragment>
  )
};

export default CharacterButtons;
