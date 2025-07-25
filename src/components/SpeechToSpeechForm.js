import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  Drawer,
  Tooltip,
  Card,
  CardContent,
  Fade,
  Zoom,
  CircularProgress,
  styled
} from '@mui/material';
import {
  Mic,
  Stop,
  CloudUpload,
  SwapHoriz,
  GraphicEq,
  Language as LanguageIcon,
  Delete as DeleteIcon,
  Replay as ReplayIcon,
  Audiotrack as AudioIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import ViewVoxComponent from './ViewVoxComponent';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com';

const languageOptions = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'lg', label: 'Luganda', flag: '🇺🇬' },
  { value: 'at', label: 'Ateso', flag: '🇺🇬' },
  { value: 'ac', label: 'Acholi', flag: '🇺🇬' },
  { value: 'sw', label: 'Swahili', flag: '🇹🇿' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { value: 'nyn', label: 'Runyankore', flag: '🇺🇬' },
];

const SUPPORTED_AUDIO_TYPES = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  border: '1px solid rgba(33, 150, 243, 0.1)',
  padding: theme.spacing(4),
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '32px',
  padding: theme.spacing(1.5, 6),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(33, 150, 243, 0.5)',
  },
  '&:disabled': {
    background: 'rgba(0,0,0,0.12)',
    boxShadow: 'none',
    color: 'rgba(0,0,0,0.26)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff !important',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiTabs-indicator': {
    height: '4px',
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.main,
  },
}));

const SpeechToSpeechForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    console.log('Initializing component, checking user data');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('User data loaded:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        showNotification('Failed to load user data. Please log in again.', 'error');
      }
    } else {
      console.warn('No user data found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      console.log('Starting recording timer');
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        console.log('Clearing recording timer');
        clearInterval(recordingTimerRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        console.log('Cleaning up recording timer');
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Drag over detected');
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dropZoneRef.current?.contains(e.relatedTarget)) {
        console.log('Drag leave detected');
        setIsDragOver(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('File dropped:', e.dataTransfer.files);
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelection(droppedFile);
      }
    };

    const dropZone = dropZoneRef.current;
    if (dropZone && activeTab === 0) {
      console.log('Adding drag-and-drop event listeners');
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropZone) {
        console.log('Removing drag-and-drop event listeners');
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, [activeTab]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const showNotification = useCallback((message, severity = 'success') => {
    console.log('Showing notification:', { message, severity });
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeNotification = useCallback(() => {
    console.log('Closing notification');
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    console.log('Switching tab to:', newValue);
    setActiveTab(newValue);
    if (audioPreview) {
      console.log('Revoking audio preview URL');
      URL.revokeObjectURL(audioPreview);
    }
    setUploadedFile(null);
    setAudioPreview(null);
  }, [audioPreview]);

  const handleLanguageSwap = useCallback(() => {
    if (sourceLanguage && targetLanguages.length > 0) {
      console.log('Swapping languages:', { source: sourceLanguage, target: targetLanguages[0] });
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguages[0]);
      setTargetLanguages([temp]);
    }
  }, [sourceLanguage, targetLanguages]);

  const validateForm = useCallback(() => {
    console.log('Validating form:', { sourceLanguage, targetLanguages, activeTab, uploadedFile });
    if (!sourceLanguage) {
      showNotification('Please select a source language', 'error');
      return false;
    }
    if (targetLanguages.length === 0) {
      showNotification('Please select at least one target language', 'error');
      return false;
    }
    if (sourceLanguage === targetLanguages[0] && targetLanguages.length === 1) {
      showNotification('Source and target languages cannot be the same', 'error');
      return false;
    }
    
    if (!user.userId) {
      showNotification('User not authenticated. Please log in again.', 'error');
      return false;
    }
    return true;
  }, [sourceLanguage, targetLanguages, uploadedFile, user.userId, showNotification]);

  const handleFileSelection = useCallback((file) => {
    console.log('Handling file selection:', { name: file.name, type: file.type, size: file.size });
    if (!file) {
      showNotification('No file selected', 'error');
      return;
    }

    const validExtension = /\.(wav|mp3|mpeg)$/i.test(file.name);
    const validMimeType = SUPPORTED_AUDIO_TYPES.includes(file.type) || file.type === '';

    console.log('File validation:', { validExtension, validMimeType });


    if (file.size > MAX_FILE_SIZE) {
      showNotification('File size must be less than 10MB', 'error');
      return;
    }

    if (audioPreview) {
      console.log('Revoking previous audio preview URL');
      URL.revokeObjectURL(audioPreview);
    }
    const newPreview = URL.createObjectURL(file);
    console.log('Setting new states:', { file, preview: newPreview });
    setUploadedFile(file);
    setAudioPreview(newPreview);
    showNotification('Audio file uploaded successfully', 'success');
  }, [showNotification, audioPreview]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    console.log('File input changed:', file);
    if (file) {
      handleFileSelection(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input to allow re-uploading same file
    }
  }, [handleFileSelection]);

  const startRecording = useCallback(async () => {
    console.log('Starting audio recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm',
      });
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Recording data available:', event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Recording stopped');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Setting recorded audio:', { url: audioUrl, size: audioBlob.size });
        setUploadedFile(new File([audioBlob], 'recorded_audio.wav', { type: 'audio/wav' }));
        setAudioPreview(audioUrl);
        stream.getTracks().forEach(track => track.stop());
        showNotification('Recording completed successfully', 'success');
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        showNotification('Recording failed. Please try again.', 'error');
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      showNotification('Recording started...', 'info');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      showNotification('Unable to access microphone. Please check permissions and try again.', 'error');
    }
  }, [showNotification]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    console.log('Clearing recording');
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    setUploadedFile(null);
    setAudioPreview(null);
    setRecordingDuration(0);
  }, [audioPreview]);

  const clearUploadedFile = useCallback(() => {
    console.log('Clearing uploaded file');
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    setUploadedFile(null);
    setAudioPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [audioPreview]);

  const handleSubmit = useCallback(async () => {
    console.log('Submitting form:', { activeTab, sourceLanguage, targetLanguages, uploadedFile, userId: user.userId });
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
  
    setDocId(null);
    setIsDrawerOpen(false);
    setIsProcessing(true);
    setUploadProgress(0);
  
    const formData = new FormData();
    formData.append('source_lang', sourceLanguage);
    formData.append('target_langs', targetLanguages.join(',')); // Changed to comma-separated string
    formData.append('user_id', user.userId);
    formData.append('audio_file', uploadedFile);
  
    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log(`FormData: ${pair[0]} = ${pair[1]}`);
    }
  
    try {
      console.log('Sending API request to:', `${BASE_URL}/voicox`);
      const response = await axios.post(`${BASE_URL}/voicox`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log('Upload progress:', progress);
          setUploadProgress(progress);
        },
        timeout: 30000,
      });
  
      console.log('API response:', response.data);
      const docId = response.data.entries?.[0]?.doc_id || response.data.doc_id || response.data.id;
      if (docId) {
        const audioUrls = response.data.entries?.[0]?.audio_urls || {};
        if (Object.keys(audioUrls).length === 0) {
          showNotification('Translation submitted, but no audio URLs were generated. Please try again.', 'warning');
        } else {
          showNotification('Translation submitted successfully! Check the results panel.', 'success');
        }
        setDocId(docId);
        setIsDrawerOpen(true);
        clearUploadedFile();
      } else {
        throw new Error('Invalid response: No document ID received from server');
      }
    } catch (error) {
      console.error('Submission error:', error);
      let errorMessage = 'Translation failed. Please try again.';
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your network and try again.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      }
      showNotification(errorMessage, 'error');
    } finally {
      console.log('Submission complete, resetting processing state');
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }, [validateForm, sourceLanguage, targetLanguages, user.userId, uploadedFile, showNotification, clearUploadedFile]);

  const renderLanguageMenuItem = (lang) => (
    <MenuItem key={lang.value} value={lang.value}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
        <LanguageIcon sx={{ color: 'primary.main', fontSize: 18 }} />
        <Typography variant="body1">{lang.label}</Typography>
      </Box>
    </MenuItem>
  );

  const renderSelectedLanguages = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {selected.map((value) => {
        const lang = languageOptions.find((lang) => lang.value === value);
        return (
          <Chip
            key={value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <span style={{ fontSize: '1rem' }}>{lang?.flag}</span>
                <Typography variant="body2">{lang?.label}</Typography>
              </Box>
            }
            sx={{
              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 30%, rgba(33, 203, 243, 0.1) 90%)',
              borderRadius: '12px',
              border: '1px solid rgba(33, 150, 243, 0.3)',
              fontWeight: 500,
            }}
          />
        );
      })}
    </Box>
  );

  const isSubmitDisabled = isProcessing || !uploadedFile || !sourceLanguage || targetLanguages.length === 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 6, px: { xs: 2, sm: 4 } }} role="main" aria-label="Audio Translation Form">
      <Fade in timeout={800}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ mb: 4, fontWeight: 700, color: 'text.primary' }}
          aria-label="Audio Translation Header"
        >
          Audio Translation
        </Typography>
      </Fade>

      <Zoom in timeout={1000}>
        <StyledPaper elevation={8} role="region" aria-label="Translation Form">
          {isProcessing && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <LinearProgress
                variant={uploadProgress > 0 ? 'determinate' : 'indeterminate'}
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                    borderRadius: 4,
                  },
                }}
                aria-label="Upload Progress"
              />
              {uploadProgress > 0 && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              )}
              {uploadProgress === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <CircularProgress size={24} sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2" color="primary">
                    Processing...
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {notification.open && (
            <Fade in>
              <Alert 
                severity={notification.severity} 
                sx={{ mb: 3, borderRadius: 2 }} 
                onClose={closeNotification}
                aria-live="assertive"
              >
                {notification.message}
              </Alert>
            </Fade>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ p: 3, backgroundColor: 'rgba(33, 150, 243, 0.02)', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }} aria-label="Language Settings">
                  Language Settings
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Source Language
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        sx={{
                          borderRadius: 3,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(33, 150, 243, 0.3)',
                          },
                          '& .MuiSelect-select': { py: 2 },
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select source language' }}
                      >
                        <MenuItem value="" disabled>
                          <Typography color="textSecondary">Select source language</Typography>
                        </MenuItem>
                        {languageOptions.map(renderLanguageMenuItem)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tooltip title="Swap languages">
                      <IconButton
                        onClick={handleLanguageSwap}
                        disabled={!sourceLanguage || targetLanguages.length === 0}
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(180deg)',
                            boxShadow: '0 12px 24px rgba(33, 150, 243, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.12)',
                            color: 'rgba(0,0,0,0.26)',
                          },
                        }}
                        aria-label="Swap source and target languages"
                      >
                        <SwapHoriz />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Target Language(s)
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        value={targetLanguages}
                        onChange={(e) => setTargetLanguages(e.target.value)}
                        renderValue={renderSelectedLanguages}
                        sx={{
                          borderRadius: 3,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(33, 150, 243, 0.3)',
                          },
                          '& .MuiSelect-select': { py: 2 },
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select target languages' }}
                      >
                        <MenuItem value="" disabled>
                          <Typography color="textSecondary">Select target language(s)</Typography>
                        </MenuItem>
                        {languageOptions
                          .filter(lang => lang.value !== sourceLanguage)
                          .map(renderLanguageMenuItem)
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <StyledTabs value={activeTab} onChange={handleTabChange} centered aria-label="Audio input method tabs">
                <Tab label="Upload Audio" aria-label="Upload Audio Tab" />
                <Tab label="Record Audio" aria-label="Record Audio Tab" />
              </StyledTabs>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  {activeTab === 0 && (
                    <Box
                      ref={dropZoneRef}
                      onClick={() => {
                        console.log('Drop zone clicked');
                        fileInputRef.current?.click();
                      }}
                      sx={{
                        minHeight: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: `3px dashed ${isDragOver ? '#2196F3' : 'rgba(33, 150, 243, 0.3)'}`,
                        borderRadius: 3,
                        background: isDragOver 
                          ? 'linear-gradient(145deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)'
                          : 'linear-gradient(145deg, rgba(248, 249, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          border: '3px dashed #2196F3',
                          background: 'linear-gradient(145deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                      role="region"
                      aria-label="Audio upload drop zone"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/wav,audio/mpeg,audio/mp3,.wav,.mp3,.mpeg"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        aria-label="Upload audio file"
                      />
                      {!uploadedFile ? (
                        <Fade in timeout={600}>
                          <Box sx={{ textAlign: 'center' }}>
                            <AudioIcon 
                              sx={{ 
                                fontSize: 80, 
                                color: 'primary.main', 
                                mb: 2,
                                filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.3))',
                              }} 
                              aria-hidden="true"
                            />
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                              Drop your audio here
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                              or click to browse files
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Supported formats: WAV, MP3 • Max size: 10MB
                            </Typography>
                          </Box>
                        </Fade>
                      ) : (
                        <Zoom in timeout={600}>
                          <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
                            <Box sx={{ mb: 3, position: 'relative' }}>
                              <audio
                                src={audioPreview}
                                controls
                                style={{
                                  width: '100%',
                                  borderRadius: '12px',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                }}
                                aria-label={`Preview of uploaded audio file ${uploadedFile.name}`}
                              />
                            </Box>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              backgroundColor: 'rgba(33, 150, 243, 0.05)',
                              borderRadius: 2,
                              border: '1px solid rgba(33, 150, 243, 0.2)',
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircleIcon sx={{ color: 'success.main' }} aria-hidden="true" />
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {uploadedFile.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatFileSize(uploadedFile.size)}
                                  </Typography>
                                </Box>
                              </Box>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearUploadedFile();
                                }}
                                color="error"
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' },
                                }}
                                aria-label="Remove uploaded audio file"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Zoom>
                      )}
                    </Box>
                  )}

                  {activeTab === 1 && (
                    <Box sx={{ textAlign: 'center', py: 4, maxWidth: 600, mx: 'auto' }} role="region" aria-label="Audio recording section">
                      <Box sx={{ mb: 4 }}>
                        <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
                          <IconButton
                            sx={{
                              width: 96,
                              height: 96,
                              backgroundColor: isRecording ? 'error.main' : 'primary.main',
                              color: 'white',
                              mb: 2,
                              '&:hover': {
                                backgroundColor: isRecording ? 'error.dark' : 'primary.dark',
                                transform: 'scale(1.1)',
                              },
                              borderRadius: '24px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={isRecording ? stopRecording : startRecording}
                            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                          >
                            {isRecording ? <Stop sx={{ fontSize: 48 }} /> : <Mic sx={{ fontSize: 48 }} />}
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {isRecording && (
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                            <GraphicEq sx={{ fontSize: 48, color: 'error.main', animation: 'pulse 1.5s infinite' }} aria-hidden="true" />
                          </Box>
                          <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }} aria-live="polite">
                            Recording: {formatTime(recordingDuration)}
                          </Typography>
                        </Box>
                      )}

                      {audioPreview && !isRecording && (
                        <Box sx={{
                          mt: 3,
                          p: 3,
                          backgroundColor: 'rgba(33, 150, 243, 0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(33, 150, 243, 0.2)',
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                            <Button
                              variant="outlined"
                              startIcon={<ReplayIcon />}
                              onClick={startRecording}
                              size="medium"
                              sx={{ borderRadius: '12px' }}
                              aria-label="Re-record audio"
                            >
                              Re-record
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              onClick={clearRecording}
                              size="medium"
                              color="error"
                              sx={{ borderRadius: '12px' }}
                              aria-label="Clear recorded audio"
                            >
                              Clear
                            </Button>
                          </Box>
                          <audio
                            controls
                            src={audioPreview}
                            style={{ width: '100%', maxWidth: 400, borderRadius: '12px' }}
                            aria-label="Preview of recorded audio"
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <StyledButton
                variant="contained"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
                startIcon={isProcessing ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CloudUpload />}
                aria-label="Translate audio"
              >
                {isProcessing ? 'Processing Translation...' : 'Translate Audio'}
              </StyledButton>
            </Grid>
          </Grid>
        </StyledPaper>
      </Zoom>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
          aria-live="assertive"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '600px' },
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            p: 3,
          },
        }}
        aria-label="Translation results drawer"
      >
        {docId && <ViewVoxComponent voiceId={docId} />}
      </Drawer>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default SpeechToSpeechForm;