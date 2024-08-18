import React, { useState, useEffect } from "react";
import { 
  Box, Card, CardContent, TextField, Button, Select, MenuItem, FormControl, 
  Grid, InputLabel, Chip, OutlinedInput, Snackbar, LinearProgress,
  ThemeProvider, createTheme, Stepper, Step, StepLabel
} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube'; 
import MicIcon from '@mui/icons-material/Mic'; 
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Ateso", code: "at" },
  { name: "Acholi", code: "ach" },
  { name: "Lugbara", code: "lgg" },
  { name: "Runyankore", code: "nyn" },
  { name: "Swahili", code: "sw" },
  { name: "French", code: "fr" },
  { name: "Kinyarwanda", code: "rw" }
];

const VideoCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [returnText, setReturnText] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Enter Video Details', 'Select Languages', 'Transcribe']

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  

  const handleTargetLanguageChange = (event) => {
    const {
      target: { value },
    } = event;
    setTargetLanguages(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setActiveStep(2);
    const formData = new FormData();
    formData.append('source_lang', selectedLanguage);
    targetLanguages.forEach(lang => formData.append('target_langs', lang));
    formData.append('youtube_link', videoLink);
    formData.append('title', videoTitle);
    formData.append('user_id', user.userId);
    
    try {
      const response = await axios({
        method: 'post',
        url: 'https://teric-asr-api-wlivbm2klq-ue.a.run.app/videoUpload/',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReturnText(response.data.msg || "Transcription submitted successfully");
      setLoading(false);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    } catch (error) {
      setReturnText("An error occurred. Please try again.");
      setLoading(false);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{
        width: '100%',
        maxWidth: 800,
        margin: '2rem auto',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Snackbar
            open={showBanner}
            autoHideDuration={6000}
            onClose={() => setShowBanner(false)}
            message={returnText}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          />
          
          {loading && <LinearProgress sx={{ marginBottom: 2 }} />}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Video Title"
                  variant="outlined"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="YouTube Video Link"
                  variant="outlined"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  InputProps={{
                    startAdornment: (
                      <YouTubeIcon sx={{ color: 'red', mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Source Language</InputLabel>
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language.name} value={language.code}>
                        {language.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Languages</InputLabel>
                  <Select
                    multiple
                    value={targetLanguages}
                    onChange={handleTargetLanguageChange}
                    input={<OutlinedInput label="Target Languages" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={languageOptions.find(lang => lang.code === value)?.name} 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language.name} value={language.code}>
                        {language.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<MicIcon />}
                  fullWidth
                  size="large"
                  sx={{
                    height: '50px',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Transcribe
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default VideoCard;
