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
  Download,
  VolumeUp,
  CloudUpload,
  Close,
  Article
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
const TranslationPremiumModal = ({ isOpen, onClose }) => {
  const premiumFeatures = [
    {
      icon: <Article />,
      title: "Document Translation",
      description: "Translate entire documents (DOCX, DOC, TXT) while maintaining original formatting and structure",
      highlight: "Most Popular"
    },
    {
      icon: <Download />,
      title: "Export Translations",
      description: "Download your translations in PDF or DOCX format for all your selected target languages",
      highlight: "Pro"
    },
    {
      icon: <VolumeUp />,
      title: "Audio Generation",
      description: "Convert your translations into natural-sounding speech in any supported language",
      highlight: "Premium"
    },
    {
      icon: <CloudUpload />,
      title: "Batch Processing",
      description: "Translate multiple documents simultaneously and manage your translation projects efficiently",
      highlight: "New!"
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
            Upgrade Your Translation Experience
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Access advanced translation tools and premium features
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
            component={Link}
            to="/get-started"
            variant="contained"
            startIcon={<Star />}
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

export default TranslationPremiumModal;