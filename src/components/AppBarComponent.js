import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  List, ListItem, ListItemText, useMediaQuery, useTheme,
  Container, Divider,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, GraphicEq, AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import { subscriptionAPI } from '../services/api';
import { M_AC, M_GRADIENT, M_BLACK, M_BORDER, M_SURFACE } from './marketing/marketingTokens';

const NAV_LINKS = [
  { label: 'Features',  path: '/#features' },
  { label: 'Pricing',   path: '/pricing' },
  { label: 'Docs',      path: '/documentation' },
  { label: 'Languages', path: '/language-support' },
];

const navLinkSx = (active) => ({
  color: active ? M_BLACK : 'rgba(17, 17, 17, 0.65)',
  fontWeight: active ? 700 : 500,
  fontSize: '0.9rem',
  px: 1.75,
  py: 0.75,
  borderRadius: '8px',
  minWidth: 'auto',
  textTransform: 'none',
  position: 'relative',
  '&:hover': {
    color: M_BLACK,
    background: 'rgba(17, 17, 17, 0.04)',
  },
  ...(active && {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 4,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 16,
      height: 2,
      borderRadius: 1,
      bgcolor: M_AC,
    },
  }),
});

export default function AppBarComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBalance = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        const uid = parsed.uid || parsed.userId;
        if (uid) {
          subscriptionAPI.getBalance(uid)
            .then(data => setBalance(data.balance ?? data.credit_balance ?? 0))
            .catch(() => {});
        }
      } catch (e) {
        console.error('AppBar: User parse failed', e);
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    fetchBalance();
    window.addEventListener('refresh-balance', fetchBalance);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('refresh-balance', fetchBalance);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/#features') return location.pathname === '/' && location.hash === '#features';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.88)'
            : 'rgba(250, 250, 248, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? `1px solid ${M_BORDER}` : '1px solid transparent',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>

            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', flexShrink: 0 }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: M_GRADIENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraphicEq sx={{ color: M_BLACK, fontSize: 18 }} />
              </Box>
              <Box sx={{
                fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: M_BLACK,
              }}>
                A·VOICES
              </Box>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                {NAV_LINKS.map(({ label, path }) => (
                  <Button
                    key={label}
                    component={Link}
                    to={path}
                    variant="text"
                    sx={navLinkSx(isActive(path))}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  {!isMobile && (
                    <Box
                      onClick={() => navigate('/dashboard/subscription')}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 0.75,
                        px: 1.75, py: 0.65, borderRadius: '999px',
                        bgcolor: 'rgba(232, 160, 32, 0.08)',
                        border: '1px solid rgba(232, 160, 32, 0.2)',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(232, 160, 32, 0.12)' },
                      }}
                    >
                      <WalletIcon sx={{ fontSize: 17, color: M_AC }} />
                      <Box sx={{ fontWeight: 700, color: M_AC, fontSize: '0.85rem' }}>
                        {balance !== null ? `${balance.toFixed(0)} credits` : '…'}
                      </Box>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      background: M_GRADIENT, color: M_BLACK, fontWeight: 700,
                      px: 2.5, py: 0.9, borderRadius: '999px', textTransform: 'none', fontSize: '0.88rem',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 4px 16px rgba(232, 160, 32, 0.3)' },
                    }}
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  {!isMobile && (
                    <Button
                      component={Link}
                      to="/get-started"
                      variant="text"
                      sx={{ ...navLinkSx(false), fontWeight: 600 }}
                    >
                      Sign in
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => navigate('/get-started')}
                    sx={{
                      background: M_GRADIENT, color: M_BLACK, fontWeight: 700,
                      px: 2.5, py: 0.9, borderRadius: '999px', textTransform: 'none', fontSize: '0.88rem',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 4px 16px rgba(232, 160, 32, 0.3)' },
                    }}
                  >
                    Get started
                  </Button>
                </>
              )}
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)} sx={{ color: M_BLACK }} aria-label="Open menu">
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: M_SURFACE,
            borderLeft: `1px solid ${M_BORDER}`,
          },
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontWeight: 800, fontSize: '1.1rem', color: M_BLACK }}>A·VOICES</Box>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: M_BORDER }} />
        <List sx={{ px: 1.5, py: 2 }}>
          {[...NAV_LINKS, { label: 'Sign in', path: '/get-started' }].map(({ label, path }) => (
            <ListItem
              key={label}
              component={Link}
              to={path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '10px', mb: 0.5, textDecoration: 'none',
                color: M_BLACK,
                bgcolor: isActive(path) ? 'rgba(232, 160, 32, 0.08)' : 'transparent',
              }}
            >
              <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ px: 2.5, pb: 3 }}>
          <Button
            fullWidth
            onClick={() => { setMobileOpen(false); navigate('/get-started'); }}
            sx={{
              background: M_GRADIENT, color: M_BLACK, py: 1.35, borderRadius: '999px',
              fontWeight: 700, textTransform: 'none',
            }}
          >
            Get started free
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
