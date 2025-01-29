import React from 'react';
import { Box, Typography, Button, Chip, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const LanguageChip = ({ label }) => (
  <Chip
    label={label}
    sx={{
      m: 0.5,
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      color: 'primary.main',
      borderRadius: '16px',
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        transform: 'translateY(-2px)',
      },
      transition: 'all 0.3s ease',
      fontWeight: 500
    }}
  />
);

const AnimatedWord = ({ word, delay }) => (
  <Box
    sx={{
      display: 'inline-block',
      position: 'relative',
      mx: 1.5,
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '2px',
        bottom: -4,
        left: 0,
        backgroundColor: 'primary.main',
        transform: 'scaleX(0)',
        transformOrigin: 'bottom right',
        animation: 'slideIn 0.6s ease-out forwards',
        animationDelay: delay,
      },
      '@keyframes slideIn': {
        to: {
          transform: 'scaleX(1)',
          transformOrigin: 'bottom left',
        },
      },
    }}
  >
    <Typography
      component="span"
      sx={{
        fontSize: { xs: '1.2rem', md: '1.5rem' },
        fontWeight: 600,
        color: 'primary.main',
        opacity: 0,
        animation: 'fadeIn 0.6s ease-out forwards',
        animationDelay: delay,
        '@keyframes fadeIn': {
          to: {
            opacity: 1,
          },
        },
      }}
    >
      {word}
    </Typography>
  </Box>
);

const EnhancedHeroSection = () => {
  const primaryLanguages = ['Luganda', 'Acholi', 'Swahili', 'English', 'Runyankore','Ateso','Lugbara','Lumasaaba'];
  const secondaryLanguages = ['Kinyarwanda' , 'French', ];
  
  const services = [
    { text: 'Voice Transcription', delay: '0s' },
    { text: 'Translation', delay: '0.2s' },
    { text: 'Voice Generation', delay: '0.4s' },
    { text: 'Text Summarization', delay: '0.6s' },
  ];

  return (
    <Box sx={{ textAlign: 'center', mb: 12, position: 'relative', overflow: 'hidden' }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          opacity: 0.05,
          background: 'radial-gradient(circle at 50% 50%, #1976d2 0%, transparent 50%)',
          zIndex: -1
        }}
      />

      {/* Main Content */}
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 3,
            letterSpacing: '-0.02em'
          }}
        >
          Break Language Barriers
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontSize: { xs: '1.5rem', md: '2rem' },
              background: 'linear-gradient(45deg, #64b5f6, #90caf9)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 600,
              mt: 1
            }}
          >
            Seamless Communication Across Africa
          </Typography>
        </Typography>

        {/* Services Showcase */}
        <Box 
          sx={{ 
            mb: 6, 
            mt: 4,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 1, md: 2 }
          }}
        >
          {services.map((service, index) => (
            <AnimatedWord 
              key={index}
              word={service.text}
              delay={service.delay}
            />
          ))}
        </Box>

        {/* Description */}
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Experience seamless communication with our advanced language processing tools, 
          designed specifically for African languages and dialects.
        </Typography>

        {/* Language Showcase */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: 'text.secondary',
              fontSize: '1.2rem',
              fontWeight: 600 
            }}
          >
            Featured Languages
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {primaryLanguages.map((lang) => (
              <LanguageChip key={lang} label={lang} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
            {secondaryLanguages.map((lang) => (
              <LanguageChip key={lang} label={lang} />
            ))}
            <LanguageChip label="+ More Coming" />
          </Box>
        </Box>

        {/* CTA Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            component={Link}
            to="/get-started"
            size="large"
            sx={{
              borderRadius: '28px',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Get Started Free
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/documentation"
            size="large"
            sx={{
              borderRadius: '28px',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            View Documentation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EnhancedHeroSection;