import React, { useState } from 'react';
import { Container, Step, StepLabel, Stepper, Button, Select, MenuItem, FormControl,Paper, Divider,Typography, Box, Grid, Card, CardContent,InputLabel, Chip, OutlinedInput} from '@mui/material';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import TranslateIcon from '@mui/icons-material/Translate';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AudioCard from './AudioCard';
import TranslateCard from './TranslateCard';
import RecordComponent from './RecordComponent';
const languages = ['Acholi','Ateso','English','Luganda','Lugbra','Lumasaaba','Runyankore-Rukiga'];

const SpeechToSpeechForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [targetLanguages, setTargetLanguages] = useState([]);

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
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

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
                                            <MenuItem key={language} value={language}>
                                                {language}
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
                                            <MenuItem key={language} value={language}>
                                                {language}
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
                            <RecordComponent/>
                       </Box>
                       <Box>
                            <Box>
                                <TranslateCard 
                                            title="Example Translation" 
                                            language="Spanish" 
                                            translation="Esta es una traducción de ejemplo."
                                        />
                            </Box>
                            <Divider/>
                            <Paper elevation={3} sx={{padding:2, margin:'auto'}}>
                            <Box >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                    <TranslateCard 
                                        title="Example Translation" 
                                        language="Spanish" 
                                        translation="Esta es una traducción de ejemplo."
                                    />
                                    <TranslateCard 
                                        title="Example Translation" 
                                        language="Spanish" 
                                        translation="Esta es una traducción de ejemplo."
                                    />
                                      
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                    <AudioCard 
                                        title="Sample Audio" 
                                        language="English" 
                                        link="path_to_your_audio_file.mp3"/>
                                    <AudioCard 
                                        title="Sample Audio" 
                                        language="English" 
                                        link="path_to_your_audio_file.mp3"/>

                                    </Grid>
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
