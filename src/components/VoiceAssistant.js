import React, { useState, useRef, useCallback ,useEffect} from 'react';
import { styled } from '@mui/material/styles';
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
  MenuItem
} from '@mui/material';
import { Mic, MicOff, Language as LanguageIcon } from '@mui/icons-material';

// Language options remain the same
const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'lg', label: 'Luganda', flag: '🇺🇬' },
  { code: 'at', label: 'Ateso', flag: '🇺🇬' },
  { code: 'ac', label: 'Acholi', flag: '🇺🇬' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'nyn', label: 'Runyankore', flag: '🇺🇬' },
  { code: 'sw', label: 'Swahili', flag: '🇹🇿' }
];

// Styled components remain the same
const StyledContainer = styled(Container)(({ theme }) => ({
  // ... same styling
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  // ... same styling
  width: '100%',
  maxWidth: 500,
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.spacing(4),
  position: 'relative',
  background: 'rgba(68, 121, 170, 0.53)',
  border: '1px solid rgba(68, 121, 170, 0.53)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[24]
  }
}));

const MicButton = styled(ButtonBase)(({ theme, isRecording }) => ({
  // ... same styling as before
  width: 140,
  height: 140,
  borderRadius: '50%',
  background: isRecording
    ? 'linear-gradient(45deg, #ff4444, #ff6666)'
    : 'linear-gradient(45deg, #4444ff, #6666ff)',
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
    background: isRecording
      ? 'linear-gradient(45deg, #ff4444, #ff6666)'
      : 'linear-gradient(45deg, #4444ff, #6666ff)',
    borderRadius: '50%',
    opacity: 0.5,
    animation: 'ripple 1.5s infinite',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}));

const VoiceAssistant = ({ agentId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [soundWaves, setSoundWaves] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState(languages[0].code);
  const [selectedLanguageInfo, setSelectedLanguageInfo] = useState(languages[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [agentInfo, setAgentInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayer = useRef(new Audio());

  useEffect(() => {
      const fetchAgentInfo = async () => {
        try {
          const formData = new FormData();
          formData.append("agent_id", agentId);
          
          const response = await fetch('https://phosaiv-98414212-8607-468b-9fc3.cranecloud.io/agent-info', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) throw new Error('Failed to fetch agent info');
          
          const data = await response.json();
          setAgentInfo(data);
        } catch (error) {
          console.log("Printed code")
        } finally {
          setIsLoadingInfo(false);
        }
      };
  
      fetchAgentInfo();
    }, [agentId]);

  // handleAudioUpload is now a useCallback that depends on targetLanguage
  const handleAudioUpload = useCallback(async (audioBlob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.webm');
    formData.append('agent_id', agentId);
    formData.append('target_lang', targetLanguage);

    console.log('Uploading with language code:', targetLanguage);
    console.log('Agent ID:', agentId);

    try {
      const response = await fetch('https://phosaiv-98414212-8607-468b-9fc3.cranecloud.io/process_voice', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to process audio');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      audioPlayer.current.src = data.audio_url;
      audioPlayer.current.play();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [targetLanguage, agentId]); // Add dependencies here

  // startRecording is now dependent on handleAudioUpload
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
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
        console.log('Audio Blob Created:', audioBlob);
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  }, [handleAudioUpload]); // Add handleAudioUpload as dependency

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
    console.log('Selected language code:', language.code);
    setTargetLanguage(language.code);
    setSelectedLanguageInfo(language);
    handleLanguageMenuClose();
  }, []);

  // Rest of the JSX remains the same
  return (
    <StyledContainer maxWidth={false} disableGutters>
      <StyledPaper elevation={24}>
        {/* Language Selector */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1 
        }}>
          <Tooltip title="Select Language">
            <IconButton 
              onClick={handleLanguageMenuOpen}
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(245, 240, 240, 0.92)',
                '&:hover': {
                  backgroundColor: 'rgba(250, 243, 243, 0.2)'
                }
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleLanguageMenuClose}
          >
            {languages.map((language) => (
              <MenuItem 
                key={language.code} 
                onClick={() => handleLanguageSelect(language)}
                selected={targetLanguage === language.code}
              >
                {language.flag} {language.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Main Content */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative'
        }}>
        <Typography variant="h6" sx={{color: '#ffff', textTransform: 'uppercase'}} component="div">{agentInfo?.agent_name || 'Unknown Agent'}</Typography>
          {/* Sound Wave Visualization */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4
          }}>
            {soundWaves.map((height, index) => (
              <Box
                key={index}
                sx={{
                  width: 4,
                  height: `${height}%`,
                  background: isRecording ? '#ff4444' : '#4444ff',
                  borderRadius: 4,
                  transition: 'height 0.1s ease-in-out'
                }}
              />
            ))}
          </Box>

          {/* Selected Language Display */}
          <Typography
            variant="subtitle1"
            sx={{
              color: 'white',
              opacity: 0.8,
              mb: 3
            }}
          >
            {selectedLanguageInfo.flag} {selectedLanguageInfo.label}
          </Typography>

          {/* Microphone Button */}
          <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
            <MicButton
              onClick={() => isRecording ? stopRecording() : startRecording()}
              disabled={isProcessing}
              isRecording={isRecording}
            >
              {isProcessing ? (
                <CircularProgress size={48} color="inherit" />
              ) : (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}>
                  {isRecording ? (
                    <MicOff sx={{ fontSize: 48 }} />
                  ) : (
                    <Mic sx={{ fontSize: 48 }} />
                  )}
                </Box>
              )}
            </MicButton>
          </Tooltip>

          {/* Status Text */}
          <Fade in={isRecording || isProcessing}>
            <Typography
              variant="h6"
              sx={{
                mt: 4,
                color: 'white',
                fontWeight: 500,
                opacity: 0.8,
                animation: isRecording ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              {isProcessing ? 'Processing...' : isRecording ? 'Recording...' : 'Tap to start'}
            </Typography>
          </Fade>
        </Box>

        {/* Error Snackbar */}
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
          >
            {error}
          </Alert>
        </Snackbar>
        
      </StyledPaper>
    </StyledContainer>
  );
};

export default VoiceAssistant;