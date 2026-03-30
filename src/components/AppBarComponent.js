import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  List, ListItem, ListItemText, useMediaQuery, useTheme,
  Container,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, GraphicEq } from '@mui/icons-material';

const NAV_LINKS = [
  { label: 'Features', path: '/#features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Docs', path: '/documentation' },
  { label: 'Languages', path: '/language-support' },
];

const GRADIENT = 'linear-gradient(135deg, #8b5cf6, #a855f7)';
const BTN_COLOR = '#ffffff';
const BTN_TEXT = '#000000';

export default function AppBarComponent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(9, 9, 11, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none', flexShrink: 0 }}
            >
              <Box sx={{
                width: 38, height: 38, borderRadius: '10px', background: GRADIENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(139,92,246,0.45)',
              }}>
                <GraphicEq sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box sx={{
                fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em',
                background: GRADIENT,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                A·VOICES
              </Box>
            </Box>

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {NAV_LINKS.map(({ label, path }) => (
                  <Button key={label} component={Link} to={path} variant="text" sx={{
                    color: 'rgba(255,255,255,0.78)', fontWeight: 600, fontSize: '0.92rem',
                    px: 2, borderRadius: '50px',
                    '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' },
                  }}>
                    {label}
                  </Button>
                ))}
              </Box>
            )}

            {/* CTA row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!isMobile && (
                <Button variant="text" component={Link} to="/get-started" sx={{
                  color: 'rgba(255,255,255,0.72)', fontWeight: 600,
                  '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' },
                }}>
                  Sign In
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => navigate('/get-started')}
                sx={{
                  background: BTN_COLOR, color: BTN_TEXT, fontWeight: 600,
                  px: { xs: 2.5, md: 3 }, py: 1.15, borderRadius: '50px',
                  boxShadow: '0 4px 14px rgba(255,255,255,0.1)', fontSize: '0.9rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#e4e4e7',
                    boxShadow: '0 6px 20px rgba(255,255,255,0.15)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Get Started Free
              </Button>
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff', ml: 0.5 }} aria-label="Open menu">
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, background: '#0f0f2d', borderLeft: '1px solid rgba(255,255,255,0.07)', px: 2, pt: 2 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ fontWeight: 800, fontSize: '1.1rem', background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            A·VOICES
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List disablePadding>
          {[...NAV_LINKS, { label: 'Sign In', path: '/get-started' }].map(({ label, path }) => (
            <ListItem key={label} component={Link} to={path} onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: '12px', mb: 0.5, textDecoration: 'none', color: 'rgba(255,255,255,0.8)', '&:hover': { background: 'rgba(139,92,246,0.12)', color: '#fff' } }}
            >
              <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600, fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 3, px: 1 }}>
          <Button fullWidth component={Link} to="/get-started" onClick={() => setMobileOpen(false)}
            sx={{ background: BTN_COLOR, color: BTN_TEXT, py: 1.5, borderRadius: '50px', fontWeight: 600, textTransform: 'none', fontSize: '1rem', boxShadow: '0 4px 14px rgba(255,255,255,0.1)' }}
          >
            Get Started Free
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
