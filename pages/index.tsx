import { Container, Box } from '@mui/material';
import { INDEX_PAGE } from '../libs';
import { MetaHead } from '../libs/components/MetaHead';
import { SearchForm } from '../libs/components/SearchForm';

const styleCss = {
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
};

const Home = () => {
  return (
    <main>
      <Box sx={styleCss.main}>
        <MetaHead
          title={'CMNW'}
          description={INDEX_PAGE.description}
          wowhead={false}
        />
        <Container maxWidth={false} sx={styleCss.root}>
          <SearchForm/>
        </Container>
      </Box>
    </main>
  )
}

export default Home;
