import React,{useState} from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Grid, InputAdornment,Select,Modal,Stack, MenuItem, FormControl,InputLabel, Chip, OutlinedInput} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import UploadIcon from '@mui/icons-material/Upload';

const languages = ['Acholi','Ateso','English','Luganda','Lugbra','Lumasaaba','Runyankore-Rukiga'];

const SynthesizeComponent = () => {
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
    console.log(event.target.files[0]); // Log or set state here
  };


  return (
    <Box>
    <Card sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '20px auto', 
        padding: '2rem', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        borderRadius: '8px', 
        boxShadow: '0 8px 16px rgba(0,0,0,0.5)', 
      }}>
      <CardContent sx={{ width: '100%' }}>
        <form>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                        </Grid>
                    </Box>
          <Box>
          <TextField
            label="Enter Text"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            fullWidth
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{
              style: { color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <VolumeUpIcon sx={{ color: 'grey' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          </Box>
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
            <input
              accept="text/*"
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" onClick={handleUploadClick}>
              <Button component="span" startIcon={<CloudUploadIcon />} variant="contained" sx={{ mr: 2, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
                Upload Document
              </Button>
            </label>
            <Button type="submit" variant="contained" startIcon={<VolumeUpIcon />} sx={{ backgroundColor: 'secondary.main', '&:hover': { backgroundColor: 'secondary.dark' } }}>
              Generate Speech
            </Button>
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
            Choose Document(s) to Read
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
              Generate Voice
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
};

export default SynthesizeComponent;
