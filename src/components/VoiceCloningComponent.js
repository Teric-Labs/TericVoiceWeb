import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, FormControl, Select,
  MenuItem, Alert, Stack, Chip, LinearProgress, InputLabel,
  Paper, Slider, Drawer, IconButton as MuiIconButton, Grid,
  Fade, Zoom
} from '@mui/material';
import {
  GraphicEq, CloudUpload, PlayArrow,
  Mic, Stop, CheckCircle,
  Close, Download, Bolt, Star,
  Settings, TextFields, History, AutoAwesome
} from '@mui/icons-material';
import { voiceCloningAPI } from '../services/api';
import { LANGUAGES } from '../constants/languages';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { 
  background: 'rgba(255,255,255,0.03)', 
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)', 
  borderRadius: '20px' 
};

const SELECT_SX = {
  borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiSelect-select': { color: '#f8fafc' }
};

const LABEL_SX = { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#0ea5e9' } };

const MODE = { SAMPLE: 'sample', RECORD: 'record' };

export default function VoiceCloningComponent() {
  const [mode, setMode] = useState(MODE.SAMPLE);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [voiceFile, setVoiceFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [temperature, setTemperature] = useState(0.7);
  const [referenceText, setReferenceText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [clonedData, setClonedData] = useState(null);
  const [showLongRequestAlert, setShowLongRequestAlert] = useState(false);

  const fileRef = useRef(null);
  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => setShowLongRequestAlert(true), 8000);
    } else {
      clearTimeout(timerRef.current);
      setShowLongRequestAlert(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [loading]);

  useEffect(() => () => {
    mediaStream.current?.getTracks().forEach(t => t.stop());
  }, []);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      chunks.current = [];
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mr.ondataavailable = e => chunks.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        mediaStream.current?.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorder.current = mr;
      setIsRecording(true);
    } catch {
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (!text.trim()) { setError('Please enter text to synthesize.'); return; }
    if (mode === MODE.SAMPLE && !voiceFile && !recordedBlob) {
      setError('Please provide a reference voice sample.');
      return;
    }

    const { uid, userId } = getUser();
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('user_id', uid || userId);
      formData.append('temperature', temperature);
      if (referenceText) formData.append('reference_text', referenceText);

      const refAudio = voiceFile || (recordedBlob ? new File([recordedBlob], 'recording.wav', { type: 'audio/wav' }) : null);
      if (refAudio) formData.append('reference_audio', refAudio);

      const res = await voiceCloningAPI.cloneVoice(formData);
      
      // FIX: Robustly handle both string and legacy object array return formats
      const finalUrl = typeof res.audio_url === 'string' ? res.audio_url : (res.audio_url?.[0]?.audio_file_url || res.audio_url);
      
      if (finalUrl) {
        setClonedData(res);
        setAudioUrl(finalUrl);
        setShowResult(true);
      } else {
        throw new Error('Neural engine failed to generate a public preview link.');
      }
    } catch (e) {
      console.error('Cloning error:', e);
      setError(e?.response?.data?.message || 'Synthesis failed. The neural engine is currently under high load.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Grid container spacing={4}>
        {/* Left Side: Configuration & Identity */}
        <Grid item xs={12} md={5}>
          <Fade in timeout={600}>
            <Box>
              <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Bolt sx={{ color: '#0ea5e9' }} /> Neural Voice Identity
              </Typography>
              
              <Box sx={{ ...GLASS, p: 3, mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {[
                    { id: MODE.SAMPLE, label: 'Studio Upload', icon: <CloudUpload sx={{ fontSize: 16 }} /> },
                    { id: MODE.RECORD, label: 'Live Capture', icon: <Mic sx={{ fontSize: 16 }} /> },
                  ].map(m => (
                    <Chip
                      key={m.id}
                      icon={m.icon}
                      label={m.label}
                      onClick={() => { setMode(m.id); setVoiceFile(null); setRecordedBlob(null); }}
                      sx={{
                        fontWeight: 700, borderRadius: '12px', height: 40, flex: 1,
                        ...(mode === m.id
                          ? { background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.3)', '& .MuiChip-icon': { color: '#38bdf8 !important' } }
                          : { background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.05)', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.3) !important' } }),
                      }}
                    />
                  ))}
                </Stack>

                {mode === MODE.SAMPLE && (
                  <Box
                    onClick={() => fileRef.current?.click()}
                    sx={{
                      border: '2px dashed',
                      borderColor: voiceFile ? '#10b981' : 'rgba(255,255,255,0.1)',
                      borderRadius: '16px', p: 4, textAlign: 'center', cursor: 'pointer',
                      background: voiceFile ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.01)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.03)', transform: 'scale(1.01)' },
                    }}
                  >
                    <input ref={fileRef} type="file" accept="audio/*" hidden onChange={e => { setVoiceFile(e.target.files[0]); e.target.value = ''; }} />
                    {voiceFile ? (
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle sx={{ color: '#10b981' }} />
                        </Box>
                        <Box textAlign="left">
                          <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>Sample Ready</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{voiceFile.name}</Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <>
                        <Box sx={{ width: 50, height: 50, borderRadius: '15px', background: 'rgba(14,165,233,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                          <CloudUpload sx={{ fontSize: 28, color: '#0ea5e9' }} />
                        </Box>
                        <Typography sx={{ color: '#f8fafc', fontWeight: 700, mb: 0.5 }}>Upload Audio Reference</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>High-fidelity WAV or MP3 recommended</Typography>
                      </>
                    )}
                  </Box>
                )}

                {mode === MODE.RECORD && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="contained"
                      onClick={isRecording ? stopRecording : startRecording}
                      sx={{
                        borderRadius: '14px', px: 3, py: 1.5, flex: 1,
                        background: isRecording ? '#ef4444' : G,
                        fontWeight: 800, fontSize: '0.9rem',
                        '&:hover': { background: isRecording ? '#dc2626' : G, opacity: 0.9 },
                        boxShadow: isRecording ? '0 0 20px rgba(239,68,68,0.4)' : 'none'
                      }}
                      startIcon={isRecording ? <Stop /> : <Mic />}
                    >
                      {isRecording ? 'Stop Capture' : 'Start Capture'}
                    </Button>
                    {isRecording && (
                      <Zoom in>
                        <Typography sx={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }}>REC</Typography>
                      </Zoom>
                    )}
                    {recordedBlob && !isRecording && <CheckCircle sx={{ color: '#10b981' }} />}
                  </Stack>
                )}
              </Box>

              <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Settings sx={{ color: '#8b5cf6' }} /> Engine Parameters
              </Typography>
              
              <Box sx={{ ...GLASS, p: 3 }}>
                <FormControl size="small" fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={LABEL_SX}>Target Language</InputLabel>
                  <Select value={language} label="Target Language" onChange={e => setLanguage(e.target.value)} sx={SELECT_SX}>
                    {LANGUAGES.map(l => (
                      <MenuItem key={l.value} value={l.value} sx={{ color: '#fff', '&.Mui-selected': { background: 'rgba(14,165,233,0.2)' } }}>
                        {l.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ mb: 1 }}>
                   <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Variation</Typography>
                    <Typography sx={{ color: '#0ea5e9', fontWeight: 800 }}>{temperature.toFixed(2)}</Typography>
                  </Stack>
                  <Slider 
                    value={temperature} min={0} max={1} step={0.05} 
                    onChange={(e, v) => setTemperature(v)}
                    sx={{ color: '#0ea5e9', '& .MuiSlider-thumb': { background: '#fff' } }}
                  />
                </Box>
              </Box>
            </Box>
          </Fade>
        </Grid>

        {/* Right Side: Synthesis Payload */}
        <Grid item xs={12} md={7}>
          <Fade in timeout={900}>
            <Box>
              <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TextFields sx={{ color: '#10b981' }} /> Narration Script
              </Typography>

              <Paper sx={{ ...GLASS, p: 3, background: 'rgba(15,23,42,0.4)' }}>
                <TextField
                  fullWidth multiline rows={8}
                  placeholder="Enter the premium narration text here..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true, style: { color: '#f8fafc', fontSize: '1.1rem', lineHeight: 1.6 } }}
                />
                
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{text.length} / 2000 characters</Typography>
                  <Button
                    variant="contained"
                    disabled={loading || !text.trim()}
                    onClick={handleSubmit}
                    startIcon={loading ? null : <AutoAwesome />}
                    sx={{
                      borderRadius: '50px', px: 5, py: 1.5, fontWeight: 900,
                      background: G, boxShadow: '0 8px 32px rgba(139,92,246,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(139,92,246,0.5)' },
                      '&.Mui-disabled': { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    {loading ? 'Processing Studio Synthesis...' : 'INITIATE CLONING'}
                  </Button>
                </Box>
              </Paper>

              <Box sx={{ mt: 3, ...GLASS, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, borderRadius: '8px', background: 'rgba(139,92,246,0.1)' }}>
                  <GraphicEq sx={{ color: '#8b5cf6' }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem italic' }}>
                  "Neural voice cloning achieves peak fidelity when the reference audio is clean and the target text matches the speaker's natural rhythm."
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Grid>
      </Grid>

      {/* Result Drawer (Voicify / ElevenLabs Elite Style) */}
      <Drawer
        anchor="right"
        open={showResult}
        onClose={() => setShowResult(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '550px' }, background: '#0a0b10', borderLeft: '1px solid rgba(255,255,255,0.1)' } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 4, background: G, position: 'relative', textAlign: 'center' }}>
            <MuiIconButton onClick={() => setShowResult(false)} sx={{ position: 'absolute', right: 16, top: 16, color: '#fff' }}><Close /></MuiIconButton>
            <Box sx={{ width: 64, height: 64, borderRadius: '20px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Star sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>Premium Clone Ready</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>High-Fidelity Vocal Reconstruction Complete</Typography>
          </Box>

          <Box sx={{ p: 4, flex: 1, overflowY: 'auto' }}>
            <Paper sx={{ ...GLASS, p: 3, mb: 4, background: 'rgba(255,255,255,0.02)' }}>
              <Typography sx={{ color: '#0ea5e9', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', mb: 3 }}>Neural Synthesis Output</Typography>
              <AudioPlayer
                src={audioUrl}
                autoPlay={false}
                showJumpControls={false}
                customAdditionalControls={[]}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', boxShadow: 'none' }}
              />
              <Button
                fullWidth variant="contained"
                startIcon={<Download />}
                href={audioUrl} download="neural_clone.wav"
                sx={{ mt: 3, py: 2, borderRadius: '14px', background: 'rgba(255,255,255,0.05)', fontWeight: 800, '&:hover': { background: 'rgba(14,165,233,0.1)' } }}
              >
                Download Master WAV
              </Button>
            </Paper>

            <Box sx={{ p: 3, borderRadius: '20px', background: 'linear-gradient(rgba(14,165,233,0.05), rgba(139,92,246,0.05))', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography sx={{ color: '#f8fafc', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History sx={{ color: '#38bdf8' }} /> Studio Persistence
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, mb: 2 }}>
                This synthesis has been indexed in your private studio library. You can re-access or re-narrate your script variations at any time.
              </Typography>
              <Button component={Link} to="/dashboard/history" sx={{ color: '#0ea5e9', textTransform: 'none', fontWeight: 800, p: 0 }}>Access Studio Library →</Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Fade in={showLongRequestAlert}>
        <Alert 
          severity="info" 
          icon={<Bolt sx={{ color: '#0ea5e9' }} />}
          sx={{ 
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', 
            borderRadius: '12px', background: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 9999, minWidth: 320,
            '& .MuiAlert-icon': { color: '#0ea5e9' }
          }}
        >
          High-fidelity neural synthesis typically takes a few moments to propagate...
        </Alert>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ position: 'fixed', bottom: 24, right: 24, borderRadius: '12px', background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
