import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, FormControl, Select,
  MenuItem, Alert, Stack, Chip, InputLabel,
  Paper, Slider, Drawer, IconButton as MuiIconButton, Grid,
  Fade, Zoom, useTheme
} from '@mui/material';
import {
  GraphicEq, CloudUpload,
  Mic, Stop, CheckCircle,
  Close, Download, Bolt, Star,
  Settings, TextFields, History, AutoAwesome,
} from '@mui/icons-material';
import { voiceCloningAPI, subscriptionAPI } from '../services/api';
import { LANGUAGES } from '../constants/languages';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';
import { AvoicesBackdropLoader } from './progress';

const G = 'linear-gradient(135deg, #E8A020, #C47F10)';
const GLASS = { 
  background: 'rgba(17, 17, 17,0.03)', 
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(17, 17, 17, 0.08)', 
  borderRadius: '20px' 
};

const SELECT_SX = {
  borderRadius: '12px', color: '#111111', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(17, 17, 17, 0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E8A020' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E8A020' },
  '& .MuiSvgIcon-root': { color: 'rgba(17, 17, 17, 0.5)' },
  '& .MuiSelect-select': { color: '#111111' }
};

const LABEL_SX = { color: 'rgba(17, 17, 17, 0.5)', '&.Mui-focused': { color: '#E8A020' } };

const MODE = { SAMPLE: 'sample', RECORD: 'record' };

// Voice cloning is a fixed premium cost
const CLONING_COST = 10;

