import { Container, Divider, Grid, Typography, Box } from '@mui/material';
import { WHO_WE_ARE, CONTRIBUTORS } from '../libs';
import ContributionStar from '../libs/components/ContributionStar';
import MetaHead from '../libs/components/MetaHead';
import { theme } from '../libs/styles';

const styleCss = {
  main: {
    marginTop: '65px',
    minHeight: '90vh',
  },
  divider: {
    padding: theme.spacing(2),
  },
  memory: {
    margin: theme.spacing(4),
    textTransform: 'uppercase',
  }
};

const WhoWeAre = () => {
  return (
    <main>
      <Box sx={styleCss.main}>
        <MetaHead
          title={'The Conglomerat'}
          description={WHO_WE_ARE.description}
          wowhead={false}/>
        <Container maxWidth={false} sx={styleCss.divider}>
          <Divider/>
          <Typography variant="h2" component="h1" align="center" sx={styleCss.memory} gutterBottom>
            Great Many Thanks
          </Typography>
          <Divider/>
          <Grid container>
            {CONTRIBUTORS.map((contributor, i) => (
              <Grid item xs={3} key={i}>
                <ContributionStar
                  character={contributor.character}
                  name={contributor.name}
                  discord={contributor.discord}
                  twitter={contributor.twitter}
                  github={contributor.github}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </main>
  )
}

export default WhoWeAre;
