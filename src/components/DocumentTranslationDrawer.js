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
    maxWidth: '650px',
    backgroundColor: '#09090b', // Zinc 950
    color: '#fafafa',
    boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth: '100%',
    },
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: '32px 24px',
  background: 'linear-gradient(to bottom, #18181b, #09090b)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '100px',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: '32px 24px',
  height: 'calc(100vh - 100px)',
  overflow: 'auto',
  backgroundColor: '#09090b',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
}));

const ResultPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  marginBottom: '20px',
  backgroundColor: '#18181b', // Zinc 900
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple secondary
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#09090b',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
      borderWidth: '2px',
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 20px',
  fontSize: '0.85rem',
  transition: 'all 0.2s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#e2e8f0',
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8b5cf6',
    color: '#a78bfa',
    transform: 'translateY(-1px)',
  },
}));

const LanguageChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(139, 92, 246, 0.15)',
  color: '#a78bfa',
  fontWeight: 600,
  borderRadius: '8px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  height: '24px',
  fontSize: '0.7rem',
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
            width: 52,
            height: 52,
            borderRadius: '16px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#8b5cf6'
          }}>
            <Translate fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fafafa', letterSpacing: '-0.01em' }}>
              Translation Workspace
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {fileName || 'Processing Results'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#64748b', '&:hover': { color: '#fafafa', backgroundColor: 'rgba(255,255,255,0.05)' } }}>
          <Close />
        </IconButton>
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
            height: '300px',
            gap: 3
          }}>
            <CircularProgress size={48} thickness={4} sx={{ color: '#8b5cf6' }} />
            <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              Refining your translation...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            variant="outlined"
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              '& .MuiAlert-icon': { color: '#f87171' }
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
              mb: 4,
              p: 2.5,
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.15)'
            }}>
              <CheckCircle sx={{ color: '#10b981' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#34d399' }}>
                Translation Ready
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Description sx={{ color: '#94a3b8', fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                        Source Text
                      </Typography>
                    </Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleSection('original')}
                    sx={{ color: '#64748b', '&:hover': { color: '#8b5cf6' } }}
                  >
                    {expandedSections.original ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                
                {(!expandedSections.hasOwnProperty('original') || expandedSections.original) && (
                  <Fade in={true}>
                    <Box>
                      <StyledTextField
                        multiline
                        rows={6}
                        fullWidth
                        value={formatText(translationData.original)}
                        variant="outlined"
                        InputProps={{ readOnly: true }}
                        sx={{ mb: 2.5 }}
                      />
                      <Stack direction="row" spacing={1.5}>
                        <ActionButton
                          variant="outlined"
                          startIcon={<ContentCopy />}
                          onClick={() => handleCopy(translationData.original, 'original')}
                          size="small"
                        >
                          {copySuccess.original ? 'Copied to Clipboard' : 'Copy Source'}
                        </ActionButton>
                      </Stack>
                    </Box>
                  </Fade>
                )}
              </ResultPaper>
            )}

            {/* Translations */}
            {translationData.translations && Object.keys(translationData.translations).length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#f8fafc', fontSize: '1.1rem' }}>
                  Target Translations
                </Typography>
                
                {Object.entries(translationData.translations).map(([language, content], index) => (
                  <ResultPaper key={language} sx={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2.5
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: '#8b5cf6', display: 'flex' }}>
                          <Language sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
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
                        sx={{ color: '#64748b', '&:hover': { color: '#8b5cf6' } }}
                      >
                        {expandedSections[language] !== false ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    
                    {expandedSections[language] !== false && (
                      <Fade in={true}>
                        <Box>
                          <StyledTextField
                            multiline
                            rows={10}
                            fullWidth
                            value={formatText(content)}
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            sx={{ mb: 2.5 }}
                          />
                          <Stack direction="row" spacing={1.5} flexWrap="wrap">
                            <ActionButton
                              variant="outlined"
                              startIcon={<ContentCopy />}
                              onClick={() => handleCopy(content, language)}
                              size="small"
                            >
                              {copySuccess[language] ? 'Copied!' : 'Copy Translation'}
                            </ActionButton>
                            <ActionButton
                              variant="outlined"
                              startIcon={<Download />}
                              onClick={() => handleDownloadDocx(content, language)}
                              size="small"
                            >
                              Download Results
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
            background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            transition: 'all 0.3s ease-in-out',
            pointerEvents: 'auto', // Ensure it's clickable
            cursor: 'pointer',
            zIndex: 1001, // Ensure it's above everything
            '&:hover': {
              background: 'linear-gradient(45deg, #0284c7, #0ea5e9)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(14, 165, 233, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0px)',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
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
