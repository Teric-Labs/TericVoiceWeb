import React, { useState, useEffect } from "react";
import {
  Box,Grid, Button, Tabs, Tab,Snackbar, LinearProgress, Paper,
  ThemeProvider, createTheme, Container,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios';
import LanguageAndUploadModal from "./LanguageAndUploadModal";
import RecordingAudioComponent from "./RecordAudioComponent";

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
    fontFamily: 'Poppins, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const TranscribeComponent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [speakLanguage, setSpeakLanguage] = useState('');
  const [transcribeLanguages, setTranscribeLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedTab, setSelectedTab] = useState(0);
  const apiEndpoint = 'https://teric-asr-api-wlivbm2klq-ue.a.run.app/upload/';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async ({ speakLanguage, transcribeLanguages, selectedFiles, description }) => {
    setModalOpen(false);
    setLoading(true);
    const formData = new FormData();
    formData.append('source_lang', speakLanguage);
    formData.append('title', description);
    transcribeLanguages.forEach(lang => formData.append('target_langs', lang));
    formData.append('user_id', user.userId);

    if (Array.isArray(selectedFiles)) {
      selectedFiles.forEach((file, index) => formData.append(`files[${index}]`, file));
    } else {
      formData.append('audio_file', selectedFiles);
    }

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBannerMessage("Transcription is complete");
      setShowBanner(true);
    } catch (error) {
      setBannerMessage("An error occurred during transcription");
      setShowBanner(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box py={4}>
          {loading && <LinearProgress />}
          
          <Snackbar
            open={showBanner}
            autoHideDuration={6000}
            onClose={() => setShowBanner(false)}
            message={bannerMessage}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          />

          <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
            <Tabs
              value={selectedTab}
              onChange={(event, newValue) => setSelectedTab(newValue)}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
              aria-label="Translation Options"
              sx={{ mb: 3 }}
            >
              <Tab label="Audio Translation" icon={<MicIcon />} iconPosition="start" />
              <Tab label="Record & Translate" icon={<MicIcon />} iconPosition="start" />
            </Tabs>

            <Grid container spacing={3} justifyContent="center">
              {selectedTab === 0 && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleOpenModal('single')}
                      startIcon={<CloudUploadIcon />}
                      sx={{ height: '100px' }}
                    >
                      Upload Single Audio
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleOpenModal('multiple')}
                      startIcon={<CloudUploadIcon />}
                      sx={{ height: '100px' }}
                    >
                      Upload Multiple Audio Files
                    </Button>
                  </Grid>
                </>
              )}
              {selectedTab === 1 && (
                <Grid item xs={12}>
                  <RecordingAudioComponent />
                </Grid>
              )}
            </Grid>
          </Paper>

          <LanguageAndUploadModal
            open={modalOpen}
            handleClose={handleCloseModal}
            speakLanguage={speakLanguage}
            setSpeakLanguage={setSpeakLanguage}
            transcribeLanguages={transcribeLanguages}
            setTranscribeLanguages={setTranscribeLanguages}
            isMultiple={modalType === 'multiple'}
            languageOptions={languageOptions}
            onSubmit={handleSubmit}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default TranscribeComponent;