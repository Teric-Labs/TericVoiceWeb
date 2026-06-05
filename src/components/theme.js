import { createTheme } from '@mui/material/styles';

// ── Brand Palette (from PHOSAI logo) ──────────────────────────────────────
const GOLD        = '#E8A020';   // Sun-ray amber – primary accent
const GOLD_LIGHT  = '#F5B844';   // Lighter gold for hover
const GOLD_DARK   = '#C47F10';   // Deeper gold for pressed states
const BLACK       = '#111111';   // Africa silhouette – dark surface
const BLACK_MID   = '#1A1A1A';   // Slightly lighter dark
const BLACK_SOFT  = '#222222';   // Cards / panels
const OFFWHITE    = '#F8F6F0';   // Logo background – light surface
const OFFWHITE_MID= '#F0EDE5';   // Secondary light surface
const OFFWHITE_DK = '#E0D9CC';   // Borders / dividers

const theme = createTheme({
  palette: {
    primary: {
      main: GOLD,
      light: GOLD_LIGHT,
      dark: GOLD_DARK,
      contrastText: BLACK,
    },
    secondary: {
      main: GOLD_DARK,
      light: GOLD,
      dark: '#A06A08',
      contrastText: BLACK,
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: BLACK,
      secondary: '#3A3020',
    },
    surface: {
      main: OFFWHITE_MID,
      light: OFFWHITE,
      dark: OFFWHITE_DK,
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.4 },
    h4: { fontWeight: 500, fontSize: '1.5rem', lineHeight: 1.4 },
    h5: { fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.4 },
    h6: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '24px',
          padding: '12px 24px',
          boxShadow: `0 2px 8px rgba(232,160,32,0.2)`,
          '&:hover': { boxShadow: `0 4px 12px rgba(232,160,32,0.35)` },
        },
        contained: {
          background: `linear-gradient(45deg, ${GOLD}, ${GOLD_DARK})`,
          color: BLACK,
          '&:hover': { background: `linear-gradient(45deg, ${GOLD_DARK}, ${GOLD_LIGHT})` },
        },
        outlined: {
          borderColor: GOLD,
          color: GOLD,
          '&:hover': { backgroundColor: `rgba(232,160,32,0.06)` },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: `1px solid rgba(232,160,32,0.12)`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: '16px' } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': { borderColor: `rgba(232,160,32,0.2)` },
            '&:hover fieldset': { borderColor: GOLD },
            '&.Mui-focused fieldset': { borderColor: GOLD },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: 'none', boxShadow: `2px 0 8px rgba(232,160,32,0.08)` },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateX(4px)' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: '40px', transition: 'color 0.3s ease' } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: '8px', fontWeight: 600 } },
    },
    MuiBadge: {
      styleOverrides: { badge: { fontSize: '0.7rem', fontWeight: 600 } },
    },
  },
});

export default theme;
