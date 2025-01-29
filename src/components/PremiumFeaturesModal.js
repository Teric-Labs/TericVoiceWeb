import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Chip,
  Stack,
  Modal,
  Divider
} from '@mui/material';
import {
  Star,
  CloudUpload,
  Language,
  AutoGraphOutlined,
  TextSnippetOutlined,
  Close
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
const PremiumFeaturesModal = ({ isOpen, onClose }) => {
  const premiumFeatures = [
    {
      icon: <Language />,
      title: "Multiple Language Translation",
      description: "Convert your text to multiple languages simultaneously with high-quality voice synthesis",
      highlight: "Most Popular"
    },
    {
      icon: <TextSnippetOutlined />,
      title: "Document Processing",
      description: "Convert PDF, DOC, DOCX, and TXT files into natural-sounding speech in any language",
      highlight: "New!"
    },
    {
      icon: <CloudUpload />,
      title: "Batch Processing",
      description: "Process multiple documents and download audio files in bulk",
      highlight: "Pro"
    },
    {
      icon: <AutoGraphOutlined />,
      title: "Enhanced Voice Quality",
      description: "Access premium voice models with superior clarity and natural intonation",
      highlight: "Premium"
    }
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            p: 3,
            position: 'relative'
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <Close />
          </IconButton>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
            Unlock Premium Features
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Enhance your text-to-speech experience with our premium features
          </Typography>
        </Box>

        {/* Features List */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            {premiumFeatures.map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                      color: 'white',
                      height: 'fit-content'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Chip
                        label={feature.highlight}
                        size="small"
                        sx={{
                          bgcolor: 'primary.50',
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Call to Action */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<Star />}
            component={Link}
            to="/get-started"
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #42a5f5)'
              }
            }}
          >
            Get Started
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default PremiumFeaturesModal;