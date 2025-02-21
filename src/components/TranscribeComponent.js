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
  Drawer
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

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://20.106.179.250:8080';

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
  const [title, setTitle] = useState('');
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
    if (!title.trim()) {
      showNotification('Please enter a title for your audio', 'error');
      return false;
    }
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
    formData.append('title', title);
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
      setTitle('');
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Language Selection Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
            border: '1px solid rgba(25, 118, 210, 0.08)',
            padding: '24px',
            mb: 4,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          {/* Language Selection Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Translate From
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  sx={{ minHeight: '56px', borderRadius: '12px' }}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      <LanguageIcon sx={{ color: 'primary.main', fontSize: 20, mr: 1 }} />
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2} sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              mt: { xs: 2, md: 4 } 
            }}>
              <IconButton
                onClick={() => {
                  const temp = sourceLanguage;
                  setSourceLanguage(targetLanguages[0] || '');
                  setTargetLanguages([temp]);
                }}
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                <SwapHoriz />
              </IconButton>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Translate To
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={targetLanguages}
                  onChange={(e) => setTargetLanguages(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={languageOptions.find((lang) => lang.value === value)?.label}
                          sx={{
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            borderRadius: '6px',
                            px: 1,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      <LanguageIcon sx={{ color: 'primary.main', fontSize: 20, mr: 1 }} />
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mb: 4, mt: 4 }}>
            <TextField
              fullWidth
              label="Audio Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              error={!title.trim()}
              helperText={!title.trim() ? 'Title is required' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Box>
        </Paper>

        {/* Main Content Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid rgba(25, 118, 210, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<CloudUploadIcon />}
              label="Upload"
              sx={{ py: 2 }}
            />
            <Tab
              icon={<MicIcon />}
              label="Record"
              sx={{ py: 2 }}
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {/* Upload Tab */}
            {selectedTab === 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: '28px',
                    px: 4,
                    py: 2,
                    borderWidth: '2px',
                    mb: 3
                  }}
                >
                  Upload Audio
                  <input
                    ref={uploadInputRef}
                    type="file"
                    hidden
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected file: {selectedFile.name}
                  </Typography>
                )}
              </Box>
            )}

            {/* Record Tab */}
            {selectedTab === 1 && (
              <Box sx={{ textAlign: 'center' }}>
                <IconButton
                  onClick={toggleRecording}
                  sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: isRecording ? 'error.main' : 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: isRecording ? 'error.dark' : 'primary.dark' },
                    mb: 2
                  }}
                >
                  {isRecording ? <StopIcon /> : <MicIcon />}
                </IconButton>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </Typography>

                {audioBlob && (
                  <Box sx={{ mb: 3 }}>
                    <audio ref={audioPlayerRef} src={audioURL} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={handlePlayPause}
                        startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        sx={{
                          borderRadius: '20px',
                          px: 3
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
                          borderRadius: '20px',
                          px: 3
                        }}
                      >
                        Discard
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: '28px',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                  },
                }}
              >
                {isLoading ? 'Processing...' : 'Submit'}
              </Button>
            </Box>

            {/* Loading Progress */}
            {isLoading && (
              <Box sx={{ mt: 4 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center" 
                  sx={{ mt: 1 }}
                >
                  Processing... {progress}%
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center" 
                  sx={{ mt: 1 }}
                >
                  Please wait while we process your {selectedTab === 0 ? 'file' : 'recording'}
                </Typography>
              </Box>
            )}
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