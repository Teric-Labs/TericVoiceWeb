import React, { useEffect, useState, useCallback, useRef } from "react";
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
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { dataAPI } from '../services/api';
import YouTubeVideoComponent from "./YouTubeVideoComponent";

const ViewVideoComponent = ({ audioId }) => {
  const theme = useTheme();
  const translationsRef = useRef(null);
  const playerRef = useRef(null);
  
  // Function to check if URL is remote (YouTube, Vimeo, etc.)
  const isRemoteVideo = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com') || 
           url.includes('dailymotion.com') ||
           url.startsWith('http://') || 
           url.startsWith('https://');
  };

  // Video placeholder component for local files
  const VideoPlaceholder = ({ filename }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
        border: `2px dashed ${theme.palette.primary.main}`,
        borderRadius: '12px'
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <VideoFileIcon 
            sx={{ 
              fontSize: 80, 
              color: theme.palette.primary.main,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }} 
          />
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.text.primary,
            mb: 2
          }}
        >
          Video File Processed
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            mb: 3
          }}
        >
          {filename || 'Video file'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayCircleOutlineIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
            Audio extracted and transcribed successfully
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
  
  // Basic state
  const [videoData, setVideoData] = useState({
    url: "",
    date: "",
    title: "",
    source_lang: "en"
  });
  
  // Language and transcript state
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [transcripts, setTranscripts] = useState({
    full: "",
    current: "",
    segments: []
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 ViewVideoComponent - Fetching video data for ID:', audioId);
        const response = await dataAPI.getVideo(audioId);
        console.log('🔍 ViewVideoComponent - Raw API response:', response);

        const entries = response.entries;
        if (!entries || entries.length === 0) {
          throw new Error("No video data available");
        }

        const entry = entries[0];
        console.log('🔍 ViewVideoComponent - First entry:', entry);

        // Store translations in ref for access during video playback
        translationsRef.current = entry.translations || entry.Translations;

        setVideoData({
          url: entry.url || entry.Url,
          date: entry.Date || entry.date,
          title: entry.title || "Video Translation",
          source_lang: entry.source_lang || 'en'
        });

        const availableLanguages = Object.keys(entry.translations || entry.Translations || {});
        console.log('🔍 ViewVideoComponent - Available languages:', availableLanguages);
        setLanguages(availableLanguages);

        // Set initial language and transcript
        if (availableLanguages.length > 0) {
          const initialLanguage = availableLanguages[0];
          setSelectedLanguage(initialLanguage);
          const translations = entry.translations || entry.Translations;
          initializeTranscript(initialLanguage, translations[initialLanguage]);
        }

        // Set original transcript from the API response
        if (entry.original_transcript) {
          setTranscripts(prev => ({
            ...prev,
            full: entry.original_transcript,
            current: entry.original_transcript
          }));
        }
      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err.message || "Failed to fetch video data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [audioId]);

  // Initialize transcript for a given language
  const initializeTranscript = useCallback((language, translations) => {
    if (!translations) {
      setTranscripts({
        full: "",
        current: "No transcript available",
        segments: []
      });
      return;
    }

    // Handle string format (from video API)
    if (typeof translations === 'string') {
      const cleanText = translations.replace(/^"|"$/g, ''); // Remove surrounding quotes
      setTranscripts({
        full: cleanText,
        current: cleanText,
        segments: [{ text: cleanText, start_time: 0, end_time: 0 }]
      });
      return;
    }

    // Handle array format (from audio API)
    if (Array.isArray(translations)) {
      const fullText = translations
        .map(segment => segment.text)
        .join('\n\n');

      setTranscripts({
        full: fullText,
        current: translations[0]?.text || "No transcript available",
        segments: translations
      });
      return;
    }

    // Fallback for unexpected format
    setTranscripts({
      full: "",
      current: "No transcript available",
      segments: []
    });
  }, []);

  // Update transcript based on current time
  const updateCurrentTranscript = useCallback((time) => {
    if (!transcripts.segments.length) return;

    const currentSegment = transcripts.segments.find(
      segment => time >= segment.start_time && time <= segment.end_time
    );

    if (currentSegment) {
      setTranscripts(prev => ({
        ...prev,
        current: currentSegment.text
      }));
    }
  }, [transcripts.segments]);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage) => {
    if (!translationsRef.current || !translationsRef.current[newLanguage]) return;
    
    setSelectedLanguage(newLanguage);
    initializeTranscript(newLanguage, translationsRef.current[newLanguage]);
    
    // Update current segment based on current video time
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      updateCurrentTranscript(currentTime);
    }
    
    setMenuAnchor(null);
  }, [initializeTranscript, updateCurrentTranscript]);

  // Handle video time update
  const handleTimeUpdate = useCallback((time) => {
    setCurrentTime(time);
    updateCurrentTranscript(time);
  }, [updateCurrentTranscript]);

  // Handle transcript download
  const handleDownload = useCallback(() => {
    if (!transcripts.segments.length) return;
    
    const transcriptText = transcripts.segments
      .map(segment => (
        `[${formatTime(segment.start_time)} - ${formatTime(segment.end_time)}]\n${segment.text}`
      ))
      .join('\n\n');
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${selectedLanguage.toLowerCase()}_${videoData.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcripts.segments, selectedLanguage, videoData.title]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, m: 2, bgcolor: theme.palette.error.light }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Paper>
    );
  }

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
      {/* Header - Hidden title as requested */}
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} md={8}>
          <Typography 
            variant="caption" 
            color="textSecondary"
            display="block"
            mb={1}
          >
          {new Date(videoData.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
          </Typography>
          {/* Title hidden as requested */}
        </Grid>
        
        {/* Controls */}
        <Grid item xs={12} md={4} container justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<LanguageIcon />}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ 
                borderRadius: '8px',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              {selectedLanguage || 'Select Language'}
            </Button>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              TransitionComponent={Fade}
              PaperProps={{
                sx: {
                  mt: 1,
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              {languages.map((language) => (
                <MenuItem 
                  key={language}
                  selected={selectedLanguage === language}
                  onClick={() => handleLanguageChange(language)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                      }
                    }
                  }}
                >
                  {language}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
          <Grid item>
            <Tooltip title="Download Transcript">
              <IconButton 
                onClick={handleDownload}
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

      {/* Video */}
      <Box 
        sx={{ 
          position: 'relative',
          paddingTop: '56.25%',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.default,
          mb: 4
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {isRemoteVideo(videoData.url) ? (
            <YouTubeVideoComponent 
              videoUrl={videoData.url} 
              onTimeUpdate={handleTimeUpdate}
              ref={playerRef}
            />
          ) : (
            <VideoPlaceholder filename={videoData.url} />
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

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
          Original Transcript ({videoData.source_lang || 'en'})
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
            {transcripts.full || "No original transcript available"}
          </Typography>
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
            <LanguageIcon color="primary" />
            All Translations ({languages.length})
          </Typography>
          <Stack direction="row" spacing={1}>
            {languages.map((lang) => (
              <Chip
                key={lang}
                label={getLanguageDisplayName(lang)}
                size="small"
                color={selectedLanguage === lang ? "primary" : "default"}
                onClick={() => handleLanguageChange(lang)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Box>

        {languages.map((language, index) => {
          const translations = translationsRef.current?.[language];
          const isExpanded = selectedLanguage === language;
          
          return (
            <Accordion 
              key={language}
              expanded={isExpanded}
              onChange={() => handleLanguageChange(language)}
              sx={{
                mb: 2,
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
                '&.Mui-expanded': {
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}20`
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: isExpanded ? theme.palette.primary.light : 'transparent',
                  borderRadius: '12px',
                  '&.Mui-expanded': {
                    borderRadius: '12px 12px 0 0'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <LanguageIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {getLanguageDisplayName(language)}
                  </Typography>
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {Array.isArray(translations) ? translations.length : 0} segments
                    </Typography>
                    <Tooltip title="Download Translation">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (Array.isArray(translations)) {
                            const transcriptText = translations
                              .map(segment => segment.text)
                              .join('\n\n');
                            const blob = new Blob([transcriptText], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `translation_${language}_${videoData.title}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {Array.isArray(translations) 
                    ? translations.map(segment => segment.text).join(' ')
                    : (typeof translations === 'string' ? translations : "No translation available")
                  }
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ViewVideoComponent;