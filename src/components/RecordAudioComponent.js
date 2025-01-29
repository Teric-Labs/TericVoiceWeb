import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Paper,
  LinearProgress,
  Snackbar,
  Alert,
  Typography,
  useTheme
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LanguageIcon from '@mui/icons-material/Language';
import WaveSurfer from 'wavesurfer.js';
import axios from "axios";

const RecordingAudioComponent = () => {
  const theme = useTheme();
  const [language, setLanguage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const mediaRecorder = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const apiEndpoint = 'http://127.0.0.1:8000/upload_recorded_audio/';

  const languageOptions = [
    { label: 'Luganda', value: 'lg' },
    { label: 'English', value: 'en' },
    { label: 'Ateso', value: 'at' },
    { label: 'Acholi', value: 'ach' },
    { label: 'Swahili', value: 'sw' },
    { label: 'Runyankore', value: 'nyn' },
    { label: 'Kinyarwanda', value: 'rw' },
    { label: 'French', value: 'fr' },
  ];

  useEffect(() => {
    const waveSurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: theme.palette.grey[300],
      progressColor: theme.palette.primary.main,
      cursorColor: theme.palette.primary.dark,
      barWidth: 2,
      responsive: true,
      height: 100,
      barRadius: 3,
      normalize: true,
    });

    waveSurferInstance.on('play', () => setIsPlaying(true));
    waveSurferInstance.on('pause', () => setIsPlaying(false));
    
    setWaveSurfer(waveSurferInstance);

    return () => waveSurferInstance.destroy();
  }, [theme.palette]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleRecordingStart = async () => {
    if (!language) {
      setBannerMessage('Please select a language before recording');
      setShowBanner(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        waveSurfer.loadBlob(blob);
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
    } catch (error) {
      setBannerMessage('Error accessing microphone');
      setShowBanner(true);
    }
  };

  const handleRecordingStop = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayPause = () => {
    waveSurfer.playPause();
  };

  const handleDiscardRecording = () => {
    setAudioBlob(null);
    waveSurfer.empty();
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('source_lang', language);
    formData.append('recorded_audio', audioBlob);

    try {
      await axios.post(apiEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBannerMessage('Recording uploaded successfully!');
      handleDiscardRecording();
    } catch (error) {
      setBannerMessage('Failed to upload the recording.');
    } finally {
      setShowBanner(true);
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{
        p: 4,
        backgroundColor: 'white',
        borderRadius: 2,
        maxWidth: 1200,
        margin: 'auto'
      }}
    >
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          }} 
        />
      )}
      
      <Snackbar
        open={showBanner}
        autoHideDuration={6000}
        onClose={() => setShowBanner(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowBanner(false)}
          severity={bannerMessage.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {bannerMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Audio Recording Studio
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="language-label">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon fontSize="small" />
                Select Language
              </Box>
            </InputLabel>
            <Select
              labelId="language-label"
              value={language}
              onChange={handleLanguageChange}
              sx={{ 
                '& .MuiSelect-select': { 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }
              }}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4 
          }}>
            <Button
              variant="contained"
              color={isRecording ? "error" : "primary"}
              onClick={isRecording ? handleRecordingStop : handleRecordingStart}
              startIcon={isRecording ? <StopIcon /> : <MicIcon />}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.grey[50],
              borderRadius: 2
            }}
          >
            <Box ref={waveformRef} sx={{ mb: 3 }} />
            
            {audioBlob && (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="outlined"
                  onClick={handlePlayPause}
                  startIcon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
                  sx={{ minWidth: 130 }}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDiscardRecording}
                  startIcon={<DeleteOutlineIcon />}
                  sx={{ minWidth: 130 }}
                >
                  Discard
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={<CloudUploadIcon />}
                  sx={{ minWidth: 130 }}
                >
                  Upload
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecordingAudioComponent;