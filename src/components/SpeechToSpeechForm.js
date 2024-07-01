import React, { useState,useEffect,useRef } from 'react';
import { Container, Step, StepLabel, Stepper, Button, Select, MenuItem, FormControl,Paper, Divider,Typography, Box, Grid, Card, CardContent,InputLabel, Chip, OutlinedInput, IconButton, keyframes,useTheme,} from '@mui/material';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AudioCard from './AudioCard';
import TranslateCard from './TranslateCard';
const languages = [
    { name: "English", code: "en" },
    { name: "Luganda", code: "lg" },
    { name: "Ateso", code: "at" },
    { name: "Acholi", code: "ac" },
    { name: "Lugbara", code: "lgg" },
    { name: "Runyankore", code: "nyn" },
    { name: "Swahili", code: "sw" } 
  ];
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
const SpeechToSpeechForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [targetLanguages, setTargetLanguages] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [websocketResults, setWebsocketResults] = useState({transcription: "",translations: [],});

    const mediaRecorderRef = useRef(null);
    const websocketRef = useRef(null);
    const intervalIdRef = useRef(null);

    const theme = useTheme();

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleTargetLanguageChange = (event) => {
        const {
            target: { value },
        } = event;
        setTargetLanguages(typeof value === 'string' ? value.split(',') : value);
    };


    const handleNext = () => {
        if(activeStep ===0){
            console.log("Selected Source Language:", selectedLanguage);
            console.log("Selected Target Languages:", targetLanguages);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const startRecording = async () => {
       if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
            websocketRef.current = new WebSocket("ws://127.0.0.1:8080/vocalcode");  
            websocketRef.current.onopen = async () => {
                console.log("WebSocket connected");
                const langSettings = {
                        sourceLanguage: selectedLanguage,
                        targetLanguages: targetLanguages,
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
                      }, 10000);
                } catch (err) {
                    console.error("Error starting recording:", err);
                }
            };

            websocketRef.current.onerror = (error) => {
                console.error("WebSocket Error: ", error);
            };

            websocketRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    setWebsocketResults({
                        transcription: data.transcription || "",
                        translation: data.translation || "",
                        audioData: data.audio_data || "",
                    });
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
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


    
      useEffect(() => {
        return () => {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
            if (websocketRef.current) websocketRef.current.close();
        };
    }, []);

    return (
        <Paper elevation={3} sx={{padding:4}}>
             <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom:'20px' }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, fontFamily:'Poppins' }} color="text.secondary" gutterBottom>
              Voice-To-Voice Transcription Overview
            </Typography>
            <Typography variant="h5" component="div" sx={{fontFamily:'Poppins'}}>
              End-To-End Voice Translation Services
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5, fontFamily:'Poppins' }}>
            A-Voices peforms end to end voice to voice translation into various Ugandan languages, enabling easy download of these transcriptions. <br/>It's designed to improve engagement and understanding across diverse local communities.          </Typography>
          </CardContent>
        </Card>
        <Container>
            <Stepper activeStep={activeStep} sx={{ paddingBottom: '5px', paddingTop:'20px', marginTop:'10px'}}>
                <Step>
                    <StepLabel sx={{fontFamily:'Poppins'}}>Select Source Language</StepLabel>
                </Step>
                <Step>
                    <StepLabel sx={{fontFamily:'Poppins'}}>Select Target Language</StepLabel>
                </Step>
            </Stepper>
            <div>
                {activeStep === 0 && (
                    <Box>
                       <Box p={4} id="icons">
                       <Card sx={{
                            border: '2px dotted #ccc',
                            margin: 'auto',
                            maxWidth: 600, 
                            borderRadius: '8px', 
                            boxShadow: '0 8px 16px rgba(0,0,0,0.5)', 
                        }}>
                        <CardContent>
                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                <GraphicEqIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                                <Typography variant="subtitle1" sx={{ mt: 1,fontFamily:'Poppins' }}>
                                Speak
                                </Typography>
                            </Grid>
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                <TranslateIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                                <Typography variant="subtitle1" sx={{ mt: 1 , fontFamily:'Poppins'}}>
                                Translate
                                </Typography>
                            </Grid>
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                <VolumeUpIcon sx={{ fontSize: 40, color: '#ff9800' }} /> 
                                <Typography variant="subtitle1" sx={{ mt: 1, fontFamily:'Poppins' }}>
                                Hear
                                </Typography>
                            </Grid>
                            </Grid>
                        </CardContent>
                        </Card>
                    </Box>
                    <Box sx={{ padding: 4, alignItems: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Grid container spacing={2} sx={{
                            borderRadius: '30px', 
                            padding: '10px', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: '800px', 
                            margin: 'auto'
                        }}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'white',fontFamily:'Poppins' }}>Source Language</InputLabel>
                                    <Select
                                        value={selectedLanguage}
                                        onChange={handleLanguageChange}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language.code} value={language.code} sx={{fontFamily:'Poppins'}}>
                                                {language.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'white', fontFamily:'Poppins' }}>Target Languages</InputLabel>
                                    <Select
                                        multiple
                                        value={targetLanguages}
                                        onChange={handleTargetLanguageChange}
                                        input={<OutlinedInput label="Target Languages" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} sx={{fontFamily:'Poppins'}} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language.code} value={language.code} sx={{fontFamily:'Poppins'}}>
                                                {language.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    </Box>
                )}
                {activeStep === 1 && (
                    <Box p={4}>
                       <Box>
                       <Card sx={{
                                minWidth: 275,
                                margin: '20px',
                                boxShadow: theme.shadows[3],
                                transition: '0.3s',
                                border: '2px dotted #ccc',
                                '&:hover': {
                                    boxShadow: theme.shadows[5]
                                }
                                }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2 }}>
                                        <IconButton color="primary" sx={{  '&:hover': { animation: `${pulse} 1s infinite` } }} onClick={startRecording} disabled={isRecording}>
                                            <MicIcon fontSize="large" />
                                        </IconButton>
                                        <IconButton color="primary" sx={{  '&:hover': { animation: `${pulse} 1s infinite` } }}>
                                            <PlayArrowIcon fontSize="large" />
                                        </IconButton>
                                        <IconButton color="primary" sx={{ '&:hover': { animation: `${pulse} 1s infinite` } }} onClick={stopRecording} disabled={!isRecording}>
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
                       </Box>
                       <Box>
                            <Box>
                                <TranslateCard
                                           title="Transcription"
                                            language={languages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
                                            translation={websocketResults.transcription}
                                        />
                            </Box>
                            <Divider/>
                            <Paper elevation={3} sx={{padding:2, margin:'auto'}}>
                            <Box >
                                <Grid container spacing={2}>
                                        <React.Fragment >
                                            <Grid item xs={12} sm={6}>
                                            <TranslateCard
                                            title="Translation"
                                            language={languages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
                                            translation={websocketResults.translation}
                                        />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                            <AudioCard
                                                    title={`Translation Audio (${languages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage})`}
                                                    language={languages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
                                                    audioData={websocketResults.audioData}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                </Grid>
                            </Box>
                            </Paper>
                       </Box>
                    </Box>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                <Button variant="contained" onClick={handleNext}>{activeStep === 1 ? 'Finish' : 'Next'}</Button>
                </div>
            </div>
        </Container>
        </Paper>
    );
};

export default SpeechToSpeechForm;