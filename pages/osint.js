import React from "react";
import Router from 'next/router'
import MetaHead from '../src/MetaHead'
import {Field, Form, Formik} from 'formik';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {Button, Container, Grid, makeStyles, MenuItem, Typography} from "@material-ui/core";
import MuiTextField from '@material-ui/core/TextField';
import {TextField} from 'formik-material-ui';
import {osint_commands, realms, type} from "../src/Interfaces";
import {Autocomplete} from 'formik-material-ui-lab';
import Link from "../src/Link";

const useStyles = makeStyles(theme => ({
  root: {
    height: '93vh',
  },
  searchField: {
    margin: theme.spacing(2, 0, 2),
  },
  searchbar: {
    marginRight: "auto",
    marginLeft: "auto",
  },
  search: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function Osint() {
  const classes = useStyles();
  return (
    <main>
      <MetaHead
        title={"Conglomerat: OSINT"}
        description={"Open Source Intelligence"}
        image={"https://conglomerat.group/logo.png"}
      />
      <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
        <Container className={classes.searchbar}>
          <Formik
            initialValues={{
              command: 'character',
              realm: {label: 'Гордунни', value: 'gordunni'},
              character: 'Блюрателла',
              guild: 'Депортация',
              type: 'a',
              hash: '0',
              id: '0'
            }}
            onSubmit={async (values, {setSubmitting}) => {
              await setSubmitting(false);
              let query = '';
              if (values.command === 'character') {
                query += `${values.character}@${values.realm.value}`
              } else if (values.command === 'guild') {
                query += `${values.guild}@${values.realm.value}`
              } else if (values.command === 'hash') {
                query += `${values.type}@${values.hash}`
              } else if (values.command === 'file') {
                query += `${values.id}`
              }
              await Router.push('/' + values.command + '/' + query);
            }}
          >
            {({
                values,
                touched,
                errors
              }) => (
              <Form className={classes.searchField}>
                <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                  <Grid item xs={3}>
                    <Field
                      component={TextField}
                      type="text"
                      name="command"
                      label="Select command"
                      select
                      variant="outlined"
                      style={{width: 300}}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {osint_commands.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  {values.command === "character" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Field
                          component={TextField}
                          name="character"
                          type="text"
                          label="Character"
                          variant="outlined"
                          style={{width: 300}}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          name="realm"
                          component={Autocomplete}
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          style={{width: 300}}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['realm'] && !!errors['realm']}
                              label="Realms"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                  {values.command === "guild" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Field
                          component={TextField}
                          name="guild"
                          type="text"
                          label="Guild"
                          variant="outlined"
                          style={{width: 300}}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          name="realm"
                          component={Autocomplete}
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          style={{width: 300}}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['realm'] && !!errors['realm']}
                              label="Realms"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                  {values.command === "hash" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Field
                          component={TextField}
                          type="text"
                          name="type"
                          label="Type"
                          select
                          variant="outlined"
                          style={{width: 300}}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        >
                          {type.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          component={TextField}
                          name="hash"
                          type="text"
                          label="Hash"
                          variant="outlined"
                          style={{width: 300}}
                          fullWidth
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                  {values.command === "file" && (
                    <React.Fragment>
                      <Grid item xs={7}>
                        <Field
                          component={TextField}
                          name="id"
                          type="text"
                          label="File ID"
                          variant="outlined"
                          style={{width: 300}}
                          fullWidth
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                  <Grid item xs={1}>
                    <Button type="submit" variant="outlined" color="secondary" size="large">
                      <ArrowForwardOutlinedIcon/>
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Container>
        <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
          He-hey, welcome! Be out guest. Check out <Link href={`/help/en-osint-manual`} color="secondary" underline="hover">full manual here</Link> или же <Link href={`/help/ru-osint-manual`} color="secondary" underline="hover">прочтите инструкцию на русском.</Link>
        </Typography>
      </Grid>
    </main>
  )
}
