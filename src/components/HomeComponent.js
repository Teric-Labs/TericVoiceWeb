import React from "react";
import { Box, Typography, Grid,Card,CardContent } from "@mui/material";
import uploadfiles from "../assets/audio-headset.png";
import microphone from "../assets/microphone.png";
import multiplefiles from "../assets/files.png"
import CustomCard from "./CustomeCard";

const HomeComponent = () => {
  return (
    <Box p={3} sx={{ maxWidth: '1200px', margin: 'auto' }}>
      <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom:'20px' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Platform Overview
          </Typography>
          <Typography variant="h5" component="div">
            Language Translation Services
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            Our platform offers an innovative solution for translating text, audio, and live streams into the local languages of Uganda. Designed to bridge communication gaps, it serves as a vital tool for businesses and individuals looking to connect with a wider audience in their native languages. Experience seamless translation in real-time, enhancing accessibility and understanding across diverse communities.
          </Typography>
        </CardContent>
    </Card>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard 
            heading="Upload" 
            value="Convert Any Audio From Your Computer To Text Of Various Languages" 
            imageUrl={uploadfiles} 
            to="/transcribe" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard 
            heading="Record" 
            value="Record Your voice Using A-Voices Then Convert it To Text In Realtime" 
            imageUrl={microphone} 
            to="/livestream" 
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <CustomCard 
            heading="Video Link" 
            value="Transcribe Your Youtube Video to Texts Of Various Languages" 
            imageUrl={multiplefiles}  
            to="/videostream" 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeComponent;
