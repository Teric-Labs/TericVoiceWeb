import React, { useEffect, useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Button, Container, Stack, LinearProgress, Snackbar, Alert,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  GetApp as DownloadIcon,
  ContentCopy as CopyIcon,
  Translate as TranslateIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' };

const ViewTranslationsComponent = ({ translationId }) => {
  const [entries, setEntries] = useState([]);
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [copyToast, setCopyToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await dataAPI.getTranslation(translationId);
        setEntries(response.entries);
        if (response.entries.length > 0) {
          setScriptDate(response.entries[0].Date);
          setScriptTitle(response.entries[0].title);
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchEntries();
  }, [translationId]);

  const downloadAsText = () => {
    let content = `Title: ${scriptTitle}\nDate: ${scriptDate}\n\n`;
    if (entries.length > 0) {
      content += `Original (${entries[0].sourceLanguage}):\n${entries[0].Original_transcript}\n\n`;
      Object.entries(entries[0].Translations || {}).forEach(([lang, t]) => {
        content += `${lang.toUpperCase()}:\n${t}\n\n`;
      });
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptTitle || 'translation'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => setCopyToast(true));
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', mb: 0.5 }}>
                {scriptTitle || 'Translation'}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                {scriptDate ? new Date(scriptDate).toLocaleString() : '—'}
              </Typography>
            </Box>
            <Button
              startIcon={<DownloadIcon />}
              onClick={downloadAsText}
              sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 700, background: G, color: '#fff', px: 3, '&:hover': { opacity: 0.9 } }}
            >
              Download
            </Button>
          </Stack>
        </Box>

        {loading && <LinearProgress sx={{ borderRadius: 4, mb: 3, '& .MuiLinearProgress-bar': { background: G } }} />}

        {entries.length === 0 && !loading && (
          <Box sx={{ ...GLASS, p: 6, textAlign: 'center' }}>
            <TranslateIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>No translation data available</Typography>
          </Box>
        )}

        {/* Original Transcript */}
        {entries.length > 0 && (
          <Box sx={{ ...GLASS, p: { xs: 3, md: 4 }, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                Original ({entries[0].sourceLanguage?.toUpperCase() || '—'})
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(entries[0].Original_transcript)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {entries[0].Original_transcript}
            </Typography>
          </Box>
        )}

        {/* Translations */}
        {entries.length > 0 && Object.entries(entries[0].Translations || {}).map(([lang, translation], i) => (
          <Accordion
            key={i}
            sx={{
              mb: 2, borderRadius: '16px !important', '&:before': { display: 'none' },
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />} sx={{ borderRadius: '16px' }}>
              <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {lang.toUpperCase()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, flex: 1 }}>
                  {translation}
                </Typography>
                <IconButton size="small" onClick={() => copyToClipboard(translation)} sx={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, '&:hover': { color: '#0ea5e9' } }}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      <Snackbar open={copyToast} autoHideDuration={2000} onClose={() => setCopyToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setCopyToast(false)} sx={{ borderRadius: '12px' }}>
          Copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewTranslationsComponent;