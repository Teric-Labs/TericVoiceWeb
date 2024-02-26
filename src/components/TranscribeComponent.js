import React, { useState } from "react";
import { Box, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme ,Card,CardContent,Snackbar,LinearProgress} from '@mui/material';
import uploadfile from '../assets/audio-headset.png';
import multiplefiles from '../assets/files.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomPanel from "./CustomPanel";
import DataTable from "./DataTable";
import axios from 'axios';
import LanguageAndUploadModal from "./LanguageAndUploadModal";
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
  const theme = useTheme(); 
  const apiEndpoint = 'http://127.0.0.1:5000/upload/';

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

  const handleSubmit=async({ speakLanguage, transcribeLanguages, selectedFiles })=>{
    setSingleModalOpen(false);
    setMultipleModalOpen(false);
    setLoading(true);
    const formData  = new FormData();
    formData.append('source_lang',speakLanguage)
    transcribeLanguages.forEach(lang => {
      formData.append('target_langs', lang); 
    });
    formData.append('user_id',"78")
   
    if (Array.isArray(selectedFiles)) {
      selectedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    } else {
      formData.append('audio_file', selectedFiles);
    }
    console.log(formData);
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

  }

  return (
    <Box p={3} sx={{ maxWidth: '1200px', margin: 'auto' }}>
      <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom:'20px' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Audio Transcription Overview
          </Typography>
          <Typography variant="h5" component="div">
            Audio Translation Services
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
          Our platform accurately transcribes audio into various Ugandan languages, enabling easy download of these transcriptions. It's designed to improve engagement and understanding across diverse local communities.          </Typography>
        </CardContent>
    </Card>
    {loading && <LinearProgress />}
    <Snackbar
      open={showBanner}
      autoHideDuration={6000}
      onClose={() => setShowBanner(false)}
      message="Transcription is complete"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}/>
      <Paper elevation={3} sx={{ padding: 4, mb: 5, borderRadius: theme.shape.borderRadius }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} onClick={handleSingleUploadClick} >
            <CustomPanel heading="Upload Audio File" value="" imageUrl={uploadfile} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} onClick={handleMultipleUploadClick}>
            <CustomPanel heading="Upload Multiple Files" value="" imageUrl={multiplefiles} />
          </Grid>
        </Grid>
      </Paper>
      <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleToggleTableVisibility} sx={{ backgroundColor: theme.palette.action.hover }}>
          <Typography variant="h6">View Transcribed Audios</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ width: '100%', padding: 2, margin:'auto', justifyContent:'center', display:'flex', backgroundColor:'black'}}>
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
