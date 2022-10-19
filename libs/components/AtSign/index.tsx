import { Grid, Typography, Box } from '@mui/material';
import React, { FC } from 'react';
import { theme } from '../../styles/theme';

const styleCss = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1, 2, 1, 2)
  },
  typography: {
    textTransform: 'uppercase',
    margin: '0'
  }
}

const AtSign: FC<{}> = () => {
  return (
    <Grid item xs={12} md={1}>
      <Box component="span" sx={styleCss.item}>
        <Typography variant="h3" align="center" sx={styleCss.typography}>
          @
        </Typography>
      </Box>
    </Grid>
  )
}

export default AtSign;
