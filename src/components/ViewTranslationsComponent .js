import React,{useEffect,useState} from "react";
import { Box, Typography, Grid, Divider,IconButton, Paper, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";


const ViewTranslationsComponent = ({ translationId }) => {
  const [entries, setEntries] = useState([]);
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/get_translation';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: translationId });
        setEntries(response.data.entries);
        if (response.data.entries.length > 0) {
          setScriptDate(response.data.entries[0].Date)
          setScriptTitle(response.data.entries[0].title)
        }
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };

    fetchEntries();
  }, [translationId]);
  const theme = useTheme();

  return (
    <Paper elevation={4} sx={{marginTop:'20px', marginX:'20px'}}>
    <Box p={4} sx={{ margin: 'auto' }}>
      <Grid container spacing={3} alignItems="center" sx={{color:"white"}}>
        <Grid item xs={12} md={6} >
          <Typography variant="subtitle1" color="textSecondary" sx={{fontFamily:'Poppins'}} >Date Created: {scriptDate}</Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{fontFamily:'Poppins'}} ><b>Title: {scriptTitle}</b></Typography>
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
              Transcript{entries[0].sourceLanguage}:
            </Typography>
            <Typography variant="body1" sx={{fontFamily:'Poppins'}}>
              {entries[0].Original_transcript}
            </Typography>
          </Box>
        )}
      {entries.length > 0 && Object.entries(entries[0].Translations).map(([language, translation], index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography sx={{fontFamily:'Poppins'}}>{language.toUpperCase()}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{fontFamily:'Poppins'}}>
                {translation}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

    </Box>
    </Paper>
  );
}

export default ViewTranslationsComponent;
