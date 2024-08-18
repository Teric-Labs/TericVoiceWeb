import React ,{useState}from "react";
import { Box, Typography,Card, CardContent,Tabs,Tab } from "@mui/material";
import DataTable from "./DataTable.js";
import VideoTable from "./VideoTable";
import TranslationsTable from "./TranslationsTable";
import SummaryTable from "./SummaryTable";
const History = () => {
  const [selectedTab,setSelectedTab] =useState(0)

  const handleChange  =(event, newValue) =>{
    setSelectedTab(newValue)
  }

  return (
    <Box p={3} sx={{ margin: 'auto',width:'100%' }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: '20px', fontFamily: 'Poppins' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography sx={{ fontSize: 14, fontFamily: 'Poppins' }} color="text.secondary" gutterBottom>
            Platform Overview
          </Typography>
        </CardContent>
      </Card>
      <Box>
        <Tabs value={selectedTab} onChange={handleChange} textColor="primary" variant="scrollable" scrollButtons="auto" aria-label="Platform Feature" sx={{marginBottom:2,fontFamily:'Poppins'}}>
            <Tab label="Voice-to-Text"/>
            <Tab label="Video Transcription"/>
            <Tab label="Text-to-Text"/>
            <Tab label="Text Summarization"/>
        </Tabs>
        <Box>
          {selectedTab === 0 &&(
            <Typography variant="body1" sx={{fontFamily:'Poppins',padding:2}}>
              <DataTable/>
            </Typography>
          )}
           {selectedTab === 1 &&(
            <Typography variant="body1" sx={{fontFamily:'Poppins',padding:2}}>
              <VideoTable/>
            </Typography>
          )}
           {selectedTab === 2 &&(
            <Typography variant="body1" sx={{fontFamily:'Poppins',padding:2}}>
              <TranslationsTable/>
            </Typography>
          )}
          {selectedTab === 3 &&(
            <Typography variant="body1" sx={{fontFamily:'Poppins',padding:2}}>
              <SummaryTable/>
            </Typography>
          )}
          
        </Box>

      </Box>
    </Box>
  );
};

export default History;
