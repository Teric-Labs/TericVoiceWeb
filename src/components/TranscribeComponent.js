import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Chip,
  TextField,
  Drawer,
  Stack,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  DeleteOutline as DeleteOutlineIcon,
  SwapHoriz,
  Language as LanguageIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import axios from 'axios';
import ViewAudioComponent from './ViewAudioComponent'

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'lg', label: 'Luganda' },
  { value: 'at', label: 'Ateso' },
  { value: 'ac', label: 'Acholi' },
  { value: 'sw', label: 'Swahili' },
  { value: 'fr', label: 'French' },
  { value: 'rw', label: 'Kinyarwanda' },
  { value: 'nyn', label: 'Runyankore' },
];

const TranscribeComponent = () => {
  // State management
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedTab, setSelectedTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  

  // Refs
  const mediaRecorder = useRef(null);
  const audioPlayerRef = useRef(null);
  const uploadInputRef = useRef(null);

  // Mock user ID - Replace with actual user authentication
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    }, []);

  // Notification helper
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Input validation
  const validateInput = () => {
    if (targetLanguages.length === 0) {
      showNotification('Please select at least one target language', 'error');
      return false;
    }
    return true;
  };

  // Recording functionality
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioBlob(blob);
          setAudioURL(URL.createObjectURL(blob));
        };

        recorder.start();
        mediaRecorder.current = recorder;
        setIsRecording(true);
      } catch (error) {
        console.error('Recording error:', error);
        showNotification('Error accessing microphone', 'error');
      }
    }
  };

  // File handling
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      showNotification('File selected successfully');
    }
  };

  // Audio playback controls
  const handlePlayPause = () => {
    if (!audioPlayerRef.current) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDiscardRecording = () => {
    setAudioBlob(null);
    setAudioURL('');
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  };

  // Submit functionality
  const handleSubmit = async () => {
    setDocId(null);
    setIsDrawerOpen(false);
    if (!validateInput()) return;

    let formData = new FormData();
    formData.append('user_id', user.userId);
    formData.append('source_lang', sourceLanguage);
    targetLanguages.forEach(lang => formData.append('target_langs', lang));

    // Add the appropriate audio file
    if (selectedTab === 0) {
      if (!selectedFile) {
        showNotification('Please select a file to upload', 'error');
        return;
      }
      formData.append('audio_file', selectedFile);
    } else {
      if (!audioBlob) {
        showNotification('Please record audio first', 'error');
        return;
      }
      formData.append('recorded_audio', audioBlob, 'recording.webm');
    }

    setIsLoading(true);
    setProgress(0);

    try {
      const endpoint = selectedTab === 0 ? 'upload/' : 'upload_recorded_audio/';
      const response = await axios.post(`${BASE_URL}/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Cap progress at 90% until we get the response
          setProgress(Math.min(percentCompleted, 90));
        }
      });

      // Set progress to 100% only after response is received
      setProgress(100);
      setResponse(response.data);
      console.log('Response data:', response.data);
      setDocId(response.data.doc_id);
      setIsDrawerOpen(true);
      showNotification(selectedTab === 0 ? 'File uploaded successfully!' : 'Recording submitted successfully!');
      
      // Reset form
     
      setSelectedFile(null);
      if (uploadInputRef.current) {
        uploadInputRef.current.value = '';
      }
      handleDiscardRecording();
      
    } catch (error) {
      console.error('Submission Error:', error);
      showNotification(error.response?.data?.message || 'Error during submission', 'error');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio player effect
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [audioURL]);

  // Reset progress when loading stops
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setProgress(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 500, mx: 'auto' }}
          >
            Upload or record audio to translate between multiple languages
          </Typography>
        </Box>

        {/* Language Selection Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
            border: '1px solid rgba(25, 118, 210, 0.08)',
            p: 4,
            mb: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            Language Settings
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Source Language
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    sx={{ 
                      height: 56, 
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(25, 118, 210, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {languageOptions.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ color: 'primary.main', fontSize: 20, mr: 2 }} />
                          {lang.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 80
              }}>
                <IconButton
                  onClick={() => {
                    const temp = sourceLanguage;
                    setSourceLanguage(targetLanguages[0] || '');
                    setTargetLanguages([temp]);
                  }}
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '&:hover': { 
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <SwapHoriz />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Target Languages
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={targetLanguages}
                    onChange={(e) => setTargetLanguages(e.target.value)}
                    sx={{ 
                      minHeight: 56, 
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(25, 118, 210, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={languageOptions.find((lang) => lang.value === value)?.label}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              color: 'primary.main',
                              borderRadius: '8px',
                              fontWeight: 500,
                              '& .MuiChip-deleteIcon': {
                                color: 'primary.main',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {languageOptions.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ color: 'primary.main', fontSize: 20, mr: 2 }} />
                          {lang.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid rgba(25, 118, 210, 0.08)',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 72,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  color: 'primary.main',
                }
              }
            }}
          >
            <Tab
              icon={<CloudUploadIcon sx={{ fontSize: 28 }} />}
              label="Upload Audio"
              iconPosition="start"
              sx={{ gap: 2 }}
            />
            <Tab
              icon={<MicIcon sx={{ fontSize: 28 }} />}
              label="Record Audio"
              iconPosition="start"
              sx={{ gap: 2 }}
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Upload Tab */}
            {selectedTab === 0 && (
              <Stack spacing={4} alignItems="center" sx={{ flex: 1, justifyContent: 'center' }}>
                <Box 
                  sx={{ 
                    border: '2px dashed rgba(25, 118, 210, 0.3)',
                    borderRadius: '16px',
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: 'rgba(25, 118, 210, 0.02)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    },
                    width: '100%',
                    maxWidth: 480
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Choose Audio File
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Supports MP3, WAV, M4A and other audio formats
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      }
                    }}
                  >
                    Browse Files
                    <input
                      ref={uploadInputRef}
                      type="file"
                      hidden
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Box>
                
                {selectedFile && (
                  <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: '12px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                      File Selected
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFile.name}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}

            {/* Record Tab */}
            {selectedTab === 1 && (
              <Stack spacing={4} alignItems="center" sx={{ flex: 1, justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
                  <IconButton
                    onClick={toggleRecording}
                    sx={{
                      width: 120,
                      height: 120,
                      backgroundColor: isRecording ? 'error.main' : 'primary.main',
                      color: 'white',
                      mb: 3,
                      boxShadow: isRecording 
                        ? '0 8px 24px rgba(244, 67, 54, 0.4)' 
                        : '0 8px 24px rgba(25, 118, 210, 0.4)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        backgroundColor: isRecording ? 'error.dark' : 'primary.dark',
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    {isRecording ? <StopIcon sx={{ fontSize: 48 }} /> : <MicIcon sx={{ fontSize: 48 }} />}
                  </IconButton>

                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {isRecording ? 'Recording in Progress' : 'Ready to Record'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {isRecording 
                      ? 'Click the stop button when you\'re finished' 
                      : 'Click the microphone to start recording your audio'
                    }
                  </Typography>

                  {isRecording && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: 'error.main', 
                          borderRadius: '50%',
                          animation: 'pulse 1.5s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 },
                          }
                        }} 
                      />
                    </Box>
                  )}
                </Box>

                {audioBlob && (
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      width: '100%',
                      maxWidth: 400
                    }}
                  >
                    <audio ref={audioPlayerRef} src={audioURL} />
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                      Recording Ready
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        onClick={handlePlayPause}
                        startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        sx={{
                          borderRadius: '10px',
                          px: 3,
                          fontWeight: 600,
                          textTransform: 'none'
                        }}
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDiscardRecording}
                        startIcon={<DeleteOutlineIcon />}
                        sx={{
                          borderRadius: '10px',
                          px: 3,
                          fontWeight: 600,
                          textTransform: 'none'
                        }}
                      >
                        Discard
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Submit Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                startIcon={isLoading ? null : <SendIcon />}
                sx={{
                  borderRadius: '16px',
                  px: 8,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  minWidth: 200,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #bbbbbb, #cccccc)',
                    boxShadow: 'none',
                    transform: 'none',
                  }
                }}
              >
                {isLoading ? 'Processing...' : 'Start Translation'}
              </Button>

              {/* Loading Progress */}
              {isLoading && (
                <Box sx={{ mt: 4, maxWidth: 400, mx: 'auto' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                      }
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Processing your {selectedTab === 0 ? 'file' : 'recording'}...
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {progress}%
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '600px' },
          },
        }}
      >
        {docId && <ViewAudioComponent audioId={docId} />}
      </Drawer>
    </Container>
  );
};

export default TranscribeComponent;