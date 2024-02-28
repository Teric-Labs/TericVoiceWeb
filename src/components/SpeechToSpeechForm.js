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
import RecordComponent from './RecordComponent';
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
    const [websocket, setWebsocket] = useState(null);
    const [transcription, setTranscription] = useState("");
    const [displayedTranslations, setDisplayedTranslations] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [displayedTranscription, setDisplayedTranscription] = useState("");
    const [websocketResults, setWebsocketResults] = useState({transcription: "",translations: [],});

    const mediaRecorderRef = useRef(null);
    const transcriptBoxRef = useRef(null);
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
            websocketRef.current = new WebSocket("wss://tericwebsocket-wlivbm2klq-uc.a.run.app/vocalcode");
            
            websocketRef.current.onopen = async () => {
                console.log("WebSocket connected");

                // Send language settings right after establishing the connection
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
                      }, 5000);
                } catch (err) {
                    console.error("Error starting recording:", err);
                }
            };

            websocketRef.current.onerror = (error) => {
                console.error("WebSocket Error: ", error);
            };

            websocketRef.current.onmessage = (event) => {
                console.log("Received message:", event.data);
                try {
                    const data = JSON.parse(event.data); // Attempt to parse JSON
                    setWebsocketResults(prevResults => ({
                        ...prevResults,
                        transcription: data.transcription,
                        translations: Object.entries(data.translations).map(([language, fullTranslation]) => ({
                            language,
                            fullTranslation,
                        })),
                    }));
                    setDisplayedTranslations(Object.entries(data.translations).map(([language, fullTranslation]) => ({
                        language,
                        displayedTranslation: "",
                    })));
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
        const timer = setInterval(() => {
            // Transcription
            if (websocketResults.transcription.length > displayedTranscription.length) {
                setDisplayedTranscription(prev => websocketResults.transcription.substring(0, prev.length + 1));
            }
    
            // Translations (existing logic)
            const newDisplayedTranslations = displayedTranslations.map(translation => {
                const fullTranslation = websocketResults.translations.find(t => t.language === translation.language)?.fullTranslation || "";
                return {
                    ...translation,
                    displayedTranslation: fullTranslation.substring(0, translation.displayedTranslation.length + 1),
                };
            });
    
            setDisplayedTranslations(newDisplayedTranslations);
        }, 50);
    
        return () => clearInterval(timer);
    }, [websocketResults, displayedTranscription, displayedTranslations]);
   

      useEffect(() => {
        if (transcriptBoxRef.current) {
            transcriptBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [websocketResults]);
    
    useEffect(() => {
        return () => {
          // Cleanup intervals and WebSocket on component unmount
          if (intervalIdRef.current) clearInterval(intervalIdRef.current);
          if (websocketRef.current) websocketRef.current.close();
        };
      }, []);

    return (
        <Paper elevation={3} sx={{padding:4}}>
             <Card sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, marginBottom:'20px' }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Voice-To-Voice Transcription Overview
            </Typography>
            <Typography variant="h5" component="div">
              End-To-End Voice Translation Services
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
            A-Voices peforms end to end voice to voice translation into various Ugandan languages, enabling easy download of these transcriptions. It's designed to improve engagement and understanding across diverse local communities.          </Typography>
          </CardContent>
        </Card>
        <Container>
            <Stepper activeStep={activeStep} sx={{ paddingBottom: '5px', paddingTop:'20px', marginTop:'10px'}}>
                <Step>
                    <StepLabel>Select Source Language</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Select Target Language</StepLabel>
                </Step>
            </Stepper>
            <div>
                {activeStep === 0 && (
                    <Box sx={{backgroundColor:'black'}}>
                       <Box p={4} id="icons">
                       <Card sx={{
                            backgroundColor: '#121212', 
                            color: '#fff', 
                            margin: 'auto',
                            maxWidth: 600, 
                            borderRadius: '8px', 
                            boxShadow: '0 8px 16px rgba(0,0,0,0.5)', 
                        }}>
                        <CardContent>
                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                <GraphicEqIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                Speak
                                </Typography>
                            </Grid>
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                <TranslateIcon sx={{ fontSize: 40, color: '#2196f3' }} />
                                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                Translate
                                </Typography>
                            </Grid>
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                <VolumeUpIcon sx={{ fontSize: 40, color: '#ff9800' }} /> 
                                <Typography variant="subtitle1" sx={{ mt: 1 }}>
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
                                    <InputLabel sx={{ color: 'white' }}>Source Language</InputLabel>
                                    <Select
                                        value={selectedLanguage}
                                        onChange={handleLanguageChange}
                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language.code} value={language.code}>
                                                {language.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'white' }}>Target Languages</InputLabel>
                                    <Select
                                        multiple
                                        value={targetLanguages}
                                        onChange={handleTargetLanguageChange}
                                        input={<OutlinedInput label="Target Languages" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )}
                                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)' }}
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language.code} value={language.code}>
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
                                backgroundColor: '#121212',
                                color: '#FFFFFF', 
                                '&:hover': {
                                    boxShadow: theme.shadows[5]
                                }
                                }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2 }}>
                                        <IconButton color="primary" sx={{ color: theme.palette.common.white, '&:hover': { animation: `${pulse} 1s infinite` } }} onClick={startRecording} disabled={isRecording}>
                                            <MicIcon fontSize="large" />
                                        </IconButton>
                                        <IconButton color="primary" sx={{ color: theme.palette.common.white, '&:hover': { animation: `${pulse} 1s infinite` } }}>
                                            <PlayArrowIcon fontSize="large" />
                                        </IconButton>
                                        <IconButton color="primary" sx={{ color: theme.palette.common.white, '&:hover': { animation: `${pulse} 1s infinite` } }} onClick={stopRecording} disabled={!isRecording}>
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
                                            translation={displayedTranscription}
                                        />
                            </Box>
                            <Divider/>
                            <Paper elevation={3} sx={{padding:2, margin:'auto'}}>
                            <Box >
                                <Grid container spacing={2}>
                                    {displayedTranslations.map(({ language, displayedTranslation }, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12} sm={6}>
                                                <TranslateCard
                                                    title={`Translation (${language.toUpperCase()})`}
                                                    language={languages.find(lang => lang.code === language)?.name || language}
                                                    translation={displayedTranslation}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <AudioCard
                                                    title={`Sample Audio (${languages.find(lang => lang.code === language)?.name || language})`}
                                                    language={languages.find(lang => lang.code === language)?.name || language}
                                                    link={`path_to_audio_file_for_${language}.mp3`}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
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