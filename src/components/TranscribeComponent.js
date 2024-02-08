import React, { useState } from "react";
import { Box, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme ,Card,CardContent} from '@mui/material';
import uploadfile from '../assets/audio-headset.png';
import multiplefiles from '../assets/files.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomPanel from "./CustomPanel";
import DataTable from "./DataTable";
import LanguageAndUploadModal from "./LanguageAndUploadModal";
const languageOptions = ["English", "Luganda", "Ateso", "Acholi", "Lugbara", "Runyankore", "Swahili"];

const TranscribeComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [multipleModalOpen, setMultipleModalOpen] = useState(false);
  const [speakLanguage, setSpeakLanguage] = useState('');
  const [transcribeLanguages, setTranscribeLanguages] = useState([]);
  const theme = useTheme(); 

  const handleSingleUploadClick = () => {
    setSingleModalOpen(true);
  };
  const handleMultipleUploadClick = () => {
    setMultipleModalOpen(true);
  };
  const handleCloseSingleModal = () => {
    setSingleModalOpen(false);
  };
  const handleFileChange = (event) => {
    // Assuming you want to store the file in state, add a state for it if not already done
    // For single file upload
    console.log(event.target.files[0]); // Log or set state here
  };

  const handleCloseMultipleModal = () => {
    setMultipleModalOpen(false);
  };

  const handleFilesChange = (event) => {
    // Assuming you want to store multiple files in state, add a state for it if not already done
    // For multiple file uploads
    console.log(event.target.files); // Log or set state here
  };
  const handleToggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

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
        handleFileChange={handleFileChange}
        isMultiple={false}
        languageOptions={languageOptions}
      />
      <LanguageAndUploadModal
        open={multipleModalOpen}
        handleClose={handleCloseMultipleModal}
        speakLanguage={speakLanguage}
        setSpeakLanguage={setSpeakLanguage}
        transcribeLanguages={transcribeLanguages}
        setTranscribeLanguages={setTranscribeLanguages}
        handleFileChange={handleFilesChange} 
        isMultiple={true}
        languageOptions={languageOptions}
      />
    </Box>
  );
}

export default TranscribeComponent;
