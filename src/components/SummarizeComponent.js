import React, { useState, useEffect } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme, Card, CardContent, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SummarizationCard from "./SummarizationCard";
import SummaryTable from "./SummaryTable";

const SummarizeComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(true);
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
      console.log(user.userId);
    }
  }, []);

  return (
    <Box sx={{ margin: 'auto', maxWidth: '1200px', p: 2 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: theme.palette.text.secondary }}>
                Text Summarization Overview
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
              <SummarizationCard />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Accordion
        sx={{ boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }}
        expanded={isTableVisible}
        onChange={handleToggleTableVisibility}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: theme.palette.action.hover }}>
          <Typography variant="h6" sx={{ fontFamily: 'Poppins' }}>View Summarizes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SummaryTable />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default SummarizeComponent;
