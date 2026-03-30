import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Button, Chip, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { GraphicEq, Email, Phone, Twitter, LinkedIn, Instagram, WhatsApp, ArrowForward } from '@mui/icons-material';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';

const PRODUCT_LINKS = [
  { label: 'Text Translation', path: '/get-started' },
  { label: 'Voice Recognition', path: '/get-started' },
  { label: 'Text to Speech', path: '/get-started' },
  { label: 'Voice to Voice', path: '/get-started' },
  { label: 'AI Agents', path: '/get-started' },
  { label: 'Summarization', path: '/get-started' },
];

const DEV_LINKS = [
  { label: 'API Documentation', path: '/documentation' },
  { label: 'API Reference', path: '/documentation' },
  { label: 'Language Support', path: '/language-support' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Status', path: '/' },
];

const COMPANY_LINKS = [
  { label: 'About Us', path: '/' },
  { label: 'Blog', path: '/' },
  { label: 'Careers', path: '/' },
  { label: 'Privacy Policy', path: '/' },
  { label: 'Terms of Service', path: '/' },
];

const SOCIAL = [
  { icon: <Twitter sx={{ fontSize: 18 }} />, label: 'Twitter',   href: '#' },
  { icon: <LinkedIn sx={{ fontSize: 18 }} />, label: 'LinkedIn',  href: '#' },
  { icon: <Instagram sx={{ fontSize: 18 }} />, label: 'Instagram', href: '#' },
  { icon: <WhatsApp sx={{ fontSize: 18 }} />, label: 'WhatsApp', href: '#' },
];

function FooterLink({ label, path }) {
  return (
    <Box component={Link} to={path} sx={{
      display: 'block', color: '#64748b', fontSize: '0.9rem', fontWeight: 500,
      textDecoration: 'none', mb: 1.5,
      transition: 'color 0.2s ease',
      '&:hover': { color: '#0ea5e9' },
    }}>
      {label}
    </Box>
  );
}

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ background: '#05051a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Top glow line */}
      <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}70, transparent)` }} />

      {/* Newsletter band */}
      <Box sx={{ background: 'rgba(14,165,233,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 5 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.2rem', mb: 0.5 }}>
                Stay up to date with A·VOICES
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.92rem' }}>
                New languages, features and developer updates — straight to your inbox.
              </Typography>
            </Box>
            <Button
              component={Link} to="/get-started" variant="contained" endIcon={<ArrowForward />}
              sx={{
                background: G, color: '#fff', fontWeight: 700, px: 3, py: 1.3,
                borderRadius: '50px', fontSize: '0.92rem',
                boxShadow: '0 4px 18px rgba(14,165,233,0.35)',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 24px rgba(14,165,233,0.5)' },
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main footer grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 6 }}>
          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: '10px', background: G,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(14,165,233,0.4)',
              }}>
                <GraphicEq sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box sx={{
                fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em',
                background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                A·VOICES
              </Box>
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.75, mb: 3, maxWidth: 320 }}>
              Africa's leading voice AI platform. Transcribe, translate, synthesize and converse in 50+ African and global languages.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {SOCIAL.map(({ icon, label, href }) => (
                <IconButton
                  key={label} component="a" href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    width: 38, height: 38, border: '1px solid rgba(255,255,255,0.08)',
                    color: '#64748b', borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': { color: '#0ea5e9', borderColor: 'rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.08)' },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ fontSize: 16, color: '#475569' }} />
                <Typography sx={{ color: '#64748b', fontSize: '0.88rem' }}>contact@tericvoices.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ fontSize: 16, color: '#475569' }} />
                <Typography sx={{ color: '#64748b', fontSize: '0.88rem' }}>+256 700 000 000</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Product links */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2.5 }}>
              Product
            </Typography>
            {PRODUCT_LINKS.map(l => <FooterLink key={l.label} {...l} />)}
          </Grid>

          {/* Developer links */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2.5 }}>
              Developers
            </Typography>
            {DEV_LINKS.map(l => <FooterLink key={l.label} {...l} />)}
          </Grid>

          {/* Company links */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2.5 }}>
              Company
            </Typography>
            {COMPANY_LINKS.map(l => <FooterLink key={l.label} {...l} />)}
            <Box sx={{ mt: 3 }}>
              <Chip label="🌍 Made in Africa" size="small" sx={{
                background: `rgba(245,158,11,0.1)`, border: `1px solid rgba(245,158,11,0.3)`,
                color: GOLD, fontWeight: 700, fontSize: '0.78rem', borderRadius: '50px',
                '& .MuiChip-label': { px: 2 },
              }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom bar */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ color: '#374151', fontSize: '0.85rem' }}>
            © {year} A-Voices / Teric Voices. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <Box key={t} component={Link} to="/" sx={{ color: '#374151', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#0ea5e9' } }}>
                {t}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
