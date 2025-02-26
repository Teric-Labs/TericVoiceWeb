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
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://agents.tericlab.com:8080',
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

const TranslationCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('lg');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
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
    async translateText(text, sourceLang, targetLang, title) {
      const formData = new FormData();
      formData.append('user_id', user.userId);
      formData.append('source_lang', sourceLang);
      formData.append('target_langs', targetLang);
      formData.append('doc', text);
      formData.append('title', title || 'Text Translation');

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/translate`,
        formData
      );
      return Object.values(response.data)[0];
    },

    async translateDocument(file, sourceLang, targetLang, title) {
      const formData = new FormData();
      formData.append('user_id', user.userId);
      formData.append('source_lang', sourceLang);
      formData.append('target_langs', targetLang);
      formData.append('file', file);
      formData.append('title', title || 'Document Translation');

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
          targetLanguage,
          documentTitle
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
          targetLanguage,
          documentTitle
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
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Tabs
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
          </Tabs>

          {/* Language Selector */}
          <Box sx={{ mb: 4 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle2" gutterBottom>Source Language</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
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
                      setSourceLanguage(targetLanguage);
                      setTargetLanguage(sourceLanguage);
                    }}
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <SwapHoriz />
                  </IconButton>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle2" gutterBottom>Target Language</Typography>
                  <FormControl fullWidth>
                    <Select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
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

          {/* Translation UI */}
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
              <Grid item xs={12} md={6}>
                <TextField
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
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Translation"
                  value={translatedText}
                  InputProps={{ readOnly: true }}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopy}
                    sx={{ textTransform: 'none' }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    sx={{ textTransform: 'none' }}
                  >
                    Download TXT
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadDocx}
                    sx={{ textTransform: 'none' }}
                  >
                    Download DOCX
                  </Button>
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
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ textTransform: 'none' }}
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
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Translation"
                    value={translatedText}
                    InputProps={{ readOnly: true }}
                  />
                  <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={handleCopy}
                      sx={{ textTransform: 'none' }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownload}
                      sx={{ textTransform: 'none' }}
                    >
                      Download TXT
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadDocx}
                      sx={{ textTransform: 'none' }}
                    >
                      Download DOCX
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box sx={{ width: '100%', mt: 4 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                Translating... {progress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleTranslate}
              disabled={loading || (!inputText && !selectedFile)}
              startIcon={loading ? <CircularProgress size={20} /> : <Translate />}
            >
              {loading ? 'Translating...' : 'Translate'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  );
};

export default TranslationCard;
