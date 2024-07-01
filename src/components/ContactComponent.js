import React from 'react';
import { Box, Typography, Grid, Paper, IconButton,Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

const contactInfo = {
  email: 'labteric@gmail.com',
  phone: '(256) 750371313/(256) 702560814',
  instagram: 'https://www.instagram.com/tericdatalabs',
  twitter: 'https://www.twitter.com/tericdatalabs',
  linkedin: 'https://www.linkedin.com/company/tericdatalabs',
  website: 'https://tericweb.web.app/'
};

const ContactComponent = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Poppins', textAlign: 'center' }}>
          Contact Us
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Poppins', textAlign: 'center', mb: 4 }}>
          A-Voices is a product of TericData Labs. Feel free to reach out to us through any of the following contact points.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: '#246EE9' }} />
              <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
                {contactInfo.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: '#246EE9' }} />
              <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
                {contactInfo.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ mr: 2, color: '#246EE9' }} />
              <Link href={contactInfo.website} target="_blank" rel="noopener" sx={{ fontFamily: 'Poppins', color: '#246EE9' }}>
                {contactInfo.website}
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">
                <InstagramIcon sx={{ color: '#E4405F' }} />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1, fontFamily: 'Poppins' }}>
                @tericdatalabs
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon sx={{ color: '#1DA1F2' }} />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1, fontFamily: 'Poppins' }}>
                @tericdatalabs
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon sx={{ color: '#0077B5' }} />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1, fontFamily: 'Poppins' }}>
                TericData Labs
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  
  );
};

export default ContactComponent;
