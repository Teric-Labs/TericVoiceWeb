import React,{useEffect,useState} from "react";
import { Box, Typography, Grid, Divider,IconButton, Paper, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import AudioPlayerComponent from "./AudioPlayerComponent";


const ViewttsAudioComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [audioDate, setAudioDate] = useState("");
  const [audiotitle, setAudioTitle] = useState("");


  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/get_tts_audio';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: audioId });
        setEntries(response.data.entries);
        if (response.data.entries.length > 0) {
          setAudioSource(response.data.entries[0].audio_data);
          setAudioDate(response.data.entries[0].Date)
          setAudioTitle(response.data.entries[0].title)
        }
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };

    fetchEntries();
  }, [audioId]);
  const theme = useTheme();

  return (
    <Paper elevation={4} sx={{marginTop:'20px', marginX:'20px'}}>
    <Box p={4} sx={{margin: 'auto' }}>
      <Grid container spacing={3} alignItems="center" sx={{color:"white"}}>
        <Grid item xs={12} md={6} >
          <Typography variant="subtitle1" color="textSecondary" sx={{fontFamily:'Poppins'}} >Date Created {audioDate}</Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{fontFamily:'Poppins'}} ><b>Title: {audiotitle}</b></Typography>
        </Grid>
        
        <Grid item xs={12} md={3} container justifyContent="flex-end">
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%' }} aria-label="Download">
            <GetAppIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%', marginLeft: 2 }} aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%', marginLeft: 2 }} aria-label="Save">
            <SaveIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 3, backgroundColor: theme.palette.divider }} />
      {entries.length > 0 && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom sx={{fontFamily:'Poppins'}}>
              Transcript:
            </Typography>
            <Typography variant="body1" sx={{fontFamily:'Poppins'}}>
              {entries[0].Translation}
            </Typography>
          </Box>
        )}
      
      <Box id="audiobox" mt={3}>
        <AudioPlayerComponent audioSrc={audioSource}/>
      </Box>
    </Box>
    </Paper>
  );
}

export default ViewttsAudioComponent;
