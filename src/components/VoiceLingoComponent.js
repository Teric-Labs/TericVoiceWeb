import React,{useState} from "react"
import { Box, Typography, Accordion, AccordionSummary,useTheme,Card,CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Voice2VoiceCard from "./Voice2VoiceCard"
import VoxTransTable from "./VoxTransTable";

const VoiceLingoComponent=()=>{
    const [isTableVisible, setIsTableVisible] = useState(false);
    const theme = useTheme();
    const handleToggleTableVisibility = () => {
      setIsTableVisible(!isTableVisible);
    };

    return(
        <Box p={3} sx={{ margin: 'auto' }}>
     
      <Card sx={{ minWidth: 300, boxShadow: 3, borderRadius: 2, position: 'relative', padding: '16px' }}>
          <CardContent>
          <Box sx={{ position: 'absolute', top: 16, right: 16 , width:'60%'}}>
          <Voice2VoiceCard />
            </Box>
            <Typography sx={{ fontSize: 14,fontFamily:'Poppins' }} color="text.secondary" gutterBottom>
             End to End Voice Translation Overview
            </Typography>
            <Typography variant="h5" component="div" sx={{fontFamily:'Poppins'}}>
              Voice to Voice Translation Services
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5,fontFamily:'Poppins' }}>
                End to End voice translation for both short and long audio and video extracted audios 
            </Typography>
          </CardContent>
        </Card>
      <Box p={3}>
      <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleToggleTableVisibility} sx={{ backgroundColor: theme.palette.action.hover }}>
          <Typography variant="h6" sx={{fontFamily:'Poppins'}}>View Translations</Typography>
        </AccordionSummary>
        <VoxTransTable/>
      </Accordion>
      </Box>
    </Box>

    )
}
export default VoiceLingoComponent