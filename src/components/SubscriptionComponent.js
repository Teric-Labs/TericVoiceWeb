import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Button, Card, CardContent,
  CardHeader, Divider, Container, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PRICING_TIERS } from '../constants/PricingConstants';

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

const PricingCard = ({ title, monthly, features, onSubscribe }) => (
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
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ backgroundColor: '#1976d2', color: 'white', textTransform: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#155a9a' } }}
        onClick={() => onSubscribe(title, monthly)}
      >
        Subscribe
      </Button>
    </Box>
  </Card>
);

const SubscriptionComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleSubscribe = (title, monthly) => {
    console.log(`Subscribed to: ${title} - ${monthly}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box p={3} sx={{ margin: 'auto' }}>
        <Container sx={{ marginTop: 4, textAlign: 'center', mb: 10 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: theme.palette.text.secondary }}>
                Subscribe 
              </Typography>
            </CardContent>
          </Card>
          <Grid container spacing={3}>
            {PRICING_TIERS.map((tier, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <PricingCard
                  title={tier.title}
                  monthly={tier.monthly}
                  features={tier.features}
                  onSubscribe={handleSubscribe}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SubscriptionComponent;
