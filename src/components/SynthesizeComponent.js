import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, Grid, Select, MenuItem,
  TextField, Alert, Tab, Tabs, Drawer, LinearProgress,
  InputLabel, Chip, IconButton, Stack
} from '@mui/material';
import { VolumeUp, CloudUpload, SwapHoriz, CheckCircle } from '@mui/icons-material';
import ViewttsAudioComponent from './ViewttsAudioComponent';
import { ActivityStrip, AvoicesBackdropLoader } from './progress';
import { ttsAPI, subscriptionAPI, getFriendlyErrorMessage } from '../services/api';
import { LANGUAGES } from '../constants/languages';

const G = 'linear-gradient(135deg, #f59e0b, #d97706)';
const G_PURPLE = 'linear-gradient(135deg, #f59e0b, #d97706)';
const GLASS = { background: 'rgba(17, 17, 17,0.04)', border: '1px solid rgba(17, 17, 17, 0.08)', borderRadius: '14px' };
const SELECT_SX = {
  borderRadius: '12px', color: '#111111', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(17, 17, 17, 0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
  '& .MuiSvgIcon-root': { color: 'rgba(17, 17, 17, 0.5)' },
};
const LABEL_SX = { color: 'rgba(17, 17, 17, 0.5)', '&.Mui-focused': { color: '#f59e0b' } };

// TTS credit rate: 0.001 credits per char (1 credit per 1k chars)
const TTS_RATE = 0.001;

export default function SynthesizeComponent() {
  const [tab, setTab] = useState(0);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLangs, setTargetLangs] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [userBalance, setUserBalance] = useState(null);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch balance on mount
  useEffect(() => {
    const user = getUser();
    const userId = user.uid || user.userId;
    if (userId) {
      subscriptionAPI.getBalance(userId)
        .then(data => setUserBalance(data.balance ?? data.credit_balance ?? null))
        .catch(() => {});
    }
  }, []);

  // Recalculate cost whenever text changes
  useEffect(() => {
    if (tab === 0 && text.trim()) {
      setEstimatedCost(Math.max(Math.round(text.length * TTS_RATE * 100) / 100, 0.01));
    } else if (tab === 1 && file) {
      // Rough proxy for docs: 1 page ≈ 3000 bytes
      const pages = Math.max(file.size / 3000, 1);
      setEstimatedCost(Math.round(pages * TTS_RATE * 3000 * 100) / 100);
    } else {
      setEstimatedCost(0);
    }
  }, [text, file, tab]);

  const isLowBalance = userBalance !== null && userBalance < estimatedCost;

  const swapLangs = () => {
    if (targetLangs.length === 1) { setSourceLang(targetLangs[0]); setTargetLangs([sourceLang]); }
  };

  const handleGenerate = async () => {
    setError(null); setLoading(true); setDocId(null); setDrawerOpen(false);
    try {
      const user = getUser();
      const userId = user.uid || user.userId;
      if (!userId) throw new Error('Please log in to use text-to-speech');
      if (tab === 0) {
        if (!text.trim()) throw new Error('Please enter text to synthesize');
        if (text.length > 5000) throw new Error('Text exceeds 5000 character limit');
        const res = await ttsAPI.synthesizeText(text, sourceLang, userId);
        if (!res.doc_id) throw new Error('No document ID received');
        setDocId(res.doc_id);
      } else {
        if (!file) throw new Error('Please select a document');
        if (file.size > 10 * 1024 * 1024) throw new Error('File must be under 10MB');
        if (!targetLangs.length) throw new Error('Select at least one target language');
        const res = await ttsAPI.translateDocumentWithTTS(file, sourceLang, targetLangs, null, userId);
        if (!res.doc_id) throw new Error('No document ID received');
        setDocId(res.doc_id);
      }
      // Refresh balance after usage
      const user2 = getUser();
      const userId2 = user2.uid || user2.userId;
      if (userId2) {
        subscriptionAPI.getBalance(userId2)
          .then(data => {
            setUserBalance(data.balance ?? data.credit_balance ?? null);
            window.dispatchEvent(new CustomEvent('refresh-balance'));
          })
          .catch(() => {});
      }
      setDrawerOpen(true);
    } catch (e) {
      if (e.response?.status === 402) {
        window.dispatchEvent(new CustomEvent('subscription-limit-exceeded', {
          detail: { message: e.response?.data?.detail || 'Insufficient credits.', status: 402 }
        }));
        setError(e.response?.data?.detail || 'Insufficient credits to generate speech.');
      } else {
        setError(getFriendlyErrorMessage(e, 'Generation failed. Please try again.'));
      }
    } finally { setLoading(false); }
  };

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(17, 17, 17,0.07)' }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(null); }}
          sx={{ minHeight: 40, '& .MuiTabs-indicator': { background: G, height: 2, borderRadius: 1 } }}>
          {[
            { label: 'Text to Speech', icon: <VolumeUp sx={{ fontSize: 17 }} /> },
            { label: 'Document to Speech', icon: <CloudUpload sx={{ fontSize: 17 }} /> },
          ].map(({ label, icon }, i) => (
            <Tab key={i} label={label} icon={icon} iconPosition="start" sx={{
              textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40,
              color: tab === i ? '#f59e0b' : 'rgba(17, 17, 17,0.4)',
              '&.Mui-selected': { color: '#f59e0b' },
            }} />
          ))}
        </Tabs>
      </Box>

      {/* Language selectors */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth size="small">
            <InputLabel sx={LABEL_SX}>Source Language</InputLabel>
            <Select value={sourceLang} label="Source Language" onChange={e => setSourceLang(e.target.value)} sx={SELECT_SX}>
              {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#111111' }}>{l.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={swapLangs} sx={{
            width: 36, height: 36, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
            color: '#f59e0b', '&:hover': { background: 'rgba(245,158,11,0.25)' },
          }}>
            <SwapHoriz fontSize="small" />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth size="small">
            <InputLabel sx={LABEL_SX}>Target Languages</InputLabel>
            <Select multiple value={targetLangs} label="Target Languages" onChange={e => setTargetLangs(e.target.value)} sx={SELECT_SX}
              renderValue={sel => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {sel.map(v => <Chip key={v} label={LANGUAGES.find(l => l.value === v)?.label || v} size="small"
                    sx={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '0.72rem', borderRadius: '50px' }} />)}
                </Box>
              )}>
              {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#111111' }}>{l.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2.5, borderRadius: '12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</Alert>}

      {tab === 0 ? (
        <TextField
          fullWidth multiline rows={6}
          label="Enter text for speech synthesis"
          value={text} onChange={e => setText(e.target.value)}
          error={text.length > 5000}
          helperText={`${text.length} / 5000`}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#111111', '& fieldset': { borderColor: 'rgba(17, 17, 17, 0.1)' }, '&:hover fieldset': { borderColor: '#f59e0b' }, '&.Mui-focused fieldset': { borderColor: '#f59e0b' } },
            '& .MuiInputLabel-root': { color: 'rgba(17, 17, 17, 0.5)', '&.Mui-focused': { color: '#f59e0b' } },
            '& .MuiFormHelperText-root': { color: '#64748b' },
          }}
        />
      ) : (
        <Box sx={{ mb: 3 }}>
          <input type="file" accept=".pdf,.doc,.docx,.txt" id="synth-file" hidden onChange={e => { setFile(e.target.files[0]); e.target.value = ''; }} />
          <label htmlFor="synth-file">
            <Box component="span" sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              ...GLASS, p: 4, cursor: 'pointer',
              borderStyle: 'dashed',
              borderColor: file ? '#f59e0b' : 'rgba(17, 17, 17, 0.08)',
              background: file ? 'rgba(245,158,11,0.05)' : 'rgba(17, 17, 17,0.02)',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.04)' },
            }}>
              {file ? (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <CheckCircle sx={{ color: '#f59e0b', fontSize: 22 }} />
                  <Box sx={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</Box>
                </Stack>
              ) : (
                <>
                  <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <CloudUpload sx={{ fontSize: 26, color: '#f59e0b' }} />
                  </Box>
                  <Box sx={{ color: '#111111', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>Click to upload document</Box>
                  <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>PDF, DOC, DOCX, TXT · Max 10 MB</Box>
                </>
              )}
            </Box>
          </label>
        </Box>
      )}

      <ActivityStrip active={loading} />

      {/* Action row: cost estimator + button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
        {/* Removed local cost estimator to prioritize global navbar balance */}

        <Button variant="contained" size="large" onClick={handleGenerate}
          disabled={loading || (tab === 0 ? !text.trim() : !file) || isLowBalance}
          startIcon={<VolumeUp />}
          sx={{
            borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
            background: G, boxShadow: '0 4px 20px rgba(245,158,11,0.2)',
            '&:hover': { background: 'linear-gradient(135deg,#fbbf24,#d97706)', boxShadow: '0 6px 28px rgba(245,158,11,0.35)', transform: 'translateY(-1px)' },
            '&.Mui-disabled': { background: 'rgba(17, 17, 17, 0.08)', color: 'rgba(17, 17, 17,0.3)', boxShadow: 'none' },
          }}>
          {loading ? 'Generating…' : isLowBalance ? 'Insufficient Credits' : 'Generate Speech'}
        </Button>
      </Box>
      <AvoicesBackdropLoader open={loading} message="Synthesizing Speech…" submessage="Please wait while we generate your high-quality audio." />

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: '92vw', md: 600, lg: 640 }, borderLeft: '1px solid rgba(17, 17, 17,0.07)' } }}>
        {docId && <ViewttsAudioComponent audioId={docId} />}
      </Drawer>
    </Box>
  );
}
