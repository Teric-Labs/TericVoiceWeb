import React, { useState,useEffect } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails,useTheme,Card,CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TranslationCard from "./TranslationCard";
import TranslationsTable from "./TranslationsTable";
const TranslationComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const theme = useTheme();
  const [user, setUser] = useState({ username: '', userId: '' });

  const handleToggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
     console.log(user.userId)
    }
  }, []);

  return (
    <Box sx={{margin: 'auto' }}>
     
      <Card sx={{ minWidth: 300, boxShadow: 3, borderRadius: 2, position: 'relative', padding: '16px' }}>
          <CardContent>
          <Box sx={{ position: 'absolute', top:20, right: 1 , width:'60%'}}>
          <TranslationCard />
          </Box>
            <Typography sx={{ fontSize: 14 , fontFamily:'Poppins'}} color="text.secondary" gutterBottom>
             Text Translation Overview
            </Typography>
            <Typography variant="h5" component="div" sx={{fontFamily:'Poppins'}}>
              Text Translation Services
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 , fontFamily:'Poppins'}}>
            A-Voices translates texts and text documents into various Ugandan languages, enabling easy download of these transcriptions. <br/>
            It's designed to improve engagement and understanding across diverse local communities.          </Typography>
          </CardContent>
        </Card>
        <Box p={3}>
      <Accordion sx={{ width: '100%', boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleToggleTableVisibility} sx={{ backgroundColor: theme.palette.action.hover }}>
          <Typography variant="h6" sx={{fontFamily:'Poppins'}}>View Translations</Typography>
        </AccordionSummary>
        <TranslationsTable/>
      </Accordion>
      </Box>
    </Box>
  );
}

export default TranslationComponent;
