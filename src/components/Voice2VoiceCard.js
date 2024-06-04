import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Grid, Select, MenuItem, Modal, Stack, InputLabel, FormControl, IconButton, Chip, OutlinedInput, Snackbar, LinearProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import voice from "../assets/audio.png"
import axios from "axios";

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Ateso", code: "at" },
  { name: "Acholi", code: "ac" },
  { name: "Lugbara", code: "lgg" },
  { name: "Runyankore", code: "nyn" },
  { name: "Swahili", code: "sw" }
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Voice2VoiceCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [textTitle, setTextTitle] = useState('');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
    console.log('File Uploaded:', file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('source_lang_code', selectedLanguage);
    formData.append('target_lang_code', targetLanguage);
    formData.append('user_id', "78");
    formData.append('file', selectedFile);
    formData.append('title', textTitle);

    try {
      const response = await axios.post('http://127.0.0.1:8000/voice_translation', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    } catch (error) {
      setLoading(false);
      console.error('Error during translation:', error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <Button variant="contained" onClick={handleOpenModal} sx={{fontFamily:'Poppins'}}>
        <img src={voice} style={{width:20, height:20}}/>
        Translate Audio</Button>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '12px',
        }}>
          <Card sx={{ width: '100%', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CardContent sx={{ width: '100%' }}>
              {loading && <LinearProgress />}
              <Snackbar
                open={showBanner}
                autoHideDuration={6000}
                onClose={() => setShowBanner(false)}
                message="Translation complete"
                sx={{fontFamily:'Poppins'}}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              />
              <form onSubmit={handleSubmit}>
                <Box>
                  <Grid container justifyContent="space-between">
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth>
                        <InputLabel>Source Language</InputLabel>
                        <Select
                          value={selectedLanguage}
                          onChange={handleLanguageChange}
                        >
                          {languageOptions.map((language) => (
                            <MenuItem key={language.code} value={language.code} sx={{fontFamily:'Poppins'}}>
                              {language.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <FormControl fullWidth>
                        <InputLabel>Target Languages</InputLabel>
                        <Select
                          value={targetLanguage}
                          onChange={handleTargetLanguageChange}
                          input={<OutlinedInput label="Target Languages" id="select-multiple-chip" />}
                        >
                          {languageOptions.map((language) => (
                            <MenuItem key={language.code} value={language.code} sx={{fontFamily:'Poppins'}}>
                              {language.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box>
                  <TextField 
                      fullWidth 
                      label="Enter Title" 
                      variant="outlined" 
                      margin="dense"
                      value={textTitle}
                      onChange={(e) => setTextTitle(e.target.value)}
                      placeholder="Text Title"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'grey' },
                          '&:hover fieldset': { borderColor: '#fff' },
                          '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                        },
                      }}
                    />
                  </Box>
                  <Box id="uploadfiles" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px dotted #ccc', borderRadius: '8px', padding: '16px', marginTop: '20px' }}>
                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                      <CloudUploadIcon sx={{ fontSize: 64, color: '#666' }} />
                      <Typography variant="body1" sx={{ color: '#666', marginTop: '10px', textAlign: 'center',fontFamily:'Poppins' }}>{fileName ? fileName : "Upload audio files (e.g., WAV, MP3)"}</Typography>
                      <input type="file" id="fileInput" style={{ display: 'none' }} accept=".wav,.mp3" onChange={handleFileUpload} />
                    </label>
                  </Box>
                </Box>
                <Button type="submit" variant="contained" sx={{ mt: 2, width:'100%',fontFamily:'Poppins' }}>Translate</Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default Voice2VoiceCard;
