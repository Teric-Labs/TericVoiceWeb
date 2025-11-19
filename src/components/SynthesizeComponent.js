import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
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
import ViewttsAudioComponent from './ViewttsAudioComponent';
import { ttsAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';

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
  const [processingStatus, setProcessingStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('🔵 SynthesizeComponent: Loading user from localStorage:', storedUser);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('🔵 SynthesizeComponent: Parsed user data:', userData);
      setUser(userData);
    } else {
      console.log('🔵 SynthesizeComponent: No user found in localStorage');
    }
  }, []);


  const handleGenerate = async () => {
    try {
      setError(null);
      setLoading(true);
      setDocId(null);
      setIsDrawerOpen(false);

      // Check if user is authenticated
      console.log('🔵 SynthesizeComponent: Current user state:', user);
      console.log('🔵 SynthesizeComponent: user.userId:', user?.userId);
      if (!user?.userId) {
        throw new Error('Please log in to use text-to-speech services');
      }

      // Check usage limits before making request
      if (activeTab === 0) {
        await checkUsageBeforeRequest('vocify'); // Text-to-speech uses vocify endpoint
      } else {
        await checkUsageBeforeRequest('synthesize_document'); // Document-to-speech uses synthesize_document endpoint
      }

      let response;
      if (activeTab === 0) {
        if (inputText.length > 5000) {
          throw new Error('Text exceeds maximum length of 5000 characters');
        }
        response = await ttsAPI.synthesizeText(inputText, sourceLanguage, user.userId);
      } else {
        if (!selectedFile) {
          throw new Error('No file selected');
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
          throw new Error('File size exceeds 10MB limit');
        }
        response = await ttsAPI.translateDocumentWithTTS(selectedFile, sourceLanguage, targetLanguages, user.userId);
      }

      if (response.doc_id) {
        setDocId(response.doc_id);
        setIsDrawerOpen(true);
      } else {
        throw new Error('No document ID received from the server.');
      }
    } catch (err) {
      console.error('Synthesis error:', err);
      const errorInfo = handleAPIError(err, 'synthesize');
      
      if (errorInfo.shouldUpgrade) {
        setError('Please upgrade your subscription to continue');
        // Trigger upgrade modal
        window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
          detail: { message: errorInfo.message }
        }));
      } else {
        setError(errorInfo.message || 'Generation failed. Please try again.');
      }
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
    <>
    <Box sx={{ width: '100%', py: 3, px: 2 }}>
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
                  error={inputText.length > 5000}
                  helperText={`${inputText.length}/5000 characters`}
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
    </>
  );
};

export default SynthesizeComponent;