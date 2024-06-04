import React from "react";
import { Box, Typography, Grid,Paper } from '@mui/material';
import MainComponent from "./MainComponent";
import '../App.css';
import AppBarComponent from "./AppBarComponent";
import FooterComponent from "./FooterComponent";

const LandingPage = () => {
  return (
    <Box>
      <AppBarComponent/>
      <MainComponent/>
      <FooterComponent/>
    </Box>
  );
}

export default LandingPage;
