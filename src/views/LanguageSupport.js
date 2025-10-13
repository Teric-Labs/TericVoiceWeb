import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Stack,
  Chip,
  Avatar,
  Divider,
  Alert,
  Fade,
  Zoom,
  Slide,
  alpha,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  CircularProgress
} from "@mui/material";
import { styled, keyframes } from '@mui/material/styles';
import LanguageMatrix from "../components/LanguageMatrix";
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import UpdateIcon from '@mui/icons-material/Update';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FlagIcon from '@mui/icons-material/Flag';

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

// Enhanced Stats Card
const StatsCard = ({ icon: Icon, title, value, description, color = '#1976d2', trend, index }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${alpha(color, 0.2)}`,
      borderRadius: '16px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${slideUp} 0.6s ease-out forwards`,
      animationDelay: `${0.1 * index}s`,
      opacity: 0,
      transform: 'translateY(30px)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: `0 12px 40px ${alpha(color, 0.3)}`,
        border: `1px solid ${alpha(color, 0.4)}`,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
            animation: `${pulse} 2s infinite`,
            animationDelay: `${0.2 * index}s`,
          }}
        >
          <Icon sx={{ fontSize: 28, color: 'white' }} />
        </Avatar>
        {trend && (
          <Chip
            icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            label={trend}
            size="small"
            sx={{
              backgroundColor: alpha('#4caf50', 0.1),
              color: '#4caf50',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold', color: color }}>
        {value}
      </Typography>
      <Typography variant="h6" component="div" sx={{ color: color, fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.4 }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

// Language Feature Card
const LanguageFeatureCard = ({ feature, languages, index }) => (
  <Card
    sx={{
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(25, 118, 210, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${slideUp} 0.6s ease-out forwards`,
      animationDelay: `${0.1 * index}s`,
      opacity: 0,
      transform: 'translateY(30px)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
        border: '1px solid rgba(25, 118, 210, 0.3)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
          }}
        >
          <TranslateIcon sx={{ color: 'white' }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 0.5 }}>
            {feature}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            {languages.length} languages supported
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {languages.slice(0, 4).map((lang) => (
          <Chip
            key={lang}
            label={lang}
            size="small"
            sx={{
              backgroundColor: alpha('#1976d2', 0.1),
              color: '#1976d2',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        ))}
        {languages.length > 4 && (
          <Chip
            label={`+${languages.length - 4} more`}
            size="small"
            sx={{
              backgroundColor: alpha('#1976d2', 0.05),
              color: '#1976d2',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>
    </CardContent>
  </Card>
);

// Coming Soon Languages Card
const ComingSoonCard = ({ languages, index }) => (
  <Card
    sx={{
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05), rgba(255, 193, 7, 0.05))',
      border: '1px solid rgba(255, 152, 0, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${slideUp} 0.6s ease-out forwards`,
      animationDelay: `${0.1 * index}s`,
      opacity: 0,
      transform: 'translateY(30px)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(255, 152, 0, 0.15)',
        border: '1px solid rgba(255, 152, 0, 0.3)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #ff9800, #ffc107)',
          }}
        >
          <ScheduleIcon sx={{ color: 'white' }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
            Coming Soon
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            {languages.length} languages in development
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {languages.map((lang) => (
          <Chip
            key={lang}
            label={lang}
            size="small"
            sx={{
              backgroundColor: alpha('#ff9800', 0.1),
              color: '#ff9800',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        ))}
      </Box>
    </CardContent>
  </Card>
);

const LanguageSupport = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const comingSoonLanguages = ['Hausa', 'Yoruba', 'Igbo', 'Amharic', 'Somali', 'Tigrinya', 'Oromo', 'Wolof'];

  const featureLanguages = {
    'Text Translation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Audio Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Video Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Text to Speech': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Voice to Voice': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Summarization': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#1976d2', mb: 3 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
            Loading Language Support...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      overflow: 'hidden',
      position: 'relative'
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
          background: 'radial-gradient(ellipse at center, rgba(25, 118, 210, 0.02) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          py: 2,
          px: 2,
          height: '100vh',
          overflow: 'auto',
          width: '100%',
          maxWidth: '100vw',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(25, 118, 210, 0.5)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(25, 118, 210, 0.7)',
            },
          },
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Fade in={isVisible} timeout={1000}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#1976d2',
                mb: 2,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              }}
            >
              Language Support Center
            </Typography>
          </Fade>
          <Fade in={isVisible} timeout={1500}>
            <Typography
              variant="h6"
              sx={{
                color: '#666666',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 500,
                mb: 3,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              }}
            >
              Comprehensive language support across all our AI-powered services
            </Typography>
          </Fade>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3,
          justifyContent: 'space-between'
        }}>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <StatsCard
              icon={LanguageIcon}
              title="Total Languages"
              value="15"
              description="Supported languages across our platform"
              color="#1976d2"
              trend="+2 this month"
              index={0}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <StatsCard
              icon={TranslateIcon}
              title="Translation Services"
              value="8"
              description="Different translation and processing services"
              color="#4caf50"
              trend="100% coverage"
              index={1}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <StatsCard
              icon={AutoGraphIcon}
              title="Coverage"
              value="95%"
              description="Language coverage for African languages"
              color="#ff9800"
              trend="+5% this quarter"
              index={2}
            />
          </Box>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <StatsCard
              icon={UpdateIcon}
              title="Regular Updates"
              value="Monthly"
              description="New languages and features added regularly"
              color="#9c27b0"
              trend="Next: Hausa"
              index={3}
            />
          </Box>
        </Box>

        {/* Feature Overview */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1976d2',
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
            }}
          >
            Feature Language Support
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            justifyContent: 'flex-start'
          }}>
            {Object.entries(featureLanguages).map(([feature, languages], index) => (
              <Box sx={{ 
                flex: '1 1 250px', 
                minWidth: '250px',
                maxWidth: '300px'
              }} key={feature}>
                <LanguageFeatureCard
                  feature={feature}
                  languages={languages}
                  index={index}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Coming Soon Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1976d2',
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
            }}
          >
            Coming Soon
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            width: '100%'
          }}>
            <Box sx={{ 
              flex: '1 1 600px', 
              maxWidth: '800px',
              minWidth: '300px'
            }}>
              <ComingSoonCard
                languages={comingSoonLanguages}
                index={0}
              />
            </Box>
          </Box>
        </Box>

        {/* Main Language Matrix */}
        <Box sx={{ mb: 3 }}>
          <LanguageMatrix />
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(25, 118, 210, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
              Need a Language Not Listed?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#666666' }}>
              We're constantly expanding our language support. Contact us to request new languages or features.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="medium"
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                  },
                }}
              >
                Request New Language
              </Button>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: alpha('#1976d2', 0.1),
                  },
                }}
              >
                View Documentation
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LanguageSupport;