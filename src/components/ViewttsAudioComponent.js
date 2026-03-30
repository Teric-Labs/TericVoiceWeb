import React, { useEffect, useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Button, Snackbar, Container, Stack, Chip, LinearProgress,
} from "@mui/material";
import {
  CloudDownload as DownloadIcon,
  Translate as TranslateIcon,
  VolumeUp as VolumeUpIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' };

const ViewttsAudioComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [audioDate, setAudioDate] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await dataAPI.getVocifyVoice(audioId);
        const fetchedEntries = response.entries;
        if (fetchedEntries.length > 0) {
          setEntries(fetchedEntries);
          setAudioDate(fetchedEntries[0].date);
          setAudioTitle(fetchedEntries[0].title);
        }
      } catch {
        setSnackbarMessage("Failed to fetch audio data");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [audioId]);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => { setSnackbarMessage("Text copied to clipboard"); setSnackbarOpen(true); })
      .catch(() => { setSnackbarMessage("Failed to copy text"); setSnackbarOpen(true); });
  };

  const handleDownload = (audioUrl) => {
    try {
      const link = document.createElement("a");
      link.href = decodeURIComponent(audioUrl);
      link.download = "";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSnackbarMessage("Download initiated.");
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Download failed.");
      setSnackbarOpen(true);
    }
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

        {/* Header */}
        <Box sx={{ ...GLASS, p: { xs: 3, md: 4 }, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', mb: 0.5 }}>
                {audioTitle || 'TTS Audio'}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                Created: {audioDate ? new Date(audioDate).toLocaleString() : '—'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip icon={<TranslateIcon sx={{ fontSize: 13 }} />} label="Multi-language" size="small" sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', fontWeight: 700 }} />
                <Chip icon={<VolumeUpIcon sx={{ fontSize: 13 }} />} label="Audio Ready" size="small" sx={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', fontWeight: 700 }} />
              </Stack>
            </Box>
          </Stack>
        </Box>

        {loading && <LinearProgress sx={{ borderRadius: 4, mb: 3, '& .MuiLinearProgress-bar': { background: G } }} />}

        {/* Content */}
        {entries.length > 0 && Object.entries(entries[0].translations_with_tts || {}).map(([lang, data]) => (
          <Accordion
            key={lang}
            sx={{
              mb: 2, borderRadius: '16px !important', '&:before': { display: 'none' },
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />}
              sx={{ borderRadius: '16px', '& .MuiAccordionSummary-content': { my: 1.5 } }}
            >
              <Stack direction="row" alignItems="center" gap={2}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TranslateIcon sx={{ fontSize: 17, color: '#0ea5e9' }} />
                </Box>
                <Typography sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                  {lang.toUpperCase()} Translation
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              {/* Translation Text */}
              <Box sx={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', p: 2.5, mb: 2.5, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem', pr: 5 }}>
                  {data.translation}
                </Typography>
                <IconButton
                  onClick={() => handleCopyText(data.translation)}
                  size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>
              {/* Audio Player */}
              <Box sx={{ mb: 2 }}>
                <AudioPlayer
                  src={data.audio_file_path}
                  style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.03)', boxShadow: 'none' }}
                  customVolumeControls={[]}
                  customAdditionalControls={[]}
                  showJumpControls={false}
                />
              </Box>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(data.audio_file_path)}
                sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, background: G, color: '#fff', px: 3, '&:hover': { opacity: 0.9 } }}
              >
                Download Audio
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ViewttsAudioComponent;