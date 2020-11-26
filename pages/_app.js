import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../src/Header'
import {red} from "@material-ui/core/colors";

const i = Math.floor(Math.random() * 5)

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b9b5bc',
      light: '#ebe7ee',
      dark: '#89858c',
    },
    secondary: {
      main: '#241c18',
      light: '#4c433e',
      dark: '#000000',
    },
    error: {
      main: red.A400,
    },
    warning: {
      main: '#c1aa82',
    },
    background: {
      default: '#ebe7ee',
      dark: '#89858c',
    },
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
  typography: {
    caption: {
      fontSize: '0.9rem',
      textTransform: 'uppercase'
    }
  },
  overrides: {
    MuiTableRoot: {
      background: 'transparent'
    },
    MuiTableHead: {
      root: {
        textTransform: 'uppercase'
      },
    },
    MuiCssBaseline: {
      "@global": {
        body: {
          width: 'auto',
          height: 'auto',
          backgroundImage: `url(/bg${i}.png)`,
          backgroundSize: 'cover'
        }
      }
    }
  },
});

export default function MyApp(props) {
  const {Component, pageProps} = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Conglomerat</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>
      <MuiThemeProvider theme={theme}>
        <Header/>
        <CssBaseline/>
        <Component {...pageProps} />
      </MuiThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
