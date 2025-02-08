import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Fade,
  Select,
  MenuItem,
  Button,
  Avatar,
  Chip,
  useTheme,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  Mic,
  MicOff,
  Language as LanguageIcon,
  Settings as SettingsIcon,
  VolumeUp,
  History as HistoryIcon,
  Lightbulb as TipIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const VoiceAssistant = ({agentId}) => {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showTip, setShowTip] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const languages = [
    { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', label: 'French', flag: '🇫🇷' },
    { code: 'de-DE', label: 'German', flag: '🇩🇪' },
  ];

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setConfidence((prev) => {
          const newValue = prev + (Math.random() * 20);
          return newValue > 100 ? 100 : newValue;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setConfidence(0);
    }
  }, [isListening]);

  const handleMicToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setTranscripts(prev => [...prev, {
          text: 'Sample transcription text...',
          timestamp: new Date()
        }]);
      }, 2000);
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.dark}05)`,
          p: 3
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 800,
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 4,
            position: 'relative',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Voice Assistant Pro
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                size="small"
                sx={{
                  minWidth: 150,
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }
                }}
                startAdornment={<LanguageIcon sx={{ fontSize: 20, mr: 1 }} />}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              
              <Tooltip title="View History">
                <IconButton onClick={() => setShowHistory(true)}>
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              p: 4
            }}
          >
            {showTip && (
              <Fade in={showTip}>
                <Paper
                  sx={{
                    position: 'absolute',
                    top: 20,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 2,
                    boxShadow: theme.shadows[2]
                  }}
                >
                  <TipIcon color="primary" />
                  <Typography variant="body2">
                    Tap the microphone and start speaking
                  </Typography>
                  <IconButton size="small" onClick={() => setShowTip(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Fade>
            )}

            <Grid container direction="column" alignItems="center" spacing={3}>
              <Grid item>
                <Box position="relative">
                  <IconButton
                    onClick={handleMicToggle}
                    sx={{
                      width: 100,
                      height: 100,
                      background: isListening
                        ? `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.light})`
                        : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      color: 'white',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isListening ? theme.shadows[8] : theme.shadows[4]
                    }}
                  >
                    {isProcessing ? (
                      <CircularProgress color="inherit" size={40} />
                    ) : isListening ? (
                      <MicOff sx={{ fontSize: 40 }} />
                    ) : (
                      <Mic sx={{ fontSize: 40 }} />
                    )}
                  </IconButton>
                  {isListening && (
                    <CircularProgress
                      variant="determinate"
                      value={confidence}
                      size={108}
                      sx={{
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        color: theme.palette.primary.main,
                        opacity: 0.3
                      }}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item>
                <Fade in={isListening || isProcessing}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isListening && <VolumeUp color="primary" />}
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ 
                        fontWeight: 500,
                        animation: isListening ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.6 },
                          '100%': { opacity: 1 },
                        }
                      }}
                    >
                      {isProcessing ? 'Processing...' : isListening ? 'Listening...' : ''}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Chip 
              label="Premium" 
              color="primary" 
              size="small"
              variant="outlined"
            />
            <Typography variant="body2" color="text.secondary">
              Confidence: {Math.round(confidence)}%
            </Typography>
          </Box>
        </Paper>

        {/* History Dialog */}
        <Dialog 
          open={showHistory} 
          onClose={() => setShowHistory(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Transcription History</Typography>
              <IconButton onClick={() => setShowHistory(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {transcripts.map((transcript, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  background: theme.palette.grey[50],
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">{transcript.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {transcript.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
            ))}
          </DialogContent>
        </Dialog>
      </Box>
      
    </Container>
  );
};

export default VoiceAssistant;