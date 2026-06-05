import React from 'react';
import { Box } from '@mui/material';
import PublicPageLayout from './marketing/PublicPageLayout';
import MainComponent from './MainComponent';
import '../App.css';

const LandingPage = () => (
  <PublicPageLayout noPad>
    <Box sx={{ bgcolor: 'transparent' }}>
      <MainComponent />
    </Box>
  </PublicPageLayout>
);

export default LandingPage;
