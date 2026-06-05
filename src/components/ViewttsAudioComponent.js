import React, { useEffect, useState } from "react";
import { Typography, Button, Snackbar, Alert, Box, IconButton, Stack } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  ResultViewLayout, ResultLangAccordion, rvPrimaryButtonSx, RV_AC,
} from './result-view';

const ViewttsAudioComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [audioDate, setAudioDate] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
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
        setSnackbar({ open: true, message: 'Failed to fetch audio data' });
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [audioId]);

  const notify = (message) => setSnackbar({ open: true, message });

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => notify('Copied to clipboard'))
      .catch(() => notify('Failed to copy'));
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
      notify('Download started');
    } catch {
      notify('Download failed');
    }
  };

  const entry = entries[0];
  const ttsMap = entry?.translations_with_tts || {};

  return (
    <>
      <ResultViewLayout
        type="tts"
        title={audioTitle || 'Synthesized audio'}
        date={audioDate}
        onBack={() => navigate(-1)}
        loading={loading}
        empty={!loading && entries.length === 0}
        emptyMessage="No synthesis data available"
        emptyIcon={RecordVoiceOverIcon}
        badges={[
          { label: 'Multi-language' },
          { label: 'Audio ready' },
        ]}
      >
        {Object.entries(ttsMap).map(([lang, data], i) => (
          <ResultLangAccordion
            key={lang}
            langCode={lang}
            langLabel={`${lang.toUpperCase()} — text & audio`}
            defaultExpanded={i === 0}
            onCopy={() => handleCopyText(data.translation)}
          >
            <Box sx={{ position: 'relative', mb: 2.5 }}>
              <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, fontSize: '0.95rem', pr: 5 }}>
                {data.translation}
              </Typography>
              <IconButton
                onClick={() => handleCopyText(data.translation)}
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0, color: 'rgba(17, 17, 17, 0.3)', '&:hover': { color: RV_AC } }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ mb: 2, '& .rhap_container': { borderRadius: '12px', border: '1px solid rgba(17,17,17,0.06)' } }}>
              <AudioPlayer
                src={data.audio_file_path}
                customVolumeControls={[]}
                customAdditionalControls={[]}
                showJumpControls={false}
              />
            </Box>
            <Button
              startIcon={<CloudDownloadIcon />}
              onClick={() => handleDownload(data.audio_file_path)}
              sx={rvPrimaryButtonSx}
            >
              Download audio
            </Button>
          </ResultLangAccordion>
        ))}
      </ResultViewLayout>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" onClose={() => setSnackbar({ open: false, message: '' })} sx={{ borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default ViewttsAudioComponent;
