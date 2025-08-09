import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Mic, 
  VideoCameraBack,
  TextFields,
  VolumeUp,
  RecordVoiceOver,
  Summarize,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import DataTable from './DataTable.js';
import VideoTable from './VideoTable';
import TranslationsTable from './TranslationsTable';
import SummaryTable from './SummaryTable';
import VoxTransTable from './VoxTransTable.js';
import TextTable from './TextTable.js';

// Enhanced styled components
const FeatureChip = styled('div')(({ theme, isSelected }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  borderRadius: '16px',
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: theme.spacing(0, 2.5),
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
  backgroundColor: isSelected ? '#1976d2' : '#ffffff',
  color: isSelected ? '#ffffff' : '#000000',
  boxShadow: isSelected 
    ? '0 8px 32px rgba(25, 118, 210, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${isSelected ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.1)'}`,
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: isSelected ? '#1565c0' : '#f8fafc',
    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
  },
  '& .MuiSvgIcon-root': {
    color: isSelected ? '#ffffff' : '#1976d2',
    marginRight: theme.spacing(1.5),
    fontSize: '1.25rem',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

const ComponentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: theme.spacing(4),
  border: '1px solid rgba(25, 118, 210, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(25, 118, 210, 0.08)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const History = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const features = [
    { 
      icon: TextFields, 
      label: 'Text Translation', 
      component: TranslationsTable,
      description: 'View all text translation history',
      color: '#1976d2'
    },
    { 
      icon: VolumeUp, 
      label: 'Text to Speech', 
      component: TextTable,
      description: 'View all text-to-speech conversions',
      color: '#4caf50'
    },
    { 
      icon: Mic, 
      label: 'Voice Recognition', 
      component: DataTable,
      description: 'View all voice recognition history',
      color: '#ff9800'
    },
    { 
      icon: VideoCameraBack, 
      label: 'Video Transcription', 
      component: VideoTable,
      description: 'View all video transcription history',
      color: '#9c27b0'
    },
    { 
      icon: RecordVoiceOver, 
      label: 'Voice to Voice', 
      component: VoxTransTable,
      description: 'View all voice-to-voice translations',
      color: '#f44336'
    },
    { 
      icon: Summarize, 
      label: 'Summarization', 
      component: SummaryTable,
      description: 'View all summarization history',
      color: '#00bcd4'
    }
  ];

  const handleTabChange = useCallback((index) => {
    setSelectedTab(index);
  }, []);

  const ActiveComponent = features[selectedTab].component;

  // Mock statistics data - in real app, this would come from Redux or API
  const stats = [
    { label: 'Total Translations', value: '1,234', icon: <TextFields />, color: '#1976d2' },
    { label: 'Voice Recordings', value: '567', icon: <Mic />, color: '#ff9800' },
    { label: 'Video Transcriptions', value: '89', icon: <VideoCameraBack />, color: '#9c27b0' },
    { label: 'AI Conversations', value: '456', icon: <RecordVoiceOver />, color: '#f44336' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: '100vh', py: 4, bgcolor: '#f8fafc' }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#1976d2',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <HistoryIcon sx={{ fontSize: '2rem' }} />
            History & Analytics
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            Track and analyze all your AI-powered interactions and translations
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: '12px', 
                      backgroundColor: `${stat.color}15`,
                      color: stat.color
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
          role="region"
          aria-label="History Section"
        >
          {/* Features Navigation */}
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid rgba(25, 118, 210, 0.08)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: '#1976d2',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AnalyticsIcon />
              Activity History
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
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
          </Box>

          {/* Component Container */}
          <ComponentContainer role="tabpanel" aria-label={`${features[selectedTab].label} Content`}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                {features[selectedTab].label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {features[selectedTab].description}
              </Typography>
            </Box>
            <ActiveComponent />
          </ComponentContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default History;