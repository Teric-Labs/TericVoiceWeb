import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Menu,
  MenuItem,
  useTheme,
  Fade,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { dataAPI } from '../services/api';
import AudioPlayerComponent from "./AudioPlayerComponent";

const ViewAudioComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [audioDate, setDate] = useState("");
  const [audioTitle, setTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentSegment, setCurrentSegment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const theme = useTheme();

  // Language display names mapping
  const getLanguageDisplayName = (code) => {
    const languageNames = {
      'en': 'English',
      'lg': 'Luganda',
      'at': 'Ateso',
      'ac': 'Acholi',
      'nyn': 'Runyankore',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ar': 'Arabic',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'hi': 'Hindi',
      'sw': 'Swahili',
      'rw': 'Kinyarwanda'
    };
    return languageNames[code] || code.toUpperCase();
  };

  // Helper function to render translation content
  const renderTranslationContent = (translationData, languageCode) => {
    if (typeof translationData === 'string') {
      return translationData;
    } else if (Array.isArray(translationData)) {
      return translationData.map(segment => segment.text).join(' ');
    } else {
      return "No translation available";
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dataAPI.getAudio(audioId);
        const data = response.entries;
        console.log('🔍 ViewAudioComponent - Raw API response:', response);
        console.log('🔍 ViewAudioComponent - Entries data:', data);
        console.log('🔍 ViewAudioComponent - First entry:', data[0]);
        console.log('🔍 ViewAudioComponent - Original transcript:', data[0]?.Original_transcript);
        setEntries(data);

        if (data.length > 0 && data[0].Url) {
          setAudioSource(data[0].Url[0].audio_file_url);
          setDate(data[0].Date);
          setTitle(data[0].title);

          const availableLanguages = Object.keys(data[0].Translations || {});
          setAvailableLanguages(availableLanguages);
          
          if (availableLanguages.length > 0) {
            setSelectedLanguage(availableLanguages[0]);
            updateSegmentDisplay(data[0].Translations[availableLanguages[0]], 0);
          }
        } else {
          setError("Audio source not available.");
        }
      } catch (err) {
        setError("Failed to fetch audio data.");
        console.error('Failed to fetch entries', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [audioId]);

  const updateSegmentDisplay = (languageSegments, time) => {
    // Handle case where languageSegments is a string (current backend format)
    if (typeof languageSegments === 'string') {
      setCurrentSegment(languageSegments);
      return;
    }
    
    // Handle case where languageSegments is an array (expected format with timing)
    if (Array.isArray(languageSegments) && languageSegments.length > 0) {
      const activeSegment = languageSegments.find(
        (segment) => time >= segment.start_time && time <= segment.end_time
      );
      setCurrentSegment(activeSegment ? activeSegment.text : "No transcript available at this time");
    } else {
      setCurrentSegment("No transcript available");
    }
  };

  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language);
    if (entries.length > 0 && entries[0].Translations) {
      const languageSegments = entries[0].Translations[language];
      updateSegmentDisplay(languageSegments, 0);
    }
    setAnchorEl(null);
  };

  const handleAudioTimeUpdate = (time) => {
    if (entries.length > 0 && selectedLanguage && entries[0].Translations) {
      const languageSegments = entries[0].Translations[selectedLanguage];
      updateSegmentDisplay(languageSegments, time);
    }
  };

  const handleDownloadTranscript = () => {
    if (!entries.length || !selectedLanguage) return;
    
    const translationData = entries[0].Translations[selectedLanguage];
    let transcriptText;
    
    // Handle string format (current backend format)
    if (typeof translationData === 'string') {
      transcriptText = translationData;
    }
    // Handle array format (expected format with timing)
    else if (Array.isArray(translationData)) {
      transcriptText = translationData
        .map(segment => segment.text)
        .join('\n\n');
    } else {
      transcriptText = "No transcript available";
    }
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${selectedLanguage.toLowerCase()}_${audioTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        margin: '20px',
        padding: { xs: '16px', md: '24px' },
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="caption" 
              color="textSecondary"
              sx={{ display: 'block', marginBottom: 1 }}
            >
              {new Date(audioDate).toLocaleDateString()}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                marginBottom: 2,
                color: theme.palette.text.primary
              }}
            >
              {audioTitle}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4} container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<LanguageIcon />}
                onClick={handleMenuClick}
                sx={{ borderRadius: '8px' }}
              >
                {selectedLanguage || 'Select Language'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
              >
                {entries.length > 0 && Object.keys(entries[0].Translations).map((language) => (
                  <MenuItem 
                    key={language}
                    selected={selectedLanguage === language}
                    onClick={() => handleLanguageSelection(language)}
                  >
                    {language}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid item>
              <Tooltip title="Download Transcript">
                <IconButton 
                  onClick={handleDownloadTranscript}
                  color="primary"
                  sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {loading && (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            Loading audio data...
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="error" sx={{ textAlign: 'center', py: 3 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            {(() => {
              console.log('🔍 ViewAudioComponent - Render conditions:');
              console.log('  - loading:', loading);
              console.log('  - error:', error);
              console.log('  - entries.length:', entries.length);
              console.log('  - entries[0]:', entries[0]);
              return null;
            })()}
            {/* Original Transcript */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <LanguageIcon color="primary" />
                Original Transcript ({getLanguageDisplayName(entries[0].source_lang || 'en')})
                {(() => {
                  const transcript = entries[0]?.Original_transcript || entries[0]?.original_transcript || entries[0]?.OriginalTranscript;
                  return transcript && (
                    <Tooltip title="Download Original Transcript">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const blob = new Blob([transcript], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `original_transcript_${entries[0].source_lang || 'en'}_${audioTitle}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  );
                })()}
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3,
                  backgroundColor: theme.palette.background.default,
                  borderRadius: '12px',
                  border: `2px solid ${theme.palette.primary.light}`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '12px 12px 0 0'
                  }
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {(() => {
                    const transcript = entries[0]?.Original_transcript || entries[0]?.original_transcript || entries[0]?.OriginalTranscript;
                    console.log('🔍 ViewAudioComponent - All possible transcript fields:');
                    console.log('  - Original_transcript:', entries[0]?.Original_transcript);
                    console.log('  - original_transcript:', entries[0]?.original_transcript);
                    console.log('  - OriginalTranscript:', entries[0]?.OriginalTranscript);
                    console.log('  - All keys:', Object.keys(entries[0] || {}));
                    console.log('🔍 ViewAudioComponent - Selected transcript:', transcript);
                    return transcript || "No original transcript available";
                  })()}
                </Typography>
                {(() => {
                  const transcript = entries[0]?.Original_transcript || entries[0]?.original_transcript || entries[0]?.OriginalTranscript;
                  return transcript && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="caption" color="text.secondary">
                        Source Language: {getLanguageDisplayName(entries[0].source_lang || 'en')} • 
                        Characters: {transcript.length} • 
                        Words: {transcript.split(' ').length}
                      </Typography>
                    </Box>
                  );
                })()}
              </Paper>
            </Box>

            {/* All Translations */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LanguageIcon color="secondary" />
                  Translations ({availableLanguages.length})
                </Typography>
                <Stack direction="row" spacing={1}>
                  {availableLanguages.map((lang) => (
                    <Chip
                      key={lang}
                      label={getLanguageDisplayName(lang)}
                      size="small"
                      color={lang === selectedLanguage ? "primary" : "default"}
                      onClick={() => setSelectedLanguage(lang)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Show all translations in accordion format */}
              {availableLanguages.map((languageCode, index) => (
                <Accordion 
                  key={languageCode}
                  expanded={activeTab === index}
                  onChange={() => setActiveTab(index)}
                  sx={{ 
                    mb: 2,
                    borderRadius: '12px !important',
                    '&:before': { display: 'none' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: languageCode === selectedLanguage 
                        ? theme.palette.primary.light 
                        : theme.palette.grey[50],
                      borderRadius: '12px',
                      '&.Mui-expanded': {
                        borderRadius: '12px 12px 0 0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Chip
                        label={languageCode.toUpperCase()}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {getLanguageDisplayName(languageCode)}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {entries[0].Translations[languageCode]?.length || 0} characters
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {renderTranslationContent(entries[0].Translations[languageCode], languageCode)}
                      </Typography>
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Current Segment (for audio sync) */}
            {selectedLanguage && (
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LanguageIcon color="action" />
                  Current Segment ({getLanguageDisplayName(selectedLanguage)})
                </Typography>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.primary.main}`
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.primary.dark,
                      fontWeight: 500
                    }}
                  >
                    {currentSegment}
                  </Typography>
                </Paper>
              </Box>
            )}
          </>
        )}

        {audioSource && (
          <Box sx={{ mt: 4 }}>
            <AudioPlayerComponent 
              audioSrc={audioSource} 
              onTimeUpdate={handleAudioTimeUpdate} 
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ViewAudioComponent;