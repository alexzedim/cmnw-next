import { FC } from 'react';
import { AppBar, Container, Divider, Toolbar, Typography } from '@mui/material';

const styleCss = {
  root: {
    top: 'auto',
    bottom: 0,
  }
};

// TODO css optimize footer

const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <AppBar id='footer' sx={styleCss.root} position='relative' color={'transparent'}>
      <Container maxWidth='md'>
        <Toolbar>
          <Divider variant='middle'/>
          <Typography variant='overline' color='inherit'>
            &copy; {year} Commonwealth | We don't use cookies or track your behavior
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Footer;
