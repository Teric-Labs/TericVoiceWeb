import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Container,
  Chip,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  CloudDownload as DownloadIcon,
  Translate as TranslateIcon,
  VolumeUp as VolumeUpIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { dataAPI } from '../services/api';

const ViewVoxComponent = ({ voiceId }) => {
  const [translationData, setTranslationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [audioError, setAudioError] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try the real API first
        try {
          const response = await dataAPI.getTTSVoice(voiceId);
          console.log("=== API RESPONSE DEBUG ===");
          console.log("Full API response:", response);
          console.log("Response data:", response.data);
          
          if (!response.entries || response.entries.length === 0) {
            console.log("ERROR: No entries found in response");
            throw new Error("No entries found");
          }
          
          const data = response.entries[0];
          console.log("=== EXTRACTED DATA DEBUG ===");
          console.log("Extracted data:", data);
          console.log("audio_urls property:", data.audio_urls);
          
          setTranslationData(data);
        } catch (apiError) {
          console.error("API Error:", apiError);
          
          // Fallback to mock data for testing
          console.log("Using mock data for testing...");
          const mockData = {
            "source_lang": "en",
            "user_id": "9090",
            "Original_transcript": [
              {
                "start_time": 0,
                "text": "Hey, welcome to our podcast. Today, we are diving into the world of artificial intelligence. It's pretty exciting stuff.",
                "end_time": 14.427
              }
            ],
            "Translations": {
              "en": [
                {
                  "start_time": 0,
                  "text": "Hey, welcome to our podcast. Today, we are diving into the world of artificial intelligence. It's pretty exciting stuff.",
                  "end_time": 14.427
                }
              ],
              "lg": [
                {
                  "start_time": 0,
                  "text": "Hey, welcome to our podcast. Leero, tubbira mu nsi ya artificial intelligence. Ebintu ebinyuma.",
                  "end_time": 14.427
                }
              ]
            },
            "doc_id": "161b4b00-9367-4654-9eae-3aa6b5c6cfd6",
            "Date": "2025-07-24T09:12:35.735020+00:00",
            "title": "Ethical and meaningful voice note",
            "fileName": "test.wav",
            "audio_urls": {
              "lg": "https://storage.googleapis.com/carryit-7fe2b.appspot.com/output_9090_2025-07-24T09%3A12%3A34.711387.wav"
            },
            "orginal_audio_url": "https://storage.googleapis.com/carryit-7fe2b.appspot.com/test.wav"
          };
          
          setTranslationData(mockData);
          setSnackbar({
            open: true,
            message: "Using mock data - API connection failed",
            severity: "warning",
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load translation data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [voiceId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownloadTranscript = (language, texts) => {
    try {
      if (!texts || texts.length === 0) {
        throw new Error("No transcript available");
      }
      const transcript = texts
        .map((item) => `[${formatTime(item.start_time)}] ${item.text}`)
        .join("\n");
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transcript_${language}_${new Date().toISOString()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Transcript downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to download transcript",
        severity: "error",
      });
    }
  };

  const handleDownloadAudio = (audioUrl, language) => {
    try {
      if (!audioUrl) {
        throw new Error("Invalid audio URL");
      }
      const decodedUrl = decodeURIComponent(audioUrl);
      const link = document.createElement("a");
      link.href = decodedUrl;
      link.download = `audio_${language}_${new Date().toISOString()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbar({
        open: true,
        message: "Audio download started",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to download audio`,
        severity: "error",
      });
    }
  };

  const handleAudioError = (index) => {
    setAudioError((prev) => ({
      ...prev,
      [index]: true,
    }));
    setSnackbar({
      open: true,
      message: `Failed to play audio ${index + 1}`,
      severity: "error",
    });
  };

  const styles = {
    mainPaper: {
      borderRadius: "24px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(25, 118, 210, 0.15)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
      },
    },
    accordion: {
      background: "rgba(255, 255, 255, 0.85)",
      borderRadius: "16px",
      marginBottom: "16px",
      border: "1px solid rgba(25, 118, 210, 0.1)",
      "&:before": { display: "none" },
    },
    audioPlayer: {
      borderRadius: "12px",
      backgroundColor: "rgba(25, 118, 210, 0.05)",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      "& .rhap_main-controls-button": {
        color: theme.palette.primary.main,
      },
      "& .rhap_progress-filled": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .rhap_download-progress": {
        backgroundColor: theme.palette.primary.light,
      },
    },
    translationBox: {
      backgroundColor: "rgba(25, 118, 210, 0.03)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
      border: "1px solid rgba(25, 118, 210, 0.08)",
    },
    downloadButton: {
      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
      color: "white",
      marginRight: "12px",
      marginTop: "12px",
      padding: "8px 16px",
      "&:hover": {
        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
      },
    },
    timestamp: {
      color: theme.palette.text.secondary,
      fontSize: "0.85rem",
      marginRight: "12px",
      minWidth: "60px",
    },
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={0} sx={styles.mainPaper}>
          <Box p={4}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography>Loading translation data...</Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!translationData) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={0} sx={styles.mainPaper}>
          <Box p={4} display="flex" alignItems="center" gap={2}>
            <ErrorIcon color="error" />
            <Typography color="error">Failed to load translation data</Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.mainPaper}>
        <Box p={4}>
          {/* Header Section */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Created on: {new Date(translationData.Date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Africa/Nairobi",
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                File: {translationData.fileName || "Unknown"}
              </Typography>
              <Box mt={2}>
                <Chip
                  icon={<TranslateIcon />}
                  label={`Source: ${translationData.source_lang?.toUpperCase() || "Unknown"}`}
                  sx={{ mr: 1, mb: 1 }}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<VolumeUpIcon />}
                  label="Audio Available"
                  sx={{ mb: 1 }}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Original Transcript Section */}
          <Typography variant="h6" gutterBottom>
            Original Transcript
          </Typography>
          <Accordion sx={styles.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={2}>
                <TranslateIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Original ({translationData.source_lang?.toUpperCase() || "Unknown"})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={styles.translationBox}>
                {translationData.Original_transcript && translationData.Original_transcript.length > 0 ? (
                  translationData.Original_transcript.map((segment, index) => (
                    <Box key={index} display="flex" alignItems="flex-start" mb={2}>
                      <Typography sx={styles.timestamp}>
                        {formatTime(segment.start_time)}
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {segment.text}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">No transcript available</Typography>
                )}
              </Box>
              {translationData.orginal_audio_url ? (
                <Box mb={2}>
                  {audioError["original"] ? (
                    <Typography color="error" sx={{ mb: 2 }}>
                      Error playing original audio
                    </Typography>
                  ) : (
                    <AudioPlayer
                      src={translationData.orginal_audio_url}
                      style={styles.audioPlayer}
                      customVolumeControls={[]}
                      customAdditionalControls={[]}
                      showJumpControls={false}
                      onError={() => handleAudioError("original")}
                    />
                  )}
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadAudio(
                        translationData.orginal_audio_url,
                        translationData.source_lang || "original"
                      )
                    }
                    sx={styles.downloadButton}
                  >
                    Download Original Audio
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadTranscript(
                        translationData.source_lang || "original",
                        translationData.Original_transcript
                      )
                    }
                    sx={styles.downloadButton}
                  >
                    Download Original Transcript
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No audio available for original
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Translated Audio Section */}
          <Typography variant="h6" gutterBottom>
            Translated Audio
          </Typography>
          
          {translationData.audio_urls && Object.keys(translationData.audio_urls).length > 0 ? (
            <Box>
              {Object.entries(translationData.audio_urls).map(([languageCode, audioUrl]) => {
                // Handle cases where audioUrl might be null or empty
                if (!audioUrl || typeof audioUrl !== 'string') {
                  return null;
                }
                
                return (
                  <Accordion key={languageCode} sx={styles.accordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <VolumeUpIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {languageCode.toUpperCase()} Translation
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box mb={2}>
                        {audioError[languageCode] ? (
                          <Typography color="error" sx={{ mb: 2 }}>
                            Error playing {languageCode.toUpperCase()} audio
                          </Typography>
                        ) : (
                          <AudioPlayer
                            src={audioUrl}
                            style={styles.audioPlayer}
                            customVolumeControls={[]}
                            customAdditionalControls={[]}
                            showJumpControls={false}
                            onError={() => handleAudioError(languageCode)}
                          />
                        )}
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadAudio(audioUrl, languageCode)}
                          sx={styles.downloadButton}
                        >
                          Download {languageCode.toUpperCase()} Audio
                        </Button>
                        
                        {/* Display transcript if available for this language */}
                        {translationData.Translations && translationData.Translations[languageCode] && (
                          <>
                            <Box sx={styles.translationBox} mt={2}>
                              <Typography variant="subtitle2" gutterBottom>
                                {languageCode.toUpperCase()} Transcript:
                              </Typography>
                              {(() => {
                                const translation = translationData.Translations[languageCode];
                                
                                // Handle string format (from voice-to-voice API)
                                if (typeof translation === 'string') {
                                  return (
                                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                      {translation}
                                    </Typography>
                                  );
                                }
                                
                                // Handle array format (from audio API)
                                if (Array.isArray(translation)) {
                                  return translation.map((segment, segIndex) => (
                                    <Box key={segIndex} display="flex" alignItems="flex-start" mb={1}>
                                      <Typography sx={styles.timestamp}>
                                        {formatTime(segment.start_time)}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                        {segment.text}
                                      </Typography>
                                    </Box>
                                  ));
                                }
                                
                                // Fallback for unexpected format
                                return (
                                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    Translation format not supported
                                  </Typography>
                                );
                              })()}
                            </Box>
                            <Button
                              startIcon={<DownloadIcon />}
                              onClick={() =>
                                handleDownloadTranscript(languageCode, translationData.Translations[languageCode])
                              }
                              sx={styles.downloadButton}
                            >
                              Download {languageCode.toUpperCase()} Transcript
                            </Button>
                          </>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          ) : (
            <Box>
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No translated audio available
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewVoxComponent;