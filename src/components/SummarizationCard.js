import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
  TextField,
  Chip,
  Snackbar,
  Alert,
  Drawer,
  Card,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Article as ArticleIcon,
  AudioFile as AudioFileIcon,
  Movie as MovieIcon,
  Language as LanguageIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import ViewSummaryComponent from './ViewSummaryComponent ';
import { summarizationAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import UpgradePromptModal from './UpgradePromptModal';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'lg', label: 'Luganda' },
  { value: 'ac', label: 'Acholi' },
  { value: 'at', label: 'Ateso' },
  { value: 'lgg', label: 'Lugbara' },
  { value: 'sw', label: 'Swahili' },
  { value: 'fr', label: 'French' },
  { value: 'rw', label: 'Kinyarwanda' },
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

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB limit (increased from 100MB)

const SummarizationCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [translationId, setTranslationId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Debug drawer state changes
  useEffect(() => {
    console.log('📊 SummarizationCard - Drawer state changed:', isDrawerOpen);
  }, [isDrawerOpen]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState(null);
  
  const fileInputRef = useRef(null);

  const showNotification = useCallback((message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
      console.log('🔍 SummarizationCard - User data loaded:', userData);
      console.log('🆔 User ID (uid):', userData.uid);
      console.log('🆔 User ID (userId):', userData.userId);
        setUser(userData);
    } else {
      console.warn('⚠️ SummarizationCard - No user data found in localStorage');
    }
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    setUploadedFile(null);
    setTextContent('');
    setTranslationId(null);
    setError(null);
    console.log('Tab changed to:', newValue);
  }, []);

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
    if (!sourceLanguage || (!user.userId && !user.uid)) {
      console.error('Missing required fields:', { sourceLanguage, userId: user.userId, uid: user.uid });
      setError('Please fill in all required fields');
      return;
    }

    // Get the correct user ID (support both uid and userId)
    const userId = user.uid || user.userId;
    console.log('🚀 SummarizationCard - Starting submission with userId:', userId);
    console.log('📁 Active tab:', activeTab);
    console.log('📝 Text content length:', textContent.length);
    console.log('📁 Uploaded file:', uploadedFile?.name);

    setTranslationId(null);
    setIsDrawerOpen(false);
    setIsProcessing(true);
    setError(null);

    try {
      // Check usage limits before making request
      const usageResult = await checkUsageBeforeRequest('summarize');
      
      // If usage limit exceeded, show upgrade modal
      if (!usageResult.allowed) {
        setUpgradeData({
          currentUsage: usageResult.current_usage || 0,
          limit: usageResult.limit || 0,
          endpoint: 'summarize',
          tier: usageResult.tier || 'free_trial'
        });
        setShowUpgradeModal(true);
        setIsProcessing(false);
        return;
      }

      let response;
      switch (activeTab) {
        case 0: // Text
          if (!textContent.trim()) {
            throw new Error('Text content is required');
          }
          response = await summarizationAPI.summarizeText(textContent, userId);
          break;
        case 1: // Document
          if (!uploadedFile) {
            throw new Error('Please select a document to upload');
          }
          response = await summarizationAPI.summarizeDocument(uploadedFile, sourceLanguage, userId);
          break;
        case 2: // Audio
          if (!uploadedFile) {
            throw new Error('Please select an audio file to upload');
          }
          response = await summarizationAPI.summarizeUpload(uploadedFile, sourceLanguage, userId);
          break;
        case 3: // Video
          if (!uploadedFile) {
            throw new Error('Please select a video file to upload');
          }
          response = await summarizationAPI.summarizeAudioFromVideo(uploadedFile, sourceLanguage, userId);
          break;
        default:
          throw new Error('Invalid tab selection');
      }

      console.log('📊 SummarizationCard - API response:', response);

      if (response?.doc_id) {
        console.log('📊 SummarizationCard - Setting translationId:', response.doc_id);
        setTranslationId(response.doc_id);
        setIsDrawerOpen(true);
        showNotification('Summary generated successfully');
        console.log('📊 SummarizationCard - Drawer should be open now');
      } else {
        console.log('📊 SummarizationCard - No doc_id in response:', response);
        throw new Error('No document ID received from server');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
      
      if (error.response?.status === 403) {
        window.dispatchEvent(new CustomEvent('show-upgrade-modal'));
      }
    } finally {
      setIsProcessing(false);
    }
  }, [sourceLanguage, user.userId, user.uid, activeTab, textContent, uploadedFile, showNotification]);

  const renderFileUpload = useCallback(() => {
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];
    const label = fileType.charAt(0).toUpperCase() + fileType.slice(1);

    return (
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
          Supports {allowedTypes.extensions.join(', ')} (Max 500MB)
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.extensions.join(',')}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {uploadedFile && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: '8px' }}>
            <Typography variant="body2">
              Selected: {uploadedFile.name}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }, [activeTab, handleFileUpload, uploadedFile]);

  return (
    <>
    <Card sx={{ 
      width: '100%',
      my: 2, 
      px: 2,
      borderRadius: '16px', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      p: 4
    }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
        AI-Powered Summarization
      </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  },
                }}
              >
                <Tab label="Paste Text" />
                <Tab label="Upload Document" />
                <Tab label="Upload Audio" />
                <Tab label="Upload Video" />
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
        </Grid>

            {/* Content Section */}
            <Box sx={{ mb: 4 }}>
        {activeTab === 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Text Content
                  </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
                    placeholder="Paste your text here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
                    sx={{ borderRadius: '12px' }}
                  />
                </Box>
              )}

              {(activeTab === 1 || activeTab === 2 || activeTab === 3) && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Upload File
                  </Typography>
                  {renderFileUpload()}
                </Box>
              )}
      </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
                size="large"
          onClick={handleSubmit}
          disabled={
            isProcessing ||
            !sourceLanguage ||
            (activeTab === 0 && !textContent.trim()) ||
            (activeTab !== 0 && !uploadedFile)
          }
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
        >
          {isProcessing ? 'Processing...' : 'Generate Summary'}
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>
          {typeof error === 'string' ? error : error.message || 'An error occurred'}
        </Alert>
      )}
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
        {translationId && (
          <ViewSummaryComponent
            translationId={translationId}
            onError={(error) => {
              console.log('📊 SummarizationCard - ViewSummaryComponent error:', error);
              showNotification(error.message, 'error');
              setIsDrawerOpen(false);
            }}
          />
        )}
      </Drawer>
      
      {/* Upgrade Prompt Modal */}
      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentUsage={upgradeData?.currentUsage || 0}
        limit={upgradeData?.limit || 0}
        endpoint={upgradeData?.endpoint || 'summarize'}
        tier={upgradeData?.tier || 'free_trial'}
      />
    </>
  );
};

export default SummarizationCard;