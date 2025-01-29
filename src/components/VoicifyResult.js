import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Button,
  Paper,
  Chip,
  Stack,
  Collapse
} from "@mui/material";
import {
  Close,
  Translate,
  VolumeUp,
  Bolt,
  Star,
  KeyboardArrowUpOutlined,
  KeyboardArrowDownOutlined,
  CloudDownload,
  Language,
  AutoGraphOutlined
} from "@mui/icons-material";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';
const VoicifyResult = ({ response, isOpen, onClose }) => {
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(false);
  
  const normalizeResponse = (response) => {
    const defaultStructure = {
      translations: {},
      original_audio: [],
      doc_id: '',
      quality: 85
    };
    
    if (!response || typeof response !== "object") {
      return defaultStructure;
    }
    
    return {
      translations: response.translations || {},
      original_audio: Array.isArray(response.original_audio) ? response.original_audio : [],
      doc_id: response.doc_id || '',
      quality: response.quality || 85
    };
  };

  const processedData = normalizeResponse(response);

  const premiumFeatures = [
    {
      icon: <CloudDownload />,
      title: "Download Audio Files",
      description: "Download all generated translations in high-quality audio format",
      highlight: "Popular"
    },
    {
      icon: <Language />,
      title: "Multiple Language Translation",
      description: "Translate your audio into multiple languages simultaneously",
      highlight: "Pro"
    },
    {
      icon: <AutoGraphOutlined />,
      title: "Enhanced Audio Quality",
      description: "Access to premium voice models with superior audio quality",
      highlight: "New!"
    }
  ];

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '600px' },
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          p: 3,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Voice Translation
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={2}>
            <Chip
              icon={<VolumeUp sx={{ color: 'white !important' }} />}
              label="Preview Quality"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              icon={<Translate sx={{ color: 'white !important' }} />}
              label="Single Translation"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Original Audio Section */}
          {processedData.original_audio?.[0]?.audio_file_url && (
            <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0f172a' }}>
                Original Audio
              </Typography>
              <AudioPlayer
                src={processedData.original_audio[0].audio_file_url}
                onPlay={e => console.log("Playing original audio")}
                style={{ 
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc'
                }}
              />
            </Paper>
          )}

          {/* Translation Preview */}
          {Object.entries(processedData.translations).slice(0, 1).map(([language, audioUrl]) => (
            <Paper key={language} elevation={0} sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#0f172a' }}>
                  {language.toUpperCase()} Translation (Preview)
                </Typography>
              </Box>
              <AudioPlayer
                src={audioUrl}
                onPlay={e => console.log(`Playing ${language} translation`)}
                style={{ 
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc'
                }}
                customVolumeControls={[]} 
                customAdditionalControls={[]} 
                showJumpControls={false}
              />
            </Paper>
          ))}
        </Box>

        {/* Premium Panel */}
        <Box sx={{ 
          borderTop: '1px solid #e2e8f0',
          background: 'linear-gradient(to right, #f8fafc, #ffffff)'
        }}>
          <Button
            fullWidth
            onClick={() => setIsPremiumExpanded(!isPremiumExpanded)}
            sx={{
              p: 2.5,
              color: '#1976d2',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bolt sx={{ fontSize: 24, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Unlock Voicify Pro Features
              </Typography>
            </Box>
            {!isPremiumExpanded && (
              <Chip
                size="small"
                label="Special Offer"
                color="primary"
                sx={{ ml: 'auto', mr: 2 }}
              />
            )}
            {isPremiumExpanded ? <KeyboardArrowDownOutlined /> : <KeyboardArrowUpOutlined />}
          </Button>

          <Collapse in={isPremiumExpanded}>
            <Box sx={{ p: 4, backgroundColor: '#f8fafc' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#0f172a' }}>
                Enhance Your Voice Translations
              </Typography>
              
              <Stack spacing={2.5}>
                {premiumFeatures.map((feature, index) => (
                  <Paper key={index} elevation={0} sx={{ 
                    p: 2.5, 
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      borderColor: '#1976d2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1.5, 
                        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                        color: 'white'
                      }}>
                        {feature.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          {feature.highlight && (
                            <Chip
                              size="small"
                              label={feature.highlight}
                              sx={{ 
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 600,
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Star />}
                component={Link}
                to="/get-started"
                sx={{
                  mt: 4,
                  py: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)'
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Drawer>
  );
};

export default VoicifyResult;