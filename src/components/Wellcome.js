import React from "react";
import { Box, Typography, Grid,Paper } from '@mui/material';
import wrk from '../assets/microphone.png';
import '../App.css';
import SignInComponent from "./SignInComponent";
import CarouselComponent from "./CarouselComponent";

const Welcome = () => {
  return (
    <Box id="main" sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    }}>
      <Grid container sx={{ height: '100%', width: '100%' }}>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box>
          <Paper elevation={3} sx={{
              width: '98%',
              mb:5,
              padding:'4px',
              fontFamily: 'Poppins',
              bgcolor: 'background.paper'}}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' ,fontFamily: 'Poppins', padding:'8px'}}>
              GET STARTED WITH AFRICAN VOICES
            </Typography>
           
          </Paper>
            <SignInComponent />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CarouselComponent />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Welcome;
