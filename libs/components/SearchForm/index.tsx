import  { useRouter } from 'next/router'
import React, { FC } from 'react';
import { COMMANDS, REALMS, HASH } from '../../constants';
import AtSign from '../AtSign';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Commands, searchValidation } from '../../types';
import { initialValues } from '../../utils';
import { Formik, Form } from 'formik';
import { TextField, Autocomplete, Button, Grid, Box, Select, MenuItem } from '@mui/material';
import { SearchInput } from '../../types/data/searchInput';

const itemCss = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '20em',
  },
}

export const SearchForm: FC = () => {
  const router = useRouter();

  return (
    <div>
      <Formik
        initialValues={initialValues()}
        validationSchema={searchValidation}
        onSubmit={async (values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Select
                    labelId="command"
                    id="command"
                    value={"character"}
                    variant="outlined"
                    fullWidth
                    label="Command"
                  >
                    {COMMANDS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Autocomplete
                    id="realm"
                    options={REALMS}
                    autoHighlight
                    getOptionLabel={(option: SearchInput) => option.label}
                    sx={itemCss.item}
                    renderInput={(params) => <TextField {...params} label="REALM" />}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    size="large"
                    disabled={isSubmitting}
                    type="submit"
                    sx={itemCss.item}
                  >
                    <ArrowForwardOutlinedIcon/>
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
