import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import Link from "./Link";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: 0,
        width: '100%'
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        position: 'relative',
    },
    title: {
        flexGrow: 1,
        display: 'none',
        textTransform: 'uppercase',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    }
}));

export default function Header() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} color="transparent" position="absolute">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" color="primary" noWrap>
                        <Link href="/" color="inherit" underline="none">
                            Terminal
                        </Link>
                    </Typography>
                    <Typography className={classes.title} variant="h6" color="primary" noWrap>
                        <Link href="/help" color="inherit" underline="none">
                            Help
                        </Link>
                    </Typography>
                    <Typography className={classes.title} variant="h6" color="primary" noWrap>
                        <Link href="/who-we-are" color="inherit" underline="none">
                            Who we are
                        </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}