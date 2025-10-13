import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  ContentCopy,
  Download,
  Translate,
  Description,
  Language,
  CheckCircle,
  Error,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.15)',
    borderLeft: '1px solid #e2e8f0',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth: '100%',
    },
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(2px)',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '80px',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: '24px',
  height: 'calc(100vh - 80px)',
  overflow: 'auto',
  backgroundColor: '#ffffff',
}));

const ResultPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  marginBottom: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#e2e8f0',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const LanguageChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  fontWeight: 500,
  borderRadius: '6px',
}));

const DocumentTranslationDrawer = ({ 
  isOpen, 
  onClose, 
  translationData, 
  isLoading, 
  error,
  fileName 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSections, setExpandedSections] = useState({});
  const [copySuccess, setCopySuccess] = useState({});

  // Enhanced close functionality
  const handleClose = () => {
    // Reset expanded sections when closing
    setExpandedSections({});
    setCopySuccess({});
    onClose();
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside to close (for mobile)
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess({ ...copySuccess, [key]: true });
      setTimeout(() => {
        setCopySuccess({ ...copySuccess, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadDocx = (content, language) => {
    // Create a simple text file download for now
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'translation'}_${language}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatText = (text) => {
    if (!text) return 'No content available';
    return text;
  };

  const getLanguageName = (code) => {
    const languageNames = {
      'en': 'English',
      'lg': 'Luganda',
      'ac': 'Acholi',
      'at': 'Ateso',
      'nyn': 'Runyankole'
    };
    return languageNames[code] || code.toUpperCase();
  };

  return (
    <StyledDrawer
      anchor="right"
      open={isOpen}
      onClose={() => {}} // Disable built-in close
      transitionDuration={300}
      SlideProps={{
        direction: 'left',
        timeout: 300,
      }}
      ModalProps={{
        BackdropProps: {
          onClick: handleBackdropClick,
        },
        disableEscapeKeyDown: true, // Disable ESC key on drawer
      }}
    >
      {/* Header */}
      <HeaderBox>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: '#e3f2fd',
            color: '#1976d2'
          }}>
            <Translate fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
              Document Translation
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {fileName || 'Translation Results'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              Use close button below or press ESC
            </Typography>
          </Box>
        </Box>
      </HeaderBox>

      {/* Content */}
      <ContentBox>
        {/* Loading State */}
        {isLoading && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '200px',
            gap: 2
          }}>
            <CircularProgress size={40} sx={{ color: '#1976d2' }} />
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Processing document translation...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Translation Results */}
        {translationData && !isLoading && !error && (
          <Box>
            {/* Success Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              p: 2,
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <CheckCircle sx={{ color: '#16a34a' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#166534' }}>
                Translation Completed Successfully
              </Typography>
            </Box>

            {/* Original Document */}
            {translationData.original && (
              <ResultPaper>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Original Document
                      </Typography>
                    </Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleSection('original')}
                    sx={{ color: '#64748b' }}
                  >
                    {expandedSections.original ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                
                {expandedSections.original && (
                  <Fade in={expandedSections.original}>
                    <Box>
                      <StyledTextField
                        multiline
                        rows={6}
                        fullWidth
                        value={formatText(translationData.original)}
                        variant="outlined"
                        InputProps={{ readOnly: true }}
                        sx={{ mb: 2 }}
                      />
                      <Stack direction="row" spacing={1}>
                        <ActionButton
                          variant="outlined"
                          startIcon={<ContentCopy />}
                          onClick={() => handleCopy(translationData.original, 'original')}
                          size="small"
                        >
                          {copySuccess.original ? 'Copied!' : 'Copy'}
                        </ActionButton>
                      </Stack>
                    </Box>
                  </Fade>
                )}
              </ResultPaper>
            )}

            {/* Translations */}
            {translationData.translations && Object.keys(translationData.translations).length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0f172a' }}>
                  Translations
                </Typography>
                
                {Object.entries(translationData.translations).map(([language, content], index) => (
                  <ResultPaper key={language}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Language sx={{ color: '#1976d2', fontSize: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {getLanguageName(language)}
                        </Typography>
                        <LanguageChip 
                          label={language.toUpperCase()} 
                          size="small" 
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => toggleSection(language)}
                        sx={{ color: '#64748b' }}
                      >
                        {expandedSections[language] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    
                    {expandedSections[language] && (
                      <Fade in={expandedSections[language]}>
                        <Box>
                          <StyledTextField
                            multiline
                            rows={8}
                            fullWidth
                            value={formatText(content)}
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            sx={{ mb: 2 }}
                          />
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <ActionButton
                              variant="outlined"
                              startIcon={<ContentCopy />}
                              onClick={() => handleCopy(content, language)}
                              size="small"
                            >
                              {copySuccess[language] ? 'Copied!' : 'Copy'}
                            </ActionButton>
                            <ActionButton
                              variant="outlined"
                              startIcon={<Download />}
                              onClick={() => handleDownloadDocx(content, language)}
                              size="small"
                            >
                              Download
                            </ActionButton>
                          </Stack>
                        </Box>
                      </Fade>
                    )}
                  </ResultPaper>
                ))}
              </Box>
            )}

            {/* Metadata */}
            {translationData.metadata && (
              <ResultPaper>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Processing Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>File Size:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {translationData.metadata.file_size ? 
                        `${(translationData.metadata.file_size / 1024).toFixed(1)} KB` : 
                        'Unknown'
                      }
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Content Length:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {translationData.metadata.extraction_length || 'Unknown'} characters
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Languages:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {translationData.metadata.languages_translated || 'Unknown'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Status:</Typography>
                    <Chip 
                      label={translationData.metadata.processing_status || 'Completed'} 
                      size="small"
                      sx={{ 
                        backgroundColor: '#f0fdf4', 
                        color: '#166534',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>
              </ResultPaper>
            )}
          </Box>
        )}

        {/* Empty State */}
        {!translationData && !isLoading && !error && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '200px',
            gap: 2,
            textAlign: 'center'
          }}>
            <Description sx={{ fontSize: 48, color: '#cbd5e1' }} />
            <Typography variant="h6" sx={{ color: '#64748b' }}>
              No Translation Results
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Upload a document to see translation results here
            </Typography>
          </Box>
        )}
      </ContentBox>

      {/* Close Button - Always at Bottom */}
      <Box sx={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000, // Ensure it's above other content
      }}>
        <Button
          variant="contained"
          onClick={onClose}
          startIcon={<Close />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            minWidth: '140px',
            height: '48px',
            fontSize: '16px',
            background: 'linear-gradient(45deg, #1976d2, #1565c0)',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            transition: 'all 0.3s ease-in-out',
            pointerEvents: 'auto', // Ensure it's clickable
            cursor: 'pointer',
            zIndex: 1001, // Ensure it's above everything
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0px)',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
            },
          }}
        >
          Close Drawer
        </Button>
      </Box>
    </StyledDrawer>
  );
};

export default DocumentTranslationDrawer;
