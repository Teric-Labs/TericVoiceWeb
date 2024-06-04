import React from 'react';
import { Box, Typography, Grid, Paper, Chip, Stack } from '@mui/material';
import wrk from '../assets/voices.png';
import { keyframes } from '@emotion/react';

// Typing animation keyframes
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  from, to { border-color: transparent }
  50% { border-color: black }
`;

const MainComponent = () => {
    const modules = [
        "Real-Time Translation",
        "Audio Transcription",
        "Video Transcription",
        "Document Translation",
        "Text Summarization",
        "Speech to Speech Translation",
        "Text to Speech",
        "Translation APIs"
    ];

    return (
        <Box sx={{display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
        p: 4, 
        fontFamily: 'Poppins', 
        margin: 'auto' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            gutterBottom
                            sx={{
                                fontFamily: 'Poppins',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                borderRight: '.15em solid black',
                                animation: `${typing} 4s steps(40, end), ${blink} .75s step-end infinite`,
                            }}
                        >
                            AFRICAN VOICES <br/>PLATFORM
                        </Typography>
                        <Typography variant="h4" component="p" sx={{ fontFamily: 'Poppins' }}>
                            Unlock Africa's Language Diversity
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom sx={{ fontFamily: 'Poppins' ,px:2, py:2}}>
                            Break communication barriers effortlessly with our powerful tool.<br/>
                            Convert your audio, documents, and videos into any native African language and beyond. Connect with your audience across the continent like never before.
                        </Typography>
                        <Box id="modules" sx={{ padding: 1 }}>
                            <Stack direction="row" flexWrap="wrap" sx={{  paddingTop:'4px', marginTop:'4px'}} spacing={2}>
                                {modules.map((module, index) => (
                                    <Chip key={index} label={module} color="primary" variant="outlined" 
                                    sx={{ 
                                        fontFamily: 'Poppins',  
                                        marginTop:'8px'
                                    }} />
                                ))}
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="center">
                            <img src={wrk} alt="Voice services" style={{ maxWidth: '100%', height: 'auto' }} />
                        </Box>
                    </Grid>
                </Grid>
            
        </Box>
    );
};

export default MainComponent;
