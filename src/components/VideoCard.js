import React,{useState} from "react";
import { Box, Card, CardContent, TextField, Button,Select, MenuItem, FormControl,Grid,InputLabel, Chip, OutlinedInput } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube'; 
import MicIcon from '@mui/icons-material/Mic'; 
const languages = ['Acholi','Ateso','English','Luganda','Lugbra','Lumasaaba','Runyankore-Rukiga'];

const VideoCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [targetLanguages, setTargetLanguages] = useState([]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);};

  const handleTargetLanguageChange = (event) => {
    const {
        target: { value },
    } = event;
    setTargetLanguages(typeof value === 'string' ? value.split(',') : value);
};



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
          
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={2}>
            <TextField 
              fullWidth 
              label="Enter Youtube video link" 
              variant="outlined" 
              margin="dense"
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
