import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box, Typography, Button, IconButton, Tooltip, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, Chip, Stack, Container,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { dataAPI } from '../services/api';
import YouTubeVideoComponent from "./YouTubeVideoComponent";
import { useNavigate } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' };

const LANG_NAMES = { en: 'English', lg: 'Luganda', at: 'Ateso', ac: 'Acholi', nyn: 'Runyankore', fr: 'French', es: 'Spanish', de: 'German', it: 'Italian', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', hi: 'Hindi', sw: 'Swahili', rw: 'Kinyarwanda' };
const getLangName = (code) => LANG_NAMES[code] || (code || '').toUpperCase();

const ViewVideoComponent = ({ audioId }) => {
  const navigate = useNavigate();
  const translationsRef = useRef(null);
  const playerRef = useRef(null);

  const isRemoteVideo = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.startsWith('http');
  };

  const VideoPlaceholder = ({ filename }) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(14,165,233,0.05)', border: '2px dashed rgba(14,165,233,0.3)', borderRadius: '12px', textAlign: 'center', p: 4 }}>
      <VideoFileIcon sx={{ fontSize: 72, color: '#0ea5e9', mb: 2, opacity: 0.6 }} />
      <Typography sx={{ color: '#f8fafc', fontWeight: 700, mb: 1 }}>Video Processed</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 2 }}>{filename || 'Video file'}</Typography>
      <Stack direction="row" alignItems="center" gap={1}>
        <PlayCircleOutlineIcon sx={{ color: '#0ea5e9', fontSize: 18 }} />
        <Typography variant="body2" sx={{ color: '#0ea5e9', fontWeight: 600 }}>Audio extracted and transcribed</Typography>
      </Stack>
    </Box>
  );

  const [videoData, setVideoData] = useState({ url: "", date: "", title: "", source_lang: "en" });
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [transcripts, setTranscripts] = useState({ full: "", current: "", segments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeTranscript = useCallback((language, translations) => {
    if (!translations) { setTranscripts({ full: "", current: "No transcript available", segments: [] }); return; }
    if (typeof translations === 'string') {
      const clean = translations.replace(/^"|"$/g, '');
      setTranscripts({ full: clean, current: clean, segments: [{ text: clean, start_time: 0, end_time: 0 }] });
      return;
    }
    if (Array.isArray(translations)) {
      const full = translations.map(s => s.text).join('\n\n');
      setTranscripts({ full, current: translations[0]?.text || "No transcript", segments: translations });
    }
  }, []);

  const updateCurrentTranscript = useCallback((time) => {
    if (!transcripts.segments.length) return;
    const seg = transcripts.segments.find(s => time >= s.start_time && time <= s.end_time);
    if (seg) setTranscripts(prev => ({ ...prev, current: seg.text }));
  }, [transcripts.segments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dataAPI.getVideo(audioId);
        const entries = response.entries;
        if (!entries || entries.length === 0) throw new Error("No video data available");
        const entry = entries[0];
        translationsRef.current = entry.translations || entry.Translations;
        setVideoData({ url: entry.url || entry.Url, date: entry.Date || entry.date, title: entry.title || "Video Translation", source_lang: entry.source_lang || 'en' });
        const langs = Object.keys(entry.translations || entry.Translations || {});
        setLanguages(langs);
        if (langs.length > 0) {
          setSelectedLanguage(langs[0]);
          initializeTranscript(langs[0], (entry.translations || entry.Translations)[langs[0]]);
        }
        if (entry.original_transcript) setTranscripts(prev => ({ ...prev, full: entry.original_transcript }));
      } catch (err) {
        setError(err.message || "Failed to fetch video data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [audioId, initializeTranscript]);

  const handleLanguageChange = useCallback((lang) => {
    if (!translationsRef.current || !translationsRef.current[lang]) return;
    setSelectedLanguage(lang);
    initializeTranscript(lang, translationsRef.current[lang]);
  }, [initializeTranscript]);

  const handleTimeUpdate = useCallback((time) => { updateCurrentTranscript(time); }, [updateCurrentTranscript]);

  const handleDownload = useCallback(() => {
    if (!transcripts.segments.length) return;
    const text = transcripts.segments.map(s => s.text).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `transcript_${selectedLanguage}_${videoData.title}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [transcripts.segments, selectedLanguage, videoData.title]);

  const downloadTranslation = (language, translations) => {
    const text = Array.isArray(translations) ? translations.map(s => s.text).join('\n\n') : (typeof translations === 'string' ? translations : '');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `translation_${language}_${videoData.title}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // Optional: add a snackbar notification here if needed, 
    // but the task is just to fix the error.
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#0a0a0f', py: 4 }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontWeight: 700, borderRadius: '50px', px: 2, '&:hover': { color: '#0ea5e9', background: 'rgba(14,165,233,0.08)' } }}>
            Back to History
          </Button>
          <Box sx={{ ...GLASS, p: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#f87171', fontWeight: 700 }}>{error}</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

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
                {videoData.title}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                {videoData.date ? new Date(videoData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              {languages.map(lang => (
                <Chip
                  key={lang}
                  label={getLangName(lang)}
                  size="small"
                  onClick={() => handleLanguageChange(lang)}
                  sx={{
                    fontWeight: 700, cursor: 'pointer',
                    ...(selectedLanguage === lang
                      ? { background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' })
                  }}
                />
              ))}
              <Tooltip title="Download Transcript">
                <IconButton size="small" onClick={handleDownload} sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', '&:hover': { background: 'rgba(14,165,233,0.2)' } }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* Video */}
        <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', mb: 3 }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {isRemoteVideo(videoData.url) ? (
              <YouTubeVideoComponent videoUrl={videoData.url} onTimeUpdate={handleTimeUpdate} ref={playerRef} />
            ) : (
              <VideoPlaceholder filename={videoData.url} />
            )}
          </Box>
        </Box>

        {/* Original Transcript */}
        <Box sx={{ ...GLASS, p: { xs: 3, md: 4 }, mb: 3 }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <LanguageIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>
              Original Transcript ({videoData.source_lang || 'en'})
            </Typography>
            {transcripts.full && (
              <IconButton size="small" onClick={() => handleCopy(transcripts.full)} sx={{ ml: 'auto', color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}>
                <CopyIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {transcripts.full || "No original transcript available"}
          </Typography>
        </Box>

        {/* Formatted Transcript (SRT, VTT, etc.) */}
        {videoData?.formatted_transcript && (
          <Box sx={{ ...GLASS, p: { xs: 3, md: 4 }, mb: 3, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <CopyIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>
                Formatted Output ({videoData.response_format?.toUpperCase() || 'RAW'})
              </Typography>
              <IconButton size="small" onClick={() => handleCopy(videoData.formatted_transcript)} sx={{ ml: 'auto', color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#8b5cf6' } }}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Box sx={{ 
              background: 'rgba(0,0,0,0.3)', 
              p: 2, 
              borderRadius: '12px', 
              fontFamily: "'Fira Code', monospace", 
              fontSize: '0.85rem',
              maxHeight: '400px',
              overflowY: 'auto',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {typeof videoData.formatted_transcript === 'string' 
                  ? videoData.formatted_transcript 
                  : JSON.stringify(videoData.formatted_transcript, null, 2)}
              </pre>
            </Box>
          </Box>
        )}

        {/* All Translations - Only show if available */}
        {languages.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2, px: 1 }}>
              <LanguageIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800, color: '#f8fafc' }}>All Translations ({languages.length})</Typography>
            </Stack>

            {languages.map((language) => {
              const translations = translationsRef.current?.[language];
              const isExpanded = selectedLanguage === language;
              return (
                <Accordion
                  key={language}
                  expanded={isExpanded}
                  onChange={() => handleLanguageChange(language)}
                  sx={{ mb: 2, borderRadius: '16px !important', '&:before': { display: 'none' }, background: isExpanded ? 'rgba(14,165,233,0.04)' : 'rgba(255,255,255,0.02)', border: isExpanded ? '1px solid rgba(14,165,233,0.3)' : '1px solid rgba(255,255,255,0.07)', boxShadow: 'none' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#0ea5e9' }} />} sx={{ borderRadius: '16px' }}>
                    <Stack direction="row" alignItems="center" gap={2} sx={{ width: '100%' }}>
                      <Chip label={language.toUpperCase()} size="small" sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 800, fontSize: '0.7rem' }} />
                      <Typography sx={{ fontWeight: 700, color: '#f8fafc' }}>{getLangName(language)}</Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>{Array.isArray(translations) ? translations.length : 0} segments</Typography>
                        <Tooltip title="Download Translation">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); downloadTranslation(language, translations); }}
                            sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {Array.isArray(translations) ? translations.map(s => s.text).join(' ') : (typeof translations === 'string' ? translations : "No translation available")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ViewVideoComponent;