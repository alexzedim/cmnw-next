import { useRouter } from 'next/router'
import MuiTextField from '@material-ui/core/TextField';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { Autocomplete } from 'formik-material-ui-lab';
import React, { FC } from 'react';
import { COMMANDS, REALMS, HASH } from '../../constants';
import AtSign from '../AtSign';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Commands, searchValidation } from '../../types';
import { initialValues } from '../../utils';
import Grid from '@mui/material/Unstable_Grid2';
import { makeStyles } from '@mui/styles';
import { Button, MenuItem } from '@mui/material';


const useStyles = makeStyles((theme) => ({
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

export const SearchForm: FC = () => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialValues()}
      validationSchema={searchValidation}
      onSubmit={
        async (values, formikHelpers) => {
          console.log(values, formikHelpers);
          formikHelpers.setSubmitting(true);
          // await submitSearchForm(values);
        }
      }
    >
      {({ values, touched, errors}) => (
        <Form>
          <Grid container spacing={5} alignItems={'center'} justifyContent={"center"}>
            <Grid xs={12} md={3}>
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
            {values.command === Commands.commdty && (
              <React.Fragment>
                <Grid xs={12} md={7}>
                  <div className={classes.item}>
                    <Field
                      component={TextField}
                      name="commdty"
                      type="text"
                      label="Commdty"
                      variant="outlined"
                      fullWidth
                    />
                  </div>
                </Grid>
              </React.Fragment>
            )}
            {values.command === Commands.characters && (
              <React.Fragment>
                <Grid xs={12} md={3}>
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
                <Grid xs={12} md={3}>
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
                <Grid xs={12} md={3}>
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
                <Grid xs={12} md={3}>
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
                <Grid xs={12} md={3}>
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
                <Grid xs={12} md={3}>
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
            <Grid xs={12} md={1}>
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
