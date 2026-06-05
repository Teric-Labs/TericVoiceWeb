import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Mic, VideoCameraBack, TextFields, VolumeUp,
  RecordVoiceOver, Summarize, GraphicEq,
} from '@mui/icons-material';
import TranscribeComponent from './TranscribeComponent';
import VideoStreamComponent from './VideoStreamComponent';
import TranslationComponent from './TranslationComponent';
import SummarizeComponent from './SummarizeComponent.js';
import SynthesizeComponent from './SynthesizeComponent.js';
import SpeechToSpeechForm from './SpeechToSpeechForm.js';
import VoiceCloningComponent from './VoiceCloningComponent.js';

const TABS = [
  { label: 'Translate',     icon: <TextFields    sx={{ fontSize: 17 }} />, Component: TranslationComponent },
  { label: 'Text to Voice', icon: <VolumeUp      sx={{ fontSize: 17 }} />, Component: SynthesizeComponent },
  { label: 'Transcribe',    icon: <Mic           sx={{ fontSize: 17 }} />, Component: TranscribeComponent },
  { label: 'Video',         icon: <VideoCameraBack sx={{ fontSize: 17 }} />, Component: VideoStreamComponent },
  { label: 'Voice to Voice',icon: <RecordVoiceOver sx={{ fontSize: 17 }} />, Component: SpeechToSpeechForm },
  { label: 'Summarize',     icon: <Summarize     sx={{ fontSize: 17 }} />, Component: SummarizeComponent },
  { label: 'Voice Clone',   icon: <GraphicEq     sx={{ fontSize: 17 }} />, Component: VoiceCloningComponent },
];

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 48,
  borderBottom: '1px solid rgba(232, 160, 32, 0.15)',
  '& .MuiTabs-indicator': {
    height: 2,
    borderRadius: 0,
    background: '#E8A020',
  },
  '& .MuiTabs-scrollButtons': { color: 'rgba(17, 17, 17, 0.4)' },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: 'rgba(17, 17, 17, 0.5)',
  gap: 6,
  minWidth: 'auto',
  px: 2,
  letterSpacing: '0.01em',
  transition: 'color 0.2s ease',
  '&.Mui-selected': {
    color: '#111111',
    fontWeight: 600,
  },
  '& .MuiTab-iconWrapper': { marginBottom: 0 },
  '&:hover': { color: 'rgba(17, 17, 17, 0.8)' },
}));

export default function HomeComponent() {
  const [tab, setTab] = useState(0);
  const { Component } = TABS[tab];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{
        background: 'transparent',
        borderRadius: '12px',
        border: '1px solid rgba(17, 17, 17, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(17, 17, 17, 0.04)',
      }}>
        {/* Tab bar */}
        <Box sx={{ px: { xs: 2, md: 3 }, pt: 0, background: 'transparent' }}>
          <StyledTabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map(({ label, icon }, i) => (
              <StyledTab key={i} label={label} icon={icon} iconPosition="start" />
            ))}
          </StyledTabs>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Component />
        </Box>
      </Box>
    </Box>
  );
}
