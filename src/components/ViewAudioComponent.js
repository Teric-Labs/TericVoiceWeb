import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Divider, IconButton, Paper, useTheme, Button } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
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
  const theme = useTheme();

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/get_audio';
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(apiEndpoint, { doc_id: audioId });
        const data = response.data.entries;
        setEntries(data);

        if (data.length > 0 && data[0].Url) {
          const url = data[0].Url[0].audio_file_url;
          setAudioSource(url);
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

  // Function to update displayed segment based on the selected language and current time
  const updateSegmentDisplay = (languageSegments, time) => {
    if (languageSegments && languageSegments.length > 0) {
      const activeSegment = languageSegments.find(
        (segment) => time >= segment.start_time && time <= segment.end_time
      );
      setCurrentSegment(activeSegment ? activeSegment.text : "No transcript available at this time");
    }
  };

  // Handle language selection and reset display to the first segment of the selected language
  const handleLanguageSelection = (language) => {
    setSelectedLanguage(language);
    const languageSegments = entries[0].Translations[language];
    updateSegmentDisplay(languageSegments, 0); // Reset to the first segment when language changes
  };

  // Sync transcript with audio playback
  const handleAudioTimeUpdate = (time) => {
    if (entries.length > 0 && selectedLanguage) {
      const languageSegments = entries[0].Translations[selectedLanguage];
      updateSegmentDisplay(languageSegments, time);
    }
  };

  return (
    <Paper elevation={4} sx={{ marginTop: '20px', marginX: '20px', padding: '20px' }}>
      <Box sx={{ margin: 'auto' }}>
        <Grid container spacing={3} alignItems="center" sx={{ color: "white" }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="textSecondary" sx={{ fontFamily: 'Poppins' }}>Date Created: {audioDate}</Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{ fontFamily: 'Poppins', fontSize: '2em' }}> <b>{audioTitle}</b></Typography>
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

        {loading && (
          <Typography variant="body1" sx={{ fontFamily: 'Poppins', marginBottom: 2 }}>Loading audio data...</Typography>
        )}

        {error && (
          <Typography variant="body1" color="error" sx={{ fontFamily: 'Poppins', marginBottom: 2 }}>{error}</Typography>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins' }}>Original Transcript:</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
                {entries[0].Original_transcript}
              </Typography>
            </Box>

            {/* Language selection buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
              {Object.keys(entries[0].Translations).map((language, index) => (
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

        {/* Audio Player Component */}
        {audioSource && (
          <Box id="audiobox" mt={3}>
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
