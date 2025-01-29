import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Paper,
  Chip,
  Stack,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  Close,
  VolumeUp,
  Bolt,
  Star,
  KeyboardArrowUpOutlined,
  KeyboardArrowDownOutlined,
  LockOutlined,
  FileDownload,
  Language,
  Timer, 
} from "@mui/icons-material";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';

const VoiceRecognitionResult = ({ results, isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(false);

  const normalizeResults = (results) => {
    const defaultStructure = { 
      translations: {}, 
      audio_link: [],
      quality: 85,
      duration: '2:30'
    };

    if (!results || typeof results !== "object") {
      return defaultStructure;
    }

    return {
      translations: results.translations || {},
      audio_link: Array.isArray(results.audio_link) ? results.audio_link : [],
      quality: results.quality || 85,
      duration: results.duration || '2:30'
    };
  };

  const processedData = normalizeResults(results);

  const togglePanel = (panel) => {
    setExpanded(expanded === panel ? false : panel);
  };

  const premiumFeatures = [
    {
      icon: <FileDownload />,
      title: "Export Transcripts",
      description: "Export transcriptions in multiple formats (PDF, TXT, SRT)",
      highlight: "Popular"
    },
    {
      icon: <Language />,
      title: "Multiple Languages",
      description: "Get transcriptions in 50+ languages simultaneously",
      highlight: "Pro"
    },
    {
      icon: <VolumeUp />,
      title: "Voice Generation",
      description: "Convert transcripts to natural-sounding voice in any language",
      highlight: "New!"
    },
    {
      icon: <VolumeUp />,
      title: "Video Transcription",
      description: "Transcribe YouTube videos directly by pasting the URL",
      highlight: "Popular"
    },
    {
      icon: <VolumeUp />,
      title: "Cloud Integration",
      description: "Import videos from Dropbox, Google Drive, and other cloud services",
      highlight: "Pro"
    }
  ];

  const renderTranscriptItem = (transcript, idx) => {
    if (!transcript || typeof transcript !== "object") return null;

    return (
      <ListItem key={idx} sx={{ 
        display: "block", 
        mb: 2,
        p: 2,
        backgroundColor: '#f8fafc',
        borderRadius: 1,
        '&:hover': {
          backgroundColor: '#f1f5f9'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {`${transcript.start_time || 0}s - ${transcript.end_time || 0}s`}
          </Typography>
          <Tooltip title="Premium: Click to hear this segment">
            <IconButton size="small" sx={{ color: '#94a3b8' }}>
              <VolumeUp fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" sx={{ color: '#334155' }}>
          {transcript.text || "No text available"}
        </Typography>
      </ListItem>
    );
  };

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
              Voice Recognition Results
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={2}>
            <Chip
              icon={<Timer sx={{ color: 'white !important' }} />}
              label={`Duration: ${processedData.duration}`}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              icon={<VolumeUp sx={{ color: 'white !important' }} />}
              label={`${processedData.quality}% Accuracy`}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Audio Player */}
          {processedData.audio_link?.[0]?.audio_file_url && (
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
                src={processedData.audio_link[0].audio_file_url}
                style={{ 
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc'
                }}
                customVolumeControls={[]} 
                customAdditionalControls={[]}
                showJumpControls={false}
              />
            </Paper>
          )}

          {/* Transcriptions */}
          <Paper elevation={0} sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            mb: 3
          }}>
            {Object.keys(processedData.translations).length > 0 ? (
              Object.entries(processedData.translations).slice(0, 1).map(([language, transcripts], index) => (
                <Accordion
                  key={language}
                  expanded={expanded === index}
                  onChange={() => togglePanel(index)}
                  elevation={0}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{ 
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {language.toUpperCase()}
                      </Typography>
                      <Chip 
                        size="small" 
                        label="Preview" 
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2 }}>
                    <List sx={{ p: 0 }}>
                      {Array.isArray(transcripts) && transcripts.length > 0 ? (
                        transcripts.slice(0, 3).map((transcript, idx) => renderTranscriptItem(transcript, idx))
                      ) : (
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          No transcripts available for this language.
                        </Typography>
                      )}
                    </List>
                    {transcripts?.length > 3 && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Chip
                          label="Upgrade to see all transcripts"
                          icon={<LockOutlined sx={{ fontSize: 16 }} />}
                          sx={{ 
                            backgroundColor: '#f1f5f9',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#e2e8f0'
                            }
                          }}
                          onClick={() => setIsPremiumExpanded(true)}
                        />
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant="body2" sx={{ p: 3, color: '#64748b' }}>
                No translations available.
              </Typography>
            )}
          </Paper>
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
                Unlock Full Transcription Features
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
                Enhance Your Transcription Experience
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

export default VoiceRecognitionResult;