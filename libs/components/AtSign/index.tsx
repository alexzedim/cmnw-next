import { Grid, Typography, Box } from '@mui/material';
import React, { FC } from 'react';

const styleCss = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  typography: {
    textTransform: 'uppercase',
    margin: '0'
  }
}

const AtSign: FC = () => {
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
