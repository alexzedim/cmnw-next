import React from "react";
import { Formik, Form, Field } from 'formik';
import Router from 'next/router'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { Autocomplete } from "material-ui-formik-components/Autocomplete";
import MetaHead from '../src/MetaHead'
import { commands, tenors, realmsinfo, type } from "../src/Interfaces";
import {
    Container, Grid,
    MenuItem, TextField, makeStyles,
    Typography, Button
} from "@material-ui/core";

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

function Index ({realms}) {
    const classes = useStyles();
    return (
        <main>
            <MetaHead
                title={"Conglomerat"}
                description={"World of Warcraft: In-game decision-making superiority starts here"}
                image={"https://conglomerat.group/logo.png"}
            />
            <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
                <Container className={classes.searchbar}>
                    <Formik
                        initialValues={{
                            command: 'item',
                            item: 'ZNTD',
                            realm: { label: 'Гордунни', value: 'gordunni' },
                            contract_tenor: 'tod',
                            character: 'Блюрателла',
                            guild: 'Депортация',
                            type: 'all',
                            match: 'Блюрателла@Гордунни',
                            realmsinfo: 'Europe',
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            await setSubmitting(false);
                            let { fields } = commands.find(x => x.value === values.command)
                            let routingString = '/' + values.command;
                            let wt = false;
                            if (routingString === '/wowtoken') {
                                wt = true;
                                routingString = '/item'
                            }
                            for (let key_path of fields) {
                                let routing_pointer = values[key_path]
                                if (key_path === 'realm') {
                                    routing_pointer = values.realm.value
                                }
                                routingString = routingString.concat('/' + routing_pointer)
                            }
                            if (wt) {
                                routingString = routingString.concat('/122284')
                            }
                            await Router.push(routingString);
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
                                    {commands.map((option) => (
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
                                {values.command === "wowtoken" && (
                                    <React.Fragment>
                                        <Grid item xs={7}>
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
                                                label="Character Name"
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
                                                label="Guild Name"
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
                                {values.command === "contract" && (
                                    <React.Fragment>
                                        <Grid item xs={2}>
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
                                        <Grid item xs={2}>
                                            <TextField
                                                select
                                                name="contract_tenor"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.contract_tenor}
                                                fullWidth id="outlined-basic"
                                                label="Tenor"
                                                className={classes.search}
                                                variant="outlined"
                                            >
                                            {tenors.map(({value, label}) => (
                                                <MenuItem key={value} value={value}>
                                                    { label }
                                                </MenuItem>
                                            ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="h3" align="center" style={{textTransform: 'uppercase', margin: '0'}}>
                                                @
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
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
                                {values.command === "find" && (
                                    <React.Fragment>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="type"
                                                select
                                                label="Hash type"
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
                                                value={values.match}
                                                fullWidth id="outlined-basic"
                                                label="Hash or Query"
                                                className={classes.search}
                                                variant="outlined"
                                            />
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
                                                label="Item name for Cross Realm Swap Quotes"
                                                className={classes.search}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </React.Fragment>
                                )}
                                {values.command === "realmsinfo" && (
                                    <React.Fragment>
                                        <Grid item xs={7}>
                                            <TextField
                                                name="realmsinfo"
                                                select
                                                label="Select locale or region"
                                                className={classes.dropdown}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.realmsinfo}
                                                variant="outlined"
                                            >
                                                {realmsinfo.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
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
                <Typography variant="overline" align="center" style={{textTransform: 'uppercase'}}>
                    Feel free to use, we don't use cookies or track your queries.
                </Typography>
            </Grid>
        </main>
    )
}

export async function getServerSideProps() {
    //TODO refactor this part with gql handler
    const region = 'Europe'
    const query = `query Realms($region: String) {
        realms(name: $region) {
            _id
            name
            slug
            name_locale
        }
    }`
    let { data: { realms} } = await fetch(`http://${process.env.api}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { region },
        })
    }).then(res => res.json())
    realms = realms.map(({name_locale, name, slug}) => ({ label: name_locale || name, value: slug }))
    return { props: { realms: realms }}
}

export default Index
