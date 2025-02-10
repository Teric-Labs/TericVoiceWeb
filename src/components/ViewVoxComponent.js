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
} from "@mui/material";
import {
  CloudDownload as DownloadIcon,
  Translate as TranslateIcon,
  VolumeUp as VolumeUpIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from "axios";

const ViewVoxComponent = ({ voiceId }) => {
  const [translationData, setTranslationData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const apiEndpoint = "https://avoices-13747549899.us-central1.run.app/get_ttsvoice";

    const fetchData = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: voiceId });
        const data = response.data.entries[0];

        if (data && data.source_lang && data.Translations) {
          setTranslationData(data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setSnackbarMessage("Failed to load translation data");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [voiceId]);

  const handleDownloadTranscript = (language, texts) => {
    try {
      const transcript = texts?.map((item) => item.text).join("\n") || "";
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transcript_${language}_${new Date().toISOString()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbarMessage("Transcript downloaded successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to download transcript");
      setSnackbarOpen(true);
    }
  };

  const handleDownloadAudio = (audioUrl, language) => {
    try {
      if (!audioUrl) {
        throw new Error("Audio URL is invalid");
      }

      const decodedUrl = decodeURIComponent(audioUrl);
      const link = document.createElement("a");
      link.href = decodedUrl;
      link.download = `audio_${language}_${new Date().toISOString()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("Audio download started");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to download audio");
      setSnackbarOpen(true);
    }
  };

  const styles = {
    mainPaper: {
      borderRadius: "24px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(25, 118, 210, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    },
    accordion: {
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "16px",
      marginBottom: "16px",
      "&:before": {
        display: "none",
      },
    },
    audioPlayer: {
      borderRadius: "12px",
      backgroundColor: "rgba(25, 118, 210, 0.04)",
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
      backgroundColor: "rgba(25, 118, 210, 0.04)",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
    },
    downloadButton: {
      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
      color: "white",
      marginRight: "8px",
      marginTop: "8px",
      "&:hover": {
        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
      },
    },
  };

  if (!translationData) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={0} sx={styles.mainPaper}>
          <Box p={4}>
            <Typography>Loading translation data...</Typography>
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
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Audio Translation
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Created on: {new Date(translationData?.Date?.seconds * 1000 || Date.now()).toLocaleString()}
              </Typography>
              <Box mt={2}>
                <Chip
                  icon={<TranslateIcon />}
                  label={`Source: ${translationData?.source_lang?.toUpperCase() || "Unknown"}`}
                  sx={{ mr: 1, mb: 1 }}
                  color="primary"
                />
                <Chip
                  icon={<VolumeUpIcon />}
                  label="Audio Available"
                  sx={{ mb: 1 }}
                  color="secondary"
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Translations Section */}
          <Typography variant="h6" gutterBottom>
            Translations
          </Typography>
          {Object.entries(translationData?.Translations || {}).map(
            ([language, translations]) => (
              <Accordion key={language} sx={styles.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TranslateIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {language.toUpperCase()} Translation
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={styles.translationBox}>
                    {translations.map((translation, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        sx={{ color: theme.palette.text.secondary, mb: 2 }}
                      >
                        {translation.text}
                      </Typography>
                    ))}
                  </Box>

                  {translationData?.audio_urls?.[language] && (
                    <Box mb={2}>
                      <AudioPlayer
                        src={translationData.audio_urls[language]}
                        style={styles.audioPlayer}
                        customVolumeControls={[]}
                        customAdditionalControls={[]}
                        showJumpControls={false}
                      />
                      <Button
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownloadAudio(
                            translationData.audio_urls[language],
                            language
                          )
                        }
                        sx={styles.downloadButton}
                      >
                        Download {language.toUpperCase()} Audio
                      </Button>
                      <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadTranscript(language, translations)}
                        sx={styles.downloadButton}
                      >
                        Download {language.toUpperCase()} Transcript
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            )
          )}
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

export default ViewVoxComponent;
