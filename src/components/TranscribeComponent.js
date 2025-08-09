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
  Divider,
  Card,
  CardContent,
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
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setSourceLanguage,
  setTargetLanguages,
  setAudioBlob,
  setAudioURL,
  setSelectedFile,
  setIsRecording,
  setIsPlaying,
  setProgress,
  clearAudio,
  clearError,
  uploadAudio,
  uploadRecordedAudio,
} from '../store/slices/transcriptionSlice';
import { addNotification } from '../store/slices/uiSlice';
import ViewAudioComponent from './ViewAudioComponent';

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
  const dispatch = useAppDispatch();
  const {
    sourceLanguage,
    targetLanguages,
    audioBlob,
    audioURL,
    selectedFile,
    isRecording,
    isPlaying,
    isLoading,
    progress,
    response,
    docId,
    error,
  } = useAppSelector((state) => state.transcription);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedTab, setSelectedTab] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Refs
  const mediaRecorder = useRef(null);
  const audioPlayerRef = useRef(null);
  const uploadInputRef = useRef(null);

  // Notification helper
  const showNotification = (message, severity = 'success') => {
    dispatch(addNotification({ message, severity }));
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
      dispatch(setIsRecording(false));
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          dispatch(setAudioBlob(blob));
          dispatch(setAudioURL(URL.createObjectURL(blob)));
        };

        recorder.start();
        mediaRecorder.current = recorder;
        dispatch(setIsRecording(true));
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
      dispatch(setSelectedFile(file));
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
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleDiscardRecording = () => {
    dispatch(clearAudio());
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  };

  // Submit functionality
  const handleSubmit = async () => {
    if (!validateInput()) return;

    let formData = new FormData();
    formData.append('user_id', user?.userId || '');
    formData.append('source_lang', sourceLanguage);
    targetLanguages.forEach(lang => formData.append('target_langs', lang));

    // Add the appropriate audio file
    if (selectedTab === 0) {
      if (!selectedFile) {
        showNotification('Please select a file to upload', 'error');
        return;
      }
      formData.append('audio_file', selectedFile);
      await dispatch(uploadAudio(formData));
    } else {
      if (!audioBlob) {
        showNotification('Please record audio first', 'error');
        return;
      }
      formData.append('recorded_audio', audioBlob, 'recording.webm');
      await dispatch(uploadRecordedAudio(formData));
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Voice Recognition & Transcription
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  },
                }}
              >
                <Tab label="Upload Audio/Video" />
                <Tab label="Record Audio" />
              </Tabs>
            </Box>

            {/* Language Selection */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Source Language
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => dispatch(setSourceLanguage(e.target.value))}
                    sx={{ borderRadius: '12px' }}
                  >
                    {languageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LanguageIcon sx={{ color: 'primary.main' }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Target Languages
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={targetLanguages}
                    onChange={(e) => dispatch(setTargetLanguages(e.target.value))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const option = languageOptions.find(opt => opt.value === value);
                          return (
                            <Chip
                              key={value}
                              label={option?.label || value}
                              size="small"
                              sx={{ backgroundColor: 'primary.main', color: 'white' }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    sx={{ borderRadius: '12px' }}
                  >
                    {languageOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LanguageIcon sx={{ color: 'primary.main' }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* File Upload or Recording Section */}
            {selectedTab === 0 ? (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Audio/Video File
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: '12px',
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: 'rgba(25, 118, 210, 0.02)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    },
                  }}
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports MP3, WAV, MP4, AVI (Max 10MB)
                  </Typography>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </Box>
                {selectedFile && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: '8px' }}>
                    <Typography variant="body2">
                      Selected: {selectedFile.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Record Audio
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    variant={isRecording ? "contained" : "outlined"}
                    color={isRecording ? "error" : "primary"}
                    startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                    onClick={toggleRecording}
                    sx={{ borderRadius: '24px', px: 3 }}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  {audioURL && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        onClick={handlePlayPause}
                        sx={{ borderRadius: '24px' }}
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <IconButton
                        onClick={handleDiscardRecording}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
                {audioURL && (
                  <audio
                    ref={audioPlayerRef}
                    src={audioURL}
                    style={{ display: 'none' }}
                    onEnded={() => dispatch(setIsPlaying(false))}
                  />
                )}
              </Box>
            )}

            {/* Progress */}
            {isLoading && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Processing... {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isLoading || (!selectedFile && !audioBlob)}
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Processing...' : 'Transcribe Audio'}
              </Button>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            {/* Results Drawer */}
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  width: { xs: '100%', sm: 400 },
                  p: 3,
                },
              }}
            >
              {docId && <ViewAudioComponent docId={docId} />}
            </Drawer>
          </CardContent>
        </Card>

        {/* Snackbar */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default TranscribeComponent;