import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Drawer,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Language as LanguageIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { voiceToVoiceAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import ViewVoxComponent from './ViewVoxComponent';

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
  // User state management
  const [user, setUser] = useState({ username: '', userId: '' });

  // Language and file state
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voiceId, setVoiceId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Notification state
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fileInputRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('🔍 SpeechToSpeechForm - User data loaded:', userData);
      console.log('🆔 User ID (uid):', userData.uid);
      console.log('🆔 User ID (userId):', userData.userId);
      setUser(userData);
    } else {
      console.warn('⚠️ SpeechToSpeechForm - No user data found in localStorage');
    }
  }, []);

  // Notification helper
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleFileSelection = (file) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError("File size should not exceed 100MB");
      return;
    }
    if (!file.type.startsWith("audio/")) {
      setError("Please upload a valid audio file");
      return;
    }

    setSelectedFile(file);
    setError(null);
    showNotification('Audio file selected successfully');
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const validateForm = () => {
    if (!sourceLanguage) {
      setError("Please select a source language");
      return false;
    }
    if (targetLanguages.length === 0) {
      setError("Please select at least one target language");
      return false;
    }
    if (!selectedFile) {
      setError("Please select an audio file");
      return false;
    }
    return true;
  };

  const handleFileSubmission = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setVoiceId(null);
    setIsDrawerOpen(false);

    try {
      if (!user.userId && !user.uid) {
        throw new Error('Please log in to use voice-to-voice services');
      }

      // Get the correct user ID (support both uid and userId)
      const userId = user.uid || user.userId;
      console.log('🚀 SpeechToSpeechForm - Starting submission with userId:', userId);
      console.log('📁 Selected file:', selectedFile?.name);
      console.log('🌍 Source language:', sourceLanguage);
      console.log('🎯 Target languages:', targetLanguages);

      await checkUsageBeforeRequest('vocify');

      const response = await voiceToVoiceAPI.voiceToVoice(
        selectedFile,
        sourceLanguage,
        targetLanguages,
        userId
      );

      setVoiceId(response.doc_id || response.voiceId);
      setIsDrawerOpen(true);
      showNotification('Voice translation completed successfully!');
    } catch (error) {
      console.error('Voice translation error:', error);
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
      
      if (error.response?.status === 403) {
        window.dispatchEvent(new CustomEvent('show-upgrade-modal'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleFileSubmission();
  };

  return (
    <Box sx={{ width: '100%', py: 3, px: 2 }}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Voice-to-Voice Translation
            </Typography>

            {/* Language Selection */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Source Language
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
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
                    onChange={(e) => setTargetLanguages(e.target.value)}
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

            {/* File Upload Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Upload Audio File
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
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports WAV, MP3, M4A (Max 100MB)
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
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

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading || (!selectedFile && targetLanguages.length === 0)}
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Processing...' : 'Translate Voice'}
              </Button>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>
                {typeof error === 'string' ? error : error.message || 'An error occurred'}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Snackbar */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
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
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            },
          }}
        >
          {voiceId && <ViewVoxComponent voiceId={voiceId} />}
        </Drawer>
    </Box>
  );
};

export default SpeechToSpeechForm;