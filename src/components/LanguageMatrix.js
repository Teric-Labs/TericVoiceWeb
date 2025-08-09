import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { styled, keyframes } from '@mui/material/styles';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LanguageIcon from '@mui/icons-material/Language';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import UpdateIcon from '@mui/icons-material/Update';
import CssBaseline from '@mui/material/CssBaseline';

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
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha('#1976d2', 0.1),
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha('#1976d2', 0.05),
          color: '#1976d2',
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ color: '#1976d2', fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: '#666666' }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const LanguageMatrix = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const languageData = [
    { name: 'English', code: 'en', region: 'Global' },
    { name: 'Luganda', code: 'lg', region: 'Uganda' },
    { name: 'Runyankole', code: 'nyn', region: 'Uganda' },
    { name: 'Acholi', code: 'ac', region: 'Uganda' },
    { name: 'Ateso', code: 'at', region: 'Uganda' },
    { name: 'French', code: 'fr', region: 'Global' },
    { name: 'Lumasaba', code: 'myx', region: 'Uganda' },
    { name: 'Lusoga', code: 'xog', region: 'Uganda' },
    { name: 'Swahili', code: 'sw', region: 'East Africa' }
  ];

  const supportMatrix = {
    'Text Translation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Audio Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Video Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Text to Speech': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda'],
    'Voice to Voice': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda'],
    'Summarization': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'LLM': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Voice Conversation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda'],
  };

  const getSupportStatus = (language, feature) => {
    const supportedLanguages = supportMatrix[feature] || [];
    return supportedLanguages.includes(language.name);
  };

  const getStatusIcon = (isSupported) => {
    return isSupported ? (
      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
    ) : (
      <HourglassEmptyIcon sx={{ color: '#ff9800', fontSize: 20 }} />
    );
  };

  const getStatusChip = (isSupported) => {
    return (
      <Chip
        label={isSupported ? 'Supported' : 'Coming Soon'}
        size="small"
        sx={{
          backgroundColor: isSupported ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
          color: isSupported ? '#4caf50' : '#ff9800',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ 
          py: 6, 
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
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
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 50%, #0d47a1 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  mb: 2,
                  animation: isVisible ? `${shimmer} 3s ease-in-out infinite` : 'none',
                  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Language Support Matrix
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '800px',
                  mx: 'auto',
                  fontWeight: 500,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                }}
              >
                Comprehensive language support across all our AI-powered services
              </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={LanguageIcon}
                  title="Total Languages"
                  value={languageData.length}
                  description="Supported languages across our platform"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={TranslateIcon}
                  title="Translation Services"
                  value="8"
                  description="Different translation and processing services"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={AutoGraphIcon}
                  title="Coverage"
                  value="95%"
                  description="Language coverage for African languages"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={UpdateIcon}
                  title="Regular Updates"
                  value="Monthly"
                  description="New languages and features added regularly"
                />
              </Grid>
            </Grid>

            {/* Language Matrix Table */}
            <Paper sx={{ p: 4, borderRadius: '16px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#1976d2' }}>
                Language Support Overview
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Language</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Region</TableCell>
                      {Object.keys(supportMatrix).map((feature) => (
                        <TableCell key={feature} sx={{ fontWeight: 600, color: '#1976d2', textAlign: 'center' }}>
                          {feature}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {languageData.map((language) => (
                      <TableRow key={language.code} sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.02)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                              {language.name}
                            </Typography>
                            <Chip
                              label={language.code.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                color: '#1976d2',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: '#666666' }}>
                            {language.region}
                          </Typography>
                        </TableCell>
                        {Object.keys(supportMatrix).map((feature) => {
                          const isSupported = getSupportStatus(language, feature);
                          return (
                            <TableCell key={feature} sx={{ textAlign: 'center' }}>
                              <Tooltip title={isSupported ? 'Supported' : 'Coming Soon'}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  {getStatusIcon(isSupported)}
                                </Box>
                              </Tooltip>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Feature Details */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {Object.entries(supportMatrix).map(([feature, supportedLanguages]) => (
                <Grid item xs={12} sm={6} md={4} key={feature}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                        {feature}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: '#666666' }}>
                        {supportedLanguages.length} languages supported
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {supportedLanguages.slice(0, 3).map((lang) => (
                          <Chip
                            key={lang}
                            label={lang}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          />
                        ))}
                        {supportedLanguages.length > 3 && (
                          <Chip
                            label={`+${supportedLanguages.length - 3} more`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(25, 118, 210, 0.05)',
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LanguageMatrix;