import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Paper, Grid, Modal, FormControl, InputLabel, Select, MenuItem,OutlinedInput, Stack, Card, CardContent } from "@mui/material";
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import downloadbtn from "../assets/download.png"
import Summarizebtn from "../assets/summary.png";
import record from '../assets/record.png'
import stop from '../assets/stop.png'


const languages = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Ateso", code: "at" },
  { name: "Acholi", code: "ach" },
  { name: "Lugbara", code: "lgg" },
  { name: "Runyankore", code: "nyn" },
  { name: "Swahili", code: "sw" },
  { name: "French", code: "fr" },
  { name: "Swahili", code: "sw" },
  { name: "Kinyarwanda", code: "rw" },

];

const LiveStreamComponent = () => {
  const [websocket, setWebsocket] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [displayedTranscription, setDisplayedTranscription] = useState("");
  const [modalOpen, setModalOpen] = useState(true);
  const [speakLanguage, setSpeakLanguage] = useState('');
  const [transcribeLanguages, setTranscribeLanguages] = useState([]);

  const mediaRecorderRef = useRef(null);
  const transcriptBoxRef = useRef(null);
  const websocketRef = useRef(null);
  const intervalIdRef = useRef(null);

  const startRecording = async () => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      websocketRef.current = new WebSocket("ws://127.0.0.1:5000/transcribe");

      websocketRef.current.onopen = async () => {
        console.log("WebSocket connected");
        const langSettings = {
          speakLanguage: speakLanguage
        };
        websocketRef.current.send(JSON.stringify(langSettings));

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
              websocketRef.current.send(e.data);
            }
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);
          intervalIdRef.current = setInterval(() => {
            console.log("Restarting recording");
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.start();
          }, 2000);
        } catch (err) {
          console.error("Error starting recording:", err);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };

      websocketRef.current.onmessage = (event) => {
        console.log("Received message:", event.data);
        setTranscription((prevTranscription) => prevTranscription + " " + event.data);
        transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
      };
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(intervalIdRef.current);
    }
  };

  const downloadTranscription = () => {
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    a.click();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (transcription.length > displayedTranscription.length) {
        setDisplayedTranscription(transcription.substring(0, displayedTranscription.length + 1));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [transcription, displayedTranscription]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (websocketRef.current) websocketRef.current.close();
    };
  }, []);

  const handleTranscribeLanguageChange = (event) => {
    const {
      target: { value },
    } = event;
    setTranscribeLanguages(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box sx={{ margin: 'auto', maxWidth: '80%' }}>
      <Card sx={{ minWidth: 300, boxShadow: 3, borderRadius: 2, position: 'relative', padding: '16px', mb: 4 }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography sx={{ fontSize: 14, fontFamily: 'Poppins' }} color="text.secondary" gutterBottom>
                RealTime Transcription Overview
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontFamily: 'Poppins' }}>
                Real Voice Transformation Services
              </Typography>
              <Typography variant="body2" sx={{ mt: 1.5, fontFamily: 'Poppins' }}>
                A-Voices performs voice transcription into various Ugandan languages, enabling easy download of these transcriptions. <br />It's designed to improve engagement and understanding across diverse local communities.
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={startRecording} disabled={isRecording} sx={{ boxShadow: 1, fontFamily: 'Poppins', mr: 1 }}>
              <img src={record} style={{width: 20, height:20}}/>
                Start Recording
              </Button>
              <Button variant="contained" color="secondary" onClick={stopRecording} disabled={!isRecording} sx={{ boxShadow: 1, fontFamily: 'Poppins' }}>
              <img src={stop} style={{width: 20, height:20}}/>
                Stop Recording
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={12} md={12}>
          <Box id="record" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Button variant="outlined" onClick={downloadTranscription} sx={{ mr: 1 }}>
                <img src={downloadbtn} style={{width: 20, height:20}}/>
                 Download Transcription
              </Button>
              <Button variant="outlined">
              <img src={Summarizebtn} style={{width: 20, height:20}}/>
                Summarize Transcription
              </Button>
            </Box>
            <Paper
              elevation={3}
              sx={{
                maxHeight: 500,
                width: '100%',
                maxWidth: '100%',
                overflowY: 'auto',
                padding: 4,
                height: 400,
                mt: 10,
                fontFamily: 'monospace',
                backgroundColor: 'gray',
                borderRadius: 2
              }}
              ref={transcriptBoxRef}
            >
              <Typography variant="body2" align="left" sx={{ fontFamily: 'Poppins' }}>
                {displayedTranscription}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="language-selection-modal-title"
        aria-describedby="language-selection-modal-description"
        closeAfterTransition
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            minWidth: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: 'none',
          }}
        >
          <Typography id="language-selection-modal-title" variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            Choose Your Languages
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Select the language you'll be speaking and the languages you want to transcribe to.
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="speak-language-label">Speak Language</InputLabel>
              <Select
                labelId="speak-language-label"
                id="speak-language"
                value={speakLanguage}
                onChange={(event) => setSpeakLanguage(event.target.value)}
                startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />}
                input={<OutlinedInput label="Speak Language" startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />} />}
              >
                {languages.map((language) => (
                  <MenuItem key={language.code} value={language.code}>
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={handleCloseModal} sx={{ textTransform: 'none', fontWeight: 'medium' }}>
              Start Transcription
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default LiveStreamComponent;
