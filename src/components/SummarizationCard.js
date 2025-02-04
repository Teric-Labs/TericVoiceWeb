import React, { useState, useRef, useEffect} from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Snackbar,
  Alert,
  Drawer
} from '@mui/material';
import {
  CloudUpload,
  Article,
  AudioFile,
  YouTube,
  SwapHoriz,
  CloudQueue,
  OndemandVideo,
  LinkedIn,
} from '@mui/icons-material';
import ViewSummaryComponent from './ViewSummaryComponent ';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://avoicesfinny-13747549899.us-central1.run.app';

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

const videoSources = [
  { icon: <YouTube />, name: 'YouTube', value: 'youtube' },
  { icon: <CloudQueue />, name: 'Vimeo', value: 'vimeo' },
  { icon: <CloudQueue />, name: 'DropBox', value: 'dropbox' },
  { icon: <CloudQueue />, name: 'facebook', value: 'facebook' },
  { icon: <OndemandVideo />, name: 'Daily Motion', value: 'dailymotion' },
  { icon: <LinkedIn />, name: 'LinkedIn', value: 'linkedin' },
];

const ALLOWED_FILE_TYPES = {
  document: {
    extensions: ['.pdf', '.doc', '.docx', '.txt'],
    message: 'Please upload a PDF, DOC, DOCX, or TXT file'
  },
  audio: {
    extensions: ['.wav', '.mp3'],
    message: 'Please upload a WAV or MP3 file'
  }
};

const SummarizationCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSource, setVideoSource] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [translationId, setTranslationId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setUploadedFile(null);
    setVideoUrl('');
    setTextContent('');
    setTranslationId(null);
  };

  const handleLanguageSwap = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    const fileType = activeTab === 1 ? 'document' : 'audio';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];

    if (allowedTypes.extensions.includes(fileExtension)) {
      setUploadedFile(file);
      showNotification('File uploaded successfully');
    } else {
      setUploadedFile(null);
      showNotification(allowedTypes.message, 'error');
    }
  };

  const handleVideoSourceChange = (event, newSources) => {
    setVideoSource(newSources);
  };

  const handleSubmit = async () => {
    setTranslationId(null);
    setIsDrawerOpen(false);
    
    if (!sourceLanguage || !title) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('source_lang', sourceLanguage);
    formData.append('title', title);
    formData.append('user_id', user.userId);

    try {
      let endpoint;
      let response;

      switch (activeTab) {
        case 0: // Text
          endpoint = `${BASE_URL}/surmarize`;
          formData.append('doc', textContent);
          break;
        case 1: // Document
          endpoint = `${BASE_URL}/summarize_document`;
          if (!uploadedFile) throw new Error('Please select a document to upload');
          formData.append('file', uploadedFile);
          break;
        case 2: // Audio
          endpoint = `${BASE_URL}/summarize_upload`;
          if (!uploadedFile) throw new Error('Please select an audio file to upload');
          formData.append('audio_file', uploadedFile);
          break;
        case 3: // Video
          endpoint = `${BASE_URL}/surmarize_audio_from_video`;
          if (!videoUrl || videoSource.length === 0) {
            throw new Error('Please provide both video URL and source');
          }
          formData.append('video_type', videoSource[0]);
          formData.append('video_link', videoUrl);
          break;
        default:
          throw new Error('Invalid tab selection');
      }

      // First, try to make the request
      response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        // Add this to handle redirects manually
        redirect: 'follow'
      });

      // If we get a redirect, follow it manually
      if (response.status === 307) {
        const redirectUrl = response.headers.get('Location');
        response = await fetch(redirectUrl, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle the response consistently across all endpoints
      if (data && typeof data === 'object') {
        const docId = data.doc_id;
        if (docId) {
          setTranslationId(docId);
          setIsDrawerOpen(true);
          showNotification('Summary generated successfully');
        } else {
          throw new Error('No document ID received from server');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification(error.message || 'Error processing request', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFileUpload = () => {
    const isDocument = activeTab === 1;
    const fileType = isDocument ? 'document' : 'audio';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];

    return (
      <Box sx={{ textAlign: 'center' }}>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={allowedTypes.extensions.join(',')}
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
          {isDocument ? 'Upload Document' : 'Upload Audio'}
        </Button>
        {uploadedFile && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={uploadedFile.name}
              onDelete={() => setUploadedFile(null)}
              sx={{ mb: 2 }}
            />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: '24px',
          maxWidth: '1200px',
          margin: 'auto',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
          mb: 8,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel>Source Language</InputLabel>
              <Select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                label="Source Language"
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
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <SwapHoriz />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth>
              <InputLabel>Target Language</InputLabel>
              <Select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                label="Target Language"
                disabled
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

      <TextField
        fullWidth
        label="Summary Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 4 }}
        required
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab icon={<Article />} label="Paste Text" />
          <Tab icon={<CloudUpload />} label="Upload Document" />
          <Tab icon={<AudioFile />} label="Upload Audio" />
          <Tab icon={<OndemandVideo />} label="Video Link" />
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
          />
        )}

        {(activeTab === 1 || activeTab === 2) && renderFileUpload()}

        {activeTab === 3 && (
          <Box>
            <TextField
              fullWidth
              label="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Select Video Source:
            </Typography>
            <ToggleButtonGroup
              value={videoSource}
              onChange={handleVideoSourceChange}
              aria-label="video source"
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {videoSources.map((source) => (
                <ToggleButton 
                  key={source.value} 
                  value={source.value}
                  aria-label={source.name}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  {source.icon}
                  <Typography sx={{ ml: 1 }}>{source.name}</Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2}}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing || 
            !sourceLanguage ||
            !title ||
            (activeTab === 0 && !textContent) ||
            ((activeTab === 1 || activeTab === 2) && !uploadedFile) ||
            (activeTab === 3 && (!videoUrl || !videoSource.length))
          }
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '28px',
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          }}
        >
          {isProcessing ? 'Processing...' : 'Generate Summary'}
        </Button>
      </Box>

      {isProcessing && (
        <LinearProgress sx={{ mt: 3 }} />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
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
      >
        {translationId && <ViewSummaryComponent translationId={translationId}  onError={(error) => {
          showNotification(error.message, 'error');
          setIsDrawerOpen(false);
        }}/>}
      </Drawer>
    </Container>
  );
};

export default SummarizationCard;