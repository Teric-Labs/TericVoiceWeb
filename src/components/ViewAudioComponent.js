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
  Tooltip
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import axios from "axios";
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
  const theme = useTheme();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('https://phosai-main-api.onrender.com/get_audio', { doc_id: audioId });
        const data = response.data.entries;
        setEntries(data);

        if (data.length > 0 && data[0].Url) {
          setAudioSource(data[0].Url[0].audio_file_url);
          setDate(data[0].Date);
          setTitle(data[0].title);

          const availableLanguages = Object.keys(data[0].Translations || {});
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
    if (languageSegments && languageSegments.length > 0) {
      const activeSegment = languageSegments.find(
        (segment) => time >= segment.start_time && time <= segment.end_time
      );
      setCurrentSegment(activeSegment ? activeSegment.text : "No transcript available at this time");
    }
  };

  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language);
    const languageSegments = entries[0].Translations[language];
    updateSegmentDisplay(languageSegments, 0);
    setAnchorEl(null);
  };

  const handleAudioTimeUpdate = (time) => {
    if (entries.length > 0 && selectedLanguage) {
      const languageSegments = entries[0].Translations[selectedLanguage];
      updateSegmentDisplay(languageSegments, time);
    }
  };

  const handleDownloadTranscript = () => {
    if (!entries.length || !selectedLanguage) return;
    
    const transcriptText = entries[0].Translations[selectedLanguage]
      .map(segment => segment.text)
      .join('\n\n');
    
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
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                Original Transcript
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  borderRadius: '8px'
                }}
              >
                <Typography variant="body1">
                  {entries[0].Original_transcript}
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.text.primary
                }}
              >
                Current Segment
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