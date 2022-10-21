import { Container, Grid, Paper, Box } from '@mui/material';
import { CHARACTER_PAGE, DOMAINS, characterPortrait, characterResponse, logResponse  } from '../../libs';
import { MetaHead } from '../../libs/components/MetaHead';
import { CharacterButtons } from '../../libs/components/CharacterButtons';
import { CharacterProfile } from '../../libs/components/CharacterProfile';
import { LogTable } from '../../libs/components/LogTable';
import { CharacterTitle } from '../../libs/components/CharacterTitle';
import { theme } from '../../libs/styles';

const styleCss = {
  main: {
    marginTop: '85px',
  },
  root: {
    minHeight: '90vh',
    padding: 0,
  },
  left: {
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: '100%',
  },
  image: {
    margin: theme.spacing(2),
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '70vh',
    borderRadius: 10,
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column'
  },
};

const Character = ({ character }) => {
  const {
    main,
    name,
    realm,
    guild,
    guild_id,
    guild_rank,
    faction,
    logs,
  } = character;

  const portrait = characterPortrait(faction, main);
  const title = `CMNW: ${name.toLowerCase()}@${realm.toLowerCase()}`;

  return (
    <main>
      <Box sx={styleCss.main}>
        <MetaHead
          title={title}
          description={CHARACTER_PAGE.description}
          image={portrait}
          wowhead={false}
        />
        <Container maxWidth={false} sx={styleCss.root}>
          <Grid container>
            <Grid key={0} item xs={12} sm={12} md={4}>
              <Grid item xs={12} sm={10} sx={styleCss.left}>
                <Paper
                  elevation={6}
                  sx={styleCss.image}
                  style={{backgroundImage: `url(${portrait}`}}
                />
                <CharacterTitle
                  name={name}
                  realm={realm}
                  guild={guild}
                  guild_id={guild_id}
                  guild_rank={guild_rank}
                  faction={faction}
                />
              </Grid>
            </Grid>
            <Grid key={1} item xs={12} sm={12} md={1}>
              <CharacterButtons name={name} realm={realm}/>
            </Grid>
            <Grid key={2} item xs={12} sm={12} md={7}>
              <Box sx={styleCss.paper} style={{alignItems: 'left'}}>
                <CharacterProfile character={character}/>
              </Box>
            </Grid>
          </Grid>
          {(logs && logs.length) ? (
            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sx={styleCss.paper}>
                <LogTable logs={logs}/>
              </Grid>
            </Grid>
          ) : ('')}
        </Container>
      </Box>
    </main>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  const [ c, l ] = await Promise.all([
    fetch(encodeURI(`${DOMAINS.domain}/api/osint/character?_id=${id}`)),
    fetch(encodeURI(`${DOMAINS.domain}/api/osint/character/logs?_id=${id}`))
  ]);
  const character = await c.json() as characterResponse;
  const logs = await l.json() as logResponse[];
  Object.assign(character, { logs });
  if (!character) {
    return {
      notFound: true,
    }
  }
  return {
    props: { character },
  }
}

export default Character;
