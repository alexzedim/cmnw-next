import React, { FC, Fragment } from 'react';
import { characterTitle } from '../../types';
import Link from '../Link';
import { Box, Divider, Typography } from '@mui/material';
import { generateFactionBackground } from '../../utils';
import { theme } from '../../styles';

const styleCss = {
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: '1080px',
    borderRadius: '15px',
    position: 'relative',
  },
  title: {
    color: 'white',
    padding: '1rem',
    border: 'solid 5px white',
  },
  divider: {
    background: theme.palette.primary.main
  },
  name: {
    fontFamily: 'Fira Sans',
    fontWeight: 900,
    textTransform: 'uppercase',
    fontSize: 'clamp(2rem, -2.7500rem + 16.6667vw, 4rem)',
    textAlign: 'left',
  },
  realm: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontSize: 'clamp(1.3rem, -2.7500rem + 16.6667vw, 2rem)',
    fontWeight: 400,
    textAlign: 'left',
  },
  guild: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontSize: 'clamp(1rem, -2.7500rem + 16.6667vw, 2rem)',
    fontWeight: 400,
    textAlign: 'left',
  },
};

const CharacterTitle: FC<characterTitle> = ({ name, realm, guild, guild_id, guild_rank, faction }) => {
  const background = generateFactionBackground(faction);
  return (
    <Fragment>
      <Box sx={styleCss.root} style={background}>
        <Box sx={styleCss.title} style={background}>
          <Typography variant="h1" component="h1" color="textPrimary" sx={styleCss.name}>
            {name}
          </Typography>
          {(guild && guild_id) ? (
            <Typography variant="h4" component="h4" color="textPrimary" sx={styleCss.guild}>
              #<Link href={`/guild/${guild_id}`} color="textPrimary" underline="hover">{guild}</Link>
              {(guild_rank && typeof guild_rank === 'number') ? ((guild_rank === 0) ? (` // GM`) : (` // R${guild_rank}`)) : ('')}
            </Typography>
          ) : ('')}
          <Divider sx={styleCss.divider}/>
          <Typography variant="h4" component="h4" color="textPrimary" sx={styleCss.realm}>
            @{realm}
          </Typography>
        </Box>
      </Box>
    </Fragment>
  )
}

export default CharacterTitle;
