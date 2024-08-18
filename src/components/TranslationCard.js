import React, { useState, useEffect } from "react";
import {
  Box,TextField, Button,Grid, Select, MenuItem,FormControl, Chip,InputLabel,
  Tab, Tabs,
  OutlinedInput, Snackbar, LinearProgress
} from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import axios from "axios";

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

const TranslationCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState({});
  const [loading, setLoading] = useState(false);
  const [textTitle, setTextTitle] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    const { target: { value } } = event;
    setTargetLanguages(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('source_lang', selectedLanguage);
    targetLanguages.forEach(lang => formData.append('target_langs', lang));
    formData.append('doc', transcript);
    formData.append('title', textTitle);
    formData.append('user_id', user.userId);

    try {
      const response = await axios.post('https://teric-asr-api-wlivbm2klq-ue.a.run.app/translate', formData, {
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
  const handleFileUpload = (event) => {
    console.log('File Uploaded:', event.target.files[0]);
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
      <Box>
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => setSelectedTab(newValue)}
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Translation Options"
        sx={{ marginBottom: 2, fontFamily: 'Poppins' }}
      >
        <Tab label="Translate Text" />
        <Tab label="Translate Document" />
      </Tabs>
      <Box sx={{ width: '100%' }}>
        {selectedTab === 0 && (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Languages</InputLabel>
                  <Select
                    multiple
                    value={targetLanguages}
                    onChange={handleTargetLanguageChange}
                    input={<OutlinedInput label="Target Languages" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((code) => (
                          <Chip key={code} label={languageOptions.find(lang => lang.code === code)?.name || code} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
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
              {Object.keys(translation).map(langCode => (
                <Grid item xs={12} key={langCode}>
                  <TextField
                    label={`Translation (${langCode})`}
                    variant="outlined"
                    margin="dense"
                    multiline
                    rows={2}
                    fullWidth
                    value={translation[langCode]}
                    disabled
                  />
                </Grid>
              ))}
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="primary" type="submit" sx={{ textTransform: 'none', fontWeight: 'medium' }}>
                  Translate
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        {selectedTab === 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
            <label htmlFor="file-upload">
              <Button variant="contained" startIcon={<UploadIcon />} sx={{ textTransform: 'none', fontWeight: 'medium' }}>
                Upload Document
              </Button>
            </label>
          </Box>
        )}
      </Box>
      </Box>
    </Box>
  );
};

export default TranslationCard;
