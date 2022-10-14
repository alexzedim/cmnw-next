import  { useRouter } from 'next/router'
import React, { FC } from 'react';
import { COMMANDS, REALMS, HASH } from '../../constants';
import AtSign from '../AtSign';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Commands, searchValidation } from '../../types';
import { initialValues } from '../../utils';
import { Formik, Field, Form } from 'formik';
import { TextField, Autocomplete, Button } from '@mui/material';



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
            <Autocomplete
              id="realm"
              options={REALMS.sort((a, b) => -b.label.localeCompare(a.label))}
              groupBy={(option) => option.label}
              getOptionLabel={(option) => option.label}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="REALM" />}
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
