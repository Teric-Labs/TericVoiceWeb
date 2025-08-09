import React, { useState, createContext, useContext, useEffect } from "react";
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
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  Google as GoogleIcon,
  Mic as MicIcon,
  Transform as TransformIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  KeyboardVoice as KeyboardVoiceIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AutoGraph as AutoGraphIcon
} from '@mui/icons-material';
import CarouselComponent from "./CarouselComponent";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';

// Enhanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0px); 
  }
`;

const borderGlow = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

// Floating background elements
const FloatingElement = ({ size, position, delay, color = '#1976d2' }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}20, ${color}05)`,
      border: `1px solid ${color}15`,
      ...position,
      animation: `${float} ${3 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: delay,
      zIndex: 0,
    }}
  />
);

// Enhanced Feature Card
const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(25, 118, 210, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${slideUp} 0.6s ease-out forwards`,
      animationDelay: `${index * 0.2}s`,
      opacity: 0,
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
        borderColor: '#1976d2',
      },
    }}
  >
    <CardContent sx={{ p: 3, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(100, 181, 246, 0.05))',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          mb: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.3), rgba(100, 181, 246, 0.1))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            opacity: 0,
            animation: `${borderGlow} 2s ease-in-out infinite`,
            animationDelay: `${index * 0.3}s`,
          },
        }}
      >
        <Icon sx={{ fontSize: 40, color: '#1976d2' }} />
      </Box>
      <Typography variant="h6" sx={{ color: '#1976d2', mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.6 }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const Welcome = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [user, setUser] = useState({ username: '', userId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { 
      icon: MicIcon, 
      title: "Natural Voice", 
      description: "Studio-quality African voice synthesis with authentic accents and natural intonation" 
    },
    { 
      icon: TransformIcon, 
      title: "Real-time Translation", 
      description: "Support for 8+ African languages with instant translation capabilities" 
    },
    { 
      icon: SpeedIcon, 
      title: "Fast Processing", 
      description: "Lightning-quick voice generation and processing for seamless user experience" 
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
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating background elements */}
      <FloatingElement size="120px" position={{ top: '10%', left: '5%' }} delay="0s" />
      <FloatingElement size="80px" position={{ top: '60%', left: '10%' }} delay="1s" color="#64b5f6" />
      <FloatingElement size="100px" position={{ top: '20%', right: '15%' }} delay="0.5s" />
      <FloatingElement size="60px" position={{ bottom: '30%', right: '5%' }} delay="1.5s" color="#42a5f5" />
      <FloatingElement size="140px" position={{ bottom: '10%', left: '20%' }} delay="2s" />
      
      {/* Main gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="xl" sx={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
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
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #1976d2, #64b5f6, #1976d2)',
                  backgroundSize: '200% 200%',
                  animation: `${shimmer} 3s ease-in-out infinite`,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }}
                >
                  <KeyboardVoiceIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 50%, #0d47a1 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    animation: isVisible ? `${shimmer} 3s ease-in-out infinite` : 'none',
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  AFRICAN VOICES
                </Typography>
              </Stack>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 4,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                }}
              >
                Break language barriers with Africa's leading AI voice platform
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<PublicIcon />} 
                  label="8+ African Languages" 
                  sx={{ 
                    backgroundColor: 'rgba(25, 118, 210, 0.2)', 
                    color: '#1976d2',
                    fontWeight: 600,
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.6s',
                    opacity: 0,
                  }} 
                />
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Enterprise Security" 
                  sx={{ 
                    backgroundColor: 'rgba(25, 118, 210, 0.2)', 
                    color: '#1976d2',
                    fontWeight: 600,
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '0.8s',
                    opacity: 0,
                  }} 
                />
                <Chip 
                  icon={<TrendingUpIcon />} 
                  label="AI-Powered" 
                  sx={{ 
                    backgroundColor: 'rgba(25, 118, 210, 0.2)', 
                    color: '#1976d2',
                    fontWeight: 600,
                    animation: `${slideUp} 0.6s ease-out forwards`,
                    animationDelay: '1s',
                    opacity: 0,
                  }} 
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
                  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                    boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: '100%',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  animation: `${slideUp} 0.6s ease-out forwards`,
                  animationDelay: '1.2s',
                }}
              >
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <Divider sx={{ my: 4, borderColor: 'rgba(25, 118, 210, 0.1)' }} />

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 4, 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 1.4s',
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
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
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