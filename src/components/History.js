import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
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
import DataTable from './DataTable.js';
import VideoTable from './VideoTable';
import TranslationsTable from './TranslationsTable';
import SummaryTable from './SummaryTable';
import VoxTransTable from './VoxTransTable.js';
import TextTable from './TextTable.js';

// Custom styled FeatureChip component
const FeatureChip = styled('div')(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
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
  '& .MuiSvgIcon-root': {
    color: isSelected ? '#ffffff' : '#1976d2',
    marginRight: theme.spacing(1),
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

// Custom styled container for the active component
const ComponentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: theme.spacing(4),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
}));

const History = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const features = [
    { icon: TextFields, label: 'Text Translation', component: TranslationsTable },
    { icon: VolumeUp, label: 'Text to Voice', component: TextTable },
    { icon: Mic, label: 'Voice Recognition', component: DataTable },
    { icon: VideoCameraBack, label: 'Video Transcription', component: VideoTable },
    { icon: RecordVoiceOver, label: 'Voice to Voice', component: VoxTransTable },
    { icon: Summarize, label: 'Summarization', component: SummaryTable }
  ];

  const handleTabChange = useCallback((index) => {
    setSelectedTab(index);
    console.log('Selected tab:', features[index].label);
  }, []);

  const ActiveComponent = features[selectedTab].component;

  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: '100vh', py: 6, bgcolor: '#f5f5f5' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            margin: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          }}
          role="region"
          aria-label="History Section"
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
            role="tablist"
            aria-label="Feature Navigation"
          >
            {features.map((feature, index) => (
              <FeatureChip
                key={index}
                isSelected={selectedTab === index}
                onClick={() => handleTabChange(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Space') {
                    handleTabChange(index);
                    e.preventDefault();
                  }
                }}
                tabIndex={0}
                role="tab"
                aria-selected={selectedTab === index}
                aria-label={`Select ${feature.label}`}
              >
                <feature.icon />
                <span>{feature.label}</span>
              </FeatureChip>
            ))}
          </Box>

          {/* Component Container */}
          <ComponentContainer role="tabpanel" aria-label={`${features[selectedTab].label} Content`}>
            <ActiveComponent />
          </ComponentContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default History;