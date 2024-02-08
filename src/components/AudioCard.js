import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AudioCard = ({ title, language, link }) => {
  const theme = useTheme(); // Using the theme for potential theme-based styling

  return (
    <Card sx={{
      minWidth: 275,
      margin: '20px',
      boxShadow: theme.shadows[3],
      transition: '0.3s',
      backgroundColor: '#121212', // Dark background
      color: '#FFFFFF', // White text color
      '&:hover': {
        boxShadow: theme.shadows[5]
      },
      '.rhap_container': {
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        boxShadow: 'none',
        '.rhap_main-controls-button': {
          color: '#FFFFFF',
        },
        '.rhap_progress-bar': {
          backgroundColor: theme.palette.grey[800],
          '.rhap_progress-filled': {
            backgroundColor: '#FFFFFF',
          },
        },
        '.rhap_volume-bar': {
          backgroundColor: theme.palette.grey[800],
          '.rhap_volume-indicator': {
            backgroundColor: '#FFFFFF',
          },
        },
      }
    }}>
      <CardContent>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF', // White background for the oval
          borderRadius: '20px', // Oval shape
          px: 2, // Horizontal padding
          py: 1, // Vertical padding
          color: '#121212', // Black text for the title
          marginBottom: '20px', // Margin bottom for spacing
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography sx={{ marginBottom: 2, color: 'grey' }}>
          Language: {language}
        </Typography>
        <AudioPlayer
          src={link}
          onPlay={e => console.log("onPlay")}
          // Custom styling can be adjusted here if needed
        />
      </CardContent>
    </Card>
  );
};

export default AudioCard;
