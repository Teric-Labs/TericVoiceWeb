import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, Grid, Tooltip, Paper, LinearProgress, Snackbar } from '@mui/material';
import wrk from '../assets/microphone.png';
import axios from 'axios';

const useStyles = styled((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  audioContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  audioPlayer: {
    display: 'block',
    margin: '0 auto',
  },
  gridContainer: {
    padding: theme.spacing(3),
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 80,
    color: 'blue',
  },
  instructions: {
    marginLeft: theme.spacing(2),
    textAlign: 'left',
    fontFamily: 'Poppins',
    fontSize: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    fontFamily: 'Poppins',
  },
}));

const RecordingAudioComponent = () => {
  const classes = useStyles();
  const [language, setLanguage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorder = useRef(null);
  const audioPlayer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [user, setUser] = useState({ username: '', userId: '' });
  const apiEndpoint = 'https://teric-asr-api-wlivbm2klq-ue.a.run.app/upload_recorded_audio/';

  const languageOptions = [
    { label: 'Luganda', value: 'lg' },
    { label: 'English', value: 'en' },
    { label: 'Ateso', value: 'at' },
    { label: 'Lumasaaba', value: 'lm' },
    { label: 'Acholi', value: 'ac' },
    { label: "Swahili", value: 'sw' },
    { label: 'Runyankore', value: 'nyn' },
  ];

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleRecordingStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks = [];

      recorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onloadend = () => {
          const arrayBuffer = reader.result;
          setAudioBlob(arrayBuffer);
        };
        setAudioURL(URL.createObjectURL(blob));
        console.log(`Recording stopped. Blob size: ${blob.size} bytes`);
      });

      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleRecordingStop = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const handleDiscardRecording = () => {
    setAudioBlob(null);
    setAudioURL(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleSubmit = async () => {
    if (audioBlob) {
      setLoading(true);
      const formData = new FormData();
      formData.append('source_lang', language);
      formData.append('target_langs', [language]);  // Update here
      formData.append('recorded_audio', new Blob([audioBlob], { type: 'audio/webm' }));
      formData.append('user_id', user.userId);

      try {
        const response = await axios.post(apiEndpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false);
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 5000);
      } catch (error) {
        setLoading(false);
        console.error('Error submitting audio:', error);
      }
    }
  };

  const handlePlayRecording = () => {
    if (audioURL) {
      audioPlayer.current.play();
    }
  };

  return (
    <Paper elevation={2} sx={{ margin: '10px' }}>
      <Box className={classes.gridContainer} sx={{ p: 2, justifyItems: 'center', display: 'flex', margin: 'auto' }}>
        {loading && <LinearProgress />}
        <Snackbar
          open={showBanner}
          autoHideDuration={6000}
          onClose={() => setShowBanner(false)}
          message="Transcription is complete"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: 14, fontFamily: 'Poppins' }}>
              Record Audio and Transcribe [Realtime]
            </Typography>
            <Box sx={{ p: 2 }}>
              <FormControl className={classes.formControl} sx={{ width: '60%' }}>
                <InputLabel id="language-label">Select Language you're going to Speak</InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  {languageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontFamily: 'Poppins' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ p: 2 }}>
              <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
                <Button
                  variant="outlined"
                  color={isRecording ? 'secondary' : 'primary'}
                  className={classes.button}
                  sx={{ width: '60%', fontFamily: 'Poppins' }}
                  onClick={isRecording ? handleRecordingStop : handleRecordingStart}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <img src={wrk} alt="Recording audio" style={{ width: 150, height: 150 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className={classes.instructions}>
                  <Typography className={classes.instructionsTitle} sx={{ fontSize: 14, fontFamily:'Poppins' }}>Instructions:</Typography>
                  <Typography sx={{ fontSize: 10, fontFamily:'Poppins' }}>1. Tap the "Start Recording" button to begin.</Typography>
                  <Typography sx={{ fontSize: 10, fontFamily:'Poppins' }}>2. Once you finish, tap the "Stop Recording" button.</Typography>
                  <Typography sx={{ fontSize: 10, fontFamily:'Poppins' }}>3. The "Play", "Discard", and "Submit" buttons will appear.</Typography>
                  <Typography className={classes.instructionsTitle} sx={{ fontSize: 14, fontFamily:'Poppins' }}>
                    Buttons:
                  </Typography>
                  <Typography sx={{ fontSize: 10, fontFamily:'Poppins' }}>• Play: Listen to your recording.</Typography>
                  <Typography sx={{ fontSize: 10, fontFamily:'Poppins' }}>• Discard: Delete the recording if you are not satisfied.</Typography>
                  <Typography sx={{ fontSize: 10, fontFamily:'Poppins' }}>• Submit: Upload your recording.</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box className={classes.audioContainer} sx={{display: 'flex', justifyContent: 'left', justifyItems: 'center', width:'80%' }}>
              {audioURL && (
                <audio ref={audioPlayer} src={audioURL} controls className={classes.audioPlayer} sx={{width:'100%'}} />
              )}
            </Box>
            <Box className={classes.buttonGroup} sx={{ p:1, display: 'flex', justifyContent: 'left', justifyItems: 'center' }}>
              {audioBlob && (
                <>
                  <Tooltip title="Play Recording">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      sx={{ margin: 2 }}
                      onClick={handlePlayRecording}
                    >
                      Play
                    </Button>
                  </Tooltip>
                  <Tooltip title="Discard Recording">
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ margin: 2 }}
                      className={classes.button}
                      onClick={handleDiscardRecording}
                    >
                      Discard
                    </Button>
                  </Tooltip>
                  <Tooltip title="Submit Recording">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ margin: 2 }}
                      className={classes.button}
                      onClick={handleSubmit}
                      disabled={!audioBlob || loading}
                    >
                      Submit
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RecordingAudioComponent;
