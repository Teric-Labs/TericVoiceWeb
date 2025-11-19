import React, { useState } from 'react';
import { Box, Chip } from '@mui/material';
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
  backgroundColor: isSelected ? '#1976d2' : '#ffffff',
  color: isSelected ? '#ffffff' : '#000000',
  boxShadow: isSelected ? '0 4px 20px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(25, 118, 210, 0.2)',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: isSelected ? '#1565c0' : '#f5f5f5',
    boxShadow: '0 6px 24px rgba(25, 118, 210, 0.2)',
  },
  '& .MuiChip-icon': {
    color: isSelected ? '#ffffff' : '#1976d2',
    marginRight: theme.spacing(1),
  },
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
    <Box sx={{ width: '100%', py: 4 }}>
      {/* Features Navigation */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
          mb: 4,
          px: 2,
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

      {/* Active Component - Takes full width */}
      <Box sx={{ width: '100%' }}>
        <ActiveComponent />
      </Box>
    </Box>
  );
};

export default HomeComponent;