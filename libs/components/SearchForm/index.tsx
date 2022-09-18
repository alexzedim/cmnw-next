import { object, string, array } from 'yup';
import Router, { useRouter } from 'next/router'
import MuiTextField from '@material-ui/core/TextField';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { Autocomplete } from 'formik-material-ui-lab';
import React, { FC } from 'react';
import { Button, Grid, makeStyles, MenuItem } from '@material-ui/core';
import { COMMANDS, REALMS, HASH } from '../../constants';
import AtSign from '../AtSign/AtSign';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Commands, HashType, initialValuesSearch } from '../../types';
import { submitSearchForm } from '../../utils';

const useStyles = makeStyles(() => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '20em',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const validation = object().shape({
  character: string()
    .min(3, 'Between 3 and 13 symbols!')
    .max(13, 'Between 3 and 13 symbols!')
    .required('Required'),
  guild: string()
    .min(3, 'Between 3 and 25 symbols!')
    .max(25, 'Between 3 and 25 symbols!')
    .required('Required'),
  hash: string()
    .min(13, 'Between 14 and 20 symbols!')
    .max(20, 'Between 14 and 20 symbols!')
    .required('Required'),
  realm: object({
    label: string().default('Гордунни').required(),
    value: string().default('gordunni').required(),
  }),
  item: string().required('Required'),
  hubs: array().min(1),
});

const initialValues = (command?: string): initialValuesSearch => ({
  command: command ? command : 'character',
  realm: { label: 'Гордунни', value: 'gordunni' },
  character: 'Блюрателла',
  guild: 'Депортация',
  type: HashType.A,
  hash: 'A99BECEC48B29FF',
  item: 'FLASK.POWER',
  hubs: [{ value: "gordunni", label: "Гордунни" }],
  id: '0'
})

export const SearchForm: FC = () => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Formik
      initialValues={initialValues(router.query.command as string)}
      validationSchema={validation}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        const route = submitSearchForm(values);
        Router.push(route);
      }}
    >
      {({ values, touched, errors}) => (
        <Form>
          <Grid container spacing={5} alignItems={'center'} justifyContent={"center"}>
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
                  {COMMANDS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </div>
            </Grid>
            {values.command === Commands.item && (
              <React.Fragment>
                <Grid item xs={12} md={3}>
                  <div className={classes.item}>
                    <Field
                      component={TextField}
                      name="item"
                      type="text"
                      label="Item"
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </Grid>
                <AtSign/>
                <Grid item xs={12} md={3}>
                  <div className={classes.item}>
                    <Field
                      name="hubs"
                      multiple
                      component={Autocomplete}
                      options={REALMS}
                      getOptionLabel={(option) => option.label}
                      fullWidth
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          error={touched['hubs'] && !!errors['hubs']}
                          label="Realms"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </Grid>
              </React.Fragment>
            )}
            {values.command === Commands.characters && (
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
                      component={Autocomplete}
                      fullWidth
                      options={REALMS}
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
            {values.command === Commands.guilds && (
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
                      options={REALMS}
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
            {values.command === Commands.hash && (
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
                      {HASH.map((option) => (
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
            <Grid item xs={12} md={1}>
              <div className={classes.button}>
                <Button type="submit" variant="outlined" color="secondary" size="large">
                  <ArrowForwardOutlinedIcon/>
                </Button>
              </div>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}
