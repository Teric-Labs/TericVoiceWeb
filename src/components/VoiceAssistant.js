import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Container, Typography, Paper, Fade, Alert, Snackbar, 
  CircularProgress, ButtonBase, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';
import { Mic, MicOff, Language as LanguageIcon, VolumeUp } from '@mui/icons-material';

// Keyframes animations
const gradientShift = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const ripple = `
  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.5); opacity: 0; }
  }
`;

const float = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const speak = `
  @keyframes speak {
    0% { transform: scale(1); }
    10% { transform: scale(1.1); }
    20% { transform: scale(1); }
    100% { transform: scale(1); }
  }
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

const VoiceAssistant = ({ agentId }) => {
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
  const [status, setStatus] = useState('idle');

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayer = useRef(new Audio());

  // Generate wave bars
  const waveBarCount = 32;
  const [waveBars] = useState(() => 
    Array.from({ length: waveBarCount }, (_, i) => ({
      height: Math.random() * 60 + 40,
      delay: i * (1000 / waveBarCount)
    }))
  );

  useEffect(() => {
    const fetchAgentInfo = async () => {
      try {
        const formData = new FormData();
        formData.append("agent_id", agentId);
        
        const response = await fetch('https://phosaiv-98414212-8607-468b-9fc3.cranecloud.io/agent-info', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch agent info');
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error('Invalid response data');
        }
        
        setAgentInfo(data);
      } catch (error) {
        console.error('Error fetching agent info:', error);
        setError("Failed to load agent information");
      } finally {
        setIsLoadingInfo(false);
      }
    };

    fetchAgentInfo();
  }, [agentId]);

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      setStatus('speaking');
    };

    const handleEnd = () => {
      setIsPlaying(false);
      setStatus('idle');
    };

    const player = audioPlayer.current;
    player.addEventListener('play', handlePlay);
    player.addEventListener('ended', handleEnd);
    player.addEventListener('pause', handleEnd);

    return () => {
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('ended', handleEnd);
      player.removeEventListener('pause', handleEnd);
    };
  }, []);

  const handleAudioUpload = useCallback(async (audioBlob) => {
    setIsProcessing(true);
    setStatus('processing');
    
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.webm');
    formData.append('agent_id', agentId);
    formData.append('target_lang', targetLanguage);

    try {
      const response = await fetch('https://jellyfish-app-aum6y.ondigitalocean.app/process_voice', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Add these headers which might help with CORS
          'Origin': window.location.origin,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // First check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response as text first
      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      // Check if we have an empty response
      if (!responseText.trim()) {
        throw new Error('Server returned empty response');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse server response:', parseError);
        // If the response contains an error message, throw that
        if (responseText.includes('error')) {
          throw new Error(responseText);
        }
        throw new Error('Server returned invalid JSON');
      }

      // Check if the response contains an error
      if (data.error) {
        throw new Error(`Server error: ${data.error}`);
      }

      // Check for audio_url
      if (!data.audio_url) {
        throw new Error('Server response missing audio URL');
      }

      // Create new Audio instance with validated URL
      audioPlayer.current = new Audio(data.audio_url);
      audioPlayer.current.volume = volume;
      
      audioPlayer.current.addEventListener('play', () => {
        setIsPlaying(true);
        setStatus('speaking');
      });
      
      audioPlayer.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setStatus('idle');
      });
      
      audioPlayer.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio response');
        setStatus('idle');
      });

      await audioPlayer.current.play();

    } catch (err) {
      console.error('Audio processing error:', err);
      // Provide more specific error messages to the user
      if (err.message.includes('empty response')) {
        setError('No response received from server. Please try again.');
      } else if (err.message.includes('invalid JSON')) {
        setError('Server communication error. Please try again.');
      } else if (err.message.includes('Server error')) {
        setError(err.message);
      } else {
        setError('Failed to process audio. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      setStatus('idle');
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

      const options = {
        mimeType: 'audio/webm;codecs=opus'
      };

      // Check if the browser supports the MIME type
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn('audio/webm;codecs=opus not supported, falling back to audio/webm');
        options.mimeType = 'audio/webm';
      }

      mediaRecorder.current = new MediaRecorder(stream, options);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks.current, { type: options.mimeType });
          await handleAudioUpload(audioBlob);
        } catch (error) {
          console.error('Error handling recorded audio:', error);
          setError('Failed to process recorded audio');
          setStatus('idle');
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err) {
      console.error('Error starting recording:', err);
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

  const handleLanguageSelect = useCallback((language) => {
    setTargetLanguage(language.code);
    setSelectedLanguageInfo(language);
    setAnchorEl(null);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #2d2d2d)',
        backgroundSize: '400% 400%',
        animation: `${gradientShift} 15s ease infinite`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          minHeight: 500,
          bgcolor: 'rgba(68, 121, 170, 0.1)',
          borderRadius: 4,
          position: 'relative',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: `${float} 6s ease-in-out infinite`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        {/* Language and Volume Controls */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
          <Tooltip title="Adjust Volume">
            <IconButton
              onClick={() => setVolume(prev => prev === 1 ? 0.5 : 1)}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <VolumeUp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select Language">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Language Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1,
              bgcolor: 'rgba(45, 45, 45, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2
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
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                '&.Mui-selected': {
                  bgcolor: 'rgba(68, 121, 170, 0.3)',
                  '&:hover': { bgcolor: 'rgba(68, 121, 170, 0.4)' }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
                <Typography>{language.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Main Content */}
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          gap: 3
        }}>
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '1px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {isLoadingInfo ? 'Loading...' : agentInfo?.agent_name || 'Unknown Agent'}
          </Typography>

          {/* Status Indicator */}
          <Box
            sx={{
              px: 3,
              py: 1,
              borderRadius: 'full',
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              color: status === 'recording' ? '#ff4444' :
                     status === 'processing' ? '#ffaa00' :
                     status === 'speaking' ? '#44ff44' :
                     'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'currentColor',
                boxShadow: theme => `0 0 10px ${theme.palette.primary.main}`
              }}
            />
            <Typography>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Typography>
          </Box>

          {/* Voice Wave Visualization */}
          <Box
            sx={{
              width: '100%',
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px'
            }}
          >
            {waveBars.map((bar, index) => (
              <Box
                key={index}
                sx={{
                  width: '3px',
                  height: `${bar.height}%`,
                  bgcolor: isPlaying
                    ? `rgba(68, 121, 170, ${0.3 + (bar.height / 100) * 0.7})`
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  transition: 'all 0.2s ease',
                  animation: isPlaying ? `${speak} 1s ease-in-out infinite` : 'none',
                  animationDelay: `${bar.delay}ms`
                }}
              />
            ))}
          </Box>

          {/* Selected Language Display */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography sx={{ color: 'white', opacity: 0.8, display: 'flex', alignItems: 'center', gap: 1 }}>
              {selectedLanguageInfo.flag}
              <span style={{ fontSize: '0.9rem' }}>{selectedLanguageInfo.label}</span>
            </Typography>
          </Box>

          {/* Recording Button */}
          {/* Recording Button Section - continuing from previous JSX */}
          <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
            <Box sx={{ position: 'relative' }}>
              <ButtonBase
                onClick={() => isRecording ? stopRecording() : startRecording()}
                disabled={isProcessing}
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: isRecording
                    ? 'linear-gradient(-45deg, #ff4444, #ff6666, #ff4444, #ff6666)'
                    : 'linear-gradient(-45deg, #4444ff, #6666ff, #4444ff, #6666ff)',
                  backgroundSize: '400% 400%',
                  animation: `${gradientShift} 3s ease infinite`,
                  color: 'white',
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
                }}
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
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    {isRecording ? (
                      <MicOff sx={{ fontSize: 48 }} />
                    ) : (
                      <Mic sx={{ fontSize: 48 }} />
                    )}
                  </Box>
                )}
              </ButtonBase>
              {isRecording && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#ff4444',
                    animation: `${speak} 1s infinite`
                  }}
                />
              )}
            </Box>
          </Tooltip>

          {/* Status Message */}
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
            sx={{
              bgcolor: 'rgba(211, 47, 47, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default VoiceAssistant;