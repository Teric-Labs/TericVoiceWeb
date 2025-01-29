import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Chip,
} from '@mui/material';
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
import SummarizeComponent from './SummarizeComponent.js'
import SynthesizeComponent from './SynthesizeComponent.js';
import SpeechToSpeechForm from './SpeechToSpeechForm.js';
// Custom styled tab component using Chip
const FeatureChip = ({ icon: Icon, label, isSelected, onClick }) => (
  <Chip
    icon={<Icon />}
    label={label}
    onClick={onClick}
    sx={{
      height: '48px',
      borderRadius: '24px',
      fontWeight: 600,
      fontSize: '14px',
      px: 2,
      py: 3,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      backgroundColor: isSelected ? 'primary.main' : 'background.paper',
      color: isSelected ? 'white' : 'text.primary',
      boxShadow: isSelected ? '0 4px 20px rgba(25, 118, 210, 0.25)' : 'none',
      '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: isSelected ? 'primary.main' : 'background.paper',
      },
      '& .MuiChip-icon': {
        color: isSelected ? 'white' : 'primary.main',
        marginRight: '8px',
      }
    }}
  />
);

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
      <Box sx={{ minHeight: '100vh', py: 2 }}>
        {/* Main Interface */}
        <Paper
          elevation={0}
          sx={{
            p:2,
            borderRadius: '24px',
            margin: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
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
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '16px'
            }}
          >
            <ActiveComponent />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomeComponent;