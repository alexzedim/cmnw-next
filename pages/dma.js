import React from "react";
import Router from 'next/router'
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';

import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import {Button, Container, Grid, makeStyles, MenuItem, Typography} from "@material-ui/core";
import MuiTextField from '@material-ui/core/TextField';
import {TextField} from 'formik-material-ui';
import {Autocomplete} from 'formik-material-ui-lab';

import Link from "../src/Link";
import AtSign from "../src/AtSign";
import MetaHead from '../src/MetaHead'
import {dma_commands, expansions, professions, realms} from "../src/Interfaces";

const useStyles = makeStyles(() => ({
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
  }
}));

const validation = Yup.object().shape({
  item: Yup.mixed().required('Required'),
  hubs: Yup.mixed().required('Required'),
});

export default function Dma() {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <MetaHead
        title={"Conglomerat: DMA"}
        description={"Direct Market Access"}
        image={"https://conglomerat.group/logo.png"}
      />
      <Container>
        <Formik
          initialValues={{
            command: 'item',
            item: 'FLASK.POWER',
            hubs: [{ value: "gordunni", label: "Гордунни" }],
            profession: "alch",
            expansion: "shdw",
          }}
          validationSchema={validation}
          onSubmit={async (values, {setSubmitting}) => {
            await setSubmitting(false);
            const realm_query = values.hubs.map(({value}) => value).join(';');
            if (values.command === 'item') {
              await Router.push('/item/' + values.item + '@' + realm_query);
            } else if (values.command === 'profession') {
              await Router.push('/profession/' + values.expansion + ':' + values.profession + '@' + realm_query);
            }
          }}
        >
          {({touched, errors, values,}) => (
            <Form>
              <Grid container spacing={2} alignItems={'center'} justify={"center"}>
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
                      {dma_commands.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </div>
                </Grid>
                {values.command === "item" && (
                  <React.Fragment>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          name="item"
                          type="text"
                          label="Item Name"
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
                          options={realms}
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
                {values.command === "profession" && (
                  <React.Fragment>
                    <Grid item xs={12} md={2}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          type="text"
                          name="expansion"
                          label="Expansion"
                          select
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        >
                          {expansions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <div className={classes.item}>
                        <Field
                          component={TextField}
                          type="text"
                          name="profession"
                          label="Profession"
                          select
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        >
                          {professions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <div className={classes.item}>
                        <Field
                          name="hubs"
                          multiple
                          component={Autocomplete}
                          options={realms}
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
            Any language, every item, many realms, much evaluation, very wow!<br/>
            Dont know how to start? Feels a bit confused? <Link href={`/help/en-dma-manual`} color="secondary" underline="true">Take a look at our guideline</Link> или же <Link href={`/help/ru-dma-manual`} color="secondary" underline="true">прочтите инструкцию на русском</Link>
          </Typography>
        </Grid>
      </Container>
    </section>
  )
}
