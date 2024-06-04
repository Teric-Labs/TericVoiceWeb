import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

  const AudioCard = ({ title, language, audioData }) => {
  const theme = useTheme(); 
  const [audioUrl, setAudioUrl] = useState('');

  
  useEffect(() => {
    if (!audioData) return;

    // Decode the base64 audio data
    const audioBytes = atob(audioData);
    const audioArray = new Uint8Array(audioBytes.length);
    for (let i = 0; i < audioBytes.length; i++) {
      audioArray[i] = audioBytes.charCodeAt(i);
    }

    // Create a Blob from the audio array
    const blob = new Blob([audioArray], { type: 'audio/wav' });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    // Clean up the URL when the component unmounts
    return () => URL.revokeObjectURL(url);
  }, [audioData]);

  return (
    <Card sx={{
      minWidth: 275,
      margin: '20px',
      boxShadow: theme.shadows[3],
      transition: '0.3s',
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
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          px: 2,
          py: 1,
          color: '#121212',
          marginBottom: '20px',
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography sx={{ marginBottom: 2, color: 'grey' }}>
          Language: {language}
        </Typography>
        {audioUrl && <AudioPlayer src={audioUrl} autoPlay onPlay={e => console.log("onPlay")} />}
      </CardContent>
    </Card>
  );
};

export default AudioCard;
