import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, CircularProgress, Alert, Snackbar,
} from '@mui/material';
import {
  Mic, VideoCameraBack, TextFields, VolumeUp, RecordVoiceOver, Summarize,
  History as HistoryIcon, Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import DataTable from './DataTable.js';
import VideoTable from './VideoTable';
import TranslationsTable from './TranslationsTable';
import SummaryTable from './SummaryTable';
import VoxTransTable from './VoxTransTable.js';
import TextTable from './TextTable.js';
import { dataAPI, agentsAPI, getCurrentUser } from '../services/api';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';
const GLASS = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px' };

const features = [
  { Icon: TextFields,      label: 'Text Translation',  Component: TranslationsTable, color: '#0ea5e9' },
  { Icon: VolumeUp,        label: 'Text to Speech',    Component: TextTable,         color: '#10b981' },
  { Icon: Mic,             label: 'Voice Recognition', Component: DataTable,         color: '#f59e0b' },
  { Icon: VideoCameraBack, label: 'Video Transcription', Component: VideoTable,      color: '#8b5cf6' },
  { Icon: RecordVoiceOver, label: 'Voice to Voice',    Component: VoxTransTable,     color: '#ef4444' },
  { Icon: Summarize,       label: 'Summarization',     Component: SummaryTable,      color: '#06b6d4' },
];

const STAT_DEFS = [
  { label: 'Total Translations', Icon: TextFields,      color: '#0ea5e9' },
  { label: 'Voice Recordings',   Icon: Mic,             color: GOLD },
  { label: 'Video Transcriptions', Icon: VideoCameraBack, color: '#8b5cf6' },
  { label: 'AI Conversations',   Icon: RecordVoiceOver, color: '#ef4444' },
];

const History = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [stats, setStats] = useState(STAT_DEFS.map(s => ({ ...s, value: '0' })));
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const handleTabChange = useCallback(index => setSelectedTab(index), []);
  const { Component } = features[selectedTab];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = getCurrentUser();
        const userId = user?.userId || user?.uid;
        if (!userId) { setStatsLoading(false); return; }

        const [translationsData, audiosData, videosData, agentsData] = await Promise.allSettled([
          dataAPI.getTranslations(userId),
          dataAPI.getAudios(userId),
          dataAPI.getVideos(userId),
          agentsAPI.getUserAgents(userId),
        ]);

        const get = (r) => r.status === 'fulfilled' ? (r.value?.entries?.length || r.value?.length || 0) : 0;
        const counts = [get(translationsData), get(audiosData), get(videosData), get(agentsData)];
        setStats(STAT_DEFS.map((s, i) => ({ ...s, value: counts[i].toLocaleString('en-US') })));
      } catch {
        setStatsError(true);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container maxWidth="xl">
      <Snackbar
        open={statsError}
        autoHideDuration={6000}
        onClose={() => setStatsError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setStatsError(false)} sx={{ borderRadius: '12px' }}>
          Could not load activity statistics. Your history data is still available below.
        </Alert>
      </Snackbar>

      <Box sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
              <HistoryIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' }, letterSpacing: '-0.02em' }}>
              History & Analytics
            </Typography>
          </Box>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
            Track and analyze all your AI-powered interactions and translations
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          {stats.map(({ label, Icon, color, value }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Box sx={{
                ...GLASS,
                p: 2.5,
                transition: 'all 0.25s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 24px ${color}20`, borderColor: `${color}30` },
              }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, mb: 2 }}>
                  <Icon sx={{ fontSize: 20 }} />
                </Box>
                {statsLoading ? (
                  <CircularProgress size={22} sx={{ color, mb: 0.5 }} />
                ) : (
                  <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1, mb: 0.5 }}>
                    {value}
                  </Typography>
                )}
                <Typography sx={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                  {label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Main Panel */}
        <Box sx={{ ...GLASS, overflow: 'hidden' }}>
          {/* Tab header */}
          <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <AnalyticsIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
              <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem' }}>
                Activity History
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {features.map(({ Icon, label, color }, i) => (
                <Box
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTabChange(i)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleTabChange(i)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 2, py: 1, borderRadius: '50px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.82rem',
                    transition: 'all 0.2s ease',
                    ...(selectedTab === i
                      ? { background: `${color}20`, border: `1px solid ${color}40`, color }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', '&:hover': { background: 'rgba(255,255,255,0.07)', color: '#f8fafc', borderColor: 'rgba(255,255,255,0.15)' } }),
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Component content */}
          <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem', mb: 0.3 }}>
                {features[selectedTab].label}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                Showing your complete {features[selectedTab].label.toLowerCase()} history
              </Typography>
            </Box>
            <Component />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default History;
