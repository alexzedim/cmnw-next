import  { useRouter } from 'next/router'
import React, { FC } from 'react';
import { COMMANDS, REALMS, HASH } from '../../constants';
import AtSign from '../AtSign';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Commands, searchValidation } from '../../types';
import { initialValues } from '../../utils';
import { useFormik } from 'formik';
import { TextField, Autocomplete, Button } from '@mui/material';



export const SearchForm: FC = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: REALMS[0],
    validationSchema: searchValidation,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Autocomplete
          id="grouped-demo"
          options={REALMS.sort((a, b) => -b.label.localeCompare(a.label))}
          groupBy={(option) => option.label}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="REALM" />}
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}
