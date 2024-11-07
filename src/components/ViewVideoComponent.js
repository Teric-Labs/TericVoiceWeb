import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Divider, IconButton, Paper, useTheme, Button } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import YouTubeVideoComponent from "./YouTubeVideoComponent";

const ViewVideoComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [videoDate, setVideoDate] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentSegment, setCurrentSegment] = useState("");
  const [currentTime, setCurrentTime] = useState(0); // Track video playback time
  const theme = useTheme();

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/get_audio_data';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: audioId });
        const data = response.data.entries;
        setEntries(data);

        if (data.length > 0 && data[0].url) {
          setVideoLink(data[0].url);
          setVideoDate(data[0].Date);
          setVideoTitle(data[0].title);

          const availableLanguages = Object.keys(data[0].translations || {});
          if (availableLanguages.length > 0) {
            setSelectedLanguage(availableLanguages[0]); // Set default language
            updateSegmentDisplay(data[0].translations[availableLanguages[0]], 0); // Display first segment at time 0
          }
        }
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };
    fetchEntries();
  }, [audioId]);

  // Function to update displayed segment based on the selected language and current time
  const updateSegmentDisplay = (languageSegments, time) => {
    if (languageSegments && languageSegments.length > 0) {
      const activeSegment = languageSegments.find(
        (segment) => time >= segment.start_time && time <= segment.end_time
      );
      setCurrentSegment(activeSegment ? activeSegment.text : "No transcript available at this time");
    }
  };

  // Handle language selection
  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language); // Update selected language
    const languageSegments = entries[0].translations[language];
    updateSegmentDisplay(languageSegments, currentTime); // Immediately display the segment at the current playback time
  };

  // Sync transcript with video playback
  const handleVideoTimeUpdate = (time) => {
    setCurrentTime(time); // Update currentTime state
    if (entries.length > 0 && selectedLanguage) {
      const languageSegments = entries[0].translations[selectedLanguage];
      updateSegmentDisplay(languageSegments, time);
    }
  };

  return (
    <Paper elevation={4} sx={{ marginTop: '20px', marginX: '20px', padding: '20px' }}>
      <Box sx={{ justifyContent: 'center', display: 'flex', mb: 2 }}>
        <YouTubeVideoComponent 
          videoUrl={videoLink} 
          onTimeUpdate={handleVideoTimeUpdate} 
          sx={{ fontFamily: 'Poppins' }} 
        />
      </Box>

      <Grid container spacing={3} alignItems="center" sx={{ color: "white" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary" sx={{ fontFamily: 'Poppins' }}>Date Created: {videoDate}</Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ fontFamily: 'Poppins' }}><b>Title: {videoTitle}</b></Typography>
        </Grid>
        <Grid item xs={12} md={3} container justifyContent="flex-end">
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%' }} aria-label="Download">
            <GetAppIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%', marginLeft: 2 }} aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%', marginLeft: 2 }} aria-label="Save">
            <SaveIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Divider sx={{ marginTop: 3, backgroundColor: theme.palette.divider }} />

      {entries.length > 0 && (
        <>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins' }}>Original Transcript:</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
              {entries[0].Original_transcript}
            </Typography>
          </Box>

          {/* Language selection buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
            {Object.keys(entries[0].translations).map((language, index) => (
              <Button
                key={index}
                variant={selectedLanguage === language ? "contained" : "outlined"}
                onClick={() => handleLanguageSelection(language)}
                sx={{
                  borderRadius: '20px', 
                  fontFamily: 'Poppins',
                  fontWeight: selectedLanguage === language ? 'bold' : 'normal',
                  color: selectedLanguage === language ? 'white' : 'primary.main',
                  backgroundColor: selectedLanguage === language ? 'primary.main' : 'transparent',
                }}
              >
                {language.toUpperCase()}
              </Button>
            ))}
          </Box>

          {/* Display current transcript segment */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1" sx={{ fontFamily: 'Poppins', backgroundColor: 'primary.light', padding: 2, borderRadius: 2 }}>
              {currentSegment}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ViewVideoComponent;