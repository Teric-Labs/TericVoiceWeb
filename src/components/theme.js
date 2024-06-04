import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      'Gill Sans',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 12,
  },
});

export default theme;
