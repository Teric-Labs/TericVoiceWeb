import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { AttachMoney, Rocket, Diamond } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PRICING_TIERS } from '../constants/PricingConstants';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
    h2: {
      fontWeight: 800,
      fontSize: '2.5rem',
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 600,
          padding: '12px 32px',
        },
      },
    },
  },
});

// Feature Chip Component
const PlanChip = ({ plan, isActive, onClick }) => {
  const icons = {
    'Basic': <AttachMoney />,
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

const PricingCard = ({ title, monthly, features, isPopular, isSelected }) => (
  <Paper
    elevation={isSelected || isPopular ? 8 : 2}
    sx={{
      height: '100%',
      borderRadius: '24px',
      transition: 'all 0.3s ease',
      transform: (isSelected || isPopular) ? 'scale(1.05)' : 'scale(1)',
      border: (isSelected || isPopular) ? '2px solid #1976d2' : '1px solid rgba(25, 118, 210, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {isPopular && (
      <Chip
        label="Most Popular"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          color: 'white',
          fontWeight: 600,
        }}
      />
    )}
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
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
            }
          }}
        >
          Get Started Now
        </Button>
      </Box>
    </CardContent>
  </Paper>
);

const PricingComponent = () => {
  const [activePlanIndex, setActivePlanIndex] = useState(1); // Default to Pro plan

  return (
    <ThemeProvider theme={theme}>
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
              Simple, Transparent Pricing
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
              Choose the perfect plan for your needs. No hidden fees, no surprises.
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
          <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto', mb: 8 }}>
            {PRICING_TIERS.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <PricingCard
                  title={tier.title}
                  monthly={tier.monthly}
                  features={tier.features}
                  isPopular={tier.title === 'Pro'}
                  isSelected={activePlanIndex === index}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PricingComponent;