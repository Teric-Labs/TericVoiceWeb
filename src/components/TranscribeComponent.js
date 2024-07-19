import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Button, Accordion,
  AccordionSummary, AccordionDetails, useTheme,
  Card, CardContent, Snackbar, LinearProgress,
  Modal, IconButton
} from '@mui/material';
import uploadfile from '../assets/upload.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import LanguageAndUploadModal from "./LanguageAndUploadModal";
import RecordingAudioComponent from "./RecordAudioComponent";
import MicIcon from '@mui/icons-material/Mic';
import DataTable from "./DataTable";

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

const TranscribeComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [multipleModalOpen, setMultipleModalOpen] = useState(false);
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [speakLanguage, setSpeakLanguage] = useState('');
  const [transcribeLanguages, setTranscribeLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  const theme = useTheme();
  const apiEndpoint = 'https://teric-asr-api-wlivbm2klq-ue.a.run.app/upload/';

  const handleSingleUploadClick = () => {
    setSingleModalOpen(true);
  };

  const handleMultipleUploadClick = () => {
    setMultipleModalOpen(true);
  };

  const handleRecordingClick = () => {
    setRecordingModalOpen(true);
  };

  const handleCloseSingleModal = () => {
    setSingleModalOpen(false);
  };

  const handleCloseMultipleModal = () => {
    setMultipleModalOpen(false);
  };

  const handleCloseRecordingModal = () => {
    setRecordingModalOpen(false);
  };

  const handleToggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleSubmit = async ({ speakLanguage, transcribeLanguages, selectedFiles, description }) => {
    setSingleModalOpen(false);
    setMultipleModalOpen(false);
    setLoading(true);
    const formData = new FormData();
    formData.append('source_lang', speakLanguage);
    formData.append('title', description);
    transcribeLanguages.forEach(lang => {
      formData.append('target_langs', lang);
    });
    formData.append('user_id', user.userId);

    if (Array.isArray(selectedFiles)) {
      selectedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    } else {
      formData.append('audio_file', selectedFiles);
    }

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Box p={3} sx={{ margin: 'auto' }}>
      <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom: '20px' }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography sx={{ fontSize: 14, fontFamily: 'Poppins' }} color="text.secondary" gutterBottom>
                Audio Transcription
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="outlined" onClick={handleSingleUploadClick}>
                    <img src={uploadfile} alt="Upload Audio" style={{ width: 20, height: 20, marginRight: 5 }} />
                    Upload Audio
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={handleRecordingClick}>
                    <MicIcon sx={{ marginRight: 1 }} />
                    Record Audio
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {loading && <LinearProgress />}
      <Snackbar
        open={showBanner}
        autoHideDuration={6000}
        onClose={() => setShowBanner(false)}
        message="Transcription is complete"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
      <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }} expanded={isTableVisible} onChange={handleToggleTableVisibility}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: theme.palette.action.hover }}>
          <Typography variant="h6">View Transcribed Audios</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ width: '100%', padding: 2, margin: 'auto', justifyContent: 'center', display: 'flex' }}>
          {isTableVisible && <DataTable />}
        </AccordionDetails>
      </Accordion>
      <LanguageAndUploadModal
        open={singleModalOpen}
        handleClose={handleCloseSingleModal}
        speakLanguage={speakLanguage}
        setSpeakLanguage={setSpeakLanguage}
        transcribeLanguages={transcribeLanguages}
        setTranscribeLanguages={setTranscribeLanguages}
        isMultiple={false}
        languageOptions={languageOptions}
        onSubmit={handleSubmit}
      />
      <LanguageAndUploadModal
        open={multipleModalOpen}
        handleClose={handleCloseMultipleModal}
        speakLanguage={speakLanguage}
        setSpeakLanguage={setSpeakLanguage}
        transcribeLanguages={transcribeLanguages}
        setTranscribeLanguages={setTranscribeLanguages}
        isMultiple={true}
        languageOptions={languageOptions}
        onSubmit={handleSubmit}
      />
      <Modal
        open={recordingModalOpen}
        onClose={handleCloseRecordingModal}
        aria-labelledby="recording-modal-title"
        aria-describedby="recording-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '70%', md: '60%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <RecordingAudioComponent />
        </Box>
      </Modal>
    </Box>
  );
}

export default TranscribeComponent;
