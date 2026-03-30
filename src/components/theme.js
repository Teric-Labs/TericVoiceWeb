import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9',
      light: '#8b5cf6',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#90caf9',
      dark: '#38bdf8',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    surface: {
      main: '#f5f5f5',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '24px',
          padding: '12px 24px',
          boxShadow: '0 2px 8px rgba(14, 165, 233, 0.15)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
          },
        },
        outlined: {
          borderColor: '#0ea5e9',
          color: '#0ea5e9',
          '&:hover': {
            backgroundColor: 'rgba(14, 165, 233, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#0ea5e9',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0ea5e9',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
          transition: 'color 0.3s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '0.7rem',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
