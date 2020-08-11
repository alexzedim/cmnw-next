import React from "react";
import { Formik } from 'formik';
import Router from 'next/router'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
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
    const greetings = [
        'Viam supervadet vadens',
        'Something from nothing',
        'bb theunderminejournal',
        'goodbye TUJ',
        'you did nothing',
        'RIP wowtoken',
    ];
    const commands = [
        {
            value: 'character',
            label: 'CHAR',
            fields: [ 'realm', 'character' ],
        },
        {
            value: 'guild',
            label: 'GUILD',
            fields: [ 'realm', 'guild' ],
        },
        {
            value: 'find',
            label: 'FIND',
            fields: [ 'type', 'match' ],
        },
        {
            value: 'item',
            label: 'ITEM',
            fields: [ 'realm', 'item' ],
        },
        {
            value: 'contract',
            label: 'CONTRACT',
            fields: [ 'realm', 'item', 'contract_tenor' ],
        },
        {
            value: 'xrs',
            label: 'XRS',
            fields: [ 'item' ],
        },
    ]
    const type = [
        {
            value: 'a',
            label: 'A',
        },
        {
            value: 'b',
            label: 'B',
        },
        {
            value: 'c',
            label: 'C',
        },
        {
            value: 'any',
            label: 'ANY',
        },
        {
            value: 'all',
            label: 'ALL',
        },
    ]
    const tenors = [
        {
            value: 'tod',
            label: 'TOD',
        },
        {
            value: 'ytd',
            label: 'YTD',
        },
        {
            value: 'week',
            label: 'WEEK',
        },
        {
            value: 'last_week',
            label: 'WEEK-1',
        },
        {
            value: 'month',
            label: 'MONTH',
        },
        {
            value: 'last_month',
            label: 'MONTH-1',
        },
    ]
    return (
        <Grid container direction="column" justify="center" alignItems="center" className={classes.root}>
            <Typography variant="h1" align="center" style={{textTransform: 'uppercase'}}>
                {greetings[Math.floor(Math.random() * greetings.length)]}
            </Typography>
            <Container className={classes.searchbar}>
                <Formik
                    initialValues={{
                        command: 'item',
                        item: 'ZNTD',
                        realm: 'gordunni',
                        contract_tenor: 'tod',
                        character: 'Блюрателла',
                        guild: 'Депортация',
                        type: 'all',
                        match: 'Блюрателла@Гордунни'
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        await setSubmitting(false);
                        let { fields } = commands.find(x => x.value === values.command)
                        let routingString = '/' + values.command;
                        for (let key_path of fields) {
                            console.log(key_path)
                            console.log(values[key_path])
                            routingString = routingString.concat('/' + values[key_path])
                        }
                        await Router.push(routingString);
                    }}
                >
                {({
                      values,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      /* and other goodies */
                  }) => (
                    <form className={classes.searchField} onSubmit={handleSubmit} noValidate autoComplete="off">
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
                                        <TextField
                                            name="realm"
                                            select
                                            label="Select realm"
                                            className={classes.dropdown}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.realm}
                                            variant="outlined"
                                        >
                                        {realms.map(({slug, name_locale, name}) => (
                                            <MenuItem key={slug} value={slug}>
                                                { name_locale || name }
                                            </MenuItem>
                                        ))}
                                        </TextField>
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
                                        <TextField
                                            name="realm"
                                            select
                                            label="Select realm"
                                            className={classes.dropdown}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.realm}
                                            variant="outlined"
                                        >
                                        {realms.map(({slug, name_locale, name}) => (
                                            <MenuItem key={slug} value={slug}>
                                                { name_locale || name }
                                            </MenuItem>
                                        ))}
                                        </TextField>
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
                                        <TextField
                                            name="realm"
                                            select
                                            label="Select realm"
                                            className={classes.dropdown}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.realm}
                                            variant="outlined"
                                        >
                                        {realms.map(({slug, name_locale, name}) => (
                                            <MenuItem key={slug} value={slug}>
                                                { name_locale || name }
                                            </MenuItem>
                                        ))}
                                        </TextField>
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
                                        <TextField
                                            name="realm"
                                            select
                                            label="Select realm"
                                            className={classes.dropdown}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.realm}
                                            variant="outlined"
                                        >
                                        {realms.map(({slug, name_locale, name}) => (
                                            <MenuItem key={slug} value={slug}>
                                                { name_locale || name }
                                            </MenuItem>
                                        ))}
                                        </TextField>
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
                            <Grid item xs={1}>
                                <Button type="submit" variant="outlined" color="secondary" size="large">
                                    <ArrowForwardOutlinedIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
                </Formik>
            </Container>
        </Grid>
    )
}

export async function getServerSideProps() {
    const res = await fetch(encodeURI(`http://localhost:3030/api/realms/ru_RU`));
    const json = await res.json();
    return { props: {realms: json}}
}

export default Index