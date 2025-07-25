import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Chip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Mic, 
  VideoCameraBack,
  TextFields,
  VolumeUp,
  RecordVoiceOver,
  Summarize
} from '@mui/icons-material';
import TranscribeComponent from "./TranscribeComponent";
import VideoStreamComponent from "./VideoStreamComponent";
import TranslationComponent from "./TranslationComponent";
import SummarizeComponent from './SummarizeComponent.js';
import SynthesizeComponent from './SynthesizeComponent.js';
import SpeechToSpeechForm from './SpeechToSpeechForm.js';

// Custom styled FeatureChip component
const FeatureChip = styled(Chip)(({ theme, isSelected }) => ({
  height: '50px',
  borderRadius: '25px',
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: theme.spacing(0, 2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  backgroundColor: isSelected ? '#1976d2' : '#ffffff', // Blue when selected, white otherwise
  color: isSelected ? '#ffffff' : '#000000', // White text when selected, black otherwise
  boxShadow: isSelected ? '0 4px 20px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)', // Blue or black shadow
  border: '1px solid rgba(25, 118, 210, 0.2)', // Light blue border
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: isSelected ? '#1565c0' : '#f5f5f5', // Darker blue or light gray on hover
    boxShadow: '0 6px 24px rgba(25, 118, 210, 0.2)',
  },
  '& .MuiChip-icon': {
    color: isSelected ? '#ffffff' : '#1976d2', // White or blue icon
    marginRight: theme.spacing(1),
  },
}));

// Custom styled container for the active component
const ComponentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff', // White background
  borderRadius: '16px',
  padding: theme.spacing(4),
  border: '1px solid rgba(0, 0, 0, 0.05)', // Subtle black border
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)', // Light black shadow
  transition: 'all 0.3s ease',
}));

const HomeComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const features = [
    { icon: TextFields, label: 'Text Translation', component: TranslationComponent },
    { icon: VolumeUp, label: 'Text to Voice', component: SynthesizeComponent },
    { icon: Mic, label: 'Voice Recognition', component: TranscribeComponent },
    { icon: VideoCameraBack, label: 'Video Transcription', component: VideoStreamComponent },
    { icon: RecordVoiceOver, label: 'Voice to Voice', component: SpeechToSpeechForm },
    { icon: Summarize, label: 'Summarization', component: SummarizeComponent }
  ];

  const ActiveComponent = features[selectedTab].component;

  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: '100vh', py: 6, bgcolor: '#f5f5f5' }}> {/* Light gray-white background */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            margin: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(25, 118, 210, 0.1)', // Subtle blue border
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', // Light black shadow
          }}
        >
          {/* Features Navigation */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 6,
            }}
          >
            {features.map((feature, index) => (
              <FeatureChip
                key={index}
                icon={feature.icon}
                label={feature.label}
                isSelected={selectedTab === index}
                onClick={() => setSelectedTab(index)}
              />
            ))}
          </Box>

          {/* Component Container */}
          <ComponentContainer>
            <ActiveComponent />
          </ComponentContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomeComponent;