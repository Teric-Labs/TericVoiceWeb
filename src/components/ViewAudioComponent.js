import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, IconButton, Chip, Stack, Tooltip, Button, TextField, Alert,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { transcriptionAPI } from '../services/api';
import AudioPlayerComponent from "./AudioPlayerComponent";
import { useNavigate } from 'react-router-dom';
import {
  ResultViewLayout, ResultSection, ResultLangAccordion, ResultCodeBlock,
  rvLangChipSx, RV_AC,
} from './result-view';
import SendToStudioButton from './SendToStudioButton';

const LANG_NAMES = { en: 'English', lg: 'Luganda', at: 'Ateso', ac: 'Acholi', nyn: 'Runyankore', fr: 'French', es: 'Spanish', sw: 'Swahili', rw: 'Kinyarwanda' };
const getLangName = (code) => LANG_NAMES[code] || (code || 'Unknown').toUpperCase();

const getStoredUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.uid || u.userId || null;
  } catch {
    return null;
  }
};

const ViewAudioComponent = ({ audioId, embedded = false, onError }) => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
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

  const loadAudio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transcriptionAPI.getAudio(audioId);
      const data = response.entries;
      setEntries(data);
      if (data.length > 0 && data[0].Url) {
        setAudioSource(data[0].Url[0].audio_file_url);
        setDate(data[0].Date);
        setTitle(data[0].title);
        const langs = Object.keys(data[0].Translations || {});
        setAvailableLanguages(langs);
        if (langs.length > 0) {
          setSelectedLanguage(langs[0]);
          updateSegmentDisplay(data[0].Translations[langs[0]], 0);
        }
      } else {
        setError("Audio source not available.");
      }
    } catch {
      const msg = "Failed to fetch audio data.";
      setError(msg);
      onError?.({ message: msg });
    } finally {
      setLoading(false);
    }
  }, [audioId, onError]);

  useEffect(() => {
    loadAudio();
  }, [loadAudio]);

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

  const entry = entries[0];
  const originalText = entry?.Original_transcript || entry?.original_transcript || entry?.OriginalTranscript || '';

  const pipelineText = () => {
    if (selectedLanguage && entry?.Translations?.[selectedLanguage]) {
      return renderTranslationContent(entry.Translations[selectedLanguage]);
    }
    return originalText || '';
  };
  const pipelineLang = selectedLanguage || entry?.source_lang || 'en';

  const handleStartEdit = () => {
    setEditText(originalText);
    setIsEditing(true);
    setSaveMsg(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText('');
    setSaveMsg(null);
  };

  const handleSaveEdit = async () => {
    const userId = getStoredUserId();
    if (!userId) {
      setSaveMsg({ type: 'error', text: 'Please log in again to save changes.' });
      return;
    }
    const trimmed = editText.trim();
    if (!trimmed) {
      setSaveMsg({ type: 'error', text: 'Transcript cannot be empty.' });
      return;
    }

    setSaving(true);
    setSaveMsg(null);
    try {
      await transcriptionAPI.updateTranscript(audioId, userId, trimmed);
      setEntries(prev => {
        if (!prev.length) return prev;
        const next = [...prev];
        const updated = { ...next[0], Original_transcript: trimmed, original_transcript: trimmed };
        if (typeof updated.formatted_transcript === 'string') {
          updated.formatted_transcript = trimmed;
        }
        next[0] = updated;
        return next;
      });
      setIsEditing(false);
      setSaveMsg({ type: 'success', text: 'Transcript saved.' });
      window.dispatchEvent(new CustomEvent('library-updated'));
    } catch (e) {
      setSaveMsg({
        type: 'error',
        text: e.response?.data?.detail || 'Could not save transcript. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const transcriptActions = (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {!isEditing ? (
        <Tooltip title="Edit transcript">
          <IconButton
            size="small"
            onClick={handleStartEdit}
            disabled={!originalText && !loading}
            sx={{ color: 'rgba(17, 17, 17, 0.35)', '&:hover': { color: RV_AC, background: 'rgba(232, 160, 32, 0.08)' } }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Button
            size="small"
            variant="contained"
            startIcon={<SaveOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={handleSaveEdit}
            disabled={saving}
            sx={{
              textTransform: 'none', fontWeight: 800, fontSize: '0.72rem', borderRadius: '8px',
              background: 'linear-gradient(135deg, #E8A020, #C47F10)', color: '#111', boxShadow: 'none',
              '&:hover': { opacity: 0.92, boxShadow: 'none' },
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <IconButton size="small" onClick={handleCancelEdit} disabled={saving} sx={{ color: 'rgba(17, 17, 17, 0.4)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const headerActions = (
    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
      {availableLanguages.map(lang => (
        <Chip
          key={lang}
          label={getLangName(lang)}
          size="small"
          onClick={() => {
            setSelectedLanguage(lang);
            if (entry?.Translations) updateSegmentDisplay(entry.Translations[lang], 0);
          }}
          sx={rvLangChipSx(lang === selectedLanguage)}
        />
      ))}
      {selectedLanguage && (
        <Tooltip title="Download transcript">
          <IconButton size="small" onClick={handleDownloadTranscript} sx={{ background: 'rgba(232, 160, 32, 0.1)', color: RV_AC, border: '1px solid rgba(232, 160, 32, 0.22)' }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {(originalText || availableLanguages.length > 0) && !isEditing && (
        <SendToStudioButton
          targets={['translate', 'synthesize', 'voiceover', 'dubbing']}
          getPayload={() => ({ text: pipelineText(), sourceLang: entry?.source_lang || 'en', targetLang: pipelineLang })}
        />
      )}
    </Stack>
  );

  return (
    <ResultViewLayout
      type="transcription"
      title={audioTitle || 'Audio Transcription'}
      date={audioDate}
      onBack={embedded ? null : () => navigate(-1)}
      loading={loading}
      error={error}
      empty={!loading && !error && entries.length === 0}
      emptyMessage="No transcription data"
      emptyIcon={GraphicEqIcon}
      headerActions={headerActions}
      badges={availableLanguages.length ? [{ label: `${availableLanguages.length} languages` }] : []}
      maxWidth={embedded ? false : 'lg'}
    >
      {saveMsg && (
        <Alert severity={saveMsg.type} onClose={() => setSaveMsg(null)} sx={{ mb: 2, borderRadius: '12px' }}>
          {saveMsg.text}
        </Alert>
      )}

      {entry && (
        <>
          <ResultSection
            title={`Original transcript (${getLangName(entry.source_lang)})`}
            icon={LanguageIcon}
            onCopy={!isEditing && originalText ? () => handleCopy(originalText) : undefined}
          >
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: isEditing ? 1.5 : 0 }}>
              {transcriptActions}
            </Stack>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                minRows={embedded ? 8 : 12}
                maxRows={24}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your transcript…"
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    color: '#111111',
                    lineHeight: 1.75,
                    fontSize: '0.92rem',
                    background: 'rgba(255,255,255,0.7)',
                  },
                }}
              />
            ) : (
              <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                {originalText || "No original transcript available"}
              </Typography>
            )}
          </ResultSection>

          {entry.formatted_transcript && !isEditing && (
            <ResultSection
              title={`Formatted output (${(entry.response_format || 'raw').toUpperCase()})`}
              icon={LanguageIcon}
              highlight
              onCopy={() => handleCopy(typeof entry.formatted_transcript === 'string' ? entry.formatted_transcript : JSON.stringify(entry.formatted_transcript, null, 2))}
            >
              <ResultCodeBlock>
                {typeof entry.formatted_transcript === 'string'
                  ? entry.formatted_transcript
                  : JSON.stringify(entry.formatted_transcript, null, 2)}
              </ResultCodeBlock>
            </ResultSection>
          )}

          {availableLanguages.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 800, color: '#111111', fontSize: '0.9rem', mb: 2, px: 0.5 }}>
                Translations ({availableLanguages.length})
              </Typography>
              {availableLanguages.map((langCode, i) => (
                <ResultLangAccordion
                  key={langCode}
                  langCode={langCode}
                  langLabel={getLangName(langCode)}
                  meta={`${String(renderTranslationContent(entry.Translations[langCode]) || '').length} chars`}
                  expanded={activeTab === i}
                  onChange={() => setActiveTab(i)}
                  onCopy={() => handleCopy(renderTranslationContent(entry.Translations[langCode]))}
                >
                  <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                    {renderTranslationContent(entry.Translations[langCode])}
                  </Typography>
                </ResultLangAccordion>
              ))}
            </Box>
          )}

          {selectedLanguage && currentSegment && !isEditing && (
            <ResultSection title={`Now playing — ${getLangName(selectedLanguage)}`} highlight>
              <Typography sx={{ color: '#111111', fontWeight: 600, lineHeight: 1.75 }}>
                {currentSegment}
              </Typography>
            </ResultSection>
          )}

          {audioSource && (
            <ResultSection title="Source audio" icon={GraphicEqIcon}>
              <AudioPlayerComponent
                audioSrc={audioSource}
                onTimeUpdate={(t) => {
                  if (entry && selectedLanguage && entry.Translations) {
                    updateSegmentDisplay(entry.Translations[selectedLanguage], t);
                  }
                }}
              />
            </ResultSection>
          )}
        </>
      )}
    </ResultViewLayout>
  );
};

export default ViewAudioComponent;
