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
import { styled } from '@mui/material/styles';
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
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com',
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

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(25, 118, 210, 0.1)', // Subtle blue border
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', // Light black shadow
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#000000', // Black text
    '&.Mui-selected': {
      color: '#1976d2', // Blue for selected tab
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#1976d2', // Blue indicator
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 4),
  background: 'linear-gradient(45deg, #1976d2, #42a5f5)', // Blue gradient
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0, #2196f3)', // Darker blue on hover
    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
  },
  '&:disabled': {
    background: 'rgba(25, 118, 210, 0.5)',
    color: '#ffffff',
  },
  transition: 'all 0.3s ease',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)', // Subtle black border
    },
    '&:hover fieldset': {
      borderColor: '#1976d2', // Blue on hover
    },
  },
  '& .MuiInputLabel-root': {
    color: '#000000', // Black label
    '&.Mui-focused': {
      color: '#1976d2', // Blue when focused
    },
  },
}));

const LanguageSelector = ({ sourceLang, targetLangs, onSourceChange, onTargetChange }) => (
  <Box sx={{ mb: 4 }}>
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid rgba(25, 118, 210, 0.1)', // Subtle blue border
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)', // Light black shadow
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#000000', fontWeight: 500 }}>
            Source Language
          </Typography>
          <FormControl fullWidth>
            <Select
              value={sourceLang}
              onChange={(e) => onSourceChange(e.target.value)}
              sx={{ borderRadius: '12px', backgroundColor: '#ffffff' }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language sx={{ color: '#1976d2' }} />
                    <Typography sx={{ color: '#000000' }}>{lang.label}</Typography>
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
            sx={{
              bgcolor: '#1976d2',
              color: '#ffffff',
              '&:hover': { bgcolor: '#1565c0' },
              borderRadius: '50%',
              p: 1.5,
            }}
          >
            <SwapHoriz />
          </IconButton>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#000000', fontWeight: 500 }}>
            Target Languages
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              value={targetLangs}
              onChange={(e) => onTargetChange(e.target.value)}
              sx={{ borderRadius: '12px', backgroundColor: '#ffffff' }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language sx={{ color: '#1976d2' }} />
                    <Typography sx={{ color: '#000000' }}>{lang.label}</Typography>
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
        formData.append('title', 'Text Synthesis');
        response = await axios.post(`${API_CONFIG.BASE_URL}/vocify`, formData);
      } else {
        if (!selectedFile) {
          throw new Error('No file selected');
        }
        if (selectedFile.size > API_CONFIG.MAX_FILE_SIZE) {
          throw new Error('File size exceeds 10MB limit');
        }
        formData.append('file', selectedFile);
        formData.append('title', selectedFile.name);
        response = await axios.post(`${API_CONFIG.BASE_URL}/translate_document_with_tts/`, formData);
      }

      if (response.data.doc_id) {
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
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 6 }}>
        <StyledPaper elevation={0}>
          <StyledTabs
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
          </StyledTabs>

          <LanguageSelector
            sourceLang={sourceLanguage}
            targetLangs={targetLanguages}
            onSourceChange={setSourceLanguage}
            onTargetChange={setTargetLanguages}
          />

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, bgcolor: '#ffffff', borderRadius: '12px' }}
            >
              {error}
            </Alert>
          )}

          {activeTab === 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
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
                <StyledButton
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Upload Document
                </StyledButton>
              </label>

              {selectedFile && (
                <Alert
                  icon={<InsertDriveFile sx={{ color: '#1976d2' }} />}
                  severity="info"
                  sx={{ mb: 3, bgcolor: '#ffffff', borderRadius: '12px' }}
                >
                  {selectedFile.name}
                </Alert>
              )}

              <Typography variant="body2" sx={{ mt: 2, color: '#000000' }}>
                Supported formats: PDF, DOC, DOCX, TXT (Max: 10MB)
              </Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ width: '100%', mt: 4 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)', // Light blue background
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#1976d2', // Blue progress bar
                  },
                }}
              />
              <Typography align="center" variant="body2" sx={{ mt: 1, color: '#000000' }}>
                Processing... {progress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <StyledButton
              variant="contained"
              onClick={handleGenerate}
              disabled={loading || (!inputText && !selectedFile) || !sourceLanguage || targetLanguages.length === 0}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VolumeUp />}
            >
              {loading ? 'Processing...' : 'Generate Speech'}
            </StyledButton>
          </Box>
        </StyledPaper>
      </Box>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '600px' },
            backgroundColor: '#ffffff',
            borderLeft: '1px solid rgba(25, 118, 210, 0.1)', // Subtle blue border
          },
        }}
      >
        {docId && <ViewttsAudioComponent audioId={docId} />}
      </Drawer>
    </Container>
  );
};

export default SynthesizeComponent;