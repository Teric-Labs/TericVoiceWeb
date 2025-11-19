import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SpeechToSpeechForm from "./SpeechToSpeechForm";
import VoxTransTable from "./VoxTransTable";

const VoiceLingoComponent = () => {
    const [isTableVisible, setIsTableVisible] = useState(false);
    const theme = useTheme();
    
    const handleToggleTableVisibility = () => {
      setIsTableVisible(!isTableVisible);
    };

    return (
      <>
        <SpeechToSpeechForm />
        <Box sx={{ mt: 4, px: 2 }}>
          <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' } }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />} 
              onClick={handleToggleTableVisibility} 
              sx={{ backgroundColor: theme.palette.action.hover }}
            >
              <Typography variant="h6" sx={{fontFamily:'Poppins'}}>View Translations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isTableVisible && <VoxTransTable/>}
            </AccordionDetails>
          </Accordion>
        </Box>
      </>
    );
}

export default VoiceLingoComponent;