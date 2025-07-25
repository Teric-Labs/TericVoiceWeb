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
  Snackbar,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Translate,
  CloudUpload,
  SwapHoriz,
  Language,
  PictureAsPdf,
  Description,
  Article,
  InsertDriveFile,
  ContentCopy,
  Download,
} from '@mui/icons-material';
import axios from 'axios';

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TEXT_LENGTH: 5000,
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
  { icon: <PictureAsPdf color="error" />, type: 'PDF', extension: '.pdf' },
  { icon: <Description color="primary" />, type: 'Word', extension: '.doc, .docx' },
  { icon: <Article color="action" />, type: 'Text', extension: '.txt' },
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

const TranslationCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('lg');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  const TranslationService = {
    async translateText(text, sourceLang, targetLang) {
      const formData = new FormData();
      formData.append('user_id', user.userId);
      formData.append('source_lang', sourceLang);
      formData.append('target_langs', targetLang);
      formData.append('doc', text);
      formData.append('title', 'Text Translation');

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/translate`,
        formData
      );
      return Object.values(response.data)[0];
    },

    async translateDocument(file, sourceLang, targetLang) {
      const formData = new FormData();
      formData.append('user_id', user.userId);
      formData.append('source_lang', sourceLang);
      formData.append('target_langs', targetLang);
      formData.append('file', file);
      formData.append('title', 'Document Translation');

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/translate_document`,
        formData
      );
      return Object.values(response.data["msg"])[0];
    }
  };

  const handleTranslate = async () => {
    try {
      setError(null);
      setLoading(true);

      let result;
      if (activeTab === 0) {
        if (inputText.length > API_CONFIG.MAX_TEXT_LENGTH) {
          throw new Error(`Text exceeds maximum length of ${API_CONFIG.MAX_TEXT_LENGTH} characters`);
        }
        result = await TranslationService.translateText(
          inputText,
          sourceLanguage,
          targetLanguage
        );
      } else {
        if (!selectedFile) {
          throw new Error('No file selected');
        }
        if (selectedFile.size > API_CONFIG.MAX_FILE_SIZE) {
          throw new Error('File size exceeds 10MB limit');
        }
        result = await TranslationService.translateDocument(
          selectedFile,
          sourceLanguage,
          targetLanguage
        );
      }
      setTranslatedText(result);
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = `.${file.name.split('.').pop().toLowerCase()}`;
      const validTypes = SUPPORTED_FILE_TYPES.map(type =>
        type.extension.split(', ').map(ext => ext.toLowerCase())
      ).flat();

      if (validTypes.includes(fileType)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        event.target.value = null;
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setSnackbar({
        open: true,
        message: 'Translation copied to clipboard!',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to copy text.',
        severity: 'error'
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'translation.txt';
    link.click();
  };

  const handleDownloadDocx = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Translated Content</h2>
          <p>${translatedText.replace(/\n/g, '<br>')}</p>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'translation.docx';
    link.click();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: '100vh', py: 6, bgcolor: '#f5f5f5' }}>
        <StyledPaper elevation={0}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1976d2', // Blue text
              textAlign: 'center',
              mb: 4,
            }}
          >
            Translate Your Content
          </Typography>

          <StyledTabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setError(null);
              setTranslatedText('');
            }}
            centered
            sx={{ mb: 4 }}
          >
            <Tab icon={<Translate />} label="Text Translation" />
            <Tab icon={<CloudUpload />} label="Document Translation" />
          </StyledTabs>

          {/* Language Selector */}
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
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
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
                      setSourceLanguage(targetLanguage);
                      setTargetLanguage(sourceLanguage);
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
                    Target Language
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
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

          {/* Translation UI */}
          {activeTab === 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Enter text to translate"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  error={inputText.length > API_CONFIG.MAX_TEXT_LENGTH}
                  helperText={`${inputText.length}/${API_CONFIG.MAX_TEXT_LENGTH} characters`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Translation"
                  value={translatedText}
                  InputProps={{ readOnly: true }}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                  <StyledButton
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopy}
                  >
                    Copy
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownload}
                  >
                    Download TXT
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadDocx}
                  >
                    Download DOCX
                  </StyledButton>
                </Stack>
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
                <>
                  <Alert
                    icon={<InsertDriveFile sx={{ color: '#1976d2' }} />}
                    severity="info"
                    sx={{ mb: 3, bgcolor: '#ffffff', borderRadius: '12px' }}
                  >
                    {selectedFile.name}
                  </Alert>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Translation"
                    value={translatedText}
                    InputProps={{ readOnly: true }}
                  />
                  <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                    <StyledButton
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={handleCopy}
                    >
                      Copy
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownload}
                    >
                      Download TXT
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadDocx}
                    >
                      Download DOCX
                    </StyledButton>
                  </Stack>
                </>
              )}
            </Box>
          )}

          {/* Loading Indicator */}
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
                Translating... {progress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <StyledButton
              variant="contained"
              onClick={handleTranslate}
              disabled={loading || (!inputText && !selectedFile)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Translate />}
            >
              {loading ? 'Translating...' : 'Translate'}
            </StyledButton>
          </Box>
        </StyledPaper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === 'success' ? '#1976d2' : '#d32f2f',
            color: '#ffffff',
            borderRadius: '12px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TranslationCard;