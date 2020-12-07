import React from "react";
import Router from 'next/router'
import MetaHead from '../src/MetaHead'
import {Field, Form, Formik} from 'formik';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {Button, Container, Grid, makeStyles, MenuItem, Typography} from "@material-ui/core";
import MuiTextField from '@material-ui/core/TextField';
import {TextField} from 'formik-material-ui';
import {dma_commands, realms} from "../src/Interfaces";
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
              item: 'FLASK.POWER',
              realm: { value: "gordunni", label: "Гордунни" },
              hubs: [{ value: "gordunni", label: "Гордунни" }]
            }}
            onSubmit={async (values, {setSubmitting}) => {
              await setSubmitting(false);
              let realm_query;
              if (values.command === 'item') {
                realm_query = values.realm.value
                await Router.push('/item/' + values.item + '@' + realm_query);
              } else if (values.command === 'xrs') {
                realm_query = values.hubs.map(({value}) => value).join(';');
                await Router.push('/item/' + values.item + '@' + realm_query);
              } else if (values.command === 'group') {
                realm_query = values.hubs.map(({value}) => value).join(';');
                await Router.push('/group_items/' + values.item + '@' + realm_query);
              }
            }}
          >
            {({
                touched,
                errors,
                values,
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
                          component={TextField}
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
                          component={TextField}
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
                  {values.command === "group" && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Field
                          component={TextField}
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
        <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
          Any language, every item, many realms, much evaluation, very wow!<br/>
          Dont know how to start? Feels a bit confused? <Link href={`/help/en-dma-manual`} color="secondary" underline="hover">Take a look at our guideline</Link> или же <Link href={`/help/ru-dma-manual`} color="secondary" underline="hover">прочтите инструкцию на русском</Link>
        </Typography>
      </Grid>
    </main>
  )
}
