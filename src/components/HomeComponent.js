import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import uploadfiles from "../assets/uploadfile.png";
import microphone from "../assets/microphone.png";
import CustomCard from "./CustomeCard"

const HomeComponent = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{margin:5}}>
        Welcome to African Voices
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomCard heading="Upload" value="Convert Any Audio From Your Computer To Text Of Various Languages" imageUrl={uploadfiles} to="/transcribe"/>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomCard heading="Record" value="Record Your voice Using A-Voices Then Convert it To Text In Realtime" imageUrl={microphone} to="/livestream"/>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <CustomCard heading="Video Link" value="Transcribe Your Youtube Video to Texts Of Various Languages" imageUrl={uploadfiles}  to="/videostream" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeComponent;
