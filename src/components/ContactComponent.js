import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container,
  Paper, 
  IconButton,
  Link,
  Divider
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { DiscAlbumIcon, Slack } from 'lucide-react';

const contactInfo = {
  email: 'labteric@gmail.com',
  phone: '(256) 750371313/(256) 702560814',
  instagram: 'https://www.instagram.com/tericdatalabs',
  twitter: 'https://www.twitter.com/tericdatalabs',
  linkedin: 'https://www.linkedin.com/company/tericdatalabs',
  website: 'https://tericweb.web.app/',
  discord: 'https://discord.gg/tericdatalabs',
  slack: 'https://tericdatalabs.slack.com'
};

const SocialLink = ({ icon, text, href, color }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateX(8px)'
      }
    }}
  >
    <IconButton 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      sx={{
        backgroundColor: `${color}15`,
        mr: 2,
        '&:hover': {
          backgroundColor: `${color}25`,
        }
      }}
    >
      {icon}
    </IconButton>
    <Link 
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      sx={{ 
        color: 'text.primary',
        textDecoration: 'none',
        fontFamily: 'Poppins',
        '&:hover': {
          color: color,
        }
      }}
    >
      {text}
    </Link>
  </Box>
);

const ContactComponent = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        minHeight: '100vh', 
        py: 8,
        backgroundColor: 'background.default'
      }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 3,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            A-Voices is a product of TericData Labs. Connect with us through any of these channels.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: '24px',
            maxWidth: '1200px',
            margin: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
          }}
        >
          <Grid container spacing={4}>
            {/* Direct Contact Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                Direct Contact
              </Typography>
              <SocialLink 
                icon={<EmailIcon sx={{ color: '#EA4335' }} />}
                text={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
                color="#EA4335"
              />
              <SocialLink 
                icon={<PhoneIcon sx={{ color: '#34A853' }} />}
                text={contactInfo.phone}
                href={`tel:${contactInfo.phone.split('/')[0]}`}
                color="#34A853"
              />
              <SocialLink 
                icon={<LanguageIcon sx={{ color: '#1976d2' }} />}
                text="Visit our website"
                href={contactInfo.website}
                color="#1976d2"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                Social Media
              </Typography>
              <SocialLink 
                icon={<LinkedInIcon sx={{ color: '#0077B5' }} />}
                text="TericData Labs"
                href={contactInfo.linkedin}
                color="#0077B5"
              />
              <SocialLink 
                icon={<TwitterIcon sx={{ color: '#1DA1F2' }} />}
                text="@tericdatalabs"
                href={contactInfo.twitter}
                color="#1DA1F2"
              />
              <SocialLink 
                icon={<InstagramIcon sx={{ color: '#E4405F' }} />}
                text="@tericdatalabs"
                href={contactInfo.instagram}
                color="#E4405F"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
            </Grid>

            {/* Community Platforms */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                Join Our Community
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <SocialLink 
                    icon={<DiscAlbumIcon size={24} style={{ color: '#5865F2' }} />}
                    text="Join our Discord server"
                    href={contactInfo.discord}
                    color="#5865F2"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SocialLink 
                    icon={<Slack size={24} style={{ color: '#E01E5A' }} />}
                    text="Connect on Slack"
                    href={contactInfo.slack}
                    color="#E01E5A"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ContactComponent;