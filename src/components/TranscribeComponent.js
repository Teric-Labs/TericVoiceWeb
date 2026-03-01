import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Snackbar, Alert,
  FormControl, Select, MenuItem, IconButton, Tab, Tabs,
  Chip, Drawer, LinearProgress, InputLabel, Stack,
} from '@mui/material';
import {
  CloudUpload, Mic, Stop, PlayArrow, Pause,
  DeleteOutline, Send, CheckCircle,
} from '@mui/icons-material';
import { transcriptionAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import { LANGUAGES } from '../constants/languages';
import ViewAudioComponent from './ViewAudioComponent';
import UpgradePromptModal from './UpgradePromptModal';

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

export default function TranscribeComponent() {
  const [tab, setTab] = useState(0);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLangs, setTargetLangs] = useState([]);
  const [file, setFile] = useState(null);
  const [blob, setBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [upgradeModal, setUpgradeModal] = useState({ open: false, data: null });

  const recorder = useRef(null);
  const stream = useRef(null);
  const player = useRef(null);
  const fileInput = useRef(null);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => () => {
    stream.current?.getTracks().forEach(t => t.stop());
    if (audioURL) URL.revokeObjectURL(audioURL);
  }, [audioURL]);

  const notify = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  const toggleRecording = async () => {
    if (isRecording) {
      recorder.current?.stop();
      stream.current?.getTracks().forEach(t => t.stop());
      stream.current = null;
      setIsRecording(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.current = s;
        const chunks = [];
        const mr = new MediaRecorder(s);
        mr.ondataavailable = e => e.data.size > 0 && chunks.push(e.data);
        mr.onstop = () => {
          const b = new Blob(chunks, { type: 'audio/webm' });
          if (b.size > 0) { setBlob(b); setAudioURL(URL.createObjectURL(b)); }
          else notify('No audio recorded', 'warning');
        };
        mr.start(1000);
        recorder.current = mr;
        setIsRecording(true);
      } catch { notify('Microphone access denied', 'error'); }
    }
  };

  const discardRecording = () => {
    stream.current?.getTracks().forEach(t => t.stop());
    if (audioURL) URL.revokeObjectURL(audioURL);
    setBlob(null); setAudioURL(null); setIsPlaying(false);
    if (player.current) player.current.pause();
  };

  const togglePlay = () => {
    if (!player.current || !audioURL) return;
    if (isPlaying) { player.current.pause(); setIsPlaying(false); }
    else { player.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  const handleSubmit = async () => {
    if (!targetLangs.length) { notify('Select at least one target language', 'error'); return; }
    if (tab === 0 && !file) { notify('Please select a file', 'error'); return; }
    if (tab === 1 && !blob) { notify('Please record audio first', 'error'); return; }
    setLoading(true); setDocId(null);
    try {
      const usage = await checkUsageBeforeRequest('upload');
      if (!usage.allowed) {
        setUpgradeModal({ open: true, data: { currentUsage: usage.current_usage, limit: usage.limit, tier: usage.tier } });
        return;
      }
      const { uid, userId } = getUser();
      const id = uid || userId;
      if (!id) { notify('Please log in again', 'error'); return; }
      const res = tab === 0
        ? await transcriptionAPI.uploadAudio(file, sourceLang, targetLangs, id)
        : await transcriptionAPI.uploadRecordedAudio(blob, sourceLang, targetLangs, id);
      setDocId(res.doc_id);
      setDrawerOpen(true);
      notify('Transcription submitted!');
    } catch (e) {
      const info = handleAPIError(e, 'upload');
      if (info.shouldUpgrade) window.dispatchEvent(new CustomEvent('show-upgrade-modal', { detail: info }));
      else notify(info.message || 'Upload failed. Please try again.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <Box>
      {/* Mode Tabs */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': { background: G, height: 2, borderRadius: 1 },
          }}
        >
          {['Upload File', 'Record Audio'].map((label, i) => (
            <Tab key={i} label={label} sx={{
              textTransform: 'none', fontWeight: 600, fontSize: '0.85rem',
              color: tab === i ? '#38bdf8' : 'rgba(255,255,255,0.4)',
              minHeight: 40,
              '&.Mui-selected': { color: '#38bdf8' },
            }} />
          ))}
        </Tabs>
      </Box>

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
      {tab === 0 && (
        <>
          <input ref={fileInput} type="file" accept="audio/*,video/*" hidden onChange={e => { setFile(e.target.files[0]); e.target.value = ''; }} />
          <Box onClick={() => fileInput.current?.click()} sx={{
            ...GLASS,
            p: 4, textAlign: 'center', cursor: 'pointer', mb: 3,
            borderStyle: 'dashed',
            borderColor: file ? '#10b981' : 'rgba(255,255,255,0.08)',
            background: file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.25s ease',
            '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)', transform: 'scale(1.005)' },
          }}>
            {file ? (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
                <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</Typography>
              </Stack>
            ) : (
              <>
                <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <CloudUpload sx={{ fontSize: 26, color: '#0ea5e9' }} />
                </Box>
                <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>Drop your file here or click to browse</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>MP3, WAV, MP4, AVI · Max 10 MB</Typography>
              </>
            )}
          </Box>
        </>
      )}

      {/* Record zone */}
      {tab === 1 && (
        <Box sx={{ ...GLASS, p: 3, mb: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
            <Button
              variant={isRecording ? 'contained' : 'outlined'}
              startIcon={isRecording ? <Stop /> : <Mic />}
              onClick={toggleRecording}
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 2.5,
                ...(isRecording
                  ? { background: 'rgba(239,68,68,0.8)', color: '#fff', borderColor: 'transparent', '&:hover': { background: 'rgba(220,38,38,0.9)' } }
                  : { borderColor: '#0ea5e9', color: '#38bdf8', '&:hover': { background: 'rgba(14,165,233,0.08)' } }),
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {isRecording && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444', animation: 'pulse 1s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
                <Typography sx={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 600 }}>Recording…</Typography>
              </Box>
            )}
            {audioURL && !isRecording && (
              <>
                <Button variant="outlined" size="small" startIcon={isPlaying ? <Pause /> : <PlayArrow />} onClick={togglePlay}
                  sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', '&:hover': { borderColor: '#8b5cf6', color: '#a78bfa' } }}>
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <IconButton onClick={discardRecording} size="small" sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
                <audio ref={player} src={audioURL} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />
              </>
            )}
          </Stack>
        </Box>
      )}

      {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, height: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />}

      <Button
        variant="contained" size="large" onClick={handleSubmit}
        disabled={loading || (tab === 0 ? !file : !blob)}
        startIcon={<Send />}
        sx={{
          borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
          background: G, boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
          '&:hover': { background: 'linear-gradient(135deg,#0284c7,#7c3aed)', boxShadow: '0 6px 28px rgba(14,165,233,0.5)', transform: 'translateY(-1px)' },
          '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
        }}
      >
        {loading ? 'Processing…' : 'Transcribe'}
      </Button>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, background: '#0f0f2d', borderLeft: '1px solid rgba(255,255,255,0.07)' } }}>
        {docId && <ViewAudioComponent audioId={docId} onError={e => { notify(e.message, 'error'); setDrawerOpen(false); }} />}
      </Drawer>

      <UpgradePromptModal open={upgradeModal.open} onClose={() => setUpgradeModal({ open: false, data: null })}
        currentUsage={upgradeModal.data?.currentUsage || 0} limit={upgradeModal.data?.limit || 0}
        endpoint="upload" tier={upgradeModal.data?.tier || 'free_trial'} />
    </Box>
  );
}
