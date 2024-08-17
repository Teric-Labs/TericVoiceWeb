import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import wrk from '../assets/voices.png';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
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
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            minHeight: '100vh',
            fontFamily: 'Poppins',
        }}>
            <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ maxWidth: '90%' }}>
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
                            paddingBottom: 2,
                            textAlign: { xs: 'center', md: 'left' }
                        }}
                    >
                        AFRICAN VOICES <br />PLATFORM
                    </Typography>
                    <Typography variant="h4" component="p" sx={{ fontFamily: 'Poppins', marginBottom: 2, textAlign: { xs: 'center', md: 'left' } }}>
                        Unlock Africa's Language Diversity
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom sx={{ fontFamily: 'Poppins', px: 2, py: 2, textAlign: { xs: 'center', md: 'left' } }}>
                        Break communication barriers effortlessly with our powerful tool.<br />
                        Convert your audio, documents, and videos into any native African language and beyond. Connect with your audience across the continent like never before.
                    </Typography>
                    <Box id="modules" sx={{ padding: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
                        <Button
                            variant="contained"
                            component={Link} 
                            to="/get-started"
                            color="primary"
                            sx={{
                                fontFamily: 'Poppins',
                                padding: '10px 20px',
                                fontSize: '16px',
                                textTransform: 'none',
                                backgroundColor: '#007BFF',
                                '&:hover': {
                                    backgroundColor: '#0056b3',
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.3s ease-in-out',
                                },
                            }}
                        >
                            Get Started for Free
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            component={Link} 
                            to="/documentation"
                            sx={{
                                fontFamily: 'Poppins',
                                padding: '10px 20px',
                                fontSize: '16px',
                                textTransform: 'none',
                                borderColor: '#007BFF',
                                color: '#007BFF',
                                '&:hover': {
                                    borderColor: '#0056b3',
                                    color: '#0056b3',
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.3s ease-in-out',
                                },
                            }}
                        >
                            API Documentation
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display="flex" justifyContent="center">
                        <img src={wrk} alt="Voice services" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MainComponent;
