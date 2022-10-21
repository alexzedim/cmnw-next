import { FC, Fragment } from 'react';
import { Avatar, Box, Divider, Grid, Typography } from '@mui/material';
import { itemTitle } from '../../types';
import { generateItemBackground } from '../../utils';
import { theme } from '../../styles';

const styleCss = {
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(4),
    borderRadius: '15px',
    position: 'relative',
  },
  title: {
    color: 'white',
    padding: '2rem',
    border: 'solid 15px',
  },
  item: {
    fontFamily: 'Fira Sans',
    fontWeight: 900,
    textTransform: 'uppercase',
    fontSize: 'clamp(1.3rem, -2.7500rem + 16.6667vw, 6rem)',
    textAlign: 'left',
    overflowWrap: 'break-word',
  },
  realm: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    textAlign: 'left',
    fontSize: 'clamp(1.3rem, -2.7500rem + 16.6667vw, 3rem)',
    overflowWrap: 'break-word',
  },
  large: {
    maxWidth: theme.spacing(7),
    maxHeight: theme.spacing(7),
    marginRight: theme.spacing(2),
  },
  divider: {
    marginBottom: '15px',
  },
};

export const ItemTitle: FC<itemTitle> = ({ itemTitle, realmTitle, quality, asset_class, icon}) => {
  const backgroundRoot = generateItemBackground({ quality, asset_class });
  const backgroundTitle = generateItemBackground({ asset_class });
  const borderColor = { borderColor: backgroundTitle.backgroundColor };
  return (
    <Fragment>
      <Box sx={styleCss.root} style={backgroundRoot}>
        <Box sx={styleCss.title} style={{ ...backgroundRoot, ...borderColor}}>
          <Grid alignItems="center" justifyContent="flex-start">
            <Avatar alt="Item Icon" variant="rounded" src={icon} sx={styleCss.large}/>
            <Typography variant="h1" component="h1" color="textPrimary" sx={styleCss.item}>
              {itemTitle}
            </Typography>
          </Grid>
          <Divider sx={styleCss.divider} style={{ background: backgroundTitle.backgroundColor }}/>
          <Typography variant="h4" component="h3" color="textPrimary" sx={styleCss.realm}>
            {realmTitle}
          </Typography>
        </Box>
      </Box>
    </Fragment>
  )
}

export default ItemTitle;
