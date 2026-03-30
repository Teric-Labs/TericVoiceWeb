import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ── Design tokens ───────────────────────────────────────────────────────────
const BLUE   = '#8b5cf6';   // primary purple
const PURPLE = '#a855f7';   // secondary violet
const GOLD   = '#f59e0b';   // African gold accent
const FOCUS_RING = `0 0 0 3px rgba(139,92,246,0.35)`;

export default function AppThemeProvider({ children }) {
  const mode = useSelector(state => state.ui.theme.mode);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary:   { main: BLUE,   light: '#a78bfa', dark: '#7c3aed', contrastText: '#ffffff' },
      secondary: { main: PURPLE, light: '#c084fc', dark: '#9333ea', contrastText: '#ffffff' },
      warning:   { main: GOLD,   light: '#fbbf24', dark: '#d97706', contrastText: '#000000' },
      success:   { main: '#10b981', light: '#34d399', dark: '#059669', contrastText: '#ffffff' },
      error:     { main: '#ef4444', light: '#f87171', dark: '#dc2626', contrastText: '#ffffff' },
      info:      { main: BLUE,   light: '#38bdf8', dark: '#0284c7', contrastText: '#ffffff' },
      ...(mode === 'dark' ? {
        background: { default: '#07071a', paper: '#0d0d24' },
        text: { primary: '#f8fafc', secondary: '#94a3b8', disabled: 'rgba(248,250,252,0.35)' },
        divider: 'rgba(255,255,255,0.07)',
      } : {
        background: { default: '#f5f3ff', paper: '#ffffff' },
        text: { primary: '#0f172a', secondary: '#475569', disabled: 'rgba(15,23,42,0.35)' },
        divider: 'rgba(139,92,246,0.12)',
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
      body1: { fontSize: '1rem',    lineHeight: 1.7 },
      body2: { fontSize: '0.875rem',lineHeight: 1.6 },
      subtitle1: { fontWeight: 500, fontSize: '1.05rem' },
      button:  { fontWeight: 700, letterSpacing: '0.01em' },
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
      '0 28px 68px rgba(14,165,233,0.2)',
      '0 32px 76px rgba(14,165,233,0.25)',
      '0 36px 84px rgba(139,92,246,0.25)',
      '0 40px 92px rgba(139,92,246,0.3)',
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
      /* ── Buttons ─────────────────────────────────────── */
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
            background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})`,
            boxShadow: `0 4px 20px rgba(139,92,246,0.35)`,
            '&:hover': {
              background: `linear-gradient(135deg, #7c3aed, #9333ea)`,
              boxShadow: `0 6px 28px rgba(139,92,246,0.5)`,
              transform: 'translateY(-1px)',
            },
            '&.Mui-disabled': { background: mode === 'dark' ? '#1e293b' : '#e2e8f0', boxShadow: 'none', color: '#64748b' },
          },
          outlined: {
            borderColor: BLUE,
            color: BLUE,
            borderWidth: '1.5px',
            '&:hover': {
              borderColor: PURPLE,
              color: PURPLE,
              backgroundColor: 'rgba(168,85,247,0.06)',
              borderWidth: '1.5px',
              transform: 'translateY(-1px)',
            },
          },
          text: {
            '&:hover': { backgroundColor: 'rgba(139,92,246,0.06)' },
          },
        },
      },
      /* ── Icon buttons ───────────────────────────────── */
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING },
            '&.Mui-disabled': { opacity: 0.4 },
          },
        },
      },
      /* ── Alerts ─────────────────────────────────────── */
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: '12px', fontWeight: 500, fontSize: '0.9rem', alignItems: 'center' },
          standardSuccess: {
            backgroundColor: mode === 'dark' ? '#052e16' : '#ecfdf5',
            color: mode === 'dark' ? '#34d399' : '#065f46',
            '& .MuiAlert-icon': { color: '#10b981' },
          },
          standardError: {
            backgroundColor: mode === 'dark' ? '#2d0a0a' : '#fef2f2',
            color: mode === 'dark' ? '#f87171' : '#991b1b',
            '& .MuiAlert-icon': { color: '#ef4444' },
          },
          standardWarning: {
            backgroundColor: mode === 'dark' ? '#2d1b00' : '#fffbeb',
            color: mode === 'dark' ? '#fbbf24' : '#92400e',
            '& .MuiAlert-icon': { color: GOLD },
          },
          standardInfo: {
            backgroundColor: mode === 'dark' ? '#0c1a2d' : '#f0f9ff',
            color: mode === 'dark' ? '#38bdf8' : '#0c4a6e',
            '& .MuiAlert-icon': { color: BLUE },
          },
          filledSuccess: { backgroundColor: '#059669' },
          filledError:   { backgroundColor: '#dc2626' },
          filledWarning: { backgroundColor: GOLD },
          filledInfo:    { backgroundColor: '#0284c7' },
        },
      },
      /* ── Cards & Papers ─────────────────────────────── */
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            backgroundImage: 'none',
            border: mode === 'dark' ? '1px solid rgba(139,92,246,0.12)' : '1px solid rgba(139,92,246,0.15)',
            boxShadow: mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.5)' : '0 4px 20px rgba(139,92,246,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: '16px', backgroundImage: 'none' },
        },
      },
      /* ── Text fields ────────────────────────────────── */
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(14,165,233,0.2)',
              },
              '&:hover fieldset': { borderColor: BLUE },
              '&.Mui-focused fieldset': { borderColor: BLUE, borderWidth: '2px' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: BLUE },
          },
        },
      },
      /* ── Select ─────────────────────────────────────── */
      MuiSelect: {
        styleOverrides: {
          root: { '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING } },
        },
      },
      /* ── Tables ─────────────────────────────────────── */
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              backgroundColor: mode === 'dark' ? '#0a0a23' : '#f0f9ff',
              color: mode === 'dark' ? '#64748b' : '#475569',
              borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.07)' : `1px solid rgba(14,165,233,0.15)`,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.03)',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(14,165,233,0.08)',
            fontSize: '0.875rem',
          },
        },
      },
      /* ── Chips ──────────────────────────────────────── */
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '50px',
            fontWeight: 600,
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING },
          },
        },
      },
      /* ── Badges ─────────────────────────────────────── */
      MuiBadge: {
        styleOverrides: {
          badge: { fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', height: '18px' },
        },
      },
      /* ── Drawers ────────────────────────────────────── */
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            backgroundImage: 'none',
            boxShadow: mode === 'dark' ? '4px 0 24px rgba(0,0,0,0.7)' : '4px 0 20px rgba(14,165,233,0.12)',
          },
        },
      },
      /* ── List items ─────────────────────────────────── */
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            margin: '2px 8px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateX(3px)', backgroundColor: 'rgba(139,92,246,0.08)' },
            '&.Mui-selected': {
              backgroundColor: 'rgba(139,92,246,0.12)',
              '&:hover': { backgroundColor: 'rgba(139,92,246,0.16)' },
            },
            '&:focus-visible': { outline: 'none', boxShadow: `inset ${FOCUS_RING}` },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: { root: { minWidth: '40px', transition: 'color 0.2s ease' } },
      },
      /* ── Tooltips ───────────────────────────────────── */
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '6px 12px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#0f172a',
          },
          arrow: { color: mode === 'dark' ? '#1e293b' : '#0f172a' },
        },
      },
      /* ── Dialogs ────────────────────────────────────── */
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '24px',
            backgroundImage: 'none',
            boxShadow: mode === 'dark' ? '0 32px 80px rgba(0,0,0,0.7)' : '0 32px 80px rgba(14,165,233,0.15)',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { fontWeight: 700, fontSize: '1.25rem' } },
      },
      /* ── Progress ───────────────────────────────────── */
      MuiLinearProgress: {
        styleOverrides: { root: { borderRadius: '8px', height: '6px' } },
      },
      /* ── Checkbox & sort ────────────────────────────── */
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#475569' : '#94a3b8',
            '&.Mui-checked': { color: BLUE },
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING, borderRadius: '4px' },
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&:focus-visible': { outline: 'none', boxShadow: FOCUS_RING, borderRadius: '4px' },
            '&.Mui-active': { color: BLUE },
          },
        },
      },
      /* ── Menus (dark globally) ───────────────────────── */
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: '#12122a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px !important',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: '#f8fafc',
            fontSize: '0.9rem',
            borderRadius: '8px',
            margin: '2px 6px',
            '&:hover': { background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' },
            '&.Mui-selected': { background: 'rgba(14,165,233,0.15)', color: '#0ea5e9' },
            '&.Mui-selected:hover': { background: 'rgba(14,165,233,0.2)' },
          },
        },
      },
      /* ── Popover ────────────────────────────────────── */
      MuiPopover: {
        styleOverrides: {
          paper: {
            background: '#12122a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
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
