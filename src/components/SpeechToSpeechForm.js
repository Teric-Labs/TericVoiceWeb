import React, { useState, useRef,useEffect } from 'react';
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
  TextField,
  IconButton,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Snackbar,
  Drawer
} from '@mui/material';
import {
  Mic,
  Stop,
  CloudUpload,
  SwapHoriz,
  GraphicEq,
  Language as LanguageIcon,
} from '@mui/icons-material';
import ViewVoxComponent from './ViewVoxComponent';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://avoicesfinny-13747549899.us-central1.run.app';

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

const SpeechToSpeechForm = () => {
  // Form state
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [title, setTitle] = useState('');
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioPlayback, setAudioPlayback] = useState({ isPlaying: false, file: null });
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Refs
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLanguageSwap = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguages[0] || '');
    setTargetLanguages(temp ? [temp] : []);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      showNotification('Please enter a title', 'error');
      return false;
    }
    if (!sourceLanguage) {
      showNotification('Please select a source language', 'error');
      return false;
    }
    if (targetLanguages.length === 0) {
      showNotification('Please select at least one target language', 'error');
      return false;
    }
    if (activeTab === 0 && !uploadedFile) {
      showNotification('Please upload an audio file', 'error');
      return false;
    }
    if (activeTab === 1 && !audioPlayback.file) {
      showNotification('Please record audio first', 'error');
      return false;
    }
    return true;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'audio/wav' || file.type === 'audio/mpeg')) {
      setUploadedFile(file);
    } else {
      showNotification('Please upload a .wav or .mp3 file', 'error');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioPlayback({ isPlaying: false, file: URL.createObjectURL(audioBlob) });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      showNotification('Error accessing microphone. Please check permissions.', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setDocId(null);
    setIsDrawerOpen(false);
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('source_lang', sourceLanguage);
    formData.append('target_langs', targetLanguages);
    formData.append('user_id', user.userId);

    try {
      let apiResponse;
      
      if (activeTab === 0) {
        // Upload tab
        formData.append('audio_file', uploadedFile);
        apiResponse = await fetch(`${BASE_URL}/voicox`, {
          method: 'POST',
          body: formData
        });
      } else {
        // Record tab
        const response = await fetch(audioPlayback.file);
        const blob = await response.blob();
        formData.append('recorded_audio', blob, 'recorded_audio.wav');
        apiResponse = await fetch(`${BASE_URL}/recorded_audio_vv`, {
          method: 'POST',
          body: formData
        });
      }

      if (!apiResponse.ok) {
        throw new Error('Translation request failed');
      }

      const responseData = await apiResponse.json();
      
      // Parse the response string if it's not already an object
      const parsedResponse = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
      
      if (parsedResponse.doc_id) {
        setDocId(parsedResponse.doc_id);
        setIsDrawerOpen(true);
        showNotification('Translation submitted successfully');
        
        // Reset form
        setTitle('');
        setUploadedFile(null);
        setAudioPlayback({ isPlaying: false, file: null });
      } else {
        throw new Error('No document ID received from server');
      }

    } catch (error) {
      console.error('Submission error:', error);
      showNotification(error.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Rest of your component (UI rendering) remains exactly the same
  return (
    <Box 
      sx={{ 
        position: 'relative',
        mb: 6,
        py: 8,
        px: 8,
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }
      }}
    >
      {/* Language Selection Section */}
      <Paper 
        elevation={0} 
        sx={{
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
          border: '1px solid rgba(25, 118, 210, 0.08)',
          padding: '24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <Grid container spacing={3} alignItems="center">
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
              onClick={handleLanguageSwap}
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
          
          <Grid item xs={12}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Upload Audio" />
          <Tab label="Record Audio" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Box sx={{ textAlign: 'center' }}>
            <input
              type="file"
              accept=".wav,.mp3"
              hidden
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current.click()}
              sx={{
                borderRadius: '28px',
                px: 4,
                py: 2,
                borderWidth: '2px',
                mb: 2
              }}
            >
              Upload Audio File
            </Button>
            {uploadedFile && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={uploadedFile.name}
                  onDelete={() => setUploadedFile(null)}
                  sx={{ mb: 2 }}
                />
                <audio controls src={URL.createObjectURL(uploadedFile)} style={{ width: '100%' }} />
              </Box>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <IconButton
              sx={{
                width: '80px',
                height: '80px',
                backgroundColor: isRecording ? 'error.main' : 'primary.main',
                color: 'white',
                mb: 3,
                '&:hover': { backgroundColor: isRecording ? 'error.dark' : 'primary.dark' }
              }}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <Stop /> : <Mic />}
            </IconButton>
            {isRecording && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <GraphicEq sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            )}
            {audioPlayback.file && !isRecording && (
              <Box sx={{ mt: 3 }}>
                <audio controls src={audioPlayback.file} style={{ width: '100%' }} />
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Submit Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          disabled={isProcessing || (!uploadedFile && !audioPlayback.file)}
          onClick={handleSubmit}
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
            }
          }}
        >
          {isProcessing ? 'Processing...' : 'Translate Audio'}
        </Button>
      </Box>

      {isProcessing && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Results Drawer */}
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
        {docId && <ViewVoxComponent voiceId={docId} />}
      </Drawer>
    </Box>
  );
};

export default SpeechToSpeechForm;