import React from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import EnhancedHeroSection from './EnhancedHeroSection';
import ServiceSections from './ServiceSections';

const HeroContainer = styled(Container)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  background: 'ur[](https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80) no-repeat center right',
  backgroundSize: '40%',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  backgroundColor: 'transparent',
  boxShadow: 'none',
}));

const MainComponent = () => {
  return (
    <Box sx={{ bgcolor: '#000', minHeight: '80vh', color: '#fff' }}>
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