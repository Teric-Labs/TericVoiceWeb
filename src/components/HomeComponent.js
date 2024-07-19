import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import voices from "../assets/voice.png";
import summary from "../assets/summary.png";
import CustomCard from "./CustomeCard";
import speech from "../assets/speech.png";
import usecase from "../assets/customize.png";
import translate from "../assets/translate.png";

const HomeComponent = () => {
  return (
    <Box p={3} sx={{ margin: 'auto', maxWidth: '1200px' }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: '20px', fontFamily: 'Poppins' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography sx={{ fontSize: 14, fontFamily: 'Poppins' }} color="text.secondary" gutterBottom>
            Platform Overview
          </Typography>
        </CardContent>
      </Card>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            heading="REAL-TIME AUDIO/VIDEO TRANSCRIPTION"
            value="Effortlessly convert audio (mp3, wav) files and YouTube videos into text in any language available on our platform, all in record time."
            imageUrl={voices}
            to="/real-time-audio-video-transcription"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            heading="DOCUMENT/TEXT TRANSLATION"
            value="Translate documents and text seamlessly into any language available on our platform, ensuring accuracy and speed for your needs."
            imageUrl={translate}
            to="/document-text-translation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            heading="TEXT-TO-SPEECH TRANSFORMATION/TRANSLATION"
            value="Transform and translate text to speech in any language available on our platform, delivering clear and accurate audio output."
            imageUrl={speech}
            to="/text-to-speech-transformation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            heading="REAL-TIME SPEECH-TO-SPEECH TRANSLATION"
            value="Convert and translate speech/audio seamlessly between languages with our platform, ensuring accurate and natural speech-to-speech translation."
            imageUrl={speech}
            to="/real-time-speech-to-speech-translation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            heading="TEXT/DOCUMENT SUMMARIZATION"
            value="Summarize lengthy documents quickly and accurately with our platform, delivering concise and essential information in just a few clicks."
            imageUrl={summary}
            to="/text-document-summarization"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            heading="USE-CASE SOLUTIONS AND CUSTOMIZATION"
            value="Tailor our services to your needs with customized solutions, addressing specific use-case scenarios efficiently and effectively in real-time."
            imageUrl={usecase}
            to="/use-case-solutions-customization"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeComponent;
