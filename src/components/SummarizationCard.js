import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  TextField,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
  Drawer
} from '@mui/material';
import {
  CloudUpload,
  Article,
  AudioFile,
  Movie,
  SwapHoriz,
} from '@mui/icons-material';
import ViewSummaryComponent from './ViewSummaryComponent ';

const BASE_URL = 'https://phosai-main-api.onrender.com';

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Acholi", code: "ac" },
  { name: "Ateso", code: "at" },
  { name: "Lugbara", code: "lgg" },
  { name: "Swahili", code: "sw" },
  { name: "French", code: "fr" },
  { name: "Kinyarwanda", code: "rw" }
];

const ALLOWED_FILE_TYPES = {
  document: {
    extensions: ['.pdf', '.doc', '.docx', '.txt'],
    message: 'Please upload a PDF, DOC, DOCX, or TXT file'
  },
  audio: {
    extensions: ['.wav', '.mp3'],
    message: 'Please upload a WAV or MP3 file'
  },
  video: {
    extensions: ['.mp4', '.avi', '.mov'],
    message: 'Please upload an MP4, AVI, or MOV file'
  }
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const SummarizationCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [translationId, setTranslationId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('User data loaded:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        showNotification('Failed to load user data', 'error');
      }
    } else {
      console.warn('No user data found in localStorage');
    }
  }, [showNotification]);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    setUploadedFile(null);
    setTextContent('');
    setTranslationId(null);
    console.log('Tab changed to:', newValue);
  }, []);

  const handleLanguageSwap = useCallback(() => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    console.log('Languages swapped:', { source: targetLanguage, target: temp });
  }, [sourceLanguage, targetLanguage]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) {
      console.warn('No file selected');
      return;
    }

    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];

    if (!allowedTypes.extensions.includes(fileExtension)) {
      console.error('Invalid file type:', fileExtension);
      setUploadedFile(null);
      showNotification(allowedTypes.message, 'error');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size);
      setUploadedFile(null);
      showNotification(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`, 'error');
      return;
    }

    setUploadedFile(file);
    showNotification(`File uploaded: ${file.name}`);
    console.log('File uploaded:', file.name, 'Size:', file.size);
  }, [activeTab, showNotification]);

  const handleSubmit = useCallback(async () => {
    if (!sourceLanguage || !user.userId) {
      console.error('Missing required fields:', { sourceLanguage, userId: user.userId });
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setTranslationId(null);
    setIsDrawerOpen(false);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('source_lang', sourceLanguage);
    formData.append('user_id', user.userId);

    try {
      let endpoint;
      switch (activeTab) {
        case 0: // Text
          endpoint = `${BASE_URL}/surmarize`;
          if (!textContent.trim()) {
            throw new Error('Text content is required');
          }
          formData.append('doc', textContent);
          break;
        case 1: // Document
          endpoint = `${BASE_URL}/summarize_document/`;
          if (!uploadedFile) {
            throw new Error('Please select a document to upload');
          }
          formData.append('file', uploadedFile);
          break;
        case 2: // Audio
          endpoint = `${BASE_URL}/summarize_upload/`;
          if (!uploadedFile) {
            throw new Error('Please select an audio file to upload');
          }
          formData.append('audio_file', uploadedFile);
          break;
        case 3: // Video
          endpoint = `${BASE_URL}/summarize_video/`;
          if (!uploadedFile) {
            throw new Error('Please select a video file to upload');
          }
          formData.append('video_file', uploadedFile);
          break;
        default:
          throw new Error('Invalid tab selection');
      }

      console.log('Submitting to endpoint:', endpoint);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data?.doc_id) {
        setTranslationId(data.doc_id);
        setIsDrawerOpen(true);
        showNotification('Summary generated successfully');
      } else {
        throw new Error('No document ID received from server');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showNotification(error.message || 'Error processing request', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [sourceLanguage, user.userId, activeTab, textContent, uploadedFile, showNotification]);

  const renderFileUpload = useCallback(() => {
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];
    const label = fileType.charAt(0).toUpperCase() + fileType.slice(1);

    return (
      <Box sx={{ textAlign: 'center' }}>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={allowedTypes.extensions.join(',')}
          aria-label={`Upload ${label} file`}
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
            mb: 2,
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
            },
          }}
          aria-label={`Select ${label} file`}
        >
          Upload {label}
        </Button>
        {uploadedFile && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={uploadedFile.name}
              onDelete={() => {
                setUploadedFile(null);
                console.log('File removed:', uploadedFile.name);
              }}
              sx={{ mb: 2 }}
              aria-label={`Uploaded file: ${uploadedFile.name}`}
            />
          </Box>
        )}
      </Box>
    );
  }, [activeTab, handleFileUpload, uploadedFile]);

  const styles = {
    paper: {
      p: 6,
      borderRadius: '24px',
      maxWidth: '1200px',
      margin: 'auto',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(25, 118, 210, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    },
    submitButton: {
      px: 4,
      py: 1.5,
      borderRadius: '28px',
      background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
      color: 'white',
      '&:hover': {
        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
      },
      '&:disabled': {
        background: 'grey.500',
        color: 'grey.300',
      },
    },
    swapButton: {
      backgroundColor: 'primary.main',
      color: 'white',
      '&:hover': {
        backgroundColor: 'primary.dark',
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.paper} role="region" aria-label="Summarization Card">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel id="source-language-label">Source Language</InputLabel>
              <Select
                labelId="source-language-label"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                label="Source Language"
                aria-label="Select source language"
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              onClick={handleLanguageSwap}
              sx={styles.swapButton}
              aria-label="Swap source and target languages"
            >
              <SwapHoriz />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel id="target-language-label">Target Language</InputLabel>
              <Select
                labelId="target-language-label"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                label="Target Language"
                disabled
                aria-label="Target language (disabled)"
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered aria-label="Input type tabs">
          <Tab icon={<Article />} label="Paste Text" aria-label="Paste Text Tab" />
          <Tab icon={<CloudUpload />} label="Upload Document" aria-label="Upload Document Tab" />
          <Tab icon={<AudioFile />} label="Upload Audio" aria-label="Upload Audio Tab" />
          <Tab icon={<Movie />} label="Upload Video" aria-label="Upload Video Tab" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3, minHeight: '300px' }}>
        {activeTab === 0 && (
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Paste your text here"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            sx={{ mb: 2 }}
            aria-label="Text input for summarization"
          />
        )}

        {(activeTab === 1 || activeTab === 2 || activeTab === 3) && renderFileUpload()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            isProcessing ||
            !sourceLanguage ||
            (activeTab === 0 && !textContent.trim()) ||
            (activeTab !== 0 && !uploadedFile)
          }
          sx={styles.submitButton}
          aria-label="Generate summary"
        >
          {isProcessing ? 'Processing...' : 'Generate Summary'}
        </Button>
      </Box>

      {isProcessing && (
        <LinearProgress sx={{ mt: 3 }} aria-label="Processing progress" />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%', borderRadius: 2 }}
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
          },
        }}
        aria-label="Summary results drawer"
      >
        {translationId && (
          <ViewSummaryComponent
            translationId={translationId}
            onError={(error) => {
              showNotification(error.message, 'error');
              setIsDrawerOpen(false);
            }}
          />
        )}
      </Drawer>
    </Container>
  );
};

export default SummarizationCard;