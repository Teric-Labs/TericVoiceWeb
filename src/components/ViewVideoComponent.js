import React,{useEffect,useState} from "react";
import { Box, Typography, Grid, Divider,IconButton, Paper, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import YouTubeVideoComponent from "./YouTubeVideoComponent";


const ViewVideoComponent =({audioId })=>{
    const [entries, setEntries] = useState([]);
  const [videoLink, setvideoLink] = useState("");

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:5000/get_audio_data/';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: audioId });
        setEntries(response.data.entries);
        if (response.data.entries.length > 0 && response.data.entries[0].Url.length > 0) {
          setvideoLink(response.data.entries[0].Url);
          console.log(videoLink)
        }
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };

    fetchEntries();
  }, [audioId]);
  const theme = useTheme();

    return(
        <Paper elevation={4} sx={{marginTop:'20px', marginX:'20px'}}>
        <Box p={4} sx={{ maxWidth: '1200px', margin: 'auto' }}>
            <Box sx={{justifyContent:'center', display:'flex', }}>
              <YouTubeVideoComponent videoUrl={videoLink}/>
            </Box>
            
          <Grid container spacing={3} alignItems="center" sx={{color:"white"}}>
            <Grid item xs={12} md={6} >
              <Typography variant="subtitle1" color="textSecondary" >27/01/2024 15:54</Typography>
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
                <Typography variant="h6" gutterBottom>
                  Original Transcript:
                </Typography>
                <Typography variant="body1">
                  {entries[0].Original_transcript}
                </Typography>
              </Box>
            )}
          {entries.length > 0 && Object.entries(entries[0].Translations).map(([language, translation], index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Typography>{language.toUpperCase()}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {translation}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
    
        </Box>
        </Paper>
    )
}

export default ViewVideoComponent ;