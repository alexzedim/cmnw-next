import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import OSINT_Logs from '../../src/OsintLogs'
import CharacterProfile from '../../src/CharacterProfile'
import CharacterButtons from '../../src/CharacterButtons'
import Link from '../../src/Link'
import MetaHead from '../../src/MetaHead'
import {Container, Divider, Grid, Typography} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
  root: {
    height: '93vh',
    padding: 0,
  },
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '93vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column'
  },
  hr: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    textTransform: 'uppercase'
  }
}));

function CharacterPage({character}) {

  let render_url = 'https://conglomerat.group/logo2.svg'

  const {
    media,
    name,
    realm,
    guild,
    faction,
    logs
  } = character;

  const title = `${name}@${realm.name}`

  if (media) {
    ({render_url} = media);
  } else {
    if (faction === 'Horde') {
      render_url = 'https://conglomerat.group/horde.png'
    }
    if (faction === 'Alliance') {
      render_url = 'https://conglomerat.group/alliance.png'
    }
  }

  const classes = useStyles();

  return (
    <main>
      <MetaHead
        title={title}
        description={"CHARACTER — Provides a necessary information about certain game character across OSINT-DB"}
        image={render_url}
      />
      <Container maxWidth={false} className={classes.root}>
        <Grid container>
          <Grid key={0} item xs={12} sm={5} md={5} className={classes.image}
                style={{backgroundImage: `url(${render_url}`}}/>
          <Grid key={1} item xs={12} sm={7} md={7} elevation={6}>
            <div className={classes.paper} style={{alignItems: 'left'}}>
              <Grid>
                <Typography variant="h3" component="h3" color="textPrimary" className={classes.title}>
                  {name}
                </Typography>
                {(guild && realm.slug && guild.slug) ? (
                  <Typography variant="h4" component="h4" color="textPrimary" className={classes.title}>
                    #<Link href={`/guild/${guild.slug}@${realm.slug}`} color="textPrimary" underline="hover">{guild.name}</Link>
                    <React.Fragment>
                      {() => {
                        if ('rank' in guild) {
                          if (parseInt(guild.rank) === 0) return (` // GM`)
                          if (parseInt(guild.rank) > 0 && parseInt(guild.rank) < 13) return (` // R${guild.rank}`)
                        }
                      }}
                    </React.Fragment>
                  </Typography>
                ) : ('')}
                <Typography variant="h4" component="h4" color="textPrimary" className={classes.title}>
                  @{realm.name}
                </Typography>
                <CharacterButtons name={name} realm={realm.slug}/>
              </Grid>
              <Divider light className={classes.hr}/>
              <CharacterProfile character={character}/>
            </div>
          </Grid>
        </Grid>
        {(logs && logs.length) ? (
          <Grid container alignItems="center" justify="center">
            <Grid item xs={12} className={classes.paper}>
              <OSINT_Logs data={logs} pageSize={5}/>
            </Grid>
          </Grid>
        ) : ('')}
      </Container>
    </main>
  )
}

export async function getServerSideProps({query}) {
  const {id} = query;
  const gql = `query Character($id: ID!) {
        character(id: $id) {
            _id
            id
            name
            realm {
              _id
              name
              slug
            }
            guild {
              name
              slug
              rank
            }
            ilvl {
              eq
              avg
            }
            hash {
              a
              b
            }
            race
            character_class
            spec
            gender
            faction
            level
            lastModified
            media {
              avatar_url
              bust_url
              render_url
            }
            createdBy
            createdAt
            updatedBy
            updatedAt
            logs {
              type
              original_value
              new_value
              message
              action
              before
              after
            }
            covenant {
              chosen_covenant
              renown_level
            }
        }      
    }`
  const {data: {character}} = await fetch(`http://${process.env.api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: gql,
      variables: {id},
    })
  }).then(res => res.json())
  return {props: {character}}
}

export default CharacterPage
