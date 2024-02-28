import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Paper,Grid,Modal,FormControl, InputLabel, Select, MenuItem,Chip, OutlinedInput ,Stack,useTheme,Card,CardContent } from "@mui/material";
import microphone from "../assets/microphone.png";
import CustomPanel from "./CustomPanel";
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
const languages = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Ateso", code: "at" },
  { name: "Acholi", code: "ac" },
  { name: "Lugbara", code: "lgg" },
  { name: "Runyankore", code: "nyn" },
  { name: "Swahili", code: "sw" } 
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
  const intervalIdRef = useRef(null)

  

  const startRecording = async () => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
         websocketRef.current = new WebSocket("wss://tericwebsocket-wlivbm2klq-uc.a.run.app/transcribe");
         
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
    <Box p={3} sx={{ maxWidth: '1200px', margin: 'auto' }}>
       <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom:'20px' }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              RealTime  Transcription Overview
            </Typography>
            <Typography variant="h5" component="div">
              Real Voice Transformation Services
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
            A-Voices peforms voice transcription into various Ugandan languages, enabling easy download of these transcriptions. It's designed to improve engagement and understanding across diverse local communities.          </Typography>
          </CardContent>
        </Card>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={4} md={4}>
          <Paper elevation={3} sx={{padding:4, width:'100%'}}>
          <Box mb={3} display="flex" flexDirection="column" alignItems="center">
            <CustomPanel heading="Record" value="" imageUrl={microphone} />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={startRecording} disabled={isRecording} sx={{ boxShadow: 1 }}>
                Start Recording
              </Button>
              <Button variant="contained" color="secondary" onClick={stopRecording} disabled={!isRecording} sx={{ boxShadow: 1 }}>
                Stop Recording
              </Button>
            </Box>
          </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} md={8}>
          <Box id="record" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                maxHeight: 500,
                width: '100%',
                maxWidth: '100%',
                overflowY: 'auto',
                padding: 2,
                height:300,
                mt: 2,
                fontFamily: 'monospace',
                color:'white',
                backgroundColor: 'black',
                borderRadius: 2
              }}
              ref={transcriptBoxRef}
            >
              <Typography variant="body2" align="left">
                {displayedTranscription}
              </Typography>
            </Paper>
            <Button variant="outlined" onClick={downloadTranscription} sx={{ mt: 2 }}>
              Download Transcription
            </Button>
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
