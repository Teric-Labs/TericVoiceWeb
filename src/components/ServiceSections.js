import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { 
  Translate, 
  VideoLibrary, 
  VolumeUp, 
  RecordVoiceOver, 
  Summarize,
  Code,
  Support,
  ArrowForward,
  PlayArrow
} from '@mui/icons-material';
import translate from "../assets/translation.jpg"
import transcribe from "../assets/transcribe.jpg"
import textvoice from "../assets/textvoice.jpg"
import voicev from "../assets/voicev.jpg"
import documents from "../assets/documentSummary.jpg"
import momo from "../assets/APIs.jpg"
import { Link } from 'react-router-dom';
const ServiceSection = ({ 
  title, 
  imgr,
  description, 
  features, 
  icon, 
  imageRight = false,
  actionButtons = true 
}) => (
  <Box
    sx={{
      py: { xs: 6, md: 12 },
      background: imageRight ? 'linear-gradient(to right, #fff, #f8f9fa)' : 'linear-gradient(to left, #fff, #f8f9fa)',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center" direction={imageRight ? 'row' : 'row-reverse'}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                p: 2,
                borderRadius: '16px',
                background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(100, 181, 246, 0.1))',
                mb: 3
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 3,
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              {description}
            </Typography>
            <Box sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PlayArrow sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              ))}
            </Box>
            {actionButtons && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/get-started"
                  sx={{
                    borderRadius: '28px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
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
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Support />}
                  component={Link}
                  to="/dashboard/contact-support"
                  sx={{
                    borderRadius: '28px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Contact Support
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'white',
              border: '1px solid rgba(25, 118, 210, 0.1)',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={imgr} 
              alt={title}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '16px'
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const ServiceSections = () => {
  const services = [
    {
      title: "Advanced Text Translation",
      imgr:translate,
      description: "Transform your content across languages with our powerful translation engine. Support for documents, websites, and real-time translation needs.",
      features: [
        "Document translation supporting PDF, DOC, DOCX formats",
        "Real-time translation for instant communication",
        "Multi-language support with context preservation",
        "Batch translation for large-scale projects"
      ],
      icon: <Translate sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Smart Voice Recognition",
      imgr:transcribe,
      description: "Convert spoken words into text with high accuracy. Supporting multiple platforms and video transcription services.",
      features: [
        "Video transcription from YouTube, Dropbox, and more",
        "Multi-speaker detection and labeling",
        "Custom vocabulary and terminology support",
        "Real-time transcription capabilities"
      ],
      icon: <VideoLibrary sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Natural Text to Voice",
      imgr:textvoice,
      description: "Generate human-like voices for your content. Perfect for accessibility, e-learning, and content consumption.",
      features: [
        "Natural voice generation for documents",
        "Multiple voice options and accents",
        "Custom voice training available",
        "Batch processing for large documents"
      ],
      icon: <VolumeUp sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Voice Translation Hub",
      imgr:voicev,
      description: "Break language barriers with real-time voice translation. Premium features for multiple language support.",
      features: [
        "Real-time voice-to-voice translation",
        "Multiple language pairs support",
        "Custom accent and dialect handling",
        "Conference and meeting support"
      ],
      icon: <RecordVoiceOver sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Content Summarization",
      imgr:documents,
      description: "Get the essence of your content quickly with our AI-powered summarization tools. Supporting multiple formats and languages.",
      features: [
        "Text, audio, and video summarization",
        "Multi-language summary translation",
        "Customizable summary length",
        "Key points extraction"
      ],
      icon: <Summarize sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Developer APIs",
      imgr:momo,
      description: "Integrate our powerful language services into your applications with our comprehensive API suite.",
      features: [
        "RESTful API access to all services",
        "Comprehensive documentation",
        "Multiple SDK support",
        "Custom integration assistance"
      ],
      icon: <Code sx={{ fontSize: 40, color: 'primary.main' }} />
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {services.map((service, index) => (
        <ServiceSection
          key={index}
          {...service}
          imageRight={index % 2 === 0}
        />
      ))}
    </Box>
  );
};

export default ServiceSections;