import React, { useEffect, useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  IconButton, Button, Container, Stack, LinearProgress, Chip, Tooltip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Language as LanguageIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { dataAPI } from '../services/api';
import AudioPlayerComponent from "./AudioPlayerComponent";
import { useNavigate } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' };

const LANG_NAMES = { en: 'English', lg: 'Luganda', at: 'Ateso', ac: 'Acholi', nyn: 'Runyankore', fr: 'French', es: 'Spanish', sw: 'Swahili', rw: 'Kinyarwanda' };
const getLangName = (code) => LANG_NAMES[code] || (code || 'Unknown').toUpperCase();

const ViewAudioComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [audioDate, setDate] = useState("");
  const [audioTitle, setTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentSegment, setCurrentSegment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const navigate = useNavigate();

  const renderTranslationContent = (data) => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.map(s => s.text).join(' ');
    return "No translation available";
  };

  const updateSegmentDisplay = (segments, time) => {
    if (typeof segments === 'string') { setCurrentSegment(segments); return; }
    if (Array.isArray(segments) && segments.length > 0) {
      const active = segments.find(s => time >= s.start_time && time <= s.end_time);
      setCurrentSegment(active ? active.text : "No transcript at this time");
    } else { setCurrentSegment("No transcript available"); }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await dataAPI.getAudio(audioId);
        const data = response.entries;
        setEntries(data);
        if (data.length > 0 && data[0].Url) {
          setAudioSource(data[0].Url[0].audio_file_url);
          setDate(data[0].Date);
          setTitle(data[0].title);
          const langs = Object.keys(data[0].Translations || {});
          setAvailableLanguages(langs);
          if (langs.length > 0) { setSelectedLanguage(langs[0]); updateSegmentDisplay(data[0].Translations[langs[0]], 0); }
        } else { setError("Audio source not available."); }
      } catch { setError("Failed to fetch audio data."); }
      finally { setLoading(false); }
    };
    fetch();
  }, [audioId]);

  const handleDownloadTranscript = () => {
    if (!entries.length || !selectedLanguage) return;
    const data = entries[0].Translations[selectedLanguage];
    const text = typeof data === 'string' ? data : Array.isArray(data) ? data.map(s => s.text).join('\n\n') : "No transcript";
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `transcript_${selectedLanguage}_${audioTitle}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleCopy = (text) => { navigator.clipboard.writeText(text).catch(() => {}); };

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
                {audioTitle || 'Audio Transcription'}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                {audioDate ? new Date(audioDate).toLocaleDateString() : '—'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {availableLanguages.map(lang => (
                <Chip
                  key={lang}
                  label={getLangName(lang)}
                  size="small"
                  onClick={() => { setSelectedLanguage(lang); if (entries.length > 0 && entries[0].Translations) updateSegmentDisplay(entries[0].Translations[lang], 0); }}
                  sx={{
                    fontWeight: 700, cursor: 'pointer',
                    ...(lang === selectedLanguage
                      ? { background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' })
                  }}
                />
              ))}
              {selectedLanguage && (
                <Tooltip title="Download Transcript">
                  <IconButton size="small" onClick={handleDownloadTranscript} sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', '&:hover': { background: 'rgba(14,165,233,0.2)' } }}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Box>

        {loading && <LinearProgress sx={{ borderRadius: 4, mb: 3, '& .MuiLinearProgress-bar': { background: G } }} />}
        {error && <Box sx={{ ...GLASS, p: 4, textAlign: 'center' }}><Typography sx={{ color: '#f87171' }}>{error}</Typography></Box>}

        {!loading && !error && entries.length > 0 && (
          <>
            {/* Original Transcript */}
            <Box sx={{ ...GLASS, p: { xs: 3, md: 4 }, mb: 3 }}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <LanguageIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  Original Transcript ({getLangName(entries[0].source_lang)})
                </Typography>
                {entries[0]?.Original_transcript && (
                  <IconButton size="small" onClick={() => handleCopy(entries[0].Original_transcript)} sx={{ ml: 'auto', color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {entries[0]?.Original_transcript || entries[0]?.original_transcript || entries[0]?.OriginalTranscript || "No original transcript available"}
              </Typography>
            </Box>

            {/* All Translations */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2, px: 1 }}>
                <LanguageIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  Translations ({availableLanguages.length})
                </Typography>
              </Stack>
              {availableLanguages.map((langCode, i) => (
                <Accordion
                  key={langCode}
                  expanded={activeTab === i}
                  onChange={() => setActiveTab(i)}
                  sx={{ mb: 2, borderRadius: '16px !important', '&:before': { display: 'none' }, background: 'rgba(255,255,255,0.02)', border: langCode === selectedLanguage ? '1px solid rgba(14,165,233,0.3)' : '1px solid rgba(255,255,255,0.07)', boxShadow: 'none' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />} sx={{ borderRadius: '16px' }}>
                    <Stack direction="row" alignItems="center" gap={2} sx={{ width: '100%' }}>
                      <Chip label={langCode.toUpperCase()} size="small" sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 800, fontSize: '0.7rem' }} />
                      <Typography sx={{ fontWeight: 700, color: '#f8fafc' }}>{getLangName(langCode)}</Typography>
                      <Typography variant="caption" sx={{ ml: 'auto', color: 'rgba(255,255,255,0.3)' }}>
                        {entries[0].Translations[langCode]?.length || 0} chars
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, flex: 1, whiteSpace: 'pre-wrap' }}>
                        {renderTranslationContent(entries[0].Translations[langCode])}
                      </Typography>
                      <IconButton size="small" onClick={() => handleCopy(renderTranslationContent(entries[0].Translations[langCode]))} sx={{ flexShrink: 0, color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Current Segment */}
            {selectedLanguage && currentSegment && (
              <Box sx={{ ...GLASS, p: 3, mb: 3, borderColor: 'rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.05)' }}>
                <Typography variant="caption" sx={{ color: '#0ea5e9', fontWeight: 800, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Segment — {getLangName(selectedLanguage)}
                </Typography>
                <Typography sx={{ color: '#f8fafc', fontWeight: 600, lineHeight: 1.7 }}>
                  {currentSegment}
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Audio Player */}
        {audioSource && (
          <Box sx={{ ...GLASS, p: 3 }}>
            <AudioPlayerComponent
              audioSrc={audioSource}
              onTimeUpdate={(t) => {
                if (entries.length > 0 && selectedLanguage && entries[0].Translations) {
                  updateSegmentDisplay(entries[0].Translations[selectedLanguage], t);
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ViewAudioComponent;