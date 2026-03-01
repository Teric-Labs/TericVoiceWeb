import React from 'react';
import { Box, Typography, Grid, Container, IconButton, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';
const GLASS = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' };

const contactInfo = {
  email: 'labteric@gmail.com',
  instagram: 'https://www.instagram.com/tericdatalabs',
  twitter: 'https://www.twitter.com/tericdatalabs',
  linkedin: 'https://www.linkedin.com/company/tericdatalabs',
  website: 'https://tericweb.web.app/',
  discord: 'https://discord.gg/tericdatalabs',
  slack: 'https://tericdatalabs.slack.com',
};

const CHANNELS = [
  {
    icon: <EmailIcon />,
    label: 'Email',
    value: 'labteric@gmail.com',
    href: 'mailto:labteric@gmail.com',
    color: '#ef4444',
    desc: 'Send us a message directly',
  },
  {
    icon: <LanguageIcon />,
    label: 'Website',
    value: 'tericweb.web.app',
    href: contactInfo.website,
    color: '#0ea5e9',
    desc: 'Visit our company website',
  },
  {
    icon: <LinkedInIcon />,
    label: 'LinkedIn',
    value: 'TericData Labs',
    href: contactInfo.linkedin,
    color: '#0077B5',
    desc: 'Connect professionally',
  },
  {
    icon: <TwitterIcon />,
    label: 'Twitter / X',
    value: '@tericdatalabs',
    href: contactInfo.twitter,
    color: '#1DA1F2',
    desc: 'Follow for updates',
  },
  {
    icon: <InstagramIcon />,
    label: 'Instagram',
    value: '@tericdatalabs',
    href: contactInfo.instagram,
    color: '#E4405F',
    desc: 'Behind the scenes',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.01.043.027.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    ),
    label: 'Discord',
    value: 'Join our server',
    href: contactInfo.discord,
    color: '#5865F2',
    desc: 'Community & support',
  },
];

const ContactCard = ({ icon, label, value, href, color, desc }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" underline="none" sx={{ display: 'block' }}>
    <Box sx={{
      ...GLASS,
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      transition: 'all 0.25s ease',
      cursor: 'pointer',
      '&:hover': {
        background: 'rgba(255,255,255,0.07)',
        borderColor: `${color}40`,
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px ${color}15`,
      },
    }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </Typography>
        <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </Typography>
        <Typography sx={{ color: '#475569', fontSize: '0.78rem' }}>{desc}</Typography>
      </Box>
      <Box sx={{ color: '#475569', fontSize: '1.2rem' }}>→</Box>
    </Box>
  </Link>
);

const ContactComponent = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    {/* Header */}
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2,
        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '50px', px: 2.5, py: 0.8,
      }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: GOLD }} />
        <Typography sx={{ color: GOLD, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          TericData Labs
        </Typography>
      </Box>
      <Typography sx={{
        fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, letterSpacing: '-0.02em',
        background: G, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        mb: 1.5, lineHeight: 1.15,
      }}>
        Get in Touch
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: '1rem', maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
        A-Voices is a product of TericData Labs. Connect with us through any of these channels — we'd love to hear from you.
      </Typography>
    </Box>

    {/* Cards */}
    <Box sx={{ ...GLASS, overflow: 'hidden' }}>
      {/* Gold accent bar */}
      <Box sx={{ height: 3, background: `linear-gradient(90deg, #0ea5e9, #f59e0b, #8b5cf6)` }} />

      <Box sx={{ p: { xs: 2.5, md: 4 } }}>
        <Grid container spacing={2}>
          {CHANNELS.map((ch) => (
            <Grid item xs={12} sm={6} key={ch.label}>
              <ContactCard {...ch} />
            </Grid>
          ))}
        </Grid>

        {/* Bottom note */}
        <Box sx={{
          mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <Typography sx={{ color: '#475569', fontSize: '0.88rem' }}>
            Usually respond within{' '}
            <Box component="span" sx={{ color: '#0ea5e9', fontWeight: 600 }}>24 hours</Box>
            {' '}on business days.
          </Typography>
        </Box>
      </Box>
    </Box>
  </Container>
);

export default ContactComponent;
