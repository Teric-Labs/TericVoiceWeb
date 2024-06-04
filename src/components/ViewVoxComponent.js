import React,{useEffect,useState} from "react";
import { Box, Typography, Grid, Divider,IconButton, Paper, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import AudioPlayerComponent from "./AudioPlayerComponent";


const ViewVoxComponent = ({ voiceId }) => {
  const [entries, setEntries] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [audioDate, setAudioDate] = useState("");
  const [audioTarget,setAudioTarget] =useState("");
  const [translation,setTranslation] =useState("");
  const [texttitle,setTitle] =useState("");
  const [sourceLangauge,setSourceLanguage] =useState("");
  const [TargetLanguage,setTargetLanguage] =useState("");

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/get_vvoice_audio';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: voiceId });
        setEntries(response.data.entries);
        if (response.data.entries.length > 0) {
          setAudioSource(response.data.entries[0].source_file[0].audio_file_url);
          setAudioTarget(response.data.entries[0].audio_data);
          setAudioDate(response.data.entries[0].Date)
          setTranslation(response.data.entries[0].Translation)
          setTitle(response.data.entries[0].title)
          setSourceLanguage(response.data.entries[0].source_language)
          setTargetLanguage(response.data.entries[0].target_language)
        }
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };

    fetchEntries();
  }, [voiceId]);
  const theme = useTheme();

  return (
    <Paper elevation={4} sx={{marginTop:'20px', marginX:'20px'}}>
    <Box p={4} sx={{margin: 'auto' }}>
      <Grid container spacing={3} alignItems="center" sx={{color:"white"}}>
        <Grid item xs={12} md={6} >
          <Typography variant="subtitle1" color="textSecondary" sx={{fontFamily:'Poppins'}} >Date Created: {audioDate}</Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{fontFamily:'Poppins'}} >Date Created: {texttitle}</Typography>
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
              Original Audio
            </Typography>
            <AudioPlayerComponent audioSrc={audioSource}/>
          </Box>
        )}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography sx={{fontFamily:'Poppins'}}>{sourceLangauge} to {TargetLanguage}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{fontFamily:'Poppins'}}>
                {translation}
              </Typography>
            </AccordionDetails>
          </Accordion>
        
      <Box id="audiobox" mt={3}>
        <AudioPlayerComponent audioSrc={audioTarget}/>
      </Box>
    </Box>
    </Paper>
  );
}

export default ViewVoxComponent;
