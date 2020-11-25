import React from "react";
import {Field, Form, Formik} from 'formik';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import MetaHead from '../src/MetaHead'
import {Button, Container, Grid, makeStyles, MenuItem, Typography} from "@material-ui/core";
import MuiTextField from '@material-ui/core/TextField';
import {fieldToTextField, TextField} from 'formik-material-ui';
import {dma_commands, realms} from "../src/Interfaces";
import {Autocomplete} from 'formik-material-ui-lab';
import Router from 'next/router'

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
  dropdown: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
  },
}));

function UpperCasingTextField(props) {
  const {
    form: {setFieldValue},
    field: {name},
  } = props;
  const onChange = React.useCallback(
    (event) => {
      const {value} = event.target;
      setFieldValue(name, value ? value.toUpperCase() : '');
    },
    [setFieldValue, name]
  );
  return <MuiTextField {...fieldToTextField(props)} onChange={onChange} />;
}

export default function DMA() {
  const classes = useStyles();

  return (
    <main>
      <MetaHead
        title={"Conglomerat: DMA"}
        description={"Direct Market Access"}
        image={"https://conglomerat.group/logo.png"}
      />
      <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
        <Container className={classes.searchbar}>
          <Formik
            initialValues={{
              command: 'item',
              item: 'WOWTOKEN',
              realm: { value: "gordunni", label: "Гордунни" },
              hubs: [{ value: "gordunni", label: "Гордунни" }],
            }}
            onSubmit={async (values, {setSubmitting}) => {
              await setSubmitting(false);
              if (values.item === 'item') {
                await Router.push('/item/' + values.item + '@' + values.realm.value);
              } else {
                console.log(values.hubs.map(({value}) => value))
                await Router.push('/item/' + values.item + '@' + values.hubs.map(({value}) => value).join(';'));
              }
            }}
          >
            {({
                submitForm,
                isSubmitting,
                touched,
                errors,
                values,
                handleChange,
                handleBlur,
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
                      {dma_commands.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  {values.command === "item" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Field
                          component={UpperCasingTextField}
                          name="item"
                          type="text"
                          label="Item Name"
                          variant="outlined"
                          style={{width: 300}}
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
                  {values.command === "xrs" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Field
                          component={UpperCasingTextField}
                          name="item"
                          type="text"
                          label="Item Name"
                          variant="outlined"
                          style={{width: 300}}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                          @
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          name="hubs"
                          multiple
                          component={Autocomplete}
                          options={realms}
                          getOptionLabel={(option) => option.label}
                          style={{width: 300}}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched['hubs'] && !!errors['hubs']}
                              label="Realms"
                              variant="outlined"
                            />
                          )}
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
      </Grid>
    </main>
  )
}
