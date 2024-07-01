import React from 'react';
import { Card, CardContent, IconButton, Box, keyframes, Grid, useTheme } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GraphicEqIcon from '@mui/icons-material/GraphicEq'; // Represents the audio wave visually

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const RecordComponent = () => {
  const theme = useTheme();

  return (
    <Card sx={{
      minWidth: 275,
      margin: '20px',
      boxShadow: theme.shadows[3],
      transition: '0.3s',
      backgroundColor: '#121212', // Dark theme background
      color: '#FFFFFF', // White text color
      '&:hover': {
        boxShadow: theme.shadows[5]
      }
    }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2 }}>
              <IconButton color="primary" sx={{ color: theme.palette.common.white, '&:hover': { animation: `${pulse} 1s infinite` } }}>
                <MicIcon fontSize="large" />
              </IconButton>
              <IconButton color="primary" sx={{ color: theme.palette.common.white, '&:hover': { animation: `${pulse} 1s infinite` } }}>
                <PlayArrowIcon fontSize="large" />
              </IconButton>
              <IconButton color="primary" sx={{ color: theme.palette.common.white, '&:hover': { animation: `${pulse} 1s infinite` } }}>
                <PauseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }} id="audio">
              <GraphicEqIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RecordComponent;
