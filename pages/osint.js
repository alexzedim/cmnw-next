import React from "react";
import Router from 'next/router'
import MetaHead from '../src/MetaHead'
import {Field, Form, Formik} from 'formik';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {Button, Grid, makeStyles, MenuItem, Typography, Container} from "@material-ui/core";
import MuiTextField from '@material-ui/core/TextField';
import {TextField} from 'formik-material-ui';
import {osint_commands, realms, type} from "../src/Interfaces";
import {Autocomplete} from 'formik-material-ui-lab';
import * as Yup from 'yup';
import Link from "../src/Link";
import AtSign from "../src/AtSign";

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  }
}));

const validation = Yup.object().shape({
  character: Yup.string()
    .min(3, 'Between 3 and 13 symbols!')
    .max(13, 'Between 3 and 13 symbols!')
    .required('Required'),
  guild: Yup.string()
    .min(3, 'Between 3 and 25 symbols!')
    .max(25, 'Between 3 and 25 symbols!')
    .required('Required'),
  hash: Yup.string()
    .min(5, 'Between 5 and 8 symbols!')
    .max(8, 'Between 5 and 8 symbols!')
    .required('Required'),
  realm: Yup.mixed().required('Required')
});

export default function Osint() {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <MetaHead
        title={"Conglomerat: OSINT"}
        description={"Open Source Intelligence"}
        image={"https://conglomerat.group/logo.png"}
      />
      <Container>
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
          validationSchema={validation}
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
                      label="Command"
                      select
                      variant="outlined"
                      fullWidth
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
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <AtSign/>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          name="realm"
                          fullWidth
                          component={Autocomplete}
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['realm'] && !!errors['realm']}
                              label="Realm"
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
                          name="guild"
                          type="text"
                          label="Guild"
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <AtSign/>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          name="realm"
                          component={Autocomplete}
                          fullWidth
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['realm'] && !!errors['realm']}
                              label="Realm"
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
                          fullWidth
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
                    <AtSign/>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
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
        <Grid container spacing={5} alignItems={'center'} justify={"center"}>
          <Typography variant="overline" align="center" style={{textTransform: 'uppercase', paddingTop: '25px'}}>
            He-hey, welcome! Be out guest. Check out <Link href={`/help/en-osint-manual`} color="secondary" underline="true">full manual here</Link> или же <Link href={`/help/ru-osint-manual`} color="secondary" underline="true">прочтите инструкцию на русском.</Link>
          </Typography>
        </Grid>
      </Container>
    </section>
  )
}
