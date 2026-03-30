import React, { useState } from 'react';
import {
  Box, Button, FormControl, Grid, Select, MenuItem,
  TextField, Alert, Tab, Tabs, Drawer, LinearProgress,
  InputLabel, Chip, IconButton, Stack,
} from '@mui/material';
import { VolumeUp, CloudUpload, SwapHoriz, CheckCircle } from '@mui/icons-material';
import ViewttsAudioComponent from './ViewttsAudioComponent';
import { ttsAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import { LANGUAGES } from '../constants/languages';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' };
const SELECT_SX = {
  borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
};
const LABEL_SX = { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#0ea5e9' } };

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

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  const swapLangs = () => {
    if (targetLangs.length === 1) { setSourceLang(targetLangs[0]); setTargetLangs([sourceLang]); }
  };

  const handleGenerate = async () => {
    setError(null); setLoading(true); setDocId(null); setDrawerOpen(false);
    try {
      const { userId } = getUser();
      if (!userId) throw new Error('Please log in to use text-to-speech');
      if (tab === 0) {
        if (!text.trim()) throw new Error('Please enter text to synthesize');
        if (text.length > 5000) throw new Error('Text exceeds 5000 character limit');
        await checkUsageBeforeRequest('vocify');
        const res = await ttsAPI.synthesizeText(text, sourceLang, userId);
        if (!res.doc_id) throw new Error('No document ID received');
        setDocId(res.doc_id);
      } else {
        if (!file) throw new Error('Please select a document');
        if (file.size > 10 * 1024 * 1024) throw new Error('File must be under 10MB');
        if (!targetLangs.length) throw new Error('Select at least one target language');
        await checkUsageBeforeRequest('synthesize_document');
        const res = await ttsAPI.translateDocumentWithTTS(file, sourceLang, targetLangs, userId);
        if (!res.doc_id) throw new Error('No document ID received');
        setDocId(res.doc_id);
      }
      setDrawerOpen(true);
    } catch (e) {
      const info = handleAPIError(e, 'synthesize');
      if (info.shouldUpgrade) window.dispatchEvent(new CustomEvent('show-upgrade-modal', { detail: info }));
      setError(info.message || e.message || 'Generation failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(null); }}
          sx={{ minHeight: 40, '& .MuiTabs-indicator': { background: G, height: 2, borderRadius: 1 } }}>
          {[
            { label: 'Text to Speech', icon: <VolumeUp sx={{ fontSize: 17 }} /> },
            { label: 'Document to Speech', icon: <CloudUpload sx={{ fontSize: 17 }} /> },
          ].map(({ label, icon }, i) => (
            <Tab key={i} label={label} icon={icon} iconPosition="start" sx={{
              textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40,
              color: tab === i ? '#0ea5e9' : 'rgba(255,255,255,0.4)',
              '&.Mui-selected': { color: '#0ea5e9' },
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
              {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={swapLangs} sx={{
            width: 36, height: 36, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)',
            color: '#0ea5e9', '&:hover': { background: 'rgba(14,165,233,0.25)' },
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
                    sx={{ background: 'rgba(14,165,233,0.2)', color: '#0ea5e9', fontSize: '0.72rem', borderRadius: '50px' }} />)}
                </Box>
              )}>
              {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
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
            '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#0ea5e9' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#0ea5e9' } },
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
              borderColor: file ? '#0ea5e9' : 'rgba(255,255,255,0.08)',
              background: file ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)' },
            }}>
              {file ? (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <CheckCircle sx={{ color: '#0ea5e9', fontSize: 22 }} />
                  <Box sx={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</Box>
                </Stack>
              ) : (
                <>
                  <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <CloudUpload sx={{ fontSize: 26, color: '#8b5cf6' }} />
                  </Box>
                  <Box sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>Click to upload document</Box>
                  <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>PDF, DOC, DOCX, TXT · Max 10 MB</Box>
                </>
              )}
            </Box>
          </label>
        </Box>
      )}

      {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, height: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" onClick={handleGenerate}
          disabled={loading || (tab === 0 ? !text.trim() : !file)}
          startIcon={<VolumeUp />}
          sx={{
            borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
            background: G, boxShadow: '0 4px 20px rgba(139,92,246,0.2)',
            '&:hover': { background: 'linear-gradient(135deg,#0284c7,#8b5cf6)', boxShadow: '0 6px 28px rgba(139,92,246,0.35)', transform: 'translateY(-1px)' },
            '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
          }}>
          {loading ? 'Generating…' : 'Generate Speech'}
        </Button>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: '92vw', md: 600, lg: 640 }, background: '#0a0a0f', borderLeft: '1px solid rgba(255,255,255,0.07)' } }}>
        {docId && <ViewttsAudioComponent audioId={docId} />}
      </Drawer>
    </Box>
  );
}
