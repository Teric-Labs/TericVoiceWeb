import React, { useState, createContext, useContext } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Container,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  Chip
} from '@mui/material';
import { 
  Google as GoogleIcon,
  Mic as MicIcon,
  Transform as TransformIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  KeyboardVoice as KeyboardVoiceIcon
} from '@mui/icons-material';
import CarouselComponent from "./CarouselComponent";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const Welcome = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [user, setUser] = useState({ username: '', userId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const features = [
    { 
      icon: <MicIcon />, 
      title: "Natural Voice", 
      description: "Studio-quality African voice synthesis" 
    },
    { 
      icon: <TransformIcon />, 
      title: "Real-time Translation", 
      description: "Support for 8+ African languages" 
    },
    { 
      icon: <SpeedIcon />, 
      title: "Fast Processing", 
      description: "Lightning-quick voice generation" 
    },
  ];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({ username: user.displayName, userId: user.uid });
      localStorage.setItem('user', JSON.stringify({ 
        username: user.displayName, 
        userId: user.uid 
      }));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in. Please try again.');
      console.error("Error during Google Sign-In:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(100, 181, 246, 0.05))',
    }}>
      <Container maxWidth="xl" sx={{ minHeight: '100vh' }}>
        <Grid container sx={{ minHeight: '100vh' }}>
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              p: { xs: 2, md: 6 },
              position: 'relative'
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <KeyboardVoiceIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '2.8rem' }
                  }}
                >
                  AFRICAN VOICES
                </Typography>
              </Stack>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  maxWidth: '600px'
                }}
              >
                Break language barriers with Africas leading AI voice platform
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
                <Chip 
                  icon={<PublicIcon />} 
                  label="8+ African Languages" 
                  sx={{ backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }} 
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Enterprise Security" 
                  sx={{ backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }} 
                />
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: '28px',
                  fontSize: '1.1rem',
                  fontWeight: 600,

                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                  },
                  minWidth: '100%'
                }}
              >
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <IconButton
                        sx={{
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          mb: 1,
                          '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' },
                          color: '#1976d2'
                        }}
                      >
                        {feature.icon}
                      </IconButton>
                      <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 4, 
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Paper>
          </Grid>

          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: { xs: 2, md: 6 }
            }}
          >
            <Box 
              sx={{
                width: '100%',
                height: '100%',
                maxWidth: '600px',
                borderRadius: '24px',
                overflow: 'hidden',
                
              }}
            >
              <CarouselComponent />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Welcome;