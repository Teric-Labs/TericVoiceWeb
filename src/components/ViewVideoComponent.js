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
  CircularProgress
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import axios from "axios";
import YouTubeVideoComponent from "./YouTubeVideoComponent";

const ViewVideoComponent = ({ audioId }) => {
  const theme = useTheme();
  const translationsRef = useRef(null);
  const playerRef = useRef(null);
  
  // Basic state
  const [videoData, setVideoData] = useState({
    url: "",
    date: "",
    title: ""
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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://20.106.179.250:8080/get_audio_data', { 
          doc_id: audioId 
        });

        const entry = response.data.entries[0];
        if (!entry) throw new Error("No data available");

        // Store translations in ref for access during video playback
        translationsRef.current = entry.translations;

        setVideoData({
          url: entry.url,
          date: entry.Date,
          title: entry.title
        });

        const availableLanguages = Object.keys(entry.translations || {});
        setLanguages(availableLanguages);

        // Set initial language and transcript
        if (availableLanguages.length > 0) {
          const initialLanguage = availableLanguages[0];
          setSelectedLanguage(initialLanguage);
          initializeTranscript(initialLanguage, entry.translations[initialLanguage]);
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
    if (!translations || !Array.isArray(translations)) {
      setTranscripts({
        full: "",
        current: "No transcript available",
        segments: []
      });
      return;
    }

    const fullText = translations
      .map(segment => segment.text)
      .join('\n\n');

    setTranscripts({
      full: fullText,
      current: translations[0]?.text || "No transcript available",
      segments: translations
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
      {/* Header */}
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
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 600 }}
          >
            {videoData.title}
          </Typography>
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
          <YouTubeVideoComponent 
            videoUrl={videoData.url} 
            onTimeUpdate={handleTimeUpdate}
            ref={playerRef}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Current Segment */}
      <Box mb={4}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ fontWeight: 500 }}
        >
          Current Segment ({formatTime(currentTime)})
        </Typography>
        <Paper 
          elevation={0}
          sx={{ 
            p: 2,
            backgroundColor: theme.palette.primary.light,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.primary.main}`,
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.primary.dark,
              fontWeight: 500
            }}
          >
            {transcripts.current}
          </Typography>
        </Paper>
      </Box>

      {/* Full Transcript */}
      <Box>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ fontWeight: 500 }}
        >
          Full Transcript
        </Typography>
        <Paper 
          elevation={0}
          sx={{ 
            p: 2,
            backgroundColor: theme.palette.grey[50],
            borderRadius: '8px',
            border: `1px solid ${theme.palette.grey[200]}`,
            maxHeight: '300px',
            overflow: 'auto'
          }}
        >
          <Typography 
            variant="body1" 
            component="pre"
            sx={{ 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {transcripts.full}
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
};

export default ViewVideoComponent;