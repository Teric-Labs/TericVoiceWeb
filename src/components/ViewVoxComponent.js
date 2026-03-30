import React, { useEffect, useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Button, Snackbar, Alert, LinearProgress, Container, Stack, Chip,
} from "@mui/material";
import {
  CloudDownload as DownloadIcon,
  Translate as TranslateIcon,
  VolumeUp as VolumeUpIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' };

const ViewVoxComponent = ({ voiceId }) => {
  const [translationData, setTranslationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [audioError, setAudioError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dataAPI.getTTSVoice(voiceId);
        if (!response.entries || response.entries.length === 0) throw new Error("No entries found");
        setTranslationData(response.entries[0]);
      } catch {
        setSnackbar({ open: true, message: "Failed to load voice data", severity: "error" });
      } finally { setLoading(false); }
    };
    fetchData();
  }, [voiceId]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  const handleDownloadTranscript = (language, texts) => {
    try {
      if (!texts || texts.length === 0) throw new Error("No transcript");
      const content = texts.map(item => (typeof item === 'string' ? item : `[${formatTime(item.start_time)}] ${item.text}`)).join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `transcript_${language}_${new Date().toISOString()}.txt`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: "Transcript downloaded", severity: "success" });
    } catch { setSnackbar({ open: true, message: "Download failed", severity: "error" }); }
  };

  const handleDownloadAudio = (audioUrl, language) => {
    try {
      const link = document.createElement("a");
      link.href = decodeURIComponent(audioUrl);
      link.download = `audio_${language}.wav`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setSnackbar({ open: true, message: "Audio download started", severity: "success" });
    } catch { setSnackbar({ open: true, message: "Download failed", severity: "error" }); }
  };

  const getTranslationText = (translation) => {
    if (typeof translation === 'string') return translation;
    if (Array.isArray(translation)) return translation.map(s => s.text).join('\n');
    return "No translation available";
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0f', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontWeight: 700, borderRadius: '50px', px: 2, '&:hover': { color: '#0ea5e9', background: 'rgba(14,165,233,0.08)' } }}
        >
          Back to History
        </Button>

        {loading && <LinearProgress sx={{ borderRadius: 4, mb: 3, '& .MuiLinearProgress-bar': { background: G } }} />}

        {!loading && !translationData && (
          <Box sx={{ ...GLASS, p: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#f87171', fontWeight: 700 }}>Failed to load voice data</Typography>
          </Box>
        )}

        {translationData && (
          <>
            {/* Header */}
            <Box sx={{ ...GLASS, p: { xs: 3, md: 4 }, mb: 3 }}>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.4rem', md: '1.9rem' }, background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', mb: 0.5 }}>
                Voice-to-Voice
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip label={`Source: ${(translationData.source_lang || 'Unknown').toUpperCase()}`} size="small" icon={<TranslateIcon sx={{ fontSize: 13 }} />} sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', fontWeight: 700 }} />
                <Chip label="Audio Available" size="small" icon={<VolumeUpIcon sx={{ fontSize: 13 }} />} sx={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', fontWeight: 700 }} />
              </Stack>
              <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 1.5 }}>
                {translationData.Date ? new Date(translationData.Date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : '—'}
              </Typography>
            </Box>

            {/* Original Transcript */}
            <Accordion sx={{ mb: 2, borderRadius: '16px !important', '&:before': { display: 'none' }, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'none' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />} sx={{ borderRadius: '16px' }}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <TranslateIcon sx={{ color: '#0ea5e9', fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>Original ({(translationData.source_lang || 'Unknown').toUpperCase()})</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                {translationData.Original_transcript && translationData.Original_transcript.length > 0 ? (
                  translationData.Original_transcript.map((seg, i) => (
                    <Box key={i} sx={{ mb: 1.5, display: 'flex', gap: 2 }}>
                      <Typography sx={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: 700, minWidth: 50, mt: 0.2 }}>{formatTime(seg.start_time || 0)}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{seg.text}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>No transcript available</Typography>
                )}
                {translationData.orginal_audio_url && (
                  <Box sx={{ mt: 2 }}>
                    <AudioPlayer src={translationData.orginal_audio_url} style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.03)', boxShadow: 'none' }} customVolumeControls={[]} customAdditionalControls={[]} showJumpControls={false} onError={() => setAudioError(p => ({ ...p, original: true }))} />
                    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                      <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownloadAudio(translationData.orginal_audio_url, translationData.source_lang || 'original')} sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, background: G, color: '#fff', '&:hover': { opacity: 0.9 } }}>Audio</Button>
                      <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownloadTranscript(translationData.source_lang || 'original', translationData.Original_transcript)} sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', '&:hover': { background: 'rgba(14,165,233,0.1)' } }}>Transcript</Button>
                    </Stack>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Translated Audio */}
            {translationData.audio_urls && Object.entries(translationData.audio_urls).map(([langCode, audioUrl]) => {
              if (!audioUrl || typeof audioUrl !== 'string') return null;
              const translation = translationData.Translations?.[langCode];
              return (
                <Accordion key={langCode} sx={{ mb: 2, borderRadius: '16px !important', '&:before': { display: 'none' }, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8b5cf6' }} />} sx={{ borderRadius: '16px' }}>
                    <Stack direction="row" alignItems="center" gap={2}>
                      <VolumeUpIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                      <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>{langCode.toUpperCase()} Translation</Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    {!audioError[langCode] && (
                      <AudioPlayer src={audioUrl} style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.03)', boxShadow: 'none' }} customVolumeControls={[]} customAdditionalControls={[]} showJumpControls={false} onError={() => setAudioError(p => ({ ...p, [langCode]: true }))} />
                    )}
                    {audioError[langCode] && <Typography sx={{ color: '#f87171', mb: 1 }}>Cannot play {langCode.toUpperCase()} audio</Typography>}
                    {translation && (
                      <Box sx={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', p: 2.5, mt: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                          {getTranslationText(translation)}
                        </Typography>
                      </Box>
                    )}
                    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                      <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownloadAudio(audioUrl, langCode)} sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, background: G, color: '#fff', '&:hover': { opacity: 0.9 } }}>Audio</Button>
                      {translation && <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownloadTranscript(langCode, [translation])} sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', '&:hover': { background: 'rgba(14,165,233,0.1)' } }}>Transcript</Button>}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </>
        )}
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewVoxComponent;