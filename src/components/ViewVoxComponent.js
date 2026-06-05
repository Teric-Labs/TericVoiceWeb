import React, { useEffect, useState } from "react";
import { Typography, Button, Snackbar, Alert, Stack, Box } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TranslateIcon from '@mui/icons-material/Translate';
import HearingIcon from '@mui/icons-material/Hearing';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  ResultViewLayout, ResultLangAccordion, rvPrimaryButtonSx, RV_AC,
} from './result-view';

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
        if (!response.entries?.length) throw new Error("No entries");
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
      if (!texts?.length) throw new Error("No transcript");
      const content = texts.map(item => (typeof item === 'string' ? item : `[${formatTime(item.start_time)}] ${item.text}`)).join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `transcript_${language}.txt`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: "Transcript downloaded", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Download failed", severity: "error" });
    }
  };

  const handleDownloadAudio = (audioUrl, language) => {
    try {
      const link = document.createElement("a");
      link.href = decodeURIComponent(audioUrl);
      link.download = `audio_${language}.wav`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setSnackbar({ open: true, message: "Audio download started", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Download failed", severity: "error" });
    }
  };

  const getTranslationText = (translation) => {
    if (typeof translation === 'string') return translation;
    if (Array.isArray(translation)) return translation.map(s => s.text).join('\n');
    return "No translation available";
  };

  const dlButtons = (audioUrl, lang, transcript) => (
    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
      <Button size="small" startIcon={<CloudDownloadIcon />} onClick={() => handleDownloadAudio(audioUrl, lang)} sx={rvPrimaryButtonSx}>
        Audio
      </Button>
      {transcript && (
        <Button
          size="small"
          startIcon={<CloudDownloadIcon />}
          onClick={() => handleDownloadTranscript(lang, Array.isArray(transcript) ? transcript : [transcript])}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, border: '1px solid rgba(232, 160, 32, 0.35)', color: RV_AC }}
        >
          Transcript
        </Button>
      )}
    </Stack>
  );

  return (
    <>
      <ResultViewLayout
        type="vox"
        title="Voice to Voice"
        date={translationData?.Date}
        onBack={() => navigate(-1)}
        loading={loading}
        empty={!loading && !translationData}
        emptyMessage="Failed to load voice data"
        emptyIcon={HearingIcon}
        badges={translationData ? [
          { label: `Source: ${(translationData.source_lang || '—').toUpperCase()}` },
          { label: 'Audio available' },
        ] : []}
      >
        {translationData && (
          <>
            <ResultLangAccordion
              langCode={translationData.source_lang || 'src'}
              langLabel={`Original (${(translationData.source_lang || 'Unknown').toUpperCase()})`}
              defaultExpanded
            >
              {translationData.Original_transcript?.length > 0 ? (
                translationData.Original_transcript.map((seg, i) => (
                  <Box key={i} sx={{ mb: 1.5, display: 'flex', gap: 2 }}>
                    <Typography sx={{ color: RV_AC, fontSize: '0.78rem', fontWeight: 800, minWidth: 48, mt: 0.2 }}>
                      {formatTime(seg.start_time || 0)}
                    </Typography>
                    <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.75 }}>{seg.text}</Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: 'rgba(17, 17, 17, 0.45)' }}>No transcript available</Typography>
              )}
              {translationData.orginal_audio_url && !audioError.original && (
                <Box sx={{ mt: 2 }}>
                  <AudioPlayer
                    src={translationData.orginal_audio_url}
                    customVolumeControls={[]}
                    customAdditionalControls={[]}
                    showJumpControls={false}
                    onError={() => setAudioError(p => ({ ...p, original: true }))}
                  />
                  {dlButtons(translationData.orginal_audio_url, translationData.source_lang || 'original', translationData.Original_transcript)}
                </Box>
              )}
            </ResultLangAccordion>

            {translationData.audio_urls && Object.entries(translationData.audio_urls).map(([langCode, audioUrl], i) => {
              if (!audioUrl || typeof audioUrl !== 'string') return null;
              const translation = translationData.Translations?.[langCode];
              return (
                <ResultLangAccordion
                  key={langCode}
                  langCode={langCode}
                  langLabel={`${langCode.toUpperCase()} translation`}
                  defaultExpanded={i === 0}
                >
                  {!audioError[langCode] ? (
                    <AudioPlayer
                      src={audioUrl}
                      customVolumeControls={[]}
                      customAdditionalControls={[]}
                      showJumpControls={false}
                      onError={() => setAudioError(p => ({ ...p, [langCode]: true }))}
                    />
                  ) : (
                    <Typography sx={{ color: '#ef4444', mb: 1 }}>Cannot play {langCode.toUpperCase()} audio</Typography>
                  )}
                  {translation && (
                    <Box sx={{ mt: 2, p: 2, borderRadius: '12px', background: 'rgba(17, 17, 17, 0.02)', border: '1px solid rgba(17, 17, 17, 0.06)' }}>
                      <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85 }}>
                        {getTranslationText(translation)}
                      </Typography>
                    </Box>
                  )}
                  {dlButtons(audioUrl, langCode, translation)}
                </ResultLangAccordion>
              );
            })}
          </>
        )}
      </ResultViewLayout>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ViewVoxComponent;
