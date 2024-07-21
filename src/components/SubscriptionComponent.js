import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Card, CardContent, Modal,
  CardHeader, Divider, Container, List, ListItem, ListItemIcon, ListItemText,
  CssBaseline
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PRICING_TIERS } from '../constants/PricingConstants';
import StripeCheckoutForm from './StripeCheckoutForm';

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

const PricingCard = ({ title, monthly, features, onSubscribe }) => {
  const getButtonLabel = () => {
    if (monthly.toLowerCase() === 'custom pricing') {
      return 'Contact Support';
    }
    if (monthly.toLowerCase() === 'free for 1 month') {
      return 'Upgrade';
    }
    return 'Subscribe';
  };

  const handleClick = () => {
    if (monthly.toLowerCase() === 'custom pricing') {
      alert('Contact support at support@example.com');
    } else {
      onSubscribe(title, monthly);
    }
  };

  return (
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
          onClick={handleClick}
        >
          {getButtonLabel()}
        </Button>
      </Box>
    </Card>
  );
};

const SubscriptionComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleSubscribe = async (title, monthly) => {
    const selectedTier = PRICING_TIERS.find(tier => tier.title === title);
    try {
      setSelectedPlan({ title, monthly, tierId: selectedTier.id });
      setIsModalOpen(true);
    } catch (error) {
      console.error('An error occurred:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const getAmountInCents = (monthly) => {
    return parseInt(monthly.replace(/[^0-9]/g, '')) * 100; 
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
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="payment-modal"
        aria-describedby="payment-form"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          {selectedPlan ? (
            <>
              <Typography id="payment-modal" variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Subscribe to {selectedPlan.title}
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Monthly fee: {selectedPlan.monthly}
              </Typography>
              {selectedPlan.monthly.toLowerCase() === 'contact support' ? (
                <Button variant="contained" color="primary" fullWidth onClick={() => alert('Contact support at support@example.com')}>
                  Contact Support
                </Button>
              ) : (
                <StripeCheckoutForm 
                  amount={getAmountInCents(selectedPlan.monthly)} 
                  tier={selectedPlan.title}
                  tierId={selectedPlan.tierId}
                  userId={user.userId}
                  onClose={handleCloseModal} 
                />
              )}
            </>
          ) : (
            <Typography variant="subtitle1" gutterBottom>
              Loading...
            </Typography>
          )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default SubscriptionComponent;
