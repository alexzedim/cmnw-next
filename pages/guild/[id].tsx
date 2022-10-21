import { Container, Divider, Box } from '@mui/material';
import { guildResponse, logResponse, GUILD_PAGE, DOMAINS } from '../../libs';
import MetaHead from '../../libs/components/MetaHead';
import { LogTable } from '../../libs/components/LogTable';
import GuildTitle from '../../libs/components/GuildTitle';
import CharacterTable from '../../libs/components/CharacterTable';
import { theme } from '../../libs/styles';

const styleCss = {
  main: {
    marginTop: '85px',
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column'
  },
  divider: {
    margin: `${theme.spacing(2)}px auto`,
  },
  left: {
    paddingLeft: theme.spacing(3),
  },
  title: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    textTransform: 'uppercase'
  }
};

const Guild = ({ guild }) => {
  const {
    name,
    realm,
    members,
    faction,
    created_timestamp,
    achievement_points,
    member_count,
    logs,
  } = guild;

  return (
    <main>
      <Box sx={styleCss.main}>
        <MetaHead
          title={`${name}@${realm}`}
          description={GUILD_PAGE.description}
          wowhead={false}
        />
        <Container maxWidth={false}>
          <GuildTitle
            name={name}
            realm={realm}
            member_count={member_count}
            created_timestamp={created_timestamp}
            achievement_points={achievement_points}
            faction={faction}
          />
        </Container>
        <Divider sx={styleCss.divider}/>
        <Container maxWidth={false}>
          <CharacterTable characters={members} roster={true}/>
          <Divider sx={styleCss.divider}/>
          <LogTable logs={logs}/>
        </Container>
      </Box>
    </main>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  const [ g, l ] = await Promise.all([
    fetch(encodeURI(`${DOMAINS.domain}/api/osint/guild?_id=${id}`)),
    fetch(encodeURI(`${DOMAINS.domain}/api/osint/guild/logs?_id=${id}`))
  ]);
  const guild = await g.json() as guildResponse;
  const logs = await l.json() as logResponse[];
  Object.assign(guild, { logs });
  if (!guild) {
    return {
      notFound: true,
    }
  }
  return { props: { guild } }
}

export default Guild;
