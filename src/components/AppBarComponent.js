import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import wrk from "../assets/microphone.png";
import { Link } from 'react-router-dom';
const AppBarComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, justifyContent:'center', alignContent:'center' }}>
          <img src={wrk} alt="Website Logo" style={{ height: 40 }}/>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
          <Button color="inherit" variant='outlined' component={Link} to="/get-started" sx={{fontFamily: 'Poppins'}}>Get Started</Button>
          <Button color="inherit" sx={{fontFamily: 'Poppins'}}>Pricing</Button>
          <Button color="inherit" sx={{fontFamily: 'Poppins'}}>Documentation</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
