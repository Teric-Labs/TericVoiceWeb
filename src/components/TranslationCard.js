import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Stack,
  Card,
  CardContent,
  Chip,
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
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setSourceLanguage,
  setTargetLanguage,
  setInputText,
  setTranslatedText,
  setSelectedFile,
  setActiveTab,
  clearError,
  clearTranslation,
  translateText,
  translateDocument,
} from '../store/slices/translationSlice';
import DocumentTranslationDrawer from './DocumentTranslationDrawer';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 5000;

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
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#000000',
    '&.Mui-selected': {
      color: '#1976d2',
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#1976d2',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 4),
  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0, #2196f3)',
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
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#000000',
    '&.Mui-focused': {
      color: '#1976d2',
    },
  },
}));

const TranslationCard = () => {
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [userClosedDrawer, setUserClosedDrawer] = useState(false);
  
  const {
    sourceLanguage,
    targetLanguage,
    inputText,
    translatedText,
    selectedFile,
    isLoading: loading,
    error,
    activeTab,
  } = useAppSelector((state) => state.translation);
  const { user } = useAppSelector((state) => state.auth);

  // Automatically open drawer when translation is complete
  useEffect(() => {
    if (translatedText && !loading && !error && !drawerOpen && !userClosedDrawer) {
      // Small delay to ensure state is properly updated
      setTimeout(() => {
        const drawerData = {
          translations: { [targetLanguage]: translatedText },
          original: activeTab === 0 ? inputText : selectedFile?.name || 'Document',
          metadata: {
            file_name: activeTab === 0 ? 'Text Translation' : selectedFile?.name || 'Document',
            file_size: activeTab === 0 ? inputText.length : selectedFile?.size || 0,
            languages_translated: 1,
            processing_status: 'completed'
          }
        };
        setDrawerData(drawerData);
        setDrawerOpen(true);
      }, 200);
    }
  }, [translatedText, loading, error, targetLanguage, activeTab, inputText, selectedFile]);

  const handleTranslate = async () => {
    if (!user?.userId) {
      console.error('Please log in to use translation services');
      return;
    }

    // Close any existing drawer when starting new translation
    setDrawerOpen(false);
    setDrawerData(null);
    setUserClosedDrawer(false); // Reset the flag for new translation

    try {
      if (activeTab === 0) {
        if (inputText.length > MAX_TEXT_LENGTH) {
          throw new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
        }
        await dispatch(translateText({
          userId: user.userId,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          text: inputText,
        })).unwrap();
      } else {
        if (!selectedFile) {
          throw new Error('No file selected');
        }
        if (selectedFile.size > MAX_FILE_SIZE) {
          throw new Error('File size exceeds 10MB limit');
        }
        await dispatch(translateDocument({
          userId: user.userId,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
          file: selectedFile,
        })).unwrap();
      }
    } catch (err) {
      console.error('Translation failed:', err.message || 'Translation failed. Please try again.');
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
        dispatch(setSelectedFile(file));
        dispatch(clearError());
      } else {
        console.error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        event.target.value = null;
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      console.log('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([translatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'translation.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDocx = () => {
    // Implementation for DOCX download would go here
    console.log('DOCX download feature coming soon!');
  };

  const handleSwapLanguages = () => {
    dispatch(setSourceLanguage(targetLanguage));
    dispatch(setTargetLanguage(sourceLanguage));
  };

  return (
    <>
    <Box sx={{ width: '100%', py: 3, px: 2 }}>
        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Text & Document Translation
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <StyledTabs
                value={activeTab}
                onChange={(_, newValue) => dispatch(setActiveTab(newValue))}
                centered
              >
                <Tab label="Text Translation" />
                <Tab label="Document Translation" />
              </StyledTabs>
            </Box>

            {/* Language Selection */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Source Language
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => dispatch(setSourceLanguage(e.target.value))}
                    sx={{ borderRadius: '12px' }}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Language sx={{ color: 'primary.main' }} />
                          {lang.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                  onClick={handleSwapLanguages}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    borderRadius: '50%',
                    p: 1.5,
                  }}
                >
                  <SwapHoriz />
                </IconButton>
              </Grid>

              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Target Language
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={targetLanguage}
                    onChange={(e) => dispatch(setTargetLanguage(e.target.value))}
                    sx={{ borderRadius: '12px' }}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Language sx={{ color: 'primary.main' }} />
                          {lang.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Content Section */}
            {activeTab === 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Input Text
                  </Typography>
                  <StyledTextField
                    multiline
                    rows={8}
                    fullWidth
                    value={inputText}
                    onChange={(e) => dispatch(setInputText(e.target.value))}
                    placeholder="Enter text to translate..."
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Translated Text
                  </Typography>
                  <StyledTextField
                    multiline
                    rows={8}
                    fullWidth
                    value={translatedText}
                    placeholder="Translation will appear here..."
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                  {translatedText && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={handleCopy}
                        size="small"
                        sx={{ borderRadius: '8px' }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleDownload}
                        size="small"
                        sx={{ borderRadius: '8px' }}
                      >
                        Download
                      </Button>
                    </Stack>
                  )}
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Document
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
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Supports PDF, DOC, DOCX, TXT (Max 10MB)
                  </Typography>
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
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
                {translatedText && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#16a34a' }}>
                      ✅ Translation Completed Successfully
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Results are displayed in the drawer on the right
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <StyledButton
                onClick={handleTranslate}
                disabled={loading || (!inputText && !selectedFile)}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Translate />}
                size="large"
              >
                {loading ? 'Translating...' : 'Translate'}
              </StyledButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Document Translation Drawer */}
      <DocumentTranslationDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setUserClosedDrawer(true); // Mark that user manually closed
        }}
        translationData={drawerData}
        isLoading={loading}
        error={error}
        fileName={selectedFile?.name || 'Text Translation'}
      />
    </>
  );
};

export default TranslationCard;