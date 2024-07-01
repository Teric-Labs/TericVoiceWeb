import React, { useState } from "react";
import {
  Box, TextField, Button,
  Typography, Grid, Select, Modal,
  MenuItem, FormControl, InputLabel, Chip,
  OutlinedInput, LinearProgress
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import axios from "axios";

const languages = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Ateso", code: "at" },
  { name: "Acholi", code: "ac" },
  { name: "Lugbara", code: "lgg" },
  { name: "Runyankore", code: "nyn" },
  { name: "Swahili", code: "sw" }
];

const SynthesizeComponent = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState([]);
  const [textData, setTextData] = useState("");
  const [textTitle, setTextTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
  };

  const handleFileUpload = (event) => {
    console.log('File Uploaded:', event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setTextData(event.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const generateSpeech = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text_file', textData);
      formData.append('source_lang_code', selectedLanguage);
      formData.append('target_lang_code', JSON.stringify(targetLanguage)); // Convert array to string
      formData.append('user_id', "78");
      formData.append('title', textTitle);

      const result = await axios.post('http://127.0.0.1:8000/tvox_translation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Results for submitting audio and text", result.data);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving speech", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <input
          accept="text/*"
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <Button component="span" startIcon={<CloudUploadIcon />} variant="contained" sx={{ mr: 2, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark', fontFamily: 'Poppins' } }}>
            Upload Document
          </Button>
        </label>
        <Button type="button" variant="contained" startIcon={<VolumeUpIcon />} onClick={handleOpenModal} sx={{ fontFamily: 'Poppins' }}>
          Generate Speech
        </Button>
      </Box>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600,
          bgcolor: 'background.paper', boxShadow: 24, p: 4,
        }}>
          {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
          <Typography id="modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Poppins' }}>
            Generate Speech
          </Typography>
          <Box sx={{ padding: 4, alignItems: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Grid container spacing={2} sx={{
              borderRadius: '30px',
              padding: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '800px',
              margin: 'auto'
            }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Source Language</InputLabel>
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    sx={{ color: 'black', bgcolor: 'rgba(255,255,255,0.15)' }}
                  >
                    {languages.map((language) => (
                      <MenuItem key={language.code} value={language.code} sx={{ fontFamily: 'Poppins' }}>
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
                    value={targetLanguage}
                    onChange={handleTargetLanguageChange}
                    input={<OutlinedInput label="Target Languages" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} sx={{ fontFamily: 'Poppins' }} />
                        ))}
                      </Box>
                    )}
                  >
                    {languages.map((language) => (
                      <MenuItem key={language.code} value={language.code} sx={{ fontFamily: 'Poppins' }}>
                        {language.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
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
            <TextField
              label="Enter Text"
              variant="outlined"
              margin="normal"
              multiline
              value={textData}
              onChange={handleTextChange}
              rows={4}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'grey' },
                  '&:hover fieldset': { borderColor: 'black' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
              }}
            />
          </Box>
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button type="button" variant="contained" startIcon={<VolumeUpIcon />} onClick={generateSpeech}>
              Generate Speech
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SynthesizeComponent;
