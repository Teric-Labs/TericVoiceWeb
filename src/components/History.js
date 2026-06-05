import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Container, Typography, Grid,
  IconButton, Tooltip, Chip, Stack, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Mic, VideoCameraBack, TextFields, VolumeUp, RecordVoiceOver, Summarize,
  History as HistoryIcon, Refresh, Description, GraphicEq, Dashboard,
  ChevronLeft, ChevronRight,
} from '@mui/icons-material';
import DataTable from './DataTable.js';
import VideoTable from './VideoTable';
import TranslationsTable from './TranslationsTable';
import SummaryTable from './SummaryTable';
import VoxTransTable from './VoxTransTable.js';
import TextTable from './TextTable.js';
import DubbedVideosTable from './DubbedVideosTable';
import VoiceoverTable from './VoiceoverTable';
import DocumentTtsTable from './DocumentTtsTable';
import AllActivityFeed from './AllActivityFeed';
import { getCurrentUser } from '../services/api';
import {
  AC, GLASS, computeVaultMetrics, fetchAllVaultActivity,
  readAllVaultActivityCache, invalidateVaultCache,
} from '../utils/mediaVault';
import { AvoicesSpinner } from './progress';

const FEATURES = [
  { id: 'all', Icon: Dashboard, label: 'All Activity', color: AC, Component: AllActivityFeed, isFeed: true },
  { id: 'translation', Icon: TextFields, label: 'Text Translation', color: '#E8A020', Component: TranslationsTable },
  { id: 'tts', Icon: VolumeUp, label: 'Text to Speech', color: '#C47F10', Component: TextTable },
  { id: 'document_tts', Icon: Description, label: 'Document Speech', color: '#C47F10', Component: DocumentTtsTable },
  { id: 'transcription', Icon: Mic, label: 'Voice Recognition', color: '#E8A020', Component: DataTable },
  { id: 'video', Icon: VideoCameraBack, label: 'Video Transcription', color: '#C47F10', Component: VideoTable },
  { id: 'dubbing', Icon: VideoCameraBack, label: 'Video Dubbing', color: '#E8A020', Component: DubbedVideosTable },
  { id: 'voiceover', Icon: GraphicEq, label: 'Voiceovers', color: '#E8A020', Component: VoiceoverTable },
  { id: 'vox', Icon: RecordVoiceOver, label: 'Voice to Voice', color: '#E8A020', Component: VoxTransTable },
  { id: 'summary', Icon: Summarize, label: 'Summarization', color: '#C47F10', Component: SummaryTable },
];

const STAT_CARDS = [
  { key: 'total', label: 'Total Assets', filter: { view: 'all' } },
  { key: 'processing', label: 'In Progress', filter: { view: 'all', status: 'processing' } },
  { key: 'thisWeek', label: 'This Week', filter: { view: 'all' } },
  { key: 'types', label: 'Asset Types', filter: null },
];

const LIBRARY_COLLAPSED_KEY = 'media-vault-library-collapsed';
const LIBRARY_WIDTH_EXPANDED = 248;
const LIBRARY_WIDTH_COLLAPSED = 56;

