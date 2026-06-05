import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ── Brand Palette (from PHOSAI logo) ──────────────────────────────────────
const GOLD        = '#E8A020';   // Sun-ray amber – primary accent
const GOLD_LIGHT  = '#F5B844';   // Hover highlight
const GOLD_DARK   = '#C47F10';   // Pressed / deeper accent
const BLACK       = '#111111';   // Africa silhouette – dark surface
const BLACK_MID   = '#1A1A1A';   // Secondary dark surface
const BLACK_SOFT  = '#242424';   // Card / panel surface
const OFFWHITE    = '#F8F6F0';   // Logo background – light surface
const OFFWHITE_MID= '#F0EDE5';   // Secondary light surface
const OFFWHITE_DK = '#E0D9CC';   // Borders on light bg

const FOCUS_RING  = `0 0 0 3px rgba(232,160,32,0.4)`;

export default function AppThemeProvider({ children }) {
  const mode = useSelector(state => state.ui.theme.mode);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary:   { main: GOLD,     light: GOLD_LIGHT, dark: GOLD_DARK, contrastText: BLACK },
      secondary: { main: GOLD_DARK, light: GOLD,      dark: '#A06A08', contrastText: BLACK },
      warning:   { main: GOLD,     light: GOLD_LIGHT, dark: GOLD_DARK, contrastText: BLACK },
      // Error and success kept minimal – mapped to gold/black variants
      success:   { main: GOLD_DARK, light: GOLD,      dark: '#8A5608', contrastText: BLACK },
      error:     { main: '#C43030', light: '#D95050', dark: '#A02020', contrastText: OFFWHITE },
      info:      { main: GOLD,     light: GOLD_LIGHT, dark: GOLD_DARK, contrastText: BLACK },
      ...(mode === 'dark' ? {
        background: { default: BLACK,     paper: BLACK_MID },
        text:       { primary: OFFWHITE,  secondary: 'rgba(248,246,240,0.58)', disabled: 'rgba(248,246,240,0.3)' },
        divider:    `rgba(232,160,32,0.12)`,
      } : {
        background: { default: '#ffffff',  paper: '#ffffff' },
        text:       { primary: BLACK,     secondary: '#3A3020', disabled: 'rgba(17,17,17,0.35)' },
        divider:    `rgba(232,160,32,0.2)`,
      }),
    },
    typography: {
      fontFamily: '"Outfit", "Inter", Arial, sans-serif',
      h1: { fontWeight: 800, fontSize: '3.5rem',  lineHeight: 1.1, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, fontSize: '2.5rem',  lineHeight: 1.2, letterSpacing: '-0.01em' },
      h3: { fontWeight: 700, fontSize: '2rem',    lineHeight: 1.3, letterSpacing: '-0.01em' },
      h4: { fontWeight: 600, fontSize: '1.5rem',  lineHeight: 1.4 },
      h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
      h6: { fontWeight: 600, fontSize: '1.1rem',  lineHeight: 1.4 },
      body1:    { fontSize: '1rem',     lineHeight: 1.7 },
      body2:    { fontSize: '0.875rem', lineHeight: 1.6 },
      subtitle1:{ fontWeight: 500, fontSize: '1.05rem' },
      button:   { fontWeight: 700, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 12 },
    shadows: [
      'none',
      '0 1px 3px rgba(0,0,0,0.1)',
      '0 2px 6px rgba(0,0,0,0.12)',
      '0 4px 12px rgba(0,0,0,0.14)',
      '0 6px 20px rgba(0,0,0,0.16)',
      '0 8px 28px rgba(0,0,0,0.18)',
      '0 12px 36px rgba(0,0,0,0.2)',
      '0 16px 44px rgba(0,0,0,0.22)',
      '0 20px 52px rgba(0,0,0,0.24)',
      '0 24px 60px rgba(0,0,0,0.26)',
      `0 28px 68px rgba(232,160,32,0.12)`,
      `0 32px 76px rgba(232,160,32,0.15)`,
      `0 36px 84px rgba(232,160,32,0.15)`,
      `0 40px 92px rgba(232,160,32,0.18)`,
      '0 44px 100px rgba(0,0,0,0.32)',
      '0 48px 108px rgba(0,0,0,0.34)',
      '0 52px 116px rgba(0,0,0,0.36)',
      '0 56px 124px rgba(0,0,0,0.38)',
      '0 60px 132px rgba(0,0,0,0.4)',
      '0 64px 140px rgba(0,0,0,0.42)',
      '0 68px 148px rgba(0,0,0,0.44)',
      '0 72px 156px rgba(0,0,0,0.46)',
      '0 76px 164px rgba(0,0,0,0.48)',
      '0 80px 172px rgba(0,0,0,0.5)',
      '0 84px 180px rgba(0,0,0,0.52)',
    ],
    components: {
      /* ── Buttons ──────────────────────────────────────────── */
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '50px',
            padding: '10px 24px',
            fontSize: '0.95rem',
            transition: 'all 0.25s ease',
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING },
            '&.Mui-disabled': { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'auto' },
          },
          contained: {
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            color: BLACK,
            boxShadow: `0 4px 20px rgba(232,160,32,0.35)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
              boxShadow: `0 6px 28px rgba(232,160,32,0.5)`,
              transform: 'translateY(-1px)',
            },
            '&.Mui-disabled': {
              background: mode === 'dark' ? BLACK_SOFT : OFFWHITE_DK,
              boxShadow: 'none',
              color: mode === 'dark' ? 'rgba(248,246,240,0.3)' : 'rgba(17,17,17,0.3)',
            },
          },
          outlined: {
            borderColor: GOLD,
            color: GOLD,
            borderWidth: '1.5px',
            '&:hover': {
              borderColor: GOLD_DARK,
              color: GOLD_DARK,
              backgroundColor: `rgba(232,160,32,0.06)`,
              borderWidth: '1.5px',
              transform: 'translateY(-1px)',
            },
          },
          text: {
            '&:hover': { backgroundColor: `rgba(232,160,32,0.06)` },
          },
        },
      },
      /* ── Icon buttons ─────────────────────────────────────── */
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING },
            '&.Mui-disabled': { opacity: 0.4 },
          },
        },
      },
      /* ── Alerts ───────────────────────────────────────────── */
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: '12px', fontWeight: 500, fontSize: '0.9rem', alignItems: 'center' },
          standardSuccess: {
            backgroundColor: mode === 'dark' ? 'rgba(232,160,32,0.1)' : 'rgba(232,160,32,0.08)',
            color: mode === 'dark' ? GOLD_LIGHT : GOLD_DARK,
            '& .MuiAlert-icon': { color: GOLD },
          },
          standardError: {
            backgroundColor: mode === 'dark' ? 'rgba(196,48,48,0.15)' : 'rgba(196,48,48,0.08)',
            color: mode === 'dark' ? '#E07070' : '#A02020',
            '& .MuiAlert-icon': { color: '#C43030' },
          },
          standardWarning: {
            backgroundColor: mode === 'dark' ? 'rgba(232,160,32,0.1)' : 'rgba(232,160,32,0.08)',
            color: mode === 'dark' ? GOLD_LIGHT : GOLD_DARK,
            '& .MuiAlert-icon': { color: GOLD },
          },
          standardInfo: {
            backgroundColor: mode === 'dark' ? `rgba(232,160,32,0.1)` : `rgba(232,160,32,0.06)`,
            color: mode === 'dark' ? GOLD_LIGHT : GOLD_DARK,
            '& .MuiAlert-icon': { color: GOLD },
          },
          filledSuccess: { backgroundColor: GOLD_DARK, color: BLACK },
          filledError:   { backgroundColor: '#C43030', color: BLACK },
          filledWarning: { backgroundColor: GOLD,      color: BLACK },
          filledInfo:    { backgroundColor: GOLD_DARK, color: BLACK },
        },
      },
      /* ── Cards & Papers ───────────────────────────────────── */
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            backgroundImage: 'none',
            border: mode === 'dark'
              ? `1px solid rgba(232,160,32,0.14)`
              : `1px solid rgba(232,160,32,0.18)`,
            boxShadow: mode === 'dark'
              ? '0 4px 24px rgba(0,0,0,0.55)'
              : `0 4px 20px rgba(232,160,32,0.1)`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { borderRadius: '16px', backgroundImage: 'none' } },
      },
      /* ── Text fields ──────────────────────────────────────── */
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(232,160,32,0.2)' : `rgba(232,160,32,0.25)`,
              },
              '&:hover fieldset':      { borderColor: GOLD },
              '&.Mui-focused fieldset': { borderColor: GOLD, borderWidth: '2px' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: GOLD },
          },
        },
      },
      /* ── Select ───────────────────────────────────────────── */
      MuiSelect: {
        styleOverrides: {
          root: { '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING } },
        },
      },
      /* ── Tables ───────────────────────────────────────────── */
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              backgroundColor: mode === 'dark' ? BLACK_SOFT : OFFWHITE_MID,
              color: mode === 'dark' ? 'rgba(248,246,240,0.55)' : '#5A4A30',
              borderBottom: mode === 'dark'
                ? `1px solid rgba(232,160,32,0.12)`
                : `1px solid rgba(232,160,32,0.18)`,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark'
                ? 'rgba(232,160,32,0.05)'
                : 'rgba(232,160,32,0.04)',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: mode === 'dark'
              ? 'rgba(232,160,32,0.08)'
              : 'rgba(232,160,32,0.1)',
            fontSize: '0.875rem',
          },
        },
      },
      /* ── Chips ────────────────────────────────────────────── */
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '50px',
            fontWeight: 600,
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING },
          },
        },
      },
      /* ── Badges ───────────────────────────────────────────── */
      MuiBadge: {
        styleOverrides: {
          badge: { fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', height: '18px' },
        },
      },
      /* ── Drawers ──────────────────────────────────────────── */
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            backgroundImage: 'none',
            boxShadow: mode === 'dark'
              ? '4px 0 24px rgba(0,0,0,0.7)'
              : `4px 0 20px rgba(232,160,32,0.12)`,
            background: mode === 'dark' ? '#18181b' : '#f4f4f5',
            backgroundColor: mode === 'dark' ? '#18181b' : '#f4f4f5',
            color: mode === 'dark' ? '#ffffff' : '#111111',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            margin: '2px 8px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover':           { transform: 'translateX(3px)', backgroundColor: `rgba(232,160,32,0.08)` },
            '&.Mui-selected':    { backgroundColor: `rgba(232,160,32,0.13)` },
            '&.Mui-selected:hover':{ backgroundColor: `rgba(232,160,32,0.18)` },
            '&:focus-visible':   { outline: 'none', boxShadow: `inset ${FOCUS_RING}` },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: { root: { minWidth: '40px', transition: 'color 0.2s ease' } },
      },
      /* ── Tooltips ─────────────────────────────────────────── */
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '6px 12px',
            backgroundColor: mode === 'dark' ? BLACK_SOFT : BLACK,
            color: BLACK,
          },
          arrow: { color: mode === 'dark' ? BLACK_SOFT : BLACK },
        },
      },
      /* ── Dialogs ──────────────────────────────────────────── */
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '24px',
            backgroundImage: 'none',
            boxShadow: mode === 'dark'
              ? '0 32px 80px rgba(0,0,0,0.7)'
              : `0 32px 80px rgba(232,160,32,0.15)`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { fontWeight: 700, fontSize: '1.25rem' } },
      },
      /* ── Progress (Avoices design system) ───────────────────── */
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            height: '6px',
            backgroundColor: 'rgba(17, 17, 17, 0.08)',
          },
          bar: {
            borderRadius: '6px',
            background: 'linear-gradient(90deg, #E8A020 0%, #F5B844 45%, #C47F10 100%)',
          },
          bar1Indeterminate: {
            background: 'linear-gradient(90deg, #E8A020 0%, #F5B844 45%, #C47F10 100%)',
          },
          bar2Indeterminate: {
            background: 'linear-gradient(90deg, #E8A020 0%, #F5B844 45%, #C47F10 100%)',
            opacity: 0.35,
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: { color: '#E8A020' },
          circle: { strokeLinecap: 'round' },
        },
      },
      /* ── Checkbox & sort ──────────────────────────────────── */
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? 'rgba(248,246,240,0.35)' : 'rgba(17,17,17,0.35)',
            '&.Mui-checked':   { color: GOLD },
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING, borderRadius: '4px' },
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING, borderRadius: '4px' },
            '&.Mui-active':    { color: GOLD },
          },
        },
      },
      /* ── Menus ────────────────────────────────────────────── */
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: mode === 'dark' ? BLACK_MID : OFFWHITE,
            border: mode === 'dark'
              ? `1px solid rgba(232,160,32,0.14)`
              : `1px solid rgba(232,160,32,0.22)`,
            borderRadius: '14px !important',
            boxShadow: mode === 'dark'
              ? '0 16px 48px rgba(0,0,0,0.65)'
              : '0 16px 48px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? OFFWHITE : BLACK,
            fontSize: '0.9rem',
            borderRadius: '8px',
            margin: '2px 6px',
            '&:hover':            { background: `rgba(232,160,32,0.12)`, color: GOLD },
            '&.Mui-selected':     { background: `rgba(232,160,32,0.15)`, color: GOLD },
            '&.Mui-selected:hover': { background: `rgba(232,160,32,0.2)` },
          },
        },
      },
      /* ── Popover ──────────────────────────────────────────── */
      MuiPopover: {
        styleOverrides: {
          paper: {
            background: mode === 'dark' ? BLACK_MID : OFFWHITE,
            border: mode === 'dark'
              ? `1px solid rgba(232,160,32,0.14)`
              : `1px solid rgba(232,160,32,0.22)`,
            borderRadius: '14px',
            boxShadow: mode === 'dark'
              ? '0 16px 48px rgba(0,0,0,0.65)'
              : '0 16px 48px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: { '& .MuiAlert-root': { boxShadow: '0 12px 40px rgba(0,0,0,0.25)' } },
        },
      },
    },
  }), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
