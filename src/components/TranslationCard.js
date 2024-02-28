import React,{useState, useEffect} from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Grid, Select, MenuItem, Modal,Stack,InputLabel, FormControl, IconButton,Chip, OutlinedInput,Snackbar,LinearProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TranslateIcon from '@mui/icons-material/Translate';
import UploadIcon from '@mui/icons-material/Upload';
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

const TranslationCard = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [transcript ,setTranscript]=useState('')
    const [translation,setTranslation]= useState({})
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

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

        const handleSubmit = async (event) => {
          event.preventDefault();
          setLoading(true);
          const formData = new FormData();
          formData.append('source_lang', selectedLanguage);
          targetLanguages.forEach(lang => formData.append('target_langs', lang));
          formData.append('doc', transcript); 
          formData.append('user_id', "78"); 
        
          try {
            const response = await axios.post('https://afrivoices-wlivbm2klq-uc.a.run.app/translate', formData, {
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
    <Card sx={{
        width: '100%',
        maxWidth: '1200px', 
        margin: '40px auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
      }}>
      <CardContent sx={{ width: '100%' }}>
      {loading && <LinearProgress />}
      <Snackbar
        open={showBanner}
        autoHideDuration={6000}
        onClose={() => setShowBanner(false)}
        message="Translation complete"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
        <form>
            <Box>
            <Grid container justifyContent="space-between">
                <Grid item xs={12} md={5} >
                    <FormControl fullWidth>
                    <InputLabel sx={{ color: 'white' }}>Source Language</InputLabel>
                      <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}>
                      {languageOptions.map((language) => (
                        <MenuItem key={language.code} value={language.code}>
                          {language.name}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                      <InputLabel sx={{ color: 'white' }}>Target Languages</InputLabel>
                        <Select
                          multiple
                          value={targetLanguages}
                          onChange={handleTargetLanguageChange}
                          input={<OutlinedInput label="Target Languages" id="select-multiple-chip" />}
                          renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((code) => (
                              <Chip key={code} label={languageOptions.find(lang => lang.code === code)?.name || code} />
                              ))}
                          </Box>)}
                          MenuProps={MenuProps}
                          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}>
                          {languageOptions.map((language) => (
                          <MenuItem key={language.code} value={language.code}>
                          {language.name}
                          </MenuItem>
                        ))}
                        </Select>
                  </FormControl>
                  </Grid>
                </Grid>
                <Box>
                <TextField
                        label="Enter Text"
                        variant="outlined"
                        margin="dense"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        InputLabelProps={{ style: { color: '#fff' } }}
                        sx={{ backgroundColor: 'white', color: '#fff', input: { color: '#fff' } }}
                    />
                </Box>
                <Box>
                {Object.keys(translation).map(langCode => (
                        <Box key={langCode}>
                          <TextField
                            label={`Translation (${langCode})`}
                            variant="outlined"
                            margin="dense"
                            multiline
                            rows={2}
                            fullWidth
                            value={translation[langCode]}
                            disabled
                            InputLabelProps={{ style: { color: '#aaa' } }}
                            sx={{ backgroundColor: 'white', color: '#aaa', input: { color: '#aaa' } }}
                          />
                        </Box>
                      ))}
                </Box>
            </Box>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
                <Button variant="contained" startIcon={<TranslateIcon /> } sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={handleSubmit}>
                    Translate
                </Button>
                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor="file-upload" onClick={handleUploadClick} >
                    <IconButton color="primary" component="span" sx={{ backgroundColor: 'secondary.main', '&:hover': { backgroundColor: 'secondary.dark' }, color: '#fff', p: '10px' }}>
                        <CloudUploadIcon />
                    </IconButton>
                </label>
            </Box>
        </form>
      </CardContent>
    </Card>
    <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="language-selection-modal-title"
        aria-describedby="language-selection-modal-description"
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
            bgcolor: 'gray', 
            color: 'primary.contrastText',
            p: 4,
            borderRadius: 2,
            outline: 'none',
          }}
        >
          <Typography id="language-selection-modal-title" variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Choose Document(s) to Translate
          </Typography>

          <Stack spacing={3}>
            <Button
              variant="outlined" 
              component="label"
              startIcon={<UploadIcon />}
              sx={{ textTransform: 'none', fontWeight: 'medium' }}>
              Upload Files
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="audio/*"
              />
            </Button>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" color="secondary" onClick={handleCloseModal} sx={{ textTransform: 'none', fontWeight: 'medium' }}>
              Translate Document(s)
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TranslationCard;
