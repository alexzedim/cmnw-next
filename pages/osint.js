import React from "react";
import Router from 'next/router'
import MetaHead from '../src/MetaHead'
import {Field, Form, Formik} from 'formik';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {Button, Grid, makeStyles, MenuItem, Typography, Container, Hidden} from "@material-ui/core";
import MuiTextField from '@material-ui/core/TextField';
import {TextField} from 'formik-material-ui';
import {osint_commands, realms, type} from "../src/Interfaces";
import {Autocomplete} from 'formik-material-ui-lab';
import Link from "../src/Link";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
  },
  container: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(30),
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  }
}));

export default function Osint() {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <MetaHead
        title={"Conglomerat: OSINT"}
        description={"Open Source Intelligence"}
        image={"https://conglomerat.group/logo.png"}
      />
      <Container className={classes.container}>
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
          {({values, touched, errors}) => (
            <Form>
              <Grid container spacing={5} alignItems={'center'} justify={"center"}>
                <Grid item xs={12} md={3}>
                  <div className={classes.item}>
                    <Field
                      component={TextField}
                      type="text"
                      name="command"
                      label="Select command"
                      select
                      variant="outlined"
                      style={{width: '100%'}}
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
                  </div>
                </Grid>
                {values.command === "character" && (
                  <React.Fragment>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          name="character"
                          type="text"
                          label="Character"
                          variant="outlined"
                          style={{width: '100%'}}
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <Hidden only="xs">
                    <Grid item xs={12} md={1}>
                      <div className={classes.item}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </div>
                    </Grid>
                    </Hidden>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          name="realm"
                          style={{width: '100%'}}
                          component={Autocomplete}
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['realm'] && !!errors['realm']}
                              label="Realms"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                    </Grid>
                  </React.Fragment>
                )}
                {values.command === "guild" && (
                  <React.Fragment>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          style={{width: '100%'}}
                          name="guild"
                          type="text"
                          label="Guild"
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <div className={classes.item}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          name="realm"
                          component={Autocomplete}
                          style={{width: '100%'}}
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['realm'] && !!errors['realm']}
                              label="Realms"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                    </Grid>
                  </React.Fragment>
                )}
                {values.command === "hash" && (
                  <React.Fragment>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          style={{width: '100%'}}
                          type="text"
                          name="type"
                          label="Type"
                          select
                          variant="outlined"
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
                      </div>
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <div className={classes.item}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          style={{width: '100%'}}
                          name="hash"
                          type="text"
                          label="Hash"
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                    </Grid>
                  </React.Fragment>
                )}
                {values.command === "file" && (
                  <React.Fragment>
                    <Grid item xs={12} md={9}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          style={{width: '100%'}}
                          name="id"
                          type="text"
                          label="File ID"
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                    </Grid>
                  </React.Fragment>
                )}
                <Grid item xs={12} md={1}>
                  <div className={classes.item}>
                    <Button type="submit" variant="outlined" color="secondary" size="large">
                      <ArrowForwardOutlinedIcon/>
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </section>
  )
}
