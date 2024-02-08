import React,{useState} from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Grid, Select, MenuItem, Modal,Stack,InputLabel, FormControl, IconButton,Chip, OutlinedInput } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TranslateIcon from '@mui/icons-material/Translate';
import UploadIcon from '@mui/icons-material/Upload';
const languages = ['Acholi','Ateso','English','Luganda','Lugbra','Lumasaaba','Runyankore-Rukiga'];

const TranslationCard = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

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
          // Assuming you want to store the file in state, add a state for it if not already done
          // For single file upload
          console.log(event.target.files[0]); // Log or set state here
        };



  return (
    <Box>
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
        
        <form>
            <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs={12} md={5} >
                    <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'white' }}>Source Language</InputLabel>
                                    <Select
                                        value={selectedLanguage}
                                        onChange={handleLanguageChange}
                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language} value={language}>
                                                {language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                    </FormControl>
                    <TextField
                        label="Enter Text"
                        variant="outlined"
                        margin="dense"
                        multiline
                        rows={4}
                        fullWidth
                        InputLabelProps={{ style: { color: '#fff' } }}
                        sx={{ backgroundColor: '#333', color: '#fff', input: { color: '#fff' } }}
                    />
                </Grid>
                <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'white' }}>Target Languages</InputLabel>
                                    <Select
                                        multiple
                                        value={targetLanguages}
                                        onChange={handleTargetLanguageChange}
                                        input={<OutlinedInput label="Target Languages" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language} value={language}>
                                                {language}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                    <TextField
                        label="Translation"
                        variant="outlined"
                        margin="dense"
                        multiline
                        rows={4}
                        fullWidth
                        disabled
                        InputLabelProps={{ style: { color: '#aaa' } }} 
                        sx={{ backgroundColor: '#333', color: '#aaa', input: { color: '#aaa' } }}
                    />
                </Grid>
            </Grid>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
                <Button variant="contained" startIcon={<TranslateIcon />} sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
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
