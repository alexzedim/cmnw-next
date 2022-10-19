import { createTheme } from '@material-ui/core';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#242424',
      light: '#ebe7ee',
      dark: '#89858c',
    },
    secondary: {
      main: '#241c18',
      light: '#4c433e',
      dark: '#000000',
    },
    error: {
      main: '#960000',
    },
    warning: {
      main: '#c1aa82',
    },
    background: {
      default: "#c5dcf2"
    },
  },
  typography: {
    caption: {
      fontSize: '0.9rem',
      textTransform: 'uppercase'
    }
  },
});
