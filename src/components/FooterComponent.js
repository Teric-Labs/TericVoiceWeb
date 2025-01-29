import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import wrk from '../assets/microphone.png';

const FooterComponent = () => {
  const socialLinks = [
    { icon: <InstagramIcon />, url: 'https://instagram.com/tericvoices', label: 'Instagram' },
    { icon: <TwitterIcon />, url: 'https://twitter.com/tericvoices', label: 'Twitter' },
    { icon: <WhatsAppIcon />, url: 'https://wa.me/256750371313', label: 'WhatsApp' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/company/tericvoices', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { title: 'Get Started', path: '/get-started' },
    { title: 'Pricing', path: '/pricing' },
    { title: 'API Doc', path: '/documentation' },
    { title: 'About Us', path: '/about' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: { xs: 6, md: 8 },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderTop: '1px solid rgba(25, 118, 210, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src={wrk}
                alt="African Voices Logo"
                style={{
                  height: 40,
                  marginRight: '12px',
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                African Voices
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
                maxWidth: '300px'
              }}
            >
              Empowering African voices through innovative speech technology solutions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease',
                    },
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="nav"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  +256 750 371313
                  <br />
                  +256 773 245500
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  contact@tericvoices.com
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Newsletter Signup */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Subscribe to Our Newsletter
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Stay updated with our latest news and updates.
            </Typography>
            {/* Add newsletter form component here */}
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(25, 118, 210, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            © {new Date().getFullYear()} TericLabs. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterComponent;