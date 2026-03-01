import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, FormControl, Select,
  MenuItem, Alert, Stack, Chip, LinearProgress, InputLabel,
} from '@mui/material';
import {
  GraphicEq, CloudUpload, PlayArrow, Pause, AutoAwesome,
  Mic, Stop, CheckCircle,
} from '@mui/icons-material';
import { ttsAPI, voiceToVoiceAPI } from '../services/api';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const fileRef = useRef(null);
  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const audioRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => () => {
    mediaStream.current?.getTracks().forEach(t => t.stop());
  }, []);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      chunks.current = [];
      const mr = new MediaRecorder(stream);
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
    const { uid, userId } = getUser();
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      if (mode === MODE.SAMPLE && (voiceFile || recordedBlob)) {
        const audio = voiceFile || new File([recordedBlob], 'recording.webm', { type: 'audio/webm' });
        const res = await voiceToVoiceAPI.voiceToVoice({
          audio_file: audio,
          source_language: language,
          target_language: language,
          user_id: uid || userId,
        });
        setAudioUrl(res.data?.audio_url || res.data?.url);
      } else {
        const res = await ttsAPI.synthesizeText({
          text,
          language,
          user_id: uid || userId,
        });
        setAudioUrl(res.data?.audio_url || res.data?.url);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Voice synthesis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  return (
    <Box>
      {/* Voice Source */}
      <Box sx={{ ...GLASS, p: 2.5, mb: 2.5 }}>
        <Typography sx={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
          Voice Source
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
          {[
            { id: MODE.SAMPLE, label: 'Upload Sample', icon: <CloudUpload sx={{ fontSize: 16 }} /> },
            { id: MODE.RECORD, label: 'Record Live', icon: <Mic sx={{ fontSize: 16 }} /> },
          ].map(m => (
            <Chip
              key={m.id}
              icon={m.icon}
              label={m.label}
              onClick={() => { setMode(m.id); setVoiceFile(null); setRecordedBlob(null); }}
              sx={{
                fontWeight: 600, borderRadius: '50px', height: 36,
                ...(mode === m.id
                  ? { background: 'rgba(14,165,233,0.2)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.4)', '& .MuiChip-icon': { color: '#38bdf8 !important' } }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.4) !important' } }),
              }}
            />
          ))}
        </Stack>

        {mode === MODE.SAMPLE && (
          <>
            <input ref={fileRef} type="file" accept="audio/*" hidden
              onChange={e => { setVoiceFile(e.target.files[0]); e.target.value = ''; }} />
            <Box
              onClick={() => fileRef.current?.click()}
              sx={{
                border: '1.5px dashed',
                borderColor: voiceFile ? '#10b981' : 'rgba(255,255,255,0.12)',
                borderRadius: '12px', p: 3, textAlign: 'center', cursor: 'pointer',
                background: voiceFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.25s ease',
                '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)' },
              }}
            >
              {voiceFile ? (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                  <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{voiceFile.name}</Typography>
                </Stack>
              ) : (
                <>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                    <CloudUpload sx={{ fontSize: 22, color: '#0ea5e9' }} />
                  </Box>
                  <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                    Click to upload a voice sample
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>MP3, WAV, M4A, WebM · Max 50MB</Typography>
                </>
              )}
            </Box>
          </>
        )}

        {mode === MODE.RECORD && (
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
            <Button
              variant={isRecording ? 'contained' : 'outlined'}
              startIcon={isRecording ? <Stop /> : <Mic />}
              onClick={isRecording ? stopRecording : startRecording}
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 2.5,
                ...(isRecording
                  ? { background: 'rgba(239,68,68,0.85)', color: '#fff', borderColor: 'transparent', '&:hover': { background: 'rgba(220,38,38,0.9)' } }
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
            {recordedBlob && !isRecording && (
              <Chip
                icon={<CheckCircle sx={{ fontSize: '16px !important' }} />}
                label="Recording ready"
                sx={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', '& .MuiChip-icon': { color: '#10b981 !important' } }}
              />
            )}
          </Stack>
        )}
      </Box>

      {/* Language */}
      <FormControl size="small" fullWidth sx={{ mb: 2.5 }}>
        <InputLabel sx={LABEL_SX}>Language</InputLabel>
        <Select value={language} label="Language" onChange={e => setLanguage(e.target.value)} sx={SELECT_SX}>
          {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
        </Select>
      </FormControl>

      {/* Text */}
      <TextField
        multiline rows={4}
        label="Text to synthesize"
        placeholder="Enter the text you want to convert to speech in your cloned voice…"
        value={text}
        onChange={e => setText(e.target.value)}
        fullWidth
        inputProps={{ maxLength: 2000 }}
        helperText={`${text.length} / 2000`}
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#0ea5e9' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } },
          '& .MuiInputLabel-root': LABEL_SX,
          '& .MuiFormHelperText-root': { color: '#64748b' },
        }}
      />

      {error && (
        <Alert severity="error" onClose={() => setError(null)}
          sx={{ mb: 2, borderRadius: '12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, height: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />}

      {/* Submit */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained" size="large"
          startIcon={<AutoAwesome />}
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          sx={{
            borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
            background: G, boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
            '&:hover': { background: 'linear-gradient(135deg,#0284c7,#7c3aed)', boxShadow: '0 6px 28px rgba(139,92,246,0.5)', transform: 'translateY(-1px)' },
            '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
          }}
        >
          {loading ? 'Generating…' : 'Generate Cloned Voice'}
        </Button>
      </Box>

      {/* Result */}
      {audioUrl && (
        <Box sx={{
          ...GLASS, p: 3,
          background: 'rgba(14,165,233,0.06)',
          borderColor: 'rgba(14,165,233,0.25)',
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                background: G,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraphicEq sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>Cloned voice ready</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>Click play to listen</Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              startIcon={isPlaying ? <Pause /> : <PlayArrow />}
              onClick={togglePlay}
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 3,
                background: G,
                '&:hover': { background: 'linear-gradient(135deg,#0284c7,#7c3aed)' },
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </Stack>
          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />
        </Box>
      )}
    </Box>
  );
}
