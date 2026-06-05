import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box, Typography, IconButton, Tooltip, Chip, Stack,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { dataAPI } from '../services/api';
import YouTubeVideoComponent from "./YouTubeVideoComponent";
import { useNavigate } from 'react-router-dom';
import {
  ResultViewLayout, ResultSection, ResultLangAccordion, ResultCodeBlock,
  rvLangChipSx, RV_AC,
} from './result-view';

const LANG_NAMES = { en: 'English', lg: 'Luganda', at: 'Ateso', ac: 'Acholi', nyn: 'Runyankore', fr: 'French', es: 'Spanish', de: 'German', it: 'Italian', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', hi: 'Hindi', sw: 'Swahili', rw: 'Kinyarwanda' };
const getLangName = (code) => LANG_NAMES[code] || (code || '').toUpperCase();

const VideoPlaceholder = ({ filename }) => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(232, 160, 32, 0.05)', border: '2px dashed rgba(232, 160, 32, 0.28)', borderRadius: '12px', textAlign: 'center', p: 4 }}>
    <VideoFileIcon sx={{ fontSize: 72, color: RV_AC, mb: 2, opacity: 0.6 }} />
    <Typography sx={{ color: '#111111', fontWeight: 700, mb: 1 }}>Video processed</Typography>
    <Typography sx={{ color: 'rgba(17, 17, 17, 0.5)', fontSize: '0.85rem', mb: 2 }}>{filename || 'Video file'}</Typography>
    <Stack direction="row" alignItems="center" gap={1}>
      <PlayCircleOutlineIcon sx={{ color: RV_AC, fontSize: 18 }} />
      <Typography variant="body2" sx={{ color: RV_AC, fontWeight: 600 }}>Audio extracted and transcribed</Typography>
    </Stack>
  </Box>
);

const ViewVideoComponent = ({ audioId }) => {
  const navigate = useNavigate();
  const translationsRef = useRef(null);
  const playerRef = useRef(null);

  const isRemoteVideo = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.startsWith('http');
  };

  const [videoData, setVideoData] = useState({ url: "", date: "", title: "", source_lang: "en", formatted_transcript: null, response_format: null });
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
        if (!entries?.length) throw new Error("No video data available");
        const entry = entries[0];
        translationsRef.current = entry.translations || entry.Translations;
        setVideoData({
          url: entry.url || entry.Url,
          date: entry.Date || entry.date,
          title: entry.title || "Video Translation",
          source_lang: entry.source_lang || 'en',
          formatted_transcript: entry.formatted_transcript,
          response_format: entry.response_format,
        });
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
    if (!translationsRef.current?.[lang]) return;
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

  const handleCopy = (text) => { if (text) navigator.clipboard.writeText(text); };

  const langChips = languages.length > 0 && (
    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
      {languages.map(lang => (
        <Chip key={lang} label={getLangName(lang)} size="small" onClick={() => handleLanguageChange(lang)} sx={rvLangChipSx(selectedLanguage === lang)} />
      ))}
      <Tooltip title="Download transcript">
        <IconButton size="small" onClick={handleDownload} sx={{ background: 'rgba(232, 160, 32, 0.1)', color: RV_AC, border: '1px solid rgba(232, 160, 32, 0.22)' }}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <ResultViewLayout
      type="video"
      title={videoData.title}
      date={videoData.date}
      onBack={() => navigate(-1)}
      loading={loading}
      error={error}
      headerActions={langChips}
      badges={languages.length ? [{ label: `${languages.length} languages` }] : []}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', background: 'rgba(17, 17, 17, 0.03)', border: '1px solid rgba(17, 17, 17, 0.06)', mb: 3 }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {isRemoteVideo(videoData.url) ? (
            <YouTubeVideoComponent videoUrl={videoData.url} onTimeUpdate={handleTimeUpdate} ref={playerRef} />
          ) : (
            <VideoPlaceholder filename={videoData.url} />
          )}
        </Box>
      </Box>

      <ResultSection
        title={`Original transcript (${videoData.source_lang || 'en'})`}
        icon={LanguageIcon}
        onCopy={transcripts.full ? () => handleCopy(transcripts.full) : undefined}
      >
        <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
          {transcripts.full || "No original transcript available"}
        </Typography>
      </ResultSection>

      {videoData.formatted_transcript && (
        <ResultSection
          title={`Formatted output (${(videoData.response_format || 'raw').toUpperCase()})`}
          highlight
          onCopy={() => handleCopy(typeof videoData.formatted_transcript === 'string' ? videoData.formatted_transcript : JSON.stringify(videoData.formatted_transcript, null, 2))}
        >
          <ResultCodeBlock>
            {typeof videoData.formatted_transcript === 'string'
              ? videoData.formatted_transcript
              : JSON.stringify(videoData.formatted_transcript, null, 2)}
          </ResultCodeBlock>
        </ResultSection>
      )}

      {languages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 800, color: '#111111', fontSize: '0.9rem', mb: 2, px: 0.5 }}>
            Translations ({languages.length})
          </Typography>
          {languages.map((language) => {
            const translations = translationsRef.current?.[language];
            const segmentCount = Array.isArray(translations) ? translations.length : 0;
            return (
              <ResultLangAccordion
                key={language}
                langCode={language}
                langLabel={getLangName(language)}
                meta={`${segmentCount} segments`}
                expanded={selectedLanguage === language}
                onChange={() => handleLanguageChange(language)}
              >
                <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                  {Array.isArray(translations) ? translations.map(s => s.text).join(' ') : (typeof translations === 'string' ? translations : "No translation available")}
                </Typography>
                <Tooltip title="Download translation">
                  <IconButton
                    size="small"
                    onClick={() => downloadTranslation(language, translations)}
                    sx={{ mt: 1.5, color: 'rgba(17, 17, 17, 0.35)', '&:hover': { color: RV_AC } }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ResultLangAccordion>
            );
          })}
        </Box>
      )}
    </ResultViewLayout>
  );
};

export default ViewVideoComponent;
