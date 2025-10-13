import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Drawer,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  DeleteOutline as DeleteOutlineIcon,
  SwapHoriz,
  Language as LanguageIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { transcriptionAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import ViewAudioComponent from './ViewAudioComponent';
import UpgradePromptModal from './UpgradePromptModal';

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

const TranscribeComponent = () => {
  // State management
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [docId, setDocId] = useState(null);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState(null);

  // Refs
  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const audioPlayerRef = useRef(null);
  const uploadInputRef = useRef(null);

  // User state management
  const [user, setUser] = useState({ username: '', userId: '' });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('🔍 TranscribeComponent: Loading user from localStorage:', storedUser);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('🔍 TranscribeComponent: Parsed user data:', userData);
      console.log('🔍 TranscribeComponent: User ID field:', userData.userId);
      console.log('🔍 TranscribeComponent: All user fields:', Object.keys(userData));
      setUser(userData);
    } else {
      console.log('🔍 TranscribeComponent: No user found in localStorage');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup media stream and recorder
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
      // Cleanup audio URL
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  // Notification helper
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Input validation
  const validateInput = () => {
    if (targetLanguages.length === 0) {
      showNotification('Please select at least one target language', 'error');
      return false;
    }
    return true;
  };

  // Recording functionality
  const toggleRecording = async () => {
    // Prevent multiple operations
    if (isLoading) {
      showNotification('Please wait for current operation to complete', 'warning');
      return;
    }
    
    if (isRecording) {
      try {
        // Stop the recording
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
          mediaRecorder.current.stop();
        }
        
        // Stop all tracks in the stream
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach(track => {
            track.stop();
          });
          mediaStream.current = null;
        }
        
        setIsRecording(false);
        showNotification('Recording stopped', 'success');
      } catch (error) {
        console.error('Error stopping recording:', error);
        showNotification('Error stopping recording', 'error');
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream.current = stream; // Store stream reference
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        recorder.onstop = () => {
          try {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            if (blob.size > 0) {
              setAudioBlob(blob);
              setAudioURL(URL.createObjectURL(blob));
              setIsAudioReady(false); // Reset ready state for new audio
              showNotification('Recording completed', 'success');
            } else {
              showNotification('No audio data recorded', 'warning');
            }
          } catch (error) {
            console.error('Error processing recording:', error);
            showNotification('Error processing recording', 'error');
          }
        };
        
        recorder.onerror = (event) => {
          console.error('MediaRecorder error:', event.error);
          showNotification('Recording error occurred', 'error');
          setIsRecording(false);
        };

        recorder.start(1000); // Record in 1-second chunks
        mediaRecorder.current = recorder;
        setIsRecording(true);
        showNotification('Recording started', 'success');
      } catch (error) {
        console.error('Recording error:', error);
        showNotification('Error accessing microphone', 'error');
        setIsRecording(false);
      }
    }
  };

  // File handling
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      showNotification('File selected successfully');
    }
  };

  // Audio playback controls
  const handlePlayPause = async () => {
    if (!audioPlayerRef.current || !audioURL) return;
    
    try {
    if (isPlaying) {
      audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure audio is loaded before playing
        if (audioPlayerRef.current.readyState < 2) {
          // Audio not loaded yet, wait for it
          audioPlayerRef.current.addEventListener('canplay', () => {
            audioPlayerRef.current.play().catch(console.error);
          }, { once: true });
    } else {
          await audioPlayerRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      showNotification('Error playing audio', 'error');
      setIsPlaying(false);
    }
  };

  const handleDiscardRecording = () => {
    // Cleanup media stream
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    
    // Cleanup recorder
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    
    // Cleanup audio URL
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    
    setAudioBlob(null);
    setAudioURL(null);
    setIsAudioReady(false);
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    showNotification('Recording discarded', 'info');
  };

  // Submit functionality
  const handleSubmit = async () => {
    console.log('🚀 Starting handleSubmit...');
    console.log('👤 User in handleSubmit:', user);
    console.log('🆔 User ID in handleSubmit:', user.userId);
    
    if (!validateInput()) return;

    // Close any existing drawer and reset form
    setIsDrawerOpen(false);
    setDocId(null);
    setError(null);

    setIsLoading(true);
    setProgress(0);

    try {
      console.log('🔍 Checking usage limits...');
      // Check usage limits before making request
      const usageResult = await checkUsageBeforeRequest('upload');
      console.log('✅ Usage check result:', usageResult);
      
      // If usage limit exceeded, show upgrade modal
      if (!usageResult.allowed) {
        console.log('🚫 Usage limit exceeded, showing upgrade modal');
        setUpgradeData({
          currentUsage: usageResult.current_usage || 0,
          limit: usageResult.limit || 0,
          endpoint: 'upload',
          tier: usageResult.tier || 'free_trial'
        });
        setShowUpgradeModal(true);
        setIsLoading(false);
        return;
      }

      // Get user from localStorage
      console.log('🔍 User object:', user);
      console.log('🔍 User.userId:', user.userId);
      console.log('🔍 User keys:', Object.keys(user));
      console.log('🔍 Raw localStorage:', localStorage.getItem('user'));
      
      if (!user.userId) {
        console.error('❌ User not authenticated - userId is missing');
        throw new Error('User not authenticated');
      }
      console.log('✅ User authenticated:', user.userId);

      let response;
    if (selectedTab === 0) {
        // File upload
      if (!selectedFile) {
          throw new Error('Please select a file to upload');
        }
        response = await transcriptionAPI.uploadAudio(
          selectedFile,
          sourceLanguage,
          targetLanguages,
          user.userId
        );
      } else {
        // Recorded audio
        if (!audioBlob) {
          throw new Error('Please record audio first');
        }
        response = await transcriptionAPI.uploadRecordedAudio(
          audioBlob,
          sourceLanguage,
          targetLanguages,
          user.userId
        );
      }

      setDocId(response.doc_id);
      setIsDrawerOpen(true);
      showNotification('Audio uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      const errorInfo = handleAPIError(error, 'upload');
      
      if (errorInfo.shouldUpgrade) {
        setError('Please upgrade your subscription to continue');
        // Trigger upgrade modal
        window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
          detail: { message: errorInfo.message }
        }));
    } else {
        setError(errorInfo.message || 'Upload failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Voice Recognition & Transcription
            </Typography>

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
                <Tab label="Upload Audio/Video" />
                <Tab label="Record Audio" />
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

            {/* File Upload or Recording Section */}
            {selectedTab === 0 ? (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Audio/Video File
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
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports MP3, WAV, MP4, AVI (Max 10MB)
                  </Typography>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
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
                  Record Audio
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    variant={isRecording ? "contained" : "outlined"}
                    color={isRecording ? "error" : "primary"}
                    startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                    onClick={toggleRecording}
                    sx={{ borderRadius: '24px', px: 3 }}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  {audioURL && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        onClick={handlePlayPause}
                        disabled={!isAudioReady}
                        sx={{ borderRadius: '24px' }}
                      >
                        {!isAudioReady ? 'Loading...' : (isPlaying ? 'Pause' : 'Play')}
                      </Button>
                      <IconButton
                        onClick={handleDiscardRecording}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
                {audioURL && (
                  <audio
                    ref={audioPlayerRef}
                    src={audioURL}
                    style={{ display: 'none' }}
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => {
                      console.error('Audio error:', e);
                      showNotification('Error loading audio', 'error');
                      setIsPlaying(false);
                    }}
                    onLoadStart={() => {
                      console.log('Audio loading started');
                      setIsAudioReady(false);
                    }}
                    onCanPlay={() => {
                      console.log('Audio can play');
                      setIsAudioReady(true);
                    }}
                    preload="metadata"
                  />
                )}
              </Box>
            )}

            {/* Progress */}
            {isLoading && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Processing... {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isLoading || (!selectedFile && !audioBlob)}
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Processing...' : 'Transcribe Audio'}
              </Button>
            </Box>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>
                {typeof error === 'string' ? error : error.message || 'An error occurred'}
              </Alert>
            )}

            {/* Results */}
            {docId && (
              <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Transcription Complete!
                </Typography>
                <Typography variant="body1">
                  Document ID: {docId}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Your transcription has been processed successfully. View the results in the drawer.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => setIsDrawerOpen(true)}
                >
                  View Results
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Snackbar */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
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
          aria-label="Transcription results drawer"
        >
          {docId && (
            <ViewAudioComponent 
              audioId={docId}
              onError={(error) => {
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
          endpoint={upgradeData?.endpoint || 'upload'}
          tier={upgradeData?.tier || 'free_trial'}
        />
      </Box>
    </Container>
  );
};

export default TranscribeComponent;