import React,{useState} from "react";
import { Box, Card, CardContent, TextField, Button,Select, MenuItem, FormControl,Grid,InputLabel, Chip, OutlinedInput,Snackbar,LinearProgress } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube'; 
import MicIcon from '@mui/icons-material/Mic'; 
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

const VideoCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);};

  const handleTargetLanguageChange = (event) => {
    const {
        target: { value },
    } = event;
    setTargetLanguages(typeof value === 'string' ? value.split(',') : value);
};

const handleSubmit=async(event)=>{
  event.preventDefault();
  setLoading(true);
  const formData = new FormData();
  formData.append('source_lang', selectedLanguage);
  targetLanguages.forEach(lang => formData.append('target_langs', lang));
  formData.append('youtube_link', videoLink);
  formData.append('user_id',"78")
  try{
    const response = await axios({method: 'post',
    url: 'http://127.0.0.1:5000/videoUpload/',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    setLoading(false);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 5000);
  }
  catch(error){
    setLoading(false);
  }

}
  return (
    <Card sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
      <CardContent sx={{ width: '100%' }}>
      <Snackbar
      open={showBanner}
      autoHideDuration={6000}
      onClose={() => setShowBanner(false)}
      message="Transcription is complete"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}/>
      {loading && <LinearProgress />}
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
                                        {languageOptions.map((language) => (
                                            <MenuItem key={language.name} value={language.code}>
                                                {language.name}
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
                                        {languageOptions.map((language) => (
                                            <MenuItem key={language.name} value={language.code}>
                                                {language.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
          
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
            <TextField 
              fullWidth 
              label="Enter Youtube video link" 
              variant="outlined" 
              margin="dense"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Insert the link here"
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{
                style: { color: '#fff' },
                startAdornment: (
                  <YouTubeIcon sx={{ color: 'red', mr: 1 }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'grey' },
                  '&:hover fieldset': { borderColor: '#fff' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />
            <Button 
              onClick={handleSubmit}
              type="submit" 
              variant="contained" 
              color="primary" 
              startIcon={<MicIcon />}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                height: '40px',
              }}>
              Transcribe
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