export default function VoiceCloningComponent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const textColor = isDark ? '#ffffff' : '#111111';
  const subTextColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(17, 17, 17, 0.7)';
  const mutedTextColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(17, 17, 17, 0.4)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(17, 17, 17, 0.08)';
  const glassBg = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(17, 17, 17, 0.03)';

  const GLASS = { 
    background: glassBg, 
    backdropFilter: 'blur(12px)',
    border: `1px solid ${borderColor}`, 
    borderRadius: '20px' 
  };

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
  const [referenceText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showLongRequestAlert, setShowLongRequestAlert] = useState(false);
  
  const [userBalance, setUserBalance] = useState(null);
  const isLowBalance = userBalance !== null && userBalance < CLONING_COST;

  const fileRef = useRef(null);
  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const user = getUser();
    const userId = user.uid || user.userId;
    if (userId) {
      subscriptionAPI.getBalance(userId)
        .then(data => {
          setUserBalance(data.balance ?? data.credit_balance ?? null);
          window.dispatchEvent(new CustomEvent('refresh-balance'));
        })
        .catch(() => {});
    }
  }, []);

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
      
      const finalUrl = typeof res.audio_url === 'string' ? res.audio_url : (res.audio_url?.[0]?.audio_file_url || res.audio_url);
      
      if (finalUrl) {
        setAudioUrl(finalUrl);
        setShowResult(true);
        // Refresh balance
        subscriptionAPI.getBalance(uid || userId)
          .then(data => {
            setUserBalance(data.balance ?? data.credit_balance ?? null);
            window.dispatchEvent(new CustomEvent('refresh-balance'));
          })
          .catch(() => {});
      } else {
        throw new Error('Neural engine failed to generate a public preview link.');
      }
    } catch (e) {
      console.error('Cloning error:', e);
      if (e.response?.status === 402) {
        window.dispatchEvent(new CustomEvent('subscription-limit-exceeded', {
          detail: { message: e.response?.data?.detail || 'Insufficient credits.', status: 402 }
        }));
        setError(e.response?.data?.detail || 'Insufficient credits for voice cloning.');
      } else {
        setError(e?.response?.data?.message || 'Synthesis failed. The neural engine is currently under high load.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 0.5, md: 1 } }}>
      <Grid container spacing={2.5}>
        {/* Left Side: Configuration & Identity */}
        <Grid item xs={12} md={5}>
          <Fade in timeout={600}>
            <Box>
              <Typography sx={{ color: 'rgba(17,17,17,0.4)', fontWeight: 800, mb: 1, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Voice Identity
              </Typography>
              <Typography variant="h6" sx={{ color: '#111111', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bolt sx={{ color: '#E8A020' }} /> Reference Voice
              </Typography>
              
              <Box sx={{ ...GLASS, p: 2.5, mb: 2 }}>
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
                          ? { background: 'rgba(232, 160, 32,0.12)', color: '#111111', border: '1px solid rgba(232, 160, 32,0.28)', '& .MuiChip-icon': { color: '#C47F10 !important' } }
                          : { background: 'rgba(17, 17, 17,0.02)', color: 'rgba(17, 17, 17, 0.55)', border: '1px solid rgba(17, 17, 17, 0.06)', '& .MuiChip-icon': { color: 'rgba(17, 17, 17,0.35) !important' } }),
                      }}
                    />
                  ))}
                </Stack>

                {mode === MODE.SAMPLE && (
                  <Box
                    onClick={() => fileRef.current?.click()}
                    sx={{
                      border: '1.5px dashed',
                      borderColor: voiceFile ? '#10b981' : 'rgba(17, 17, 17, 0.1)',
                      borderRadius: '14px', p: 3, textAlign: 'center', cursor: 'pointer',
                      background: voiceFile ? 'rgba(16,185,129,0.03)' : 'rgba(17, 17, 17,0.01)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { borderColor: '#E8A020', background: 'rgba(232, 160, 32,0.03)' },
                    }}
                  >
                    <input ref={fileRef} type="file" accept="audio/*" hidden onChange={e => { setVoiceFile(e.target.files[0]); e.target.value = ''; }} />
                    {voiceFile ? (
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle sx={{ color: '#10b981' }} />
                        </Box>
                        <Box textAlign="left">
                          <Typography sx={{ color: '#111111', fontWeight: 700, fontSize: '0.95rem' }}>Sample Ready</Typography>
                          <Typography sx={{ color: 'rgba(17, 17, 17, 0.5)', fontSize: '0.75rem' }}>{voiceFile.name}</Typography>
                        </Box>
                      </Stack>
                    ) : (
                      <>
                        <Box sx={{ width: 50, height: 50, borderRadius: '15px', background: 'rgba(232, 160, 32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                          <CloudUpload sx={{ fontSize: 28, color: '#E8A020' }} />
                        </Box>
                        <Typography sx={{ color: '#111111', fontWeight: 700, mb: 0.5 }}>Upload Audio Reference</Typography>
                        <Typography sx={{ color: 'rgba(17, 17, 17, 0.45)', fontSize: '0.78rem' }}>Use a clean WAV or MP3 clip for best results</Typography>
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

              <Typography sx={{ color: 'rgba(17,17,17,0.4)', fontWeight: 800, mb: 1, mt: 0.5, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Settings
              </Typography>
              <Typography variant="h6" sx={{ color: '#111111', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Settings sx={{ color: '#C47F10' }} /> Engine Parameters
              </Typography>
              
              <Box sx={{ ...GLASS, p: 2.5 }}>
                <FormControl size="small" fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={LABEL_SX}>Target Language</InputLabel>
                  <Select value={language} label="Target Language" onChange={e => setLanguage(e.target.value)} sx={SELECT_SX}>
                    {LANGUAGES.map(l => (
                      <MenuItem key={l.value} value={l.value} sx={{ color: '#111111', '&.Mui-selected': { background: 'rgba(232, 160, 32,0.2)' } }}>
                        {l.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ mb: 1 }}>
                   <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.6)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Variation</Typography>
                    <Typography sx={{ color: '#C47F10', fontWeight: 800 }}>{temperature.toFixed(2)}</Typography>
                  </Stack>
                  <Slider 
                    value={temperature} min={0} max={1} step={0.05} 
                    onChange={(e, v) => setTemperature(v)}
                    sx={{ color: '#E8A020', '& .MuiSlider-thumb': { background: '#fff' } }}
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
              <Typography sx={{ color: 'rgba(17,17,17,0.4)', fontWeight: 800, mb: 1, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Content
              </Typography>
              <Typography variant="h6" sx={{ color: '#111111', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextFields sx={{ color: '#10b981' }} /> Narration Script
              </Typography>

              <Paper elevation={0} sx={{ ...GLASS, p: 2.5, background: 'rgba(17,17,17,0.02)' }}>
                <TextField
                  fullWidth multiline rows={8}
                  placeholder="Type the script you want synthesized with your cloned voice..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true, style: { color: '#111111', fontSize: '1rem', lineHeight: 1.65 } }}
                />
                
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(17, 17, 17, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.45)', fontSize: '0.78rem', fontWeight: 600 }}>{text.length} / 2000 characters</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Removed local cost estimator to prioritize global navbar balance */}
                    <Button
                      variant="contained"
                      disabled={loading || !text.trim() || isLowBalance}
                      onClick={handleSubmit}
                      startIcon={loading ? null : <AutoAwesome />}
                      sx={{
                        borderRadius: '12px', px: 3, py: 1.2, fontWeight: 900, textTransform: 'none',
                        background: G, boxShadow: '0 8px 32px rgba(232, 160, 32,0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': { boxShadow: '0 12px 40px rgba(232, 160, 32,0.5)' },
                        '&.Mui-disabled': { background: 'rgba(17, 17, 17, 0.05)', color: 'rgba(17, 17, 17, 0.2)' }
                      }}
                    >
                      {loading ? 'Generating Voice...' : isLowBalance ? 'Insufficient Credits' : 'Generate Cloned Voice'}
                    </Button>
                  </Box>
                </Box>
              </Paper>

              <Box sx={{ mt: 2, ...GLASS, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: '8px', background: 'rgba(232, 160, 32,0.1)' }}>
                  <GraphicEq sx={{ color: '#C47F10' }} />
                </Box>
                <Typography sx={{ color: 'rgba(17, 17, 17, 0.62)', fontSize: '0.82rem', fontStyle: 'italic' }}>
                  Best quality comes from clean reference audio and a script with natural pacing.
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Grid>
      </Grid>

      {/* Result Drawer */}
      <Drawer
        anchor="right"
        open={showResult}
        onClose={() => setShowResult(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '550px' }, borderLeft: `1px solid ${borderColor}` } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, background: G, position: 'relative', textAlign: 'center' }}>
            <MuiIconButton onClick={() => setShowResult(false)} sx={{ position: 'absolute', right: 16, top: 16, color: '#111111' }}><Close /></MuiIconButton>
            <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(17, 17, 17, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
              <Star sx={{ color: '#111111', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#111111', fontWeight: 900, mb: 0.75 }}>Clone Ready</Typography>
            <Typography sx={{ color: 'rgba(17, 17, 17, 0.8)', fontSize: '0.82rem' }}>Your generated voice is ready for preview and download.</Typography>
          </Box>

          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Paper sx={{ ...GLASS, p: 2.5, mb: 3, background: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(17, 17, 17, 0.02)' }}>
              <Typography sx={{ color: '#E8A020', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', mb: 2 }}>Generated Output</Typography>
              <AudioPlayer
                src={audioUrl}
                autoPlay={false}
                showJumpControls={false}
                customAdditionalControls={[]}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(17, 17, 17, 0.03)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '14px',
                  boxShadow: 'none',
                  color: textColor
                }}
              />
              <Button
                fullWidth variant="contained"
                startIcon={<Download />}
                href={audioUrl} download="neural_clone.wav"
                sx={{
                  mt: 2,
                  py: 1.25,
                  borderRadius: '12px',
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(17, 17, 17, 0.05)',
                  color: textColor,
                  fontWeight: 800,
                  '&:hover': {
                    background: 'rgba(232, 160, 32, 0.1)',
                    color: '#E8A020'
                  }
                }}
              >
                Download Master WAV
              </Button>
            </Paper>

            <Box sx={{
              p: 2.5,
              borderRadius: '16px',
              background: isDark ? 'rgba(232, 160, 32, 0.08)' : 'rgba(232, 160, 32, 0.04)',
              border: `1px solid ${isDark ? 'rgba(232, 160, 32, 0.2)' : 'rgba(17, 17, 17, 0.05)'}`
            }}>
              <Typography sx={{ color: textColor, fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History sx={{ color: '#F5B844' }} /> Studio Persistence
              </Typography>
              <Typography sx={{ color: subTextColor, fontSize: '0.9rem', lineHeight: 1.6, mb: 2 }}>
                This result is saved in your history library for reuse and download.
              </Typography>
              <Button component={Link} to="/dashboard/history" sx={{ color: '#E8A020', textTransform: 'none', fontWeight: 800, p: 0, '&:hover': { background: 'transparent', textDecoration: 'underline' } }}>Open History Library</Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Fade in={showLongRequestAlert}>
        <Alert 
          severity="info" 
          icon={<Bolt sx={{ color: '#E8A020' }} />}
          sx={{ 
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', 
            borderRadius: '12px', background: 'transparent', border: '1px solid #1A1A1A', color: '#111111',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 9999, minWidth: 320,
            '& .MuiAlert-icon': { color: '#E8A020' }
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
      <AvoicesBackdropLoader open={loading} message="Synthesizing Neural Voice…" submessage="This high-fidelity process requires a few moments to complete." />
    </Box>
  );
}
