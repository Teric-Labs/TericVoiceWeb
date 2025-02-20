import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  Tab,
  Tabs,
  Drawer
} from '@mui/material';
import {
  VolumeUp,
  CloudUpload,
  SwapHoriz,
  Language,
  InsertDriveFile,
} from '@mui/icons-material';
import axios from 'axios';
import ViewttsAudioComponent from './ViewttsAudioComponent';

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://20.106.179.250:8080',
  TIMEOUT: 60000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TEXT_LENGTH: 5000,
  DOC_TYPES: {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt'
  }
};

const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'lg', label: 'Luganda' },
  { value: 'sw', label: 'Kiswahili' },
  { value: 'ac', label: 'Acholi' },
  { value: 'at', label: 'Ateso' },
  { value: 'nyn', label: 'Runyankore' },
];

const SUPPORTED_FILE_TYPES = [
  { type: 'PDF', extension: '.pdf' },
  { type: 'Word', extension: '.doc, .docx' },
  { type: 'Text', extension: '.txt' },
];


const LanguageSelector = ({ sourceLang, targetLangs, onSourceChange, onTargetChange }) => (
  <Box sx={{ mb: 4 }}>
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" gutterBottom>Source Language</Typography>
          <FormControl fullWidth>
            <Select
              value={sourceLang}
              onChange={(e) => onSourceChange(e.target.value)}
              sx={{ borderRadius: 1 }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language color="primary" />
                    {lang.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={() => {
              if (targetLangs.length === 1) {
                onSourceChange(targetLangs[0]);
                onTargetChange([sourceLang]);
              }
            }}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <SwapHoriz />
          </IconButton>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" gutterBottom>Target Languages</Typography>
          <FormControl fullWidth>
            <Select
              multiple
              value={targetLangs}
              onChange={(e) => onTargetChange(e.target.value)}
              sx={{ borderRadius: 1 }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language color="primary" />
                    {lang.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

const SynthesizeComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);
  
  useEffect(() => {
    let progressTimer;
    if (loading) {
      progressTimer = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(progressTimer);
  }, [loading]);

  const handleGenerate = async () => {
    try {
      setError(null);
      setLoading(true);
      setDocId(null);
      setIsDrawerOpen(false);

      const formData = new FormData();
      formData.append('user_id', user.userId);
      formData.append('source_lang', sourceLanguage);
      formData.append('target_langs', targetLanguages);

      let response;
      if (activeTab === 0) {
        if (inputText.length > API_CONFIG.MAX_TEXT_LENGTH) {
          throw new Error(`Text exceeds maximum length of ${API_CONFIG.MAX_TEXT_LENGTH} characters`);
        }
        formData.append('doc', inputText);
        formData.append('title', documentTitle || 'Text Synthesis');
        response = await axios.post(`${API_CONFIG.BASE_URL}/vocify`, formData);
      } else {
        if (!selectedFile) {
          throw new Error('No file selected');
        }
        if (selectedFile.size > API_CONFIG.MAX_FILE_SIZE) {
          throw new Error('File size exceeds 10MB limit');
        }
        formData.append('file', selectedFile);
        formData.append('title', documentTitle || selectedFile.name);
        response = await axios.post(`${API_CONFIG.BASE_URL}/translate_document_with_tts/`, formData);
      }

      if (response.data.doc_id) {
        console.log(response.data.doc_id)
        setDocId(response.data.doc_id);
        setIsDrawerOpen(true);
      } else {
        throw new Error('No document ID received from the server.');
      }
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setDocumentTitle(file.name.split('.')[0]);
    }
  };

  

  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setError(null);
              setTaskId(null);
              setProcessingStatus(null);
            }}
            centered
            sx={{ mb: 4 }}
          >
            <Tab
              icon={<VolumeUp />}
              label="Text to Speech"
              sx={{ minHeight: 72 }}
            />
            <Tab
              icon={<CloudUpload />}
              label="Document to Speech"
              sx={{ minHeight: 72 }}
            />
          </Tabs>

          <LanguageSelector
            sourceLang={sourceLanguage}
            targetLangs={targetLanguages}
            onSourceChange={setSourceLanguage}
            onTargetChange={setTargetLanguages}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {activeTab === 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Document Title (Optional)"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  sx={{ mb: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Enter text for speech synthesis"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  error={inputText.length > API_CONFIG.MAX_TEXT_LENGTH}
                  helperText={`${inputText.length}/${API_CONFIG.MAX_TEXT_LENGTH} characters`}
                />
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderRadius: '28px',
                    px: 4,
                    py: 2,
                    borderWidth: '2px',
                    mb: 2
                  }}
                >
                  Upload Document
                </Button>
              </label>

              {selectedFile && (
                <>
                  <Alert
                    icon={<InsertDriveFile />}
                    severity="info"
                    sx={{ mb: 3 }}
                  >
                    {selectedFile.name}
                  </Alert>
                  <TextField
                    fullWidth
                    label="Document Title (Optional)"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                </>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Supported formats: PDF, DOC, DOCX, TXT (Max: 10MB)
              </Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ width: '100%', mt: 4 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                Processing... {progress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              sx={{
                borderRadius: '28px',
                px: 4,
                py: 2,
                borderWidth: '2px',
                mb: 2
              }}
              disabled={loading || (!inputText && !selectedFile) || !sourceLanguage || targetLanguages.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <VolumeUp />}
            >
              {loading ? 'Processing...' : 'Generate Speech'}
            </Button>
          </Box>
        </Paper>
      </Box>
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
        {docId && <ViewttsAudioComponent audioId={docId} />}
      </Drawer>
    </Container>
  );
};

export default SynthesizeComponent;
