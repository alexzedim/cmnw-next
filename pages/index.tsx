import React from 'react';
import MetaHead from '../libs/components/MetaHead';
import { INDEX_PAGE } from '../libs';
import { SearchForm } from '../libs/components/SearchForm';
import { Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { theme } from '../libs/styles/theme';

const useStyles = makeStyles((theme) => ({
  main: {
    overflow: 'hidden',
    height: '95vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  root: {
    overflow: 'hidden',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const Home = () => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <MetaHead
        title={'CMNW'}
        description={INDEX_PAGE.description}
        wowhead={false}
      />
      <ThemeProvider theme={theme}>
        <Container maxWidth={false} className={classes.root}>
          <SearchForm/>
        </Container>
      </ThemeProvider>
    </main>
  )
}

export default Home;
