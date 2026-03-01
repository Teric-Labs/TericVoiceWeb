import React, { useState, useRef } from 'react';
import {
  Box, Button, FormControl, Grid, Snackbar, Alert, Select,
  MenuItem, Chip, Drawer, LinearProgress, InputLabel, Stack,
} from '@mui/material';
import { CloudUpload, Send, CheckCircle } from '@mui/icons-material';
import { voiceToVoiceAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import { LANGUAGES } from '../constants/languages';
import ViewVoxComponent from './ViewVoxComponent';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const SELECT_SX = {
  borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
};
const LABEL_SX = { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#0ea5e9' } };

export default function SpeechToSpeechForm() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLangs, setTargetLangs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceId, setVoiceId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });

  const fileRef = useRef(null);
  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');
  const notify = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 100 * 1024 * 1024) { notify('File must be under 100MB', 'error'); return; }
    if (!f.type.startsWith('audio/')) { notify('Please upload an audio file', 'error'); return; }
    setFile(f);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!targetLangs.length) { notify('Select at least one target language', 'error'); return; }
    if (!file) { notify('Please upload an audio file', 'error'); return; }
    setLoading(true);
    try {
      await checkUsageBeforeRequest('vocify');
      const { uid, userId } = getUser();
      const id = uid || userId;
      if (!id) { notify('Please log in again', 'error'); return; }
      const res = await voiceToVoiceAPI.voiceToVoice(file, sourceLang, targetLangs, id);
      setVoiceId(res.doc_id || res.voiceId);
      setDrawerOpen(true);
      notify('Voice translation completed!');
    } catch (e) {
      const info = handleAPIError(e);
      if (e.response?.status === 403) window.dispatchEvent(new CustomEvent('show-upgrade-modal'));
      notify(info.message || 'Translation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Language selectors */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={LABEL_SX}>Source Language</InputLabel>
            <Select value={sourceLang} label="Source Language" onChange={e => setSourceLang(e.target.value)} sx={SELECT_SX}>
              {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={LABEL_SX}>Target Languages</InputLabel>
            <Select
              multiple value={targetLangs} label="Target Languages"
              onChange={e => setTargetLangs(e.target.value)} sx={SELECT_SX}
              renderValue={sel => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {sel.map(v => (
                    <Chip key={v} label={LANGUAGES.find(l => l.value === v)?.label || v} size="small"
                      sx={{ background: 'rgba(14,165,233,0.2)', color: '#38bdf8', fontSize: '0.72rem', borderRadius: '50px' }} />
                  ))}
                </Box>
              )}
            >
              {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Upload zone */}
      <input ref={fileRef} type="file" accept="audio/*" hidden onChange={handleFile} />
      <Box
        onClick={() => fileRef.current?.click()}
        sx={{
          border: '1.5px dashed',
          borderColor: file ? '#10b981' : 'rgba(255,255,255,0.12)',
          borderRadius: '14px', p: 4, textAlign: 'center', cursor: 'pointer',
          background: file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
          mb: 3, transition: 'all 0.25s ease',
          '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)', transform: 'scale(1.005)' },
        }}
      >
        {file ? (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
            <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
            <Box sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</Box>
          </Stack>
        ) : (
          <>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <CloudUpload sx={{ fontSize: 26, color: '#8b5cf6' }} />
            </Box>
            <Box sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>Click to upload audio file</Box>
            <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>WAV, MP3, M4A · Max 100MB</Box>
          </>
        )}
      </Box>

      {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, height: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained" size="large" onClick={handleSubmit}
          disabled={loading || !file || !targetLangs.length}
          startIcon={<Send />}
          sx={{
            borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
            background: G, boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
            '&:hover': { background: 'linear-gradient(135deg,#0284c7,#7c3aed)', boxShadow: '0 6px 28px rgba(14,165,233,0.5)', transform: 'translateY(-1px)' },
            '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
          }}
        >
          {loading ? 'Processing…' : 'Translate Voice'}
        </Button>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, background: '#0f0f2d', borderLeft: '1px solid rgba(255,255,255,0.07)' } }}>
        {voiceId && <ViewVoxComponent voiceId={voiceId} />}
      </Drawer>
    </Box>
  );
}
