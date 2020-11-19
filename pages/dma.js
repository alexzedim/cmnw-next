import React from "react";
import { Formik, Form, Field } from 'formik';
import Router from 'next/router'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Autocomplete } from "material-ui-formik-components/Autocomplete";
import MetaHead from '../src/MetaHead'
import { Button, Container, Grid, makeStyles, MenuItem, TextField, Typography } from "@material-ui/core";
import { dma_commands, realms } from "../src/Interfaces";

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

export default function Dma () {
    const classes = useStyles();
    const [formState, setFormState] = React.useState({
        userRoles: []
    });

    const handleFieldChange = event => {
        console.log(event);
        event.persist();
        setFormState(formState => ({
            ...formState,
            [event.target.name]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value
        }));
    };

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
                            realm: [{ label: 'Гордунни', value: 'gordunni' }],
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            await setSubmitting(false);
                            let query = '';
                            if (values.command === 'item') {
                                query += `${values.item}@${values.realm.value}`
                            }
                            //await Router.push('/' + values.command + '/' + query);
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
                                            {dma_commands.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    {values.command === "item" && (
                                        <React.Fragment>
                                            <Grid item xs={3}>
                                                <TextField
                                                    type="text"
                                                    name="item"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.item}
                                                    fullWidth id="outlined-basic"
                                                    label="Item Name"
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
                                                <TextField
                                                    classes={{ root: classes.dropdown }}
                                                    requiered="true"
                                                    select
                                                    name="userRoles"
                                                    id="userRoles"
                                                    variant="outlined"
                                                    label="Realms"
                                                    SelectProps={{
                                                        multiple: true,
                                                        value: formState.userRoles,
                                                        onChange: handleFieldChange
                                                    }}
                                                >
                                                    {realms.map((option) => (
                                                        <MenuItem key={option.label} value={option.label}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    {values.command === "xrs" && (
                                        <React.Fragment>
                                            <Grid item xs={7}>
                                                <TextField
                                                    type="text"
                                                    name="item"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.item}
                                                    fullWidth id="outlined-basic"
                                                    label="Item Name"
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
