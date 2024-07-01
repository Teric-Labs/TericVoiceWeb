import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TericVoicesIcon from '../assets/microphone.png';

const FooterComponent = () => {
  return (
    <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 4, textAlign: 'center', fontFamily: 'Poppins' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <img src={TericVoicesIcon} alt="TericVoices Icon" style={{ height: 30, marginRight: 10 }} />
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'white' }}>African Voices</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Link href="https://www.instagram.com/TericVoices" target="_blank" rel="noopener">
          <IconButton color="inherit">
            <InstagramIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>TericVoices</Typography>
        </Link>
        <Link href="https://twitter.com/Tericvoices" target="_blank" rel="noopener">
          <IconButton color="inherit">
            <TwitterIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>Tericvoices</Typography>
        </Link>
        <Link href="https://wa.me/256750371313" target="_blank" rel="noopener">
          <IconButton color="inherit">
            <WhatsAppIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>+256750371313 / +256773245500</Typography>
        </Link>
        <Link href="https://www.linkedin.com/company/tericvoices" target="_blank" rel="noopener">
          <IconButton color="inherit">
            <LinkedInIcon style={{ color: 'white' }} />
          </IconButton>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>Tericvoices</Typography>
        </Link>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        &copy; {new Date().getFullYear()} TericLabs. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FooterComponent;