const History = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const viewParam = searchParams.get('view') || 'all';
  const statusParam = searchParams.get('status') || 'all';

  const selectedIndex = Math.max(0, FEATURES.findIndex(f => f.id === viewParam));
  const selected = FEATURES[selectedIndex] || FEATURES[0];

  const [refreshKey, setRefreshKey] = useState(0);
  const [metrics, setMetrics] = useState({ total: 0, processing: 0, thisWeek: 0, byType: {} });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [libraryCollapsed, setLibraryCollapsed] = useState(() => {
    try {
      return localStorage.getItem(LIBRARY_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const refreshKeyRef = useRef(0);

  const toggleLibrary = useCallback(() => {
    setLibraryCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LIBRARY_COLLAPSED_KEY, String(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const handleMetrics = useCallback((entries) => {
    setMetrics(computeVaultMetrics(entries));
    setMetricsLoading(false);
  }, []);

  const refreshLibrary = useCallback(() => {
    const user = getCurrentUser();
    const userId = user?.userId || user?.uid;
    if (userId) invalidateVaultCache(userId);
    setRefreshKey(k => k + 1);
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      const user = getCurrentUser();
      const userId = user?.userId || user?.uid;
      if (!userId) { setMetricsLoading(false); return; }

      const force = refreshKey !== refreshKeyRef.current;
      refreshKeyRef.current = refreshKey;

      const cached = readAllVaultActivityCache(userId);
      if (cached?.length && !force) {
        handleMetrics(cached);
        return;
      }
      if (!cached?.length) setMetricsLoading(true);

      try {
        const entries = await fetchAllVaultActivity(userId, { force });
        handleMetrics(entries);
      } catch {
        setMetricsLoading(false);
      }
    };
    loadMetrics();
  }, [refreshKey, handleMetrics]);

  useEffect(() => {
    const onUpdate = () => refreshLibrary();
    window.addEventListener('library-updated', onUpdate);
    return () => window.removeEventListener('library-updated', onUpdate);
  }, [refreshLibrary]);

  const setView = useCallback((id, extra = {}) => {
    const params = new URLSearchParams();
    params.set('view', id);
    if (extra.status) params.set('status', extra.status);
    else if (statusParam && id === 'all') params.set('status', statusParam);
    setSearchParams(params);
  }, [setSearchParams, statusParam]);

  const statValues = useMemo(() => ({
    total: metrics.total.toLocaleString('en-US'),
    processing: metrics.processing.toLocaleString('en-US'),
    thisWeek: metrics.thisWeek.toLocaleString('en-US'),
    types: Object.keys(metrics.byType).length.toString(),
  }), [metrics]);

  const ActiveComponent = selected.Component;

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }}>
      <Box sx={{ py: { xs: 1.25, md: 1.5 } }}>

        {/* Stat cards */}
        <Grid container spacing={1.5} sx={{ mb: 2.25 }}>
          {STAT_CARDS.map(({ key, label, filter }) => (
            <Grid item xs={6} md={3} key={key}>
              <Box
                onClick={() => filter && setView(filter.view, { status: filter.status })}
                sx={{
                  ...GLASS, p: 2, cursor: filter ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  border: selected.id === 'all' && filter?.status === statusParam ? `1px solid ${AC}50` : undefined,
                  '&:hover': filter ? { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${AC}18`, borderColor: `${AC}40` } : {},
                }}
              >
                <Typography sx={{ color: AC, fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                  {label}
                </Typography>
                {metricsLoading && key !== 'types' ? (
                  <AvoicesSpinner size="xs" />
                ) : (
                  <Typography sx={{ color: '#111111', fontWeight: 900, fontSize: '1.75rem', lineHeight: 1 }}>
                    {statValues[key]}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Main panel */}
        <Box sx={{ ...GLASS, overflow: 'hidden' }}>
          <Box sx={{
            px: 2, py: 2,
            borderBottom: '1px solid rgba(17,17,17,0.07)',
            background: 'rgba(232,160,32,0.03)',
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
              <Typography sx={{ color: '#111111', fontWeight: 800, fontSize: '0.95rem' }}>
                Asset Library
              </Typography>
              {!isMobile && (
                <Typography sx={{ color: 'rgba(17,17,17,0.45)', fontSize: '0.75rem', fontWeight: 700 }}>
                  Full-width card grid enabled
                </Typography>
              )}
            </Stack>
            <Box sx={{
              display: 'flex', flexDirection: 'row', gap: 1,
              overflowX: 'auto', flexWrap: 'nowrap', pb: 0.5,
              '&::-webkit-scrollbar': { height: 4 },
            }}>
              {FEATURES.map((feat, i) => {
                const count = feat.id === 'all' ? metrics.total : (metrics.byType[feat.id] ?? null);
                return (
                  <Chip
                    key={feat.id}
                    icon={<feat.Icon sx={{ fontSize: '16px !important' }} />}
                    label={count != null ? `${feat.label} (${count})` : feat.label}
                    onClick={() => setView(feat.id)}
                    sx={{
                      flexShrink: 0, fontWeight: 700, fontSize: '0.78rem',
                      background: selectedIndex === i ? `${feat.color}22` : 'rgba(17,17,17,0.04)',
                      color: selectedIndex === i ? feat.color : 'rgba(17,17,17,0.5)',
                      border: `1px solid ${selectedIndex === i ? `${feat.color}44` : 'rgba(17,17,17,0.08)'}`,
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
                  <Box>
                    <Typography sx={{ color: '#111111', fontWeight: 800, fontSize: '1rem' }}>
                      {selected.label}
                    </Typography>
                    <Typography sx={{ color: 'rgba(17,17,17,0.45)', fontSize: '0.8rem', fontWeight: 600 }}>
                      {selected.id === 'all'
                        ? 'Chronological view across every studio'
                        : `Browsing your saved ${selected.label.toLowerCase()}`}
                    </Typography>
                  </Box>
                </Stack>

                {selected.isFeed ? (
                  <AllActivityFeed
                    refreshKey={refreshKey}
                    onMetrics={handleMetrics}
                    statusFilter={statusParam !== 'all' ? statusParam : undefined}
                  />
                ) : (
                  <ActiveComponent refreshKey={refreshKey} />
                )}
              </Box>
          </Box>
      </Box>
    </Container>
  );
};

export default History;
