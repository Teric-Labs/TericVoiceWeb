import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Chip,
  Alert,
  Typography,
  Snackbar,
  Drawer,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import ViewVideoComponent from "./ViewVideoComponent";
import { videoAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import UpgradePromptModal from './UpgradePromptModal';

const VideoCard = () => {
  // User state management
  const [user, setUser] = useState({ username: '', userId: '' });
  
  // Language and file state
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  
  // UI state
  const [selectedTab, setSelectedTab] = useState(0); // 0: File Upload, 1: YouTube URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Notification state
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState(null);
  
  const fileInputRef = useRef(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  // Notification helper
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "lg", label: "Luganda", flag: "🇺🇬" },
    { value: "at", label: "Ateso", flag: "🇺🇬" },
    { value: "ac", label: "Acholi", flag: "🇺🇬" },
    { value: "sw", label: "Swahili", flag: "🇰🇪" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
    { value: "nyn", label: "Runyankore", flag: "🇺🇬" },
  ];

  const handleFileSelection = (file) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError("File size should not exceed 100MB");
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError("Please upload a valid video file");
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    showNotification('Video file selected successfully');
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
    
    if (selectedTab === 0) {
      if (!selectedFile) {
        setError("Please select a video file");
        return false;
      }
    } else {
      if (!youtubeUrl.trim()) {
        setError("Please enter a YouTube URL");
        return false;
      }
    }
    
    return true;
  };

  const handleFileSubmission = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setDocId(null);
    setIsDrawerOpen(false);

    try {
      if (!user.userId) {
        throw new Error('Please log in to use video processing services');
      }

      const usageResult = await checkUsageBeforeRequest('videoUpload');
      
      // If usage limit exceeded, show upgrade modal
      if (!usageResult.allowed) {
        setUpgradeData({
          currentUsage: usageResult.current_usage || 0,
          limit: usageResult.limit || 0,
          endpoint: 'videoUpload',
          tier: usageResult.tier || 'free_trial'
        });
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      let response;
      if (selectedTab === 0) {
        response = await videoAPI.extractAudioFromVideo(
          selectedFile,
          sourceLanguage,
          targetLanguages,
          user.userId
        );
      } else {
        response = await videoAPI.uploadVideo(
          youtubeUrl,
          sourceLanguage,
          targetLanguages,
          user.userId
        );
      }

      setDocId(response.doc_id);
      setIsDrawerOpen(true);
      showNotification('Video processed successfully!');
    } catch (error) {
      console.error('Video processing error:', error);
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
              Video Transcription & Translation
            </Typography>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                {typeof error === 'string' ? error : error.message || 'An error occurred'}
              </Alert>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, newValue) => setSelectedTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  },
                }}
              >
                <Tab label="Upload Video File" />
                <Tab label="YouTube URL" />
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


            {/* File Upload or YouTube URL Section */}
            {selectedTab === 0 ? (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Video File
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
                    Supports MP4, AVI, MOV, WMV (Max 100MB)
                  </Typography>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
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
            ) : (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  YouTube URL
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  sx={{ borderRadius: '12px' }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading || (!selectedFile && !youtubeUrl.trim())}
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Processing...' : 'Process Video'}
              </Button>
            </Box>
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
          {docId && <ViewVideoComponent audioId={docId} />}
        </Drawer>
        
        {/* Upgrade Prompt Modal */}
        <UpgradePromptModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentUsage={upgradeData?.currentUsage || 0}
          limit={upgradeData?.limit || 0}
          endpoint={upgradeData?.endpoint || 'videoUpload'}
          tier={upgradeData?.tier || 'free_trial'}
        />
    </Box>
  );
};

export default VideoCard;