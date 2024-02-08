import React,{useState} from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails,useTheme,Card,CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SynthesizeComponent from "./SynthesizeComponent";
import VideoTable from "./VideoTable";
const Text2SpeechComponent =()=>{
    const [isTableVisible, setIsTableVisible] = useState(false);
    const theme = useTheme();

  const handleToggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };
    return(   
        <Box p={3} sx={{ maxWidth: '1200px', margin: 'auto' }}>
            <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom:'20px' }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Audio Creation Overview
            </Typography>
            <Typography variant="h5" component="div">
              Text to Voice Services
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
            A-Voices converts documents into audios of various Ugandan languages, enabling easy download of these transcriptions. It's designed to improve engagement and understanding across diverse local communities.          </Typography>
          </CardContent>
        </Card>
             <Box container spacing={1}>
                <SynthesizeComponent/>
            </Box>
            <Box p={3}>
            <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleToggleTableVisibility} sx={{ backgroundColor: theme.palette.action.hover }}>
            <Typography variant="h6">View Generated Audios</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ width: '100%', padding: 2, margin:'auto', justifyContent:'center', display:'flex', backgroundColor:'black'}}>
            {isTableVisible && <VideoTable />}
            </AccordionDetails>
        </Accordion>
        </Box>
        </Box>
    )
}

export default Text2SpeechComponent;