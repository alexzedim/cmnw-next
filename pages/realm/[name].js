import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import {Container, Divider, Typography} from "@material-ui/core";
import MetaHead from '../../src/MetaHead'
import PopulationRealm from '../../src/PopulationRealm'


const useStyles = makeStyles(theme => ({
  divider: {
    margin: `${theme.spacing(2)}px auto`,
  },
  titleBlock: {
    padding: theme.spacing(10, 0, 5),
  },
  title: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    textTransform: 'uppercase'
  }
}));

function RealmsInfo({realms}) {
  const title = `${('name_locale' in realms) ? (realms.name_locale) : (realms.name)}`.toUpperCase();
  const classes = useStyles();
  return (
    <main>
      <MetaHead
        title={title}
        description={`Return information about ${realms.name}, such as id, name and population.`}
      />
      <div className={classes.titleBlock}>
        <Container maxWidth="lg">
          <Typography component="h1" variant="h2" align="center" color="secondary" className={classes.title} gutterBottom>
            {title}
          </Typography>
        </Container>
      </div>
      <Divider className={classes.divider}/>
      <Container>
        <PopulationRealm series={realms.population.characters_classes} x_axis={realms.population.timestamps} type={'characters_classes'}/>
      </Container>
      <Container>
        <PopulationRealm series={realms.population.characters_professions} x_axis={realms.population.timestamps} type={'characters_professions'}/>
      </Container>
    </main>
  )
}

export async function getServerSideProps({query}) {
  const {name} = query;
  const gql = `query Realms($name: String!) {
    realms(name: $name, limit: 1) {
      _id
      name
      name_locale
      region
      category
      locale
      connected_realm_id
      connected_realm
      ticker
      auctions
      valuations
      golds
      population_status
      population {
        characters_total
        characters_active
        characters_active_alliance
        characters_active_horde
        characters_active_max_level
        characters_guild_members
        characters_guildless
        characters_classes {
          _id
          value
        }
        characters_professions {
          _id
          value
        }
        characters_covenants {
          _id
          value
        }
        players_unique
        players_active_unique
        guilds_total
        guilds_alliance
        guilds_horde
        timestamps
      }
    }
  }`
  const {data: {realms}} = await fetch(`http://${process.env.api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: gql,
      variables: {name},
    })
  }).then(res => res.json())
  return {props: {realms: realms[0]}}
}

export default RealmsInfo
