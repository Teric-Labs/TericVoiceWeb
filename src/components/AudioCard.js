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
      border: '1px solid rgba(232, 160, 32, 0.15)',
      backgroundColor: 'transparent',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      borderRadius: '16px',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(232, 160, 32, 0.08)',
        transform: 'translateY(-2px)',
      },
      '.rhap_container': {
        backgroundColor: 'transparent',
        color: '#111111',
        boxShadow: 'none',
        '.rhap_main-controls-button': {
          color: theme.palette.primary.main,
        },
        '.rhap_progress-bar': {
          backgroundColor: '#e2e8f0',
          '.rhap_progress-filled': {
            backgroundColor: theme.palette.primary.main,
          },
        },
        '.rhap_volume-bar': {
          backgroundColor: '#e2e8f0',
          '.rhap_volume-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
        },
      }
    }}>
      <CardContent>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'rgba(232, 160, 32, 0.1)',
          borderRadius: '20px',
          px: 2,
          py: 0.8,
          color: '#111111',
          marginBottom: '20px',
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {title}
          </Typography>
        </Box>
        <Typography sx={{ marginBottom: 2, color: 'text.secondary', fontSize: '0.85rem' }}>
          Language: {language}
        </Typography>
        {audioUrl && <AudioPlayer src={audioUrl} autoPlay onPlay={e => console.log("onPlay")} />}
      </CardContent>
    </Card>
  );
};

export default AudioCard;
