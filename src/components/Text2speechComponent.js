import React, { useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SynthesizeComponent from "./SynthesizeComponent";
import TextTable from "./TextTable";

const Text2SpeechComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const theme = useTheme();

  const handleToggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <>
      <SynthesizeComponent />
      <Box sx={{ mt: 4 }}>
        <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleToggleTableVisibility} sx={{ backgroundColor: theme.palette.action.hover }}>
            <Typography variant="h6" sx={{fontFamily:'Poppins'}}>View Generated Audios</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: '100%', padding: 2, margin: 'auto', justifyContent: 'center', display: 'flex'}}>
            {isTableVisible && <TextTable />}
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}

export default Text2SpeechComponent;
