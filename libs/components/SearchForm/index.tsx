import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react';
import { COMMANDS, REALMS, HASH } from '../../constants';
import AtSign from '../AtSign';
import { ArrowForward } from '@mui/icons-material';
import { Commands, initialValuesSearch, searchValidation } from '../../types';
import { initialValues } from '../../utils';
import { Formik, Form } from 'formik';
import { SearchInput } from '../../types/data/searchInput';
import { TextField, Autocomplete, Button, Grid, Box, MenuItem } from '@mui/material';
import { createRoutingMap } from '../../utils/createRoutingMap';

const styleCss = {
  box: {
    flexGrow: 1
  },
  grid: {
    width: '50vw',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

export const SearchForm: FC = () => {
  const router = useRouter();

  return (
    <div>
      <Formik<initialValuesSearch>
        initialValues={initialValues()}
        validationSchema={searchValidation}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          const routingMap = createRoutingMap(values);
          await router.push(routingMap.get(values.command as Commands));
        }}
      >
        {({ isSubmitting, values, handleChange, setFieldValue }) => (
          <Form>
            <Box sx={styleCss.box}>
              <Grid
                container
                direction='row'
                spacing={2}
                alignItems={'center'}
                justifyContent={'center'}
                sx={styleCss.grid}
              >
                <Grid item xs={12} md>
                  <TextField
                    id="command"
                    select
                    name="command"
                    label="Command"
                    fullWidth
                    value={values.command}
                    onChange={handleChange}
                    sx={styleCss.item}
                  >
                    {COMMANDS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {values.command === Commands.characters && (
                  <Fragment>
                    <Grid item xs={12} md>
                      <TextField
                        id="character"
                        name="character"
                        label="Character"
                        variant="outlined"
                        fullWidth
                        value={values.character}
                        onChange={handleChange}
                        sx={styleCss.item}
                      />
                    </Grid>
                    <AtSign/>
                    <Grid item xs={12} md>
                      <Autocomplete
                        id="realm"
                        options={REALMS}
                        autoHighlight
                        defaultValue={values.realm}
                        value={values.realm}
                        isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                        getOptionLabel={(option: SearchInput) => option.label}
                        onChange={(e, value) => setFieldValue('realm', value)}
                        sx={styleCss.item}
                        renderInput={(params) => <TextField {...params} label="Realm" />}
                      />
                    </Grid>
                  </Fragment>
                )}
                {values.command === Commands.guilds && (
                  <Fragment>
                    <Grid item xs={12} md>
                      <TextField
                        id="guild"
                        name="guild"
                        label="Guild"
                        variant="outlined"
                        fullWidth
                        value={values.guild}
                        onChange={handleChange}
                        sx={styleCss.item}
                      />
                    </Grid>
                    <AtSign/>
                    <Grid item xs={12} md>
                      <Autocomplete
                        id="realm"
                        options={REALMS}
                        autoHighlight
                        defaultValue={values.realm}
                        value={values.realm}
                        isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                        getOptionLabel={(option: SearchInput) => option.label}
                        onChange={(e, value) => setFieldValue('realm', value)}
                        sx={styleCss.item}
                        renderInput={(params) => <TextField {...params} label="Realm" />}
                      />
                    </Grid>
                  </Fragment>
                )}
                {values.command === Commands.hash && (
                  <Fragment>
                    <Grid item xs={12} md={2}>
                      <TextField
                        id="type"
                        select
                        name="type"
                        label="Type"
                        fullWidth
                        value={values.type}
                        onChange={handleChange}
                        sx={styleCss.item}
                      >
                        {HASH.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <AtSign/>
                    <Grid item xs={12} md>
                      <TextField
                        id="hash"
                        name="hash"
                        label="Hash"
                        variant="outlined"
                        fullWidth
                        value={values.hash}
                        onChange={handleChange}
                        sx={styleCss.item}
                      />
                    </Grid>
                  </Fragment>
                )}
                {values.command === Commands.commdty && (
                  <Fragment>
                    <Grid item xs={12} md>
                      <TextField
                        id="commdty"
                        name="commdty"
                        label="Commdty"
                        variant="outlined"
                        fullWidth
                        value={values.commdty}
                        onChange={handleChange}
                        sx={styleCss.item}
                      />
                    </Grid>
                    <AtSign/>
                    <Grid item xs={12} md>
                      <Autocomplete
                        id="realm"
                        options={REALMS}
                        autoHighlight
                        defaultValue={values.realm}
                        value={values.realm}
                        isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                        getOptionLabel={(option: SearchInput) => option.label}
                        onChange={(e, value) => setFieldValue('realm', value)}
                        sx={styleCss.item}
                        renderInput={(params) => <TextField {...params} label="Realm" />}
                      />
                    </Grid>
                  </Fragment>
                )}
                {values.command === Commands.gold && (
                  <Fragment>
                    <AtSign/>
                    <Grid item xs={12} md>
                      <Autocomplete
                        id="realm"
                        options={REALMS}
                        autoHighlight
                        defaultValue={values.realm}
                        value={values.realm}
                        isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                        getOptionLabel={(option: SearchInput) => option.label}
                        onChange={(e, value) => setFieldValue('realm', value)}
                        sx={styleCss.item}
                        renderInput={(params) => <TextField {...params} label="Realm" />}
                      />
                    </Grid>
                  </Fragment>
                )}
                <Grid item xs={12} md={1}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    size="large"
                    disabled={isSubmitting}
                    type="submit"
                    sx={styleCss.button}
                  >
                    <ArrowForward/>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  )
}
