import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Container, Grid, Paper, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { PlayArrow, Translate, RecordVoiceOver, Mic, Chat, Summarize } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';

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
const AnimatedWord = ({ word, delay, icon: Icon }) => {
  const isChat = word === 'AI Chatbots';
  
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        mx: 1,
        my: 0.5,
        px: isChat ? 2.5 : 2,
        py: isChat ? 1.25 : 1,
        borderRadius: '25px',
        background: isChat 
          ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.25), rgba(100, 181, 246, 0.15))' 
          : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(100, 181, 246, 0.05))',
        border: isChat 
          ? '2px solid rgba(100, 181, 246, 0.4)' 
          : '1px solid rgba(25, 118, 210, 0.2)',
        backdropFilter: 'blur(10px)',
        opacity: 0,
        transform: 'translateY(20px)',
        animation: 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        animationDelay: delay,
        boxShadow: isChat 
          ? '0 4px 20px rgba(100, 181, 246, 0.3), 0 0 20px rgba(100, 181, 246, 0.2)' 
          : 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: isChat 
            ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.5), rgba(25, 118, 210, 0.3))' 
            : 'linear-gradient(135deg, rgba(25, 118, 210, 0.3), rgba(100, 181, 246, 0.1))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: isChat ? 1 : 0,
          animation: isChat 
            ? 'borderGlow 2s ease-in-out infinite' 
            : 'borderGlow 2s ease-in-out infinite',
          animationDelay: `calc(${delay} + 0.5s)`,
        },
        '@keyframes slideUp': {
          to: { 
            opacity: 1, 
            transform: 'translateY(0px)',
          },
        },
        '@keyframes borderGlow': {
          '0%, 100%': { opacity: isChat ? 0.7 : 0 },
          '50%': { opacity: isChat ? 1 : (isChat ? 1 : 0) },
        },
        '&:hover': {
          transform: 'translateY(-5px) scale(1.08)',
          boxShadow: isChat 
            ? '0 8px 30px rgba(100, 181, 246, 0.4), 0 0 30px rgba(100, 181, 246, 0.3)' 
            : '0 15px 35px rgba(25, 118, 210, 0.2)',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {Icon && (
        <Icon 
          sx={{ 
            mr: 1, 
            fontSize: isChat ? '1.4rem' : '1.2rem', 
            color: isChat ? '#64b5f6' : '#1976d2',
            animation: `${pulse} 2s ease-in-out infinite`,
            animationDelay: `calc(${delay} + 1s)`,
            filter: isChat ? 'drop-shadow(0 0 4px rgba(100, 181, 246, 0.6))' : 'none',
          }} 
        />
      )}
      <Typography
        component="span"
        sx={{
          fontSize: isChat ? { xs: '1.1rem', md: '1.3rem' } : { xs: '1rem', md: '1.2rem' },
          fontWeight: isChat ? 700 : 600,
          background: isChat 
            ? 'linear-gradient(135deg, #64b5f6, #42a5f5)' 
            : 'none',
          backgroundClip: isChat ? 'text' : 'unset',
          WebkitBackgroundClip: isChat ? 'text' : 'unset',
          color: isChat ? 'transparent' : '#1976d2',
          letterSpacing: '0.02em',
          textShadow: isChat ? '0 0 10px rgba(100, 181, 246, 0.3)' : 'none',
        }}
      >
        {word}
      </Typography>
    </Paper>
  );
};

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
  const { user } = useAppSelector((state) => state.auth);
  
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
    { text: 'AI Chatbots', delay: '0.2s', icon: Chat },
    { text: 'Live Translation', delay: '0.4s', icon: Translate },
    { text: 'Voice Transcription', delay: '0.6s', icon: Mic },
    { text: 'Text-to-Speech', delay: '0.7s', icon: RecordVoiceOver },
    { text: 'Auto Summarize', delay: '0.8s', icon: Summarize },
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
            {/* Service chips */}
            <Box sx={{ mb: 4, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s' }}>
              {services.map((service, index) => (
                <AnimatedWord
                  key={service.text}
                  word={service.text}
                  delay={service.delay}
                  icon={service.icon}
                />
              ))}
            </Box>

            {/* Language chips */}
            <Box sx={{ mb: 6, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(50px)', transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.9s' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                Supported Languages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                {languages.map((lang) => (
                  <LanguageChip
                    key={lang.name}
                    label={lang.name}
                    flag={lang.flag}
                    isPrimary={lang.isPrimary}
                  />
                ))}
              </Box>
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(60px)', transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 1.2s' }}>
              <Button
                component={Link}
                to="/get-started"
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '28px',
                  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Build Your Chatbot Free
              </Button>
              <Button
                component={Link}
                to="/pricing"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '28px',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                See Pricing Plans
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* African pattern and visual elements with headline overlay */}
            <Box sx={{ 
              position: 'relative',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: { xs: '400px', md: '500px' },
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s'
            }}>
              {/* African Pattern Background */}
              <Box sx={{ 
                position: 'absolute',
                zIndex: 1,
                opacity: 0.4
              }}>
                <AfricanPattern size={400} color="#1976d2" />
              </Box>
              
              {/* Headline Overlay */}
              <Box sx={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                px: 2
              }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '3.5rem', lg: '4rem' },
                    background: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 50%, #0d47a1 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    mb: 2,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    animation: isVisible ? `${shimmer} 3s ease-in-out infinite` : 'none',
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    textShadow: '0 0 30px rgba(100, 181, 246, 0.3)',
                  }}
                >
                  Build AI Chatbots in African Languages
                </Typography>
                <Box
                  component="span"
                  sx={{
                    color: '#64b5f6',
                    fontSize: { xs: '1.5rem', md: '2.2rem', lg: '2.5rem' },
                    fontWeight: 700,
                    display: 'block',
                    mt: 1,
                    textShadow: '0 0 20px rgba(100, 181, 246, 0.4)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                  }}
                >
                  Translate, Transcribe & Speak Instantly
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EnhancedHeroSection;