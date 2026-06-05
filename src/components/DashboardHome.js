import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Paper, Typography, Stack, Chip, Skeleton,
  IconButton, Tooltip, Button, Avatar,
} from '@mui/material';
import {
  SettingsVoice as TranscribeIcon,
  Translate as TranslateIcon,
  RecordVoiceOver as SynthIcon,
  Notes as SummarizeIcon,
  Movie as DubbingIcon,
  GraphicEq as VoiceoverIcon,
  AccountBalanceWallet as WalletIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  ArrowForward,
  Bolt,
  AutoAwesome,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { subscriptionAPI } from '../services/api';
import {
  fetchAllVaultActivity, readAllVaultActivityCache,
  computeVaultMetrics, formatRelativeDate, isProcessingStatus,
} from '../utils/mediaVault';
import { AvoicesProgress, AvoicesRingProgress } from './progress';
import { useTour } from './onboarding';
import { TOUR_IDS, dashboardTour } from './onboarding/tours';

const AC = '#E8A020';
const G = 'linear-gradient(135deg, #E8A020, #C47F10)';
const GLASS = {
  background: 'rgba(17, 17, 17, 0.02)',
  border: '1px solid rgba(17, 17, 17, 0.05)',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
};

const QUICK_ACTIONS = [
  { id: 'transcribe', label: 'Transcribe', desc: 'Speech to text', icon: <TranscribeIcon />, path: '/dashboard/transcribe', color: '#E8A020' },
  { id: 'translate', label: 'Translate', desc: 'Text & documents', icon: <TranslateIcon />, path: '/dashboard/translate', color: '#10b981' },
  { id: 'synthesize', label: 'Synthesize', desc: 'Neural voices', icon: <SynthIcon />, path: '/dashboard/synthesize', color: '#C47F10' },
  { id: 'summarize', label: 'Summarize', desc: 'Condense media', icon: <SummarizeIcon />, path: '/dashboard/summarize', color: '#8b5cf6' },
  { id: 'dubbing', label: 'Video Dubbing', desc: 'Translate videos', icon: <DubbingIcon />, path: '/dashboard/dubbing', color: '#3b82f6' },
  { id: 'voiceovers', label: 'Voiceovers', desc: 'Narrate & slideshow', icon: <VoiceoverIcon />, path: '/dashboard/voiceovers', color: '#ec4899' },
];

const TYPE_ICON = {
  transcription: <TranscribeIcon sx={{ fontSize: 18 }} />,
  video: <TranscribeIcon sx={{ fontSize: 18 }} />,
  translation: <TranslateIcon sx={{ fontSize: 18 }} />,
  tts: <SynthIcon sx={{ fontSize: 18 }} />,
  document_tts: <SynthIcon sx={{ fontSize: 18 }} />,
  summary: <SummarizeIcon sx={{ fontSize: 18 }} />,
  dubbing: <DubbingIcon sx={{ fontSize: 18 }} />,
  voiceover: <VoiceoverIcon sx={{ fontSize: 18 }} />,
  vox: <SynthIcon sx={{ fontSize: 18 }} />,
};

const RechartsTooltipCard = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ p: 1.5, background: '#111111', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 600 }}>{label}</Typography>
        <Typography sx={{ color: '#F5B844', fontWeight: 800, fontSize: '0.95rem' }}>
          {payload[0].value.toFixed(2)} CR
        </Typography>
      </Box>
    );
  }
  return null;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardHome({ userId }) {
  const navigate = useNavigate();
  const { startTour } = useTour();
  const [balance, setBalance] = useState(0);
  const [analytics, setAnalytics] = useState({});
  const [ledger, setLedger] = useState([]);
  const [activity, setActivity] = useState(() => readAllVaultActivityCache(userId) || []);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userName = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      const name = u.displayName || u.name || u.email || '';
      return name ? String(name).split('@')[0].split(' ')[0] : '';
    } catch {
      return '';
    }
  }, []);

  const loadAll = useCallback(async ({ force = false } = {}) => {
    if (!userId) return;
    try {
      force ? setRefreshing(true) : setLoading(true);
      const [balRes, analyticsRes, ledgerRes, vault] = await Promise.all([
        subscriptionAPI.getBalance(userId).catch(() => ({})),
        subscriptionAPI.getAnalytics(userId).catch(() => ({})),
        subscriptionAPI.getLedger(userId, 1, 60).catch(() => ({})),
        fetchAllVaultActivity(userId, { force }).catch(() => []),
      ]);
      setBalance(balRes.balance ?? balRes.credit_balance ?? 0);
      setAnalytics(analyticsRes.analytics || {});
      setLedger(ledgerRes.ledger || []);
      setActivity(Array.isArray(vault) ? vault : []);
      window.dispatchEvent(new CustomEvent('refresh-balance'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAll();
    const onUpdate = () => loadAll({ force: true });
    window.addEventListener('library-updated', onUpdate);
    return () => window.removeEventListener('library-updated', onUpdate);
  }, [loadAll]);

  // First-visit guided tour — wait until the dashboard has rendered its anchors.
  useEffect(() => {
    if (loading) return undefined;
    const t = setTimeout(() => startTour(TOUR_IDS.dashboard, dashboardTour), 700);
    return () => clearTimeout(t);
  }, [loading, startTour]);

  const metrics = useMemo(() => computeVaultMetrics(activity), [activity]);
  const recent = useMemo(() => activity.slice(0, 6), [activity]);

  const totalSpent = useMemo(
    () => Object.values(analytics).reduce((a, b) => a + b, 0),
    [analytics]
  );
  const hoursSaved = (totalSpent * 0.05).toFixed(1);

  const chartData = useMemo(() => {
    if (!ledger.length) return [];
    const groups = {};
    [...ledger].reverse().forEach(item => {
      if (item.service === 'credit_addition' || item.type === 'credit' || item.amount < 0) return;
      const d = item.timestamp ? format(new Date(item.timestamp), 'MMM dd') : 'Unknown';
      groups[d] = (groups[d] || 0) + item.amount;
    });
    return Object.keys(groups).map(date => ({ date, spent: groups[date] }));
  }, [ledger]);

  const topServices = useMemo(
    () => Object.entries(analytics).sort((a, b) => b[1] - a[1]).slice(0, 4),
    [analytics]
  );

  if (loading && !activity.length) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 5, mb: 3, bgcolor: 'rgba(17,17,17,0.05)' }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={6} md={2} key={i}><Skeleton variant="rectangular" height={110} sx={{ borderRadius: 4, bgcolor: 'rgba(17,17,17,0.05)' }} /></Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 5, bgcolor: 'rgba(17,17,17,0.05)' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Greeting + quick actions ───────────────────────────────── */}
      <Paper sx={{ ...GLASS, p: { xs: 2.5, md: 3.5 }, mb: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,32,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 900, color: '#111111', letterSpacing: '-0.02em' }}>
              {greeting()}{userName ? `, ${userName}` : ''} 👋
            </Typography>
            <Typography sx={{ color: 'rgba(17,17,17,0.55)', fontWeight: 600, fontSize: '0.9rem', mt: 0.5 }}>
              Pick up where you left off or start something new.
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={() => loadAll({ force: true })} disabled={refreshing} sx={{ color: 'rgba(17,17,17,0.3)', '&:hover': { color: AC, background: 'rgba(232,160,32,0.1)' } }}>
              <RefreshIcon fontSize="small" sx={{ animation: refreshing ? 'spin 1.2s linear infinite' : 'none', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Grid data-tour="quick-actions" container spacing={1.5}>
          {QUICK_ACTIONS.map(a => (
            <Grid item xs={6} sm={4} md={2} key={a.id}>
              <Box
                onClick={() => navigate(a.path)}
                sx={{
                  cursor: 'pointer', p: 2, borderRadius: '16px', height: '100%',
                  background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(17,17,17,0.06)',
                  transition: 'all 0.18s',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 24px rgba(17,17,17,0.08)', borderColor: `${a.color}55` },
                }}
              >
                <Avatar variant="rounded" sx={{ width: 38, height: 38, mb: 1.25, bgcolor: `${a.color}18`, color: a.color, borderRadius: '12px' }}>
                  {a.icon}
                </Avatar>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#111111' }}>{a.label}</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: 'rgba(17,17,17,0.45)', fontWeight: 600 }}>{a.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* ── Stat row ───────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Credit Balance', value: balance.toLocaleString(), icon: <WalletIcon />, color: AC, tour: 'stat-balance', action: () => navigate('/dashboard/subscription') },
          { label: 'Total Assets', value: metrics.total, icon: <HistoryIcon />, color: '#3b82f6', action: () => navigate('/dashboard/history') },
          { label: 'In Progress', value: metrics.processing, icon: <Bolt />, color: '#f59e0b', tour: 'stat-progress', action: () => navigate('/dashboard/history?status=processing') },
          { label: 'Hours Saved', value: `${hoursSaved}h`, icon: <AutoAwesome />, color: '#10b981', action: () => navigate('/dashboard/usage') },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Paper data-tour={s.tour} onClick={s.action} sx={{ ...GLASS, p: 2.5, cursor: 'pointer', transition: 'all 0.18s', '&:hover': { transform: 'translateY(-2px)', borderColor: `${s.color}40` } }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: `${s.color}18`, color: s.color, borderRadius: '12px' }}>{s.icon}</Avatar>
                <Box>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#111111', lineHeight: 1 }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(17,17,17,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>{s.label}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Recent projects ──────────────────────────────────────── */}
        <Grid item xs={12} md={7}>
          <Paper data-tour="recent-projects" sx={{ ...GLASS, p: 0, overflow: 'hidden', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5, borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <HistoryIcon sx={{ color: AC }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111111', fontSize: '1rem' }}>Recent Projects</Typography>
              </Stack>
              <Button size="small" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} onClick={() => navigate('/dashboard/history')} sx={{ textTransform: 'none', fontWeight: 700, color: AC }}>
                View all
              </Button>
            </Stack>

            {recent.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <AutoAwesome sx={{ fontSize: 40, color: 'rgba(17,17,17,0.15)', mb: 1.5 }} />
                <Typography sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>No projects yet</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(17,17,17,0.45)', mb: 2.5 }}>Start with one of the studios above to see your work here.</Typography>
                <Button variant="contained" onClick={() => navigate('/dashboard/transcribe')} sx={{ background: G, borderRadius: '10px', fontWeight: 800, textTransform: 'none' }}>
                  Start Creating
                </Button>
              </Box>
            ) : (
              <Stack divider={<Box sx={{ borderBottom: '1px solid rgba(17,17,17,0.04)' }} />}>
                {recent.map((row, i) => {
                  const processing = isProcessingStatus(row._status);
                  const clickable = !!row._viewPath;
                  return (
                    <Stack
                      key={row.doc_id || i}
                      direction="row" alignItems="center" spacing={1.5}
                      onClick={() => clickable && navigate(row._viewPath)}
                      sx={{
                        px: 2.5, py: 1.75,
                        cursor: clickable ? 'pointer' : 'default',
                        transition: 'background 0.15s',
                        '&:hover': { background: clickable ? 'rgba(232,160,32,0.04)' : 'transparent' },
                      }}
                    >
                      <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: `${row._vaultColor || AC}18`, color: row._vaultColor || AC, borderRadius: '10px' }}>
                        {TYPE_ICON[row._vaultType] || <AutoAwesome sx={{ fontSize: 18 }} />}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row._title || 'Untitled'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(17,17,17,0.45)', fontWeight: 600 }}>
                          {row._vaultLabel} · {formatRelativeDate(row._date)}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={processing ? 'Processing' : (row._status === 'failed' ? 'Failed' : 'Ready')}
                        sx={{
                          height: 22, fontSize: '0.65rem', fontWeight: 800,
                          bgcolor: processing ? 'rgba(245,158,11,0.12)' : row._status === 'failed' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                          color: processing ? '#d97706' : row._status === 'failed' ? '#ef4444' : '#10b981',
                        }}
                      />
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* ── Usage analytics ──────────────────────────────────────── */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Paper sx={{ ...GLASS, p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
              <AvoicesRingProgress value={Math.min((balance / 1500) * 100, 100)} size={110}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#111111' }}>{balance.toLocaleString()}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(17,17,17,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Credits</Typography>
              </AvoicesRingProgress>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, color: '#111111', mb: 0.5 }}>Wallet</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'rgba(17,17,17,0.5)', mb: 2 }}>
                  {totalSpent.toFixed(1)} credits used all-time
                </Typography>
                <Button variant="contained" size="small" fullWidth onClick={() => navigate('/dashboard/subscription')} sx={{ background: G, borderRadius: '10px', fontWeight: 800, textTransform: 'none' }}>
                  Top up
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ ...GLASS, p: 3, flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <TimelineIcon sx={{ color: '#C47F10' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111111' }}>Consumption</Typography>
                </Stack>
                <Chip label="Recent" size="small" sx={{ bgcolor: 'rgba(17,17,17,0.05)', color: 'rgba(17,17,17,0.5)', fontWeight: 600 }} />
              </Stack>

              {chartData.length > 1 ? (
                <Box sx={{ width: '100%', height: 120, mb: 2 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dhSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C47F10" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#C47F10" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,17,17,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(17,17,17,0.3)" style={{ fontSize: '0.65rem', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="rgba(17,17,17,0.3)" style={{ fontSize: '0.65rem', fontWeight: 600 }} axisLine={false} tickLine={false} width={34} />
                      <RechartsTooltip content={<RechartsTooltipCard />} cursor={{ stroke: 'rgba(17,17,17,0.1)', strokeDasharray: '3 3' }} />
                      <Area type="monotone" dataKey="spent" stroke="#C47F10" strokeWidth={2.5} fillOpacity={1} fill="url(#dhSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Typography sx={{ color: 'rgba(17,17,17,0.3)', fontWeight: 600, fontSize: '0.8rem' }}>Not enough data to chart yet.</Typography>
                </Box>
              )}

              <Stack spacing={1.5}>
                {topServices.length > 0 ? topServices.map(([service, amount]) => (
                  <Box key={service}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(17,17,17,0.7)', fontWeight: 600, textTransform: 'capitalize' }}>{service.replace(/_/g, ' ')}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#111111', fontWeight: 800 }}>{amount.toFixed(1)}</Typography>
                    </Stack>
                    <AvoicesProgress variant="determinate" value={totalSpent > 0 ? (amount / totalSpent) * 100 : 0} size="xs" />
                  </Box>
                )) : (
                  <Typography sx={{ color: 'rgba(17,17,17,0.3)', fontSize: '0.8rem' }}>No usage tracked yet.</Typography>
                )}
              </Stack>
              <Button size="small" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} onClick={() => navigate('/dashboard/usage')} sx={{ mt: 2, textTransform: 'none', fontWeight: 700, color: AC }}>
                Full analytics
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
