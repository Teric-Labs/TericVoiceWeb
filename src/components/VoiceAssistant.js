import React, { useState, useRef, useCallback, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Paper,
  Fade,
  Alert,
  Snackbar,
  CircularProgress,
  ButtonBase,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Skeleton
} from '@mui/material';
import { Mic, MicOff, Language as LanguageIcon, VolumeUp, Settings } from '@mui/icons-material';

// Enhanced gradient animations
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ripple = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const speak = keyframes`
  0% { transform: scale(1); }
  10% { transform: scale(1.1); }
  20% { transform: scale(1); }
  100% { transform: scale(1); }
`;

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'lg', label: 'Luganda', flag: '🇺🇬' },
  { code: 'at', label: 'Ateso', flag: '🇺🇬' },
  { code: 'ac', label: 'Acholi', flag: '🇺🇬' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'nyn', label: 'Runyankore', flag: '🇺🇬' },
  { code: 'sw', label: 'Swahili', flag: '🇹🇿' }
];

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #2d2d2d)',
  backgroundSize: '400% 400%',
  animation: `${gradientShift} 15s ease infinite`,
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  minHeight: 500,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.spacing(4),
  position: 'relative',
  background: 'rgba(68, 121, 170, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${float} 6s ease-in-out infinite`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  }
}));

const MicButton = styled(ButtonBase)(({ theme, isRecording }) => ({
  width: 160,
  height: 160,
  borderRadius: '50%',
  background: isRecording
    ? 'linear-gradient(-45deg, #ff4444, #ff6666, #ff4444, #ff6666)'
    : 'linear-gradient(-45deg, #4444ff, #6666ff, #4444ff, #6666ff)',
  backgroundSize: '400% 400%',
  animation: `${gradientShift} 3s ease infinite`,
  color: theme.palette.common.white,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: '50%',
    background: isRecording
      ? 'linear-gradient(-45deg, #ff4444, #ff6666, #ff4444, #ff6666)'
      : 'linear-gradient(-45deg, #4444ff, #6666ff, #4444ff, #6666ff)',
    backgroundSize: '400% 400%',
    animation: `${ripple} 1.5s ease-out infinite`,
    opacity: 0.5,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}));

const VoiceWaveContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px'
});

const WaveBar = styled(Box)(({ delay, isPlaying }) => ({
  width: '3px',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '3px',
  transition: 'all 0.2s ease',
  animation: isPlaying ? `${speak} 1s ease-in-out infinite` : 'none',
  animationDelay: `${delay}ms`,
  transform: 'scaleY(0.2)'
}));

const StatusIndicator = styled(Box)(({ status, theme }) => ({
  position: 'absolute',
  top: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '8px 16px',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.9rem',
  fontWeight: 500,
  letterSpacing: '0.5px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  animation: status === 'speaking' ? `${speak} 1.5s infinite` : 'none'
}));

