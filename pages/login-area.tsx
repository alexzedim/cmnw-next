import { Container, Grid, Typography, Box } from '@mui/material';
import { MetaHead } from '../libs/components/MetaHead';
import Image from 'next/image'

const styleCss = {
  main: {
    marginTop: '65px',
  },
  root: {
    overflow: 'hidden',
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  image: {
    margin: 'auto',
    left: '50%',
    top: '50%',
  }
}

const LoginArea = () => {
  return (
    <main>
      <Box sx={styleCss.main}>
        <MetaHead
          title={'Login Area'}
          description={'Work in progress'}
          wowhead={false}
        />
        <Container maxWidth={false} sx={styleCss.root}>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="h1" component="h5" align="center" gutterBottom>
                THE NEXT BIG THING
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Image
                src={'/static/cmnw-1.svg'}
                alt='CMNW'
                layout='intrinsic'
                style={styleCss.image}
                width={700}
                height={475}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </main>
  )
}

export default LoginArea;
