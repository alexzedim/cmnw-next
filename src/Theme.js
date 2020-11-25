import {createMuiTheme} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';

// Create a theme instance.
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
    MuiTableHead: {
      root: {
        textTransform: 'uppercase'
      },
    },
  },
});

export default theme;
