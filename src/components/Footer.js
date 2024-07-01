import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Place,
  Phone,
  ArrowCircleRight,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid #7B89AB',
        backgroundColor: 'primary.main',
        color: 'white',
        mx: 'auto',
        padding: 3,
      }}
      id="contact"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
            SOCIAL MEDIA
          </Typography>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}>
            <GitHub />
            <Typography variant="body2" sx={{ ml: 1 }}>
              GitHub
            </Typography>
          </Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}>
            <Email />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Email
            </Typography>
          </Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}>
            <Twitter />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Twitter
            </Typography>
          </Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}>
            <LinkedIn />
            <Typography variant="body2" sx={{ ml: 1 }}>
              LinkedIn
            </Typography>
          </Box>

          
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
            PAGES
          </Typography>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}><Link to="/projects" variant="body2" sx={{ color: 'white', my: 0.5 }} >PRODUCTS</Link></Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}><Link to="/projects" variant="body2" sx={{ color: 'white', my: 0.5 }} >SOLUTIONS</Link></Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}><Link to="/projects" variant="body2" sx={{ color: 'white', my: 0.5 }} >BLOG</Link></Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}><Link to="/projects" variant="body2" sx={{ color: 'white', my: 0.5 }} >SIGNIN</Link></Box>
          <Box sx={{ display: 'flex',alignItems: 'center',cursor: 'pointer', my: 1,}}><Link to="/projects" variant="body2" sx={{ color: 'white', my: 0.5 }} >SIGNUP</Link></Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
            SERVICES
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', my: 1,}}>
                <ArrowCircleRight />
                <Typography variant="body2" sx={{ ml: 1 }}>
                OCR For PDFs & Image Documents
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', my: 1,}}>
                <ArrowCircleRight />
                <Typography variant="body2" sx={{ ml: 1 }}>
                Document Classification
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', my: 1,}}>
                <ArrowCircleRight />
                <Typography variant="body2" sx={{ ml: 1 }}>
                Document Translation
                </Typography>
            </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
            HAVE A QUESTION?
          </Typography>
          <Typography variant="body2" sx={{ my: 0.5 }}>
            Reach out to us for Consultancy
          </Typography>
          <Box sx={{display:"flex", alignItems:"center", cursor:"pointer"}}>
                <Phone/>
                <Typography variant="body2" sx={{my:1}}> +256705451834 or +256702560814</Typography>
            </Box>

            <Box sx={{display:"flex", alignItems:"center", cursor:"pointer"}}>
                <Place/>
                <Typography variant="body2" sx={{my:1}}>Location: Makerere University, Kampala, Uganda</Typography>
            </Box>

            <Box sx={{display:"flex", alignItems:"center", cursor:"pointer"}}>
                <Email/>
                <Typography variant="body2" sx={{my:1}}>tobiusaolo21@gmail.com</Typography>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
