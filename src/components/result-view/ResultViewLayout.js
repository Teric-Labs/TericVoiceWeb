import React from 'react';
import {
  Box, Button, Container, Stack, Typography, Chip, useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import TranslateIcon from '@mui/icons-material/Translate';
import SummarizeIcon from '@mui/icons-material/Summarize';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VideocamIcon from '@mui/icons-material/Videocam';
import HearingIcon from '@mui/icons-material/Hearing';
import MovieIcon from '@mui/icons-material/Movie';
import { ActivityStrip } from '../progress';
import { RV_AC, RV_G, rvBackButtonSx, rvGlass } from './resultViewTokens';

const TYPE_META = {
  transcription: { icon: GraphicEqIcon, label: 'Transcription' },
  translation: { icon: TranslateIcon, label: 'Translation' },
  summary: { icon: SummarizeIcon, label: 'Summary' },
  tts: { icon: RecordVoiceOverIcon, label: 'Synthesis' },
  video: { icon: VideocamIcon, label: 'Video' },
  vox: { icon: HearingIcon, label: 'Voice to Voice' },
  dubbing: { icon: MovieIcon, label: 'Video Dubbing' },
  voiceover: { icon: GraphicEqIcon, label: 'Voiceover' },
};

/**
 * Unified shell for History / Media Vault result detail pages.
 */
const ResultViewLayout = ({
  type = 'translation',
  title,
  subtitle,
  date,
  onBack,
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No data available',
  emptyIcon: EmptyIcon,
  headerActions = null,
  badges = [],
  maxWidth = 'lg',
  children,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const glass = rvGlass(isDark);
  const meta = TYPE_META[type] || TYPE_META.translation;
  const Icon = meta.icon;

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return String(d);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'transparent', py: { xs: 2, md: 4 } }}>
      <Container maxWidth={maxWidth}>
        {onBack && (
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={rvBackButtonSx}>
            Back to Media Vault
          </Button>
        )}

        <Box sx={{ ...glass, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'rgba(232, 160, 32, 0.1)',
                  border: '1px solid rgba(232, 160, 32, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon sx={{ fontSize: 24, color: RV_AC }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: RV_AC,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontSize: '0.68rem',
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  {subtitle || meta.label}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.35rem', md: '1.85rem' },
                    background: RV_G,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    wordBreak: 'break-word',
                  }}
                >
                  {title || meta.label}
                </Typography>
                <Typography sx={{ color: 'rgba(17, 17, 17, 0.45)', fontSize: '0.82rem', fontWeight: 600, mt: 0.75 }}>
                  {formatDate(date)}
                </Typography>
                {badges.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                    {badges.map((b, i) => (
                      <Chip
                        key={i}
                        size="small"
                        icon={b.icon}
                        label={b.label}
                        sx={{
                          background: 'rgba(232, 160, 32, 0.08)',
                          color: RV_AC,
                          border: '1px solid rgba(232, 160, 32, 0.22)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
            {headerActions && (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {headerActions}
              </Stack>
            )}
          </Stack>
        </Box>

        <ActivityStrip active={loading} label="Loading result" sx={{ mb: 3 }} />

        {error && !loading && (
          <Box sx={{ ...glass, p: 4, textAlign: 'center', mb: 3 }}>
            <Typography sx={{ color: '#ef4444', fontWeight: 700 }}>{error}</Typography>
          </Box>
        )}

        {empty && !loading && !error && (
          <Box sx={{ ...glass, p: 6, textAlign: 'center' }}>
            {EmptyIcon && <EmptyIcon sx={{ fontSize: 56, color: 'rgba(17, 17, 17, 0.12)', mb: 2 }} />}
            <Typography sx={{ color: 'rgba(17, 17, 17, 0.4)', fontWeight: 700 }}>{emptyMessage}</Typography>
          </Box>
        )}

        {!loading && !error && !empty && children}
      </Container>
    </Box>
  );
};

export default ResultViewLayout;
