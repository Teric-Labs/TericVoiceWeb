import React, { useState,useEffect } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Grid, Select, MenuItem, Modal,
  Stack, InputLabel, FormControl, Chip,
  OutlinedInput, Snackbar, LinearProgress
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TranslateIcon from '@mui/icons-material/Translate';
import UploadIcon from '@mui/icons-material/Upload';
import axios from "axios";

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Acholi", code: "ach" },
  { name: "Swahili", code: "sw" },
  { name: "French", code: "fr" },
  { name: "Kinyarwanda", code: "rw" }
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

const SummarizationCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textTitle, setTextTitle] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  
  const handleTargetLanguageChange = (event) => {
    const {
      target: { value },
    } = event;
    setTargetLanguages(typeof value === 'string' ? value.split(',') : value);
  };
  
  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log('File Uploaded:', event.target.files[0]);
  };
  
  const handleFileChange = (event) => {
    console.log(event.target.files[0]); // Log or set state here
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
    const formData = new FormData();
    formData.append('source_lang', selectedLanguage);
    formData.append('doc', transcript); 
    formData.append('title', textTitle); 
    formData.append('user_id', user.userId); 
  
    try {
      const response = await axios.post('https://teric-asr-api-wlivbm2klq-ue.a.run.app/surmarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
      setTranslation(response.data.msg); 
    } catch (error) {
      setLoading(false);
      console.error('Error during translation:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          {loading && <LinearProgress />}
          <Snackbar
            open={showBanner}
            autoHideDuration={6000}
            onClose={() => setShowBanner(false)}
            message="Translation complete"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
          <Box mt={1} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" startIcon={<TranslateIcon /> } sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={handleUploadClick}>
              Summarize Text 
            </Button>
            {/* <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
            <label htmlFor="file-upload">
              <Button variant="contained" startIcon={<UploadIcon />} sx={{ '&:hover': { backgroundColor: 'secondary.dark' }, color: '#fff' }}>
                Upload Document
              </Button>
            </label> */}
          </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="translation-modal-title"
        aria-describedby="translation-modal-description"
        closeAfterTransition
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            minWidth: 600,
            bgcolor: 'background.paper', 
            color: 'text.primary',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
          }}
        >
          {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
          <Typography id="translation-modal-title" variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', fontFamily:'Poppins'}}>
            Summarize Text
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <FormControl fullWidth>
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
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Source Language</InputLabel>
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language.code} value={language.code}>
                        {language.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Enter Text"
                  variant="outlined"
                  margin="dense"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="primary" type="submit" sx={{ textTransform: 'none', fontWeight: 'medium' }}>
                  Summarize
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ textTransform: 'none', fontWeight: 'medium' }}>
                  Close
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default SummarizationCard;