const VoiceAssistant = ({ agentId }) => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(languages[0].code);
  const [selectedLanguageInfo, setSelectedLanguageInfo] = useState(languages[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [agentInfo, setAgentInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [volume, setVolume] = useState(1);
  const [status, setStatus] = useState('idle'); // idle, recording, processing, speaking

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayer = useRef(new Audio());
  
  // Generate wave bars with varying heights
  const waveBarCount = 32;
  const generateWaveBars = () => {
    return Array.from({ length: waveBarCount }, (_, i) => ({
      height: Math.random() * 60 + 40,
      delay: i * (1000 / waveBarCount)
    }));
  };
  const [waveBars] = useState(generateWaveBars());

  useEffect(() => {
    audioPlayer.current.addEventListener('play', () => {
      setIsPlaying(true);
      setStatus('speaking');
    });
    audioPlayer.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setStatus('idle');
    });
    audioPlayer.current.addEventListener('pause', () => {
      setIsPlaying(false);
      setStatus('idle');
    });

    return () => {
      const player = audioPlayer.current;
      player.removeEventListener('play', () => setIsPlaying(true));
      player.removeEventListener('ended', () => setIsPlaying(false));
      player.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    const fetchAgentInfo = async () => {
      try {
        const formData = new FormData();
        formData.append("agent_id", agentId);
        
        const response = await fetch('https://agents.tericlab.com:8000/agent-info', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to fetch agent info');
        
        const data = await response.json();
        setAgentInfo(data);
      } catch (error) {
        setError("Failed to load agent information");
      } finally {
        setIsLoadingInfo(false);
      }
    };

    fetchAgentInfo();
  }, [agentId]);

  const handleAudioUpload = useCallback(async (audioBlob) => {
    setIsProcessing(true);
    setStatus('processing');
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.webm');
    formData.append('agent_id', agentId);
    formData.append('target_lang', targetLanguage);

    try {
      const response = await fetch('https://agents.tericlab.com:8000/process_voice', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to process audio');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      audioPlayer.current.src = data.audio_url;
      audioPlayer.current.volume = volume;
      audioPlayer.current.play();

    } catch (err) {
      setError(err.message);
      setStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  }, [targetLanguage, agentId, volume]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true, 
          noiseSuppression: true, 
          autoGainControl: true 
        } 
      });
      
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  }, [handleAudioUpload]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, []);

  const handleLanguageMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleLanguageMenuClose = () => setAnchorEl(null);

  const handleLanguageSelect = useCallback((language) => {
    setTargetLanguage(language.code);
    setSelectedLanguageInfo(language);
    handleLanguageMenuClose();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'recording':
        return '#ff4444';
      case 'processing':
        return '#ffaa00';
      case 'speaking':
        return '#44ff44';
      default:
        return 'rgba(255, 255, 255, 0.7)';
    }
  };

  return (
    <StyledContainer maxWidth={false} disableGutters>
      <StyledPaper elevation={24}>
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1,
          display: 'flex',
          gap: 1
        }}>
          <Tooltip title="Adjust Volume">
            <IconButton
              onClick={() => setVolume(prev => prev === 1 ? 0.5 : 1)}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <VolumeUp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select Language">
            <IconButton 
              onClick={handleLanguageMenuOpen}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleLanguageMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              background: 'rgba(45, 45, 45, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          {languages.map((language) => (
            <MenuItem 
              key={language.code} 
              onClick={() => handleLanguageSelect(language)}
              selected={targetLanguage === language.code}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                },
                '&.Mui-selected': {
                  background: 'rgba(68, 121, 170, 0.3)',
                  '&:hover': {
                    background: 'rgba(68, 121, 170, 0.4)'
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
                <Typography variant="body1">{language.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative'
        }}>
          {isLoadingInfo ? (
            <Skeleton 
              variant="text" 
              width={200} 
              height={40} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
            />
          ) : (
            <Typography 
              variant="h5" 
              sx={{
                color: '#fff',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '1px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                mb: 3
              }}
            >
              {agentInfo?.agent_name || 'Unknown Agent'}
            </Typography>
          )}

          <StatusIndicator 
            status={status}
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: getStatusColor()
            }}
          >
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: getStatusColor(),
                boxShadow: `0 0 10px ${getStatusColor()}`
              }} 
            />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusIndicator>

          <VoiceWaveContainer>
            {waveBars.map((bar, index) => (
              <WaveBar
                key={index}
                isPlaying={isPlaying}
                delay={bar.delay}
                sx={{
                  height: `${bar.height}%`,
                  backgroundColor: isPlaying 
                    ? `rgba(68, 121, 170, ${0.3 + (bar.height / 100) * 0.7})`
                    : 'rgba(255, 255, 255, 0.1)'
                }}
              />
            ))}
          </VoiceWaveContainer>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 4,
            p: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'white',
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {selectedLanguageInfo.flag} 
              <span style={{ fontSize: '0.9rem' }}>{selectedLanguageInfo.label}</span>
            </Typography>
          </Box>

          <Tooltip 
            title={isRecording ? "Stop Recording" : "Start Recording"}
            arrow
            placement="top"
          >
            <Box sx={{ position: 'relative' }}>
              <MicButton
                onClick={() => isRecording ? stopRecording() : startRecording()}
                disabled={isProcessing}
                isRecording={isRecording}
                aria-label={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isProcessing ? (
                  <CircularProgress 
                    size={48} 
                    thickness={5}
                    sx={{ color: 'white' }} 
                  />
                ) : (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    {isRecording ? (
                      <MicOff sx={{ fontSize: 48 }} />
                    ) : (
                      <Mic sx={{ fontSize: 48 }} />
                    )}
                  </Box>
                )}
              </MicButton>
              {isRecording && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#ff4444',
                    animation: `${speak} 1s infinite`
                  }}
                />
              )}
            </Box>
          </Tooltip>

          <Fade in={isRecording || isProcessing || isPlaying}>
            <Typography
              variant="h6"
              sx={{
                mt: 4,
                color: 'white',
                fontWeight: 500,
                opacity: 0.8,
                textAlign: 'center',
                animation: isRecording ? `${speak} 1.5s infinite` : 'none',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {isProcessing ? 'Processing your message...' : 
               isRecording ? 'Listening to you...' : 
               isPlaying ? 'Speaking...' : 
               'Tap the microphone to start'}
            </Typography>
          </Fade>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            variant="filled"
            sx={{
              backgroundColor: 'rgba(211, 47, 47, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </StyledPaper>
    </StyledContainer>
  );
};

export default VoiceAssistant;