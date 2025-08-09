import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Container, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Chip,
  Paper,
  Stack
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { styled, keyframes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TranslateIcon from '@mui/icons-material/Translate';
import RecordIcon from '@mui/icons-material/RecordVoiceOver';
import { Link } from 'react-router-dom';

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

let theme = createTheme({
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
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      color: '#1976d2',
    },
    h2: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h3: {
      fontWeight: 600,
      color: '#1976d2',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          borderRadius: '16px',
          border: '1px solid rgba(25, 118, 210, 0.1)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          padding: '12px 24px',
          fontWeight: 600,
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const FeatureSection = ({ features }) => (
  <Box sx={{ bgcolor: '#f8fafc', py: 8, position: 'relative' }}>
    {/* Floating elements for feature section */}
    <FloatingElement size="80px" position={{ top: '10%', left: '5%' }} delay="0s" color="#64b5f6" />
    <FloatingElement size="60px" position={{ bottom: '20%', right: '10%' }} delay="1s" />
    
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                p: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
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
                animation: `${slideUp} 0.6s ease-out forwards`,
                animationDelay: `${index * 0.2}s`,
                opacity: 0,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#666666', lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      mr: 2, 
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(100, 181, 246, 0.05))',
                      border: '1px solid rgba(25, 118, 210, 0.2)',
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Button
                    variant="contained"
                    component={Link}
                    to={feature.link}
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                      },
                      borderRadius: '24px',
                      px: 3,
                      py: 1,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const PricingCard = ({ title, monthly, features }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
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
  }}>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box
        sx={{
          marginY: 3,
          padding: 2,
          border: '1px solid rgba(25, 118, 210, 0.2)',
          borderRadius: '12px',
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          textAlign: 'center',
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
        <Typography variant="h4" component="div" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          {monthly}
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
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
              <ListItemText primary={feature} sx={{ color: '#000000' }} />
            </ListItem>
            {index < features.length - 1 && <Divider sx={{ borderColor: 'rgba(25, 118, 210, 0.1)' }} />}
          </React.Fragment>
        ))}
      </List>
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
          },
          borderRadius: '24px',
          py: 1.5,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        Subscribe Now
      </Button>
    </CardContent>
  </Card>
);

const APIComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        bgcolor: '#f8fafc', 
        minHeight: '100vh',
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
          <Box sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: 'white',
            py: 8,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    mb: 2,
                    letterSpacing: '-0.03em',
                    lineHeight: 0.9,
                    animation: isVisible ? `${shimmer} 3s ease-in-out infinite` : 'none',
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  A-Voices API
                </Typography>
                <Typography 
                  variant="h5" 
                  paragraph 
                  sx={{ 
                    maxWidth: '800px', 
                    mx: 'auto', 
                    mb: 4,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                  }}
                >
                  Powerful, scalable, and easy-to-integrate APIs for multilingual content processing
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
                }}>
                  <Chip
                    icon={<TranslateIcon />}
                    label="Multilingual Support"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      px: 2,
                      '& .MuiChip-icon': { color: 'white' },
                      animation: `${slideUp} 0.6s ease-out forwards`,
                      animationDelay: '0.8s',
                      opacity: 0,
                    }}
                  />
                  <Chip
                    icon={<RecordVoiceOverIcon />}
                    label="Real-time Processing"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      px: 2,
                      '& .MuiChip-icon': { color: 'white' },
                      animation: `${slideUp} 0.6s ease-out forwards`,
                      animationDelay: '1s',
                      opacity: 0,
                    }}
                  />
                  <Chip
                    icon={<TextFieldsIcon />}
                    label="AI-Powered"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      px: 2,
                      '& .MuiChip-icon': { color: 'white' },
                      animation: `${slideUp} 0.6s ease-out forwards`,
                      animationDelay: '1.2s',
                      opacity: 0,
                    }}
                  />
                </Box>
              </Box>
            </Container>
          </Box>

          {/* Features Section */}
          <FeatureSection
            features={[
              {
                title: 'Text Translation',
                description: 'Translate text content between multiple languages with high accuracy and context awareness.',
                icon: <TranslateIcon sx={{ fontSize: 40 }} />,
                buttonText: 'Get Started',
                link: '/dashboard/translate'
              },
              {
                title: 'Voice Recognition',
                description: 'Convert speech to text with support for multiple languages and dialects.',
                icon: <RecordIcon sx={{ fontSize: 40 }} />,
                buttonText: 'Try Now',
                link: '/dashboard/transcribe'
              },
              {
                title: 'Text to Speech',
                description: 'Convert text to natural-sounding speech in multiple languages.',
                icon: <RecordVoiceOverIcon sx={{ fontSize: 40 }} />,
                buttonText: 'Explore',
                link: '/dashboard/synthesize'
              },
              {
                title: 'Voice to Voice',
                description: 'Real-time voice translation between different languages.',
                icon: <PlayArrowIcon sx={{ fontSize: 40 }} />,
                buttonText: 'Learn More',
                link: '/dashboard/voice'
              }
            ]}
          />

          {/* Pricing Section */}
          <Box sx={{ py: 8, bgcolor: '#ffffff', position: 'relative' }}>
            {/* Floating elements for pricing section */}
            <FloatingElement size="100px" position={{ top: '20%', left: '10%' }} delay="0s" color="#64b5f6" />
            <FloatingElement size="80px" position={{ bottom: '30%', right: '15%' }} delay="1s" />
            
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1976d2',
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.2s',
                    opacity: 0,
                  }}
                >
                  API Pricing
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#666666', 
                    maxWidth: '600px', 
                    mx: 'auto',
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.4s',
                    opacity: 0,
                  }}
                >
                  Choose the perfect plan for your API usage needs
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <PricingCard
                    title="Starter"
                    monthly="$20/month"
                    features={[
                      "1,000 API calls/month",
                      "Basic language support",
                      "Email support",
                      "Documentation access"
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <PricingCard
                    title="Professional"
                    monthly="$50/month"
                    features={[
                      "10,000 API calls/month",
                      "Full language support",
                      "Priority support",
                      "Advanced features",
                      "Custom integrations"
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <PricingCard
                    title="Enterprise"
                    monthly="Custom"
                    features={[
                      "Unlimited API calls",
                      "All languages & features",
                      "Dedicated support",
                      "Custom solutions",
                      "SLA guarantee"
                    ]}
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/* CTA Section */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            color: 'white',
            py: 8,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Floating elements for CTA section */}
            <FloatingElement size="120px" position={{ top: '20%', right: '10%' }} delay="0s" color="#ffffff" />
            <FloatingElement size="80px" position={{ bottom: '20%', left: '15%' }} delay="1s" color="#ffffff" />
            
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.2s',
                    opacity: 0,
                  }}
                >
                  Ready to Get Started?
                </Typography>
                <Typography 
                  variant="h6" 
                  paragraph 
                  sx={{ 
                    mb: 4,
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.4s',
                    opacity: 0,
                  }}
                >
                  Join thousands of developers using A-Voices API for their multilingual content needs
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '28px',
                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 12px 40px rgba(255, 255, 255, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.6s',
                    opacity: 0,
                  }}
                >
                  Start Building Now
                </Button>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default APIComponent;
