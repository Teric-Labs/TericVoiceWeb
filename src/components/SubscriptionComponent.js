import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Modal,
  CardHeader,
  Divider,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Chip,
  Paper,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PRICING_TIERS } from '../constants/PricingConstants';
import StripeCheckoutForm from './StripeCheckoutForm';
import { LocalAtm, Diamond, Rocket } from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
    fontSize: 11,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1.1rem',
          padding: '12px 32px',
        },
      },
    },
  },
});

// Feature Chip Component
const PlanChip = ({ plan, isActive, onClick }) => {
  const icons = {
    'Basic': <LocalAtm />,
    'Pro': <Diamond />,
    'Enterprise': <Rocket />,
  };

  return (
    <Chip
      label={plan.title}
      icon={icons[plan.title]}
      onClick={onClick}
      sx={{
        height: '48px',
        borderRadius: '24px',
        fontWeight: 600,
        fontSize: '0.95rem',
        px: 2,
        py: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        backgroundColor: isActive ? 'primary.main' : 'background.paper',
        color: isActive ? 'white' : 'text.primary',
        boxShadow: isActive ? '0 4px 20px rgba(25, 118, 210, 0.25)' : 'none',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: isActive ? 'primary.main' : 'background.paper',
        },
        '& .MuiChip-icon': {
          color: isActive ? 'white' : 'primary.main',
          marginRight: '8px',
        }
      }}
    />
  );
};

const PricingCard = ({ title, monthly, features, onSubscribe, isSelected }) => (
  <Paper
    elevation={isSelected ? 8 : 2}
    sx={{
      height: '100%',
      borderRadius: '24px',
      transition: 'all 0.3s ease',
      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      border: isSelected ? '2px solid #1976d2' : '1px solid rgba(25, 118, 210, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        p: 3,
        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
    </Box>
    <CardContent sx={{ p: 4 }}>
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: '16px',
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          {monthly}
        </Typography>
      </Box>
      <List>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <CheckIcon sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText 
                primary={feature}
                primaryTypographyProps={{
                  sx: { fontSize: '0.95rem' }
                }}
              />
            </ListItem>
            {index < features.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={() => onSubscribe(title, monthly)}
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
            }
          }}
        >
          {monthly.toLowerCase() === 'custom pricing' ? 'Contact Support' : 'Subscribe Now'}
        </Button>
      </Box>
    </CardContent>
  </Paper>
);

const SubscriptionComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubscribe = (title, monthly) => {
    if (monthly.toLowerCase() === 'custom pricing') {
      alert('Contact support at support@example.com');
      return;
    }
    const selectedTier = PRICING_TIERS.find(tier => tier.title === title);
    setSelectedPlan({ title, monthly, tierId: selectedTier.id });
    setIsModalOpen(true);
  };

  const getAmountInCents = (monthly) => {
    return parseInt(monthly.replace(/[^0-9]/g, '')) * 100;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ minHeight: '100vh', py: 8 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 12 }}>
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
              Choose Your Plan
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
              Select the perfect plan for your needs with our flexible pricing options
            </Typography>
          </Box>

          {/* Plan Selection Chips */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 6,
            }}
          >
            {PRICING_TIERS.map((tier, index) => (
              <PlanChip
                key={index}
                plan={tier}
                isActive={activePlanIndex === index}
                onClick={() => setActivePlanIndex(index)}
              />
            ))}
          </Box>

          {/* Pricing Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {PRICING_TIERS.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <PricingCard
                  title={tier.title}
                  monthly={tier.monthly}
                  features={tier.features}
                  onSubscribe={handleSubscribe}
                  isSelected={activePlanIndex === index}
                />
              </Grid>
            ))}
          </Grid>

          {/* Subscription Modal */}
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              sx={{
                width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
                maxHeight: '90vh',
                overflow: 'auto',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {selectedPlan ? `Subscribe to ${selectedPlan.title}` : 'Loading...'}
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                {selectedPlan && (
                  <>
                    <Box
                      sx={{
                        mb: 4,
                        p: 2,
                        borderRadius: '16px',
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        Monthly fee: {selectedPlan.monthly}
                      </Typography>
                    </Box>
                    <StripeCheckoutForm
                      amount={getAmountInCents(selectedPlan.monthly)}
                      tier={selectedPlan.title}
                      tierId={selectedPlan.tierId}
                      userId={user.userId}
                      onClose={() => setIsModalOpen(false)}
                    />
                  </>
                )}
              </CardContent>
            </Paper>
          </Modal>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SubscriptionComponent;