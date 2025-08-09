import React, { useState, useEffect } from 'react';
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
import { styled, keyframes } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import { AttachMoney, Rocket, Diamond, Star, TrendingUp, Security } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PRICING_TIERS } from '../constants/PricingConstants';

// Enhanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0px); 
  }
`;

const borderGlow = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

// Floating background elements
const FloatingElement = ({ size, position, delay, color = '#1976d2' }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}20, ${color}05)`,
      border: `1px solid ${color}15`,
      ...position,
      animation: `${float} ${3 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: delay,
      zIndex: 0,
    }}
  />
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#64b5f6',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64b5f6',
      light: '#90caf9',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h2: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
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
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
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
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
          },
        },
      },
    },
  },
});

// Enhanced Plan Chip with animations
const PlanChip = ({ plan, isActive, onClick }) => {
  const icons = {
    'Classic': <AttachMoney />,
    'Classic Pro': <Diamond />,
    'Enterprise Plus': <Rocket />,
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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        backgroundColor: isActive ? '#1976d2' : '#ffffff',
        color: isActive ? '#ffffff' : '#000000',
        boxShadow: isActive ? '0 8px 32px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: isActive ? '2px solid #1976d2' : '1px solid rgba(25, 118, 210, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: isActive ? '#1565c0' : '#f8fafc',
          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
          '&::before': {
            left: '100%',
          },
        },
        '& .MuiChip-icon': {
          color: isActive ? '#ffffff' : '#1976d2',
          marginRight: '8px',
        }
      }}
    />
  );
};

// Enhanced Pricing Card with animations and gradients
const PricingCard = ({ title, monthly, features, isPopular, isSelected }) => (
  <Paper
    elevation={isSelected || isPopular ? 8 : 2}
    sx={{
      height: '100%',
      borderRadius: '24px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: (isSelected || isPopular) ? 'scale(1.02)' : 'scale(1)',
      border: (isSelected || isPopular) ? '2px solid #1976d2' : '1px solid rgba(25, 118, 210, 0.1)',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: (isSelected || isPopular) 
        ? '0 8px 32px rgba(25, 118, 210, 0.15)' 
        : '0 4px 20px rgba(0, 0, 0, 0.08)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #1976d2, #64b5f6, #1976d2)',
        backgroundSize: '200% 200%',
        animation: `${shimmer} 3s ease-in-out infinite`,
      },
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 12px 40px rgba(25, 118, 210, 0.2)',
      },
    }}
  >
    {isPopular && (
      <Chip
        label="Most Popular"
        icon={<Star />}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      />
    )}
    <Box
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        color: '#ffffff',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
        },
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
        {title}
      </Typography>
    </Box>
    <CardContent sx={{ p: 4, position: 'relative' }}>
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: '16px',
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          textAlign: 'center',
          border: '1px solid rgba(25, 118, 210, 0.08)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.3), rgba(100, 181, 246, 0.1))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            opacity: 0,
            animation: `${borderGlow} 2s ease-in-out infinite`,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {monthly}
        </Typography>
      </Box>
      <List>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <ListItem
              sx={{
                animation: `${slideUp} 0.6s ease-out forwards`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
              }}
            >
              <ListItemIcon>
                <CheckIcon sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText 
                primary={feature}
                primaryTypographyProps={{
                  sx: { 
                    fontSize: '0.95rem',
                    color: '#000000',
                    fontWeight: 500,
                  }
                }}
              />
            </ListItem>
            {index < features.length - 1 && <Divider sx={{ borderColor: 'rgba(25, 118, 210, 0.1)' }} />}
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
            },
            borderRadius: '24px',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Get Started Now
        </Button>
      </Box>
    </CardContent>
  </Paper>
);

const PricingComponent = () => {
  const [activePlanIndex, setActivePlanIndex] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Box sx={{ 
          minHeight: '100vh', 
          py: 8, 
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Floating background elements */}
          <FloatingElement size="120px" position={{ top: '10%', left: '5%' }} delay="0s" />
          <FloatingElement size="80px" position={{ top: '60%', left: '10%' }} delay="1s" color="#64b5f6" />
          <FloatingElement size="100px" position={{ top: '20%', right: '15%' }} delay="0.5s" />
          <FloatingElement size="60px" position={{ bottom: '30%', right: '5%' }} delay="1.5s" color="#42a5f5" />
          <FloatingElement size="140px" position={{ bottom: '10%', left: '20%' }} delay="2s" />
          
          {/* Main gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
              zIndex: 1,
            }}
          />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 12 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  background: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 50%, #0d47a1 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  mb: 3,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.9,
                  animation: isVisible ? `${shimmer} 3s ease-in-out infinite` : 'none',
                  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Simple, Transparent
                <br />
                <Box component="span" sx={{ color: '#64b5f6' }}>Pricing</Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 6,
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  lineHeight: 1.6,
                  fontWeight: 400,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
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
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
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
            <Grid 
              container 
              spacing={4} 
              sx={{ 
                maxWidth: '1200px', 
                mx: 'auto', 
                mb: 8,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.9s',
              }}
            >
              {PRICING_TIERS.map((tier, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <PricingCard
                    title={tier.title}
                    monthly={tier.monthly}
                    features={tier.features}
                    isPopular={tier.title === 'Classic Pro'}
                    isSelected={activePlanIndex === index}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PricingComponent;