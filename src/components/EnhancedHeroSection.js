import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Container, Grid, Paper, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { PlayArrow, Translate, RecordVoiceOver, Mic } from '@mui/icons-material';

// Enhanced floating animation
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

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// African Pattern SVG Component
const AfricanPattern = ({ size = 300, color = "#1976d2" }) => (
  <svg width={size} height={size} viewBox="0 0 300 300" style={{ opacity: 0.6 }}>
    {/* Kente-inspired pattern */}
    <defs>
      <pattern id="kente" patternUnits="userSpaceOnUse" width="20" height="20">
        <rect width="20" height="20" fill={`${color}10`}/>
        <rect x="0" y="0" width="10" height="10" fill={`${color}20`}/>
        <rect x="10" y="10" width="10" height="10" fill={`${color}20`}/>
        <circle cx="10" cy="10" r="2" fill={color}/>
      </pattern>
      <linearGradient id="africanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
        <stop offset="50%" stopColor="#ff9800" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#4caf50" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    
    {/* Main African continent silhouette */}
    <path 
      d="M150 30 C120 30, 100 50, 90 80 L85 120 C80 140, 85 160, 95 180 L100 200 C105 220, 115 235, 130 245 L150 260 C170 270, 190 265, 205 250 L220 230 C235 215, 240 195, 235 175 L230 155 C225 135, 220 115, 210 95 C200 75, 185 55, 165 40 C160 35, 155 30, 150 30 Z"
      fill="url(#africanGrad)"
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Traditional symbols */}
    <circle cx="130" cy="100" r="3" fill="#ff9800" opacity="0.8"/>
    <circle cx="170" cy="130" r="4" fill="#4caf50" opacity="0.8"/>
    <circle cx="150" cy="160" r="3" fill="#f44336" opacity="0.8"/>
    
    {/* Decorative border pattern */}
    <circle cx="150" cy="150" r="140" fill="none" stroke="url(#kente)" strokeWidth="20" opacity="0.3"/>
  </svg>
);

// Enhanced Language Chip with micro-interactions
const LanguageChip = ({ label, isPrimary = false, flag }) => (
  <Chip
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {flag && <span style={{ fontSize: '1.2em' }}>{flag}</span>}
        {label}
      </Box>
    }
    sx={{
      m: 0.5,
      backgroundColor: isPrimary ? 'rgba(25, 118, 210, 0.15)' : 'rgba(100, 181, 246, 0.1)',
      color: isPrimary ? '#1976d2' : '#64b5f6',
      borderRadius: '20px',
      border: isPrimary ? '2px solid rgba(25, 118, 210, 0.3)' : '1px solid rgba(100, 181, 246, 0.2)',
      fontSize: '0.875rem',
      fontWeight: isPrimary ? 600 : 500,
      px: 1.5,
      py: 0.5,
      cursor: 'pointer',
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
        backgroundColor: isPrimary ? 'rgba(25, 118, 210, 0.25)' : 'rgba(100, 181, 246, 0.2)',
        transform: 'translateY(-3px) scale(1.05)',
        boxShadow: isPrimary ? '0 8px 25px rgba(25, 118, 210, 0.3)' : '0 8px 25px rgba(100, 181, 246, 0.2)',
        '&::before': {
          left: '100%',
        },
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  />
);

// Enhanced animated word with staggered reveal
const AnimatedWord = ({ word, delay, icon: Icon }) => (
  <Paper
    elevation={0}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative',
      mx: 1,
      my: 0.5,
      px: 2,
      py: 1,
      borderRadius: '25px',
      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(100, 181, 246, 0.05))',
      border: '1px solid rgba(25, 118, 210, 0.2)',
      backdropFilter: 'blur(10px)',
      opacity: 0,
      transform: 'translateY(20px)',
      animation: 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      animationDelay: delay,
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
        animation: 'borderGlow 2s ease-in-out infinite',
        animationDelay: `calc(${delay} + 0.5s)`,
      },
      '@keyframes slideUp': {
        to: { 
          opacity: 1, 
          transform: 'translateY(0px)',
        },
      },
      '@keyframes borderGlow': {
        '0%, 100%': { opacity: 0 },
        '50%': { opacity: 1 },
      },
      '&:hover': {
        transform: 'translateY(-5px) scale(1.05)',
        boxShadow: '0 15px 35px rgba(25, 118, 210, 0.2)',
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
  >
    {Icon && (
      <Icon 
        sx={{ 
          mr: 1, 
          fontSize: '1.2rem', 
          color: '#1976d2',
          animation: `${pulse} 2s ease-in-out infinite`,
          animationDelay: `calc(${delay} + 1s)`,
        }} 
      />
    )}
    <Typography
      component="span"
      sx={{
        fontSize: { xs: '1rem', md: '1.2rem' },
        fontWeight: 600,
        color: '#1976d2',
        letterSpacing: '0.02em',
      }}
    >
      {word}
    </Typography>
  </Paper>
);

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

const EnhancedHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Complete list of African languages with cultural representation
  const languages = [
    { name: 'Luganda', flag: '🇺🇬', isPrimary: true },
    { name: 'Acholi', flag: '🇺🇬', isPrimary: true },
    { name: 'Swahili', flag: '🇰🇪', isPrimary: true },
    { name: 'English', flag: '🌍', isPrimary: true },
    { name: 'Kinyarwanda', flag: '🇷🇼' },
    { name: 'French', flag: '🇫🇷' }
  ];

  const services = [
    { text: 'Transcribe', delay: '0.2s', icon: Mic },
    { text: 'Translate', delay: '0.4s', icon: Translate },
    { text: 'Speak', delay: '0.6s', icon: RecordVoiceOver },
    { text: 'Surmarize', delay: '0.6s', icon: RecordVoiceOver },
  ];

  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        mb: 8, 
        position: 'relative', 
        overflow: 'hidden', 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
      }}
    >
      {/* Enhanced background with floating elements */}
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            {/* Main headline with enhanced animation */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.8rem', md: '4rem', lg: '4.5rem' },
                background: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 50%, #0d47a1 100%)',
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
              A-Voices
              <br />
              <Box component="span" sx={{ color: '#64b5f6' }}>AI Powered</Box>
            </Typography>

            {/* Subtitle with typewriter effect */}
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.6,
                fontWeight: 400,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
              }}
            >
              Advanced AI for African languages and Communication apps
            </Typography>

            {/* Enhanced service chips */}
            <Box sx={{ mb: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
              {services.map((service, index) => (
                <AnimatedWord 
                  key={index} 
                  word={service.text} 
                  delay={service.delay} 
                  icon={service.icon}
                />
              ))}
            </Box>

            {/* Action buttons with enhanced styling */}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
              <Button
                variant="contained"
                component={Link}
                to="/get-started"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                  boxShadow: '0 10px 30px rgba(25, 118, 210, 0.4)',
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
                    transition: 'left 0.6s',
                  },
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 15px 40px rgba(25, 118, 210, 0.5)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Get Started
              </Button>
              
              <Button
                variant="outlined"
                component={Link}
                to="/documentation"
                size="large"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderWidth: '2px',
                  color: '#64b5f6',
                  borderColor: '#64b5f6',
                  background: 'rgba(100, 181, 246, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { 
                    borderWidth: '2px', 
                    backgroundColor: 'rgba(100, 181, 246, 0.15)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 15px 40px rgba(100, 181, 246, 0.2)',
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                API Documention
              </Button>
            </Box>
          </Grid>

          {/* Right side - African visual and languages */}
          <Grid item xs={12} md={6}>
            {/* African-inspired visual */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 4,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  animation: `${rotate} 30s linear infinite`,
                  transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
                }}
              >
                <AfricanPattern size={280} color="#1976d2" />
              </Box>
            </Box>

            {/* Languages showcase */}
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: '25px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  color: '#fff', 
                  fontSize: '1.3rem', 
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                16+ African Languages
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {languages.map((lang) => (
                  <LanguageChip 
                    key={lang.name} 
                    label={lang.name} 
                    flag={lang.flag}
                    isPrimary={lang.isPrimary}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom gradient fade */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, rgba(10, 14, 39, 0.8), transparent)',
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default EnhancedHeroSection;