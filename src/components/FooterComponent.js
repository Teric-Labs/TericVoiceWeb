import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Button, Divider, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { GraphicEq, Email, ArrowForward } from '@mui/icons-material';
import phosaiLogo from '../assets/logo.jpg';
import { M_AC, M_GRADIENT, M_BLACK, M_BORDER, M_SURFACE, M_TEXT_MUTED, mBtnPrimary } from './marketing/marketingTokens';

const PRODUCT_LINKS = [
  { label: 'Transcribe', path: '/get-started' },
  { label: 'Translate', path: '/get-started' },
  { label: 'Synthesize', path: '/get-started' },
  { label: 'Summarize', path: '/get-started' },
  { label: 'Video dubbing', path: '/get-started' },
  { label: 'AI agents', path: '/get-started' },
];

const DEV_LINKS = [
  { label: 'API documentation', path: '/documentation' },
  { label: 'Language support', path: '/language-support' },
  { label: 'Pricing', path: '/pricing' },
];

const COMPANY_LINKS = [
  { label: 'About', path: '/' },
  { label: 'Privacy', path: '/' },
  { label: 'Terms', path: '/' },
];

const SOCIAL = [
  { label: 'Discord', href: 'https://discord.gg/phosai' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/phosai' },
  { label: 'X', href: 'https://x.com/phosai' },
];

function FooterLink({ label, path }) {
  return (
    <Box
      component={Link}
      to={path}
      sx={{
        display: 'block',
        color: M_TEXT_MUTED,
        fontSize: '0.875rem',
        fontWeight: 500,
        textDecoration: 'none',
        mb: 1.25,
        transition: 'color 0.15s',
        '&:hover': { color: M_AC },
      }}
    >
      {label}
    </Box>
  );
}

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: M_SURFACE, borderTop: `1px solid ${M_BORDER}`, mt: 'auto' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px', background: M_GRADIENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraphicEq sx={{ color: M_BLACK, fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: M_BLACK, letterSpacing: '-0.02em' }}>
                A·VOICES
              </Typography>
            </Box>
            <Typography sx={{ color: M_TEXT_MUTED, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 320, mb: 3 }}>
              Voice AI for Africa and the world. Transcribe, translate, synthesize, and build with 50+ languages.
            </Typography>
            <Button
              component={Link}
              to="/get-started"
              endIcon={<ArrowForward />}
              sx={{ ...mBtnPrimary, px: 2.5, py: 1, fontSize: '0.88rem' }}
            >
              Get started free
            </Button>
          </Grid>

          <Grid item xs={6} sm={4} md={2.5}>
            <Typography sx={{ color: M_BLACK, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
              Product
            </Typography>
            {PRODUCT_LINKS.map(l => <FooterLink key={l.label} {...l} />)}
          </Grid>

          <Grid item xs={6} sm={4} md={2.5}>
            <Typography sx={{ color: M_BLACK, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
              Developers
            </Typography>
            {DEV_LINKS.map(l => <FooterLink key={l.label} {...l} />)}
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography sx={{ color: M_BLACK, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
              Company
            </Typography>
            {COMPANY_LINKS.map(l => <FooterLink key={l.label} {...l} />)}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Email sx={{ fontSize: 16, color: M_TEXT_MUTED }} />
              <Typography sx={{ color: M_TEXT_MUTED, fontSize: '0.82rem' }}>phosaico@gmail.com</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: M_BORDER }} />

      <Container maxWidth="lg">
        <Box sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <StackRow year={year} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {SOCIAL.map(({ label, href }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  border: `1px solid ${M_BORDER}`,
                  borderRadius: '8px',
                  color: M_TEXT_MUTED,
                  fontSize: '0.7rem',
                  '&:hover': { color: M_AC, borderColor: 'rgba(232, 160, 32, 0.3)' },
                }}
              >
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{label[0]}</Typography>
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function StackRow({ year }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography sx={{ color: M_TEXT_MUTED, fontSize: '0.82rem' }}>
        © {year} A·VOICES · Phosai Co.
      </Typography>
      <Avatar src={phosaiLogo} alt="Phosai" sx={{ width: 22, height: 22, border: `1px solid ${M_BORDER}` }} />
    </Box>
  );
}
