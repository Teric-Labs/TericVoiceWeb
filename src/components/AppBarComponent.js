import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import wrk from "../assets/microphone.png";

const AppBarComponent = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <img src={wrk} alt="Website Logo" style={{ height: 40 }} />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: 'center', fontFamily: 'Poppins' }}
        >
          African Voices
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
          <Button color="inherit" variant="outlined" component={Link} to="/get-started" sx={{ fontFamily: 'Poppins', mx: 1 }}>
            Get Started
          </Button>
          <Button color="inherit" variant="outlined" component={Link} to="/pricing" sx={{ fontFamily: 'Poppins', mx: 1 }}>
            Pricing
          </Button>
          <Button color="inherit" component={Link} to="/documentation" sx={{ fontFamily: 'Poppins', mx: 1 }}>
            Documentation
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
