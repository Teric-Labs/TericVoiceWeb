import React, { useState,useEffect } from "react";
import {
  Box, Typography, Grid, Button, Accordion,
  AccordionSummary, AccordionDetails, useTheme,
  Card, CardContent, Snackbar, LinearProgress
} from '@mui/material';
import uploadfile from '../assets/upload.png';
import multiplefiles from '../assets/documents.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataTable from "./DataTable";
import axios from 'axios';
import LanguageAndUploadModal from "./LanguageAndUploadModal";
import Upload from "@mui/icons-material/Upload";

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Ateso", code: "at" },
  { name: "Acholi", code: "ac" },
  { name: "Lugbara", code: "lgg" },
  { name: "Runyankore", code: "nyn" },
  { name: "Swahili", code: "sw" }
];

const TranscribeComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [multipleModalOpen, setMultipleModalOpen] = useState(false);
  const [speakLanguage, setSpeakLanguage] = useState('');
  const [transcribeLanguages, setTranscribeLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  const theme = useTheme();
  const apiEndpoint = 'http://127.0.0.1:8000/upload/';

  const handleSingleUploadClick = () => {
    setSingleModalOpen(true);
  };
  const handleMultipleUploadClick = () => {
    setMultipleModalOpen(true);
  };
  const handleCloseSingleModal = () => {
    setSingleModalOpen(false);
  };
  const handleCloseMultipleModal = () => {
    setMultipleModalOpen(false);
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
  const handleSubmit = async ({ speakLanguage, transcribeLanguages, selectedFiles,description }) => {
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
                Audio Transcription Overview
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontFamily: 'Poppins' }}>
                Audio Translation Services
              </Typography>
              <Typography variant="body2" sx={{ mt: 1.5, fontFamily: 'Poppins' }}>
                Our platform accurately transcribes audio into various Ugandan languages, enabling easy download of these transcriptions. <br />
                It's designed to improve engagement and understanding across diverse local communities.
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="outlined" onClick={handleSingleUploadClick}>
                    <img src={uploadfile} alt="Upload Audio" style={{width: 20, height: 20}} />
                    Upload Audio
                  </Button>
                </Grid>
                <Grid item>
                  {/* <Button variant="outlined" onClick={handleMultipleUploadClick}>
                    <img src={multiplefiles} alt="Upload Multiple Files" style={{width: 20, height: 20}} />
                    Upload Multiple Files
                  </Button> */}
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
      <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleToggleTableVisibility} sx={{ backgroundColor: theme.palette.action.hover }}>
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
    </Box>
  );
}

export default TranscribeComponent;
