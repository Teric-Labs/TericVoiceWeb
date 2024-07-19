import React from 'react';
import { PRICING_TIERS } from '../constants/PricingConstants';
import { Card, CardContent, Typography, Grid, Container, Button, List, ListItem, ListItemIcon, ListItemText, Box, CardHeader, Divider } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
    fontSize: 11,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
        },
      },
    },
  },
});
const PricingCard = ({ title, monthly, features }) => (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        title={title}
        sx={{ backgroundColor: '#1976d2', color: 'white', textAlign: 'center', padding: 2 }}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ marginBottom: 2, padding: 2, border: '1px solid #1976d2', borderRadius: 1, backgroundColor: '#e3f2fd', textAlign: 'center' }}>
        <Typography variant="h6" component="div" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          {monthly}
        </Typography>
      </Box>
        <List>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
              {index < features.length - 1 && <Divider variant="middle" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Button variant="contained" color="primary" sx={{ backgroundColor: '#1976d2', color: 'white', textTransform: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#155a9a' } }}>
          Subscribe
        </Button>
      </Box>
    </Card>
  );
  

const PricingComponet = () => (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container sx={{ marginTop: 4, textAlign: 'center', mb:10 }}>
      <Box
        sx={{
          width: '100%',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: 2,
          marginBottom: 4,
        }}
      >
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
          Pricing
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {PRICING_TIERS.map((tier, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <PricingCard
              title={tier.title}
              monthly={tier.monthly}
              features={tier.features}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  </ThemeProvider>
);

export default PricingComponet;
