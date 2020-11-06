import React from "react";
import { Formik, Form, Field } from 'formik';
import Router from 'next/router'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Autocomplete } from "material-ui-formik-components/Autocomplete";
import MetaHead from '../src/MetaHead'
import { Button, Container, Grid, makeStyles, MenuItem, TextField, Typography } from "@material-ui/core";
import { osint_commands, realms, type } from "../src/Interfaces";

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

export default function Osint () {
    const classes = useStyles();
    return (
        <main>
            <MetaHead
                title={"Conglomerat: OSINT"}
                description={"Intel"}
                image={"https://conglomerat.group/logo.png"}
            />
            <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
                <Container className={classes.searchbar}>
                    <Formik
                        initialValues={{
                            command: 'character',
                            realm: { label: 'Гордунни', value: 'gordunni' },
                            character: 'Блюрателла',
                            guild: 'Депортация',
                            type: 'a',
                            hash: '0',
                            id: '0'
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
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
                        {({
                              values,
                              handleChange,
                              handleBlur,
                              /* and other goodies */
                          }) => (
                            <Form className={classes.searchField}>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="center">
                                    <Grid item xs={3}>
                                        <TextField
                                            name="command"
                                            select
                                            label="Select command"
                                            className={classes.dropdown}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.command}
                                            variant="outlined"
                                        >
                                            {osint_commands.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    {values.command === "character" && (
                                        <React.Fragment>
                                            <Grid item xs={3}>
                                                <TextField
                                                    type="text"
                                                    name="character"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.character}
                                                    fullWidth id="outlined-basic"
                                                    label="Character"
                                                    className={classes.search}
                                                    variant="outlined"
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
                                                    required
                                                    options={realms}
                                                    component={Autocomplete}
                                                    className={classes.dropdown}
                                                    textFieldProps={{
                                                        label: "Realm",
                                                        variant: "outlined",
                                                        margin: 'none',
                                                    }}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    {values.command === "guild" && (
                                        <React.Fragment>
                                            <Grid item xs={3}>
                                                <TextField
                                                    type="text"
                                                    name="guild"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.guild}
                                                    fullWidth id="outlined-basic"
                                                    label="Guild"
                                                    className={classes.search}
                                                    variant="outlined"
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
                                                    required
                                                    options={realms}
                                                    component={Autocomplete}
                                                    className={classes.dropdown}
                                                    textFieldProps={{
                                                        label: "Realm",
                                                        variant: "outlined",
                                                        margin: 'none',
                                                    }}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    {values.command === "hash" && (
                                        <React.Fragment>
                                            <Grid item xs={3}>
                                                <TextField
                                                    name="type"
                                                    select
                                                    label="Type"
                                                    className={classes.dropdown}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.type}
                                                    variant="outlined"
                                                >
                                                    {type.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                                                    @
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    type="text"
                                                    name="match"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.hash}
                                                    fullWidth id="outlined-basic"
                                                    label="Hash"
                                                    className={classes.search}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    {values.command === "file" && (
                                        <React.Fragment>
                                            <Grid item xs={7}>
                                                <TextField
                                                    type="text"
                                                    name="ID"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.id}
                                                    fullWidth id="outlined-basic"
                                                    label="File ID"
                                                    className={classes.search}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    <Grid item xs={1}>
                                        <Button type="submit" variant="outlined" color="secondary" size="large">
                                            <ArrowForwardOutlinedIcon />
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
