import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import EnhancedHeroSection from './EnhancedHeroSection';
import ServiceSections from './ServiceSections';

// Custom styled components
const HeroContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f1faee 0%, #ffffff 100%)',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  backgroundColor: '#fff',
  boxShadow: '0 8px 32px rgba(230, 57, 70, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(230, 57, 70, 0.2)',
  },
}));

const MainComponent = () => {
  return (
    <Box sx={{ bgcolor: '#f1faee', minHeight: '100vh' }}>
      <HeroContainer maxWidth="xl">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12}>
            <SectionPaper elevation={0}>
              <EnhancedHeroSection />
            </SectionPaper>
          </Grid>
        </Grid>
      </HeroContainer>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <SectionPaper elevation={0}>
          <ServiceSections />
        </SectionPaper>
      </Container>
    </Box>
  );
};

export default MainComponent;