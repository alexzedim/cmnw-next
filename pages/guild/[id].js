import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import {Container, Divider, Grid, Typography,} from "@material-ui/core";
import CharactersTable from "../../src/CharactersTable";
import OSINT_Logs from "../../src/OsintLogs";
import MetaHead from '../../src/MetaHead'

const useStyles = makeStyles(theme => ({
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
}));

function GuildPage({guild}) {

  const {
    name,
    realm,
    members,
    created_timestamp,
    achievement_points,
    member_count,
    logs
  } = guild

  const title = `${name}@${realm.name}`

  const classes = useStyles();

  return (
    <main>
      <MetaHead
        title={title}
        description={"GUILD — return all available information about selected guild, like members and OSINT logs."}
      />
      <Container maxWidth={false}>
        <Container maxWidth={false}>
          <div className={classes.paper}>
            <Grid container direction="column" justify="center" alignItems="center">
              <Typography variant="h3" component="h3" color="textPrimary" className={classes.title}>
                #{name}
              </Typography>
              <Typography variant="h4" component="h4" color="textPrimary" className={classes.title}>
                @{realm.name}
              </Typography>
              <Typography variant="overline">
                Created: {new Date(created_timestamp).toLocaleString('en-GB')}
              </Typography>
              <Typography variant="overline">
                Members: {member_count} Achievements: {achievement_points}
              </Typography>
            </Grid>
          </div>
        </Container>
        <Divider className={classes.divider}/>
        <Container maxWidth={false}>
          <CharactersTable data={members} members={true}/>
          <Divider className={classes.divider}/>
          <OSINT_Logs data={logs} pageSize={15}/>
          <Divider className={classes.divider}/>
        </Container>
      </Container>
    </main>
  )
}

export async function getServerSideProps({query}) {
  const {id} = query;
  const gql = `query Guild($id: ID!) {
      guild(id: $id) {
        _id
        id
        name
        realm {
          _id
          slug
          name
        }
        faction
        members {
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
          }
          hash {
            a
            b
            c
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
        }
        achievement_points
        created_timestamp
        lastModified
        createdBy
        updatedBy
        isWatched
        logs {
          type
          original_value
          new_value
          message
          action
          before
          after
        }
        createdAt
        updatedAt
      }   
    }`
  const {data: {guild}} = await fetch(`http://${process.env.api}`, {
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
  return {props: {guild}}
}

export default GuildPage
