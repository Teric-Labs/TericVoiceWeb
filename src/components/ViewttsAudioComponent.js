import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
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
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from "axios";

const ViewttsAudioComponent = ({ audioId }) => {
  const [entries, setEntries] = useState([]);
  const [audioDate, setAudioDate] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const apiEndpoint = "http://20.106.179.250:8080/get_vocify_voice";

    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: audioId });
        const fetchedEntries = response.data.entries;

        if (fetchedEntries.length > 0) {
          setEntries(fetchedEntries);
          setAudioDate(fetchedEntries[0].date);
          setAudioTitle(fetchedEntries[0].title);
        }
      } catch (error) {
        console.error("Failed to fetch entries", error);
        setSnackbarMessage("Failed to fetch audio data");
        setSnackbarOpen(true);
      }
    };

    fetchEntries();
  }, [audioId]);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage("Text copied to clipboard");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage("Failed to copy text");
        setSnackbarOpen(true);
      });
  };

  const handleDirectDownload = (audioUrl) => {
    try {
      if (!audioUrl) {
        throw new Error("Audio URL is invalid or not provided.");
      }
  
      const decodedUrl = decodeURIComponent(audioUrl);
  
      // Create a link element and programmatically trigger a click
      const link = document.createElement("a");
      link.href = decodedUrl;
      link.download = ""; // Optional: Browser will infer the filename
      link.target = "_blank"; // Open in a new tab if necessary
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setSnackbarMessage("Audio download initiated.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Direct download failed:", error);
      setSnackbarMessage("Failed to initiate download. Please try again later.");
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
    actionButton: {
      background: "linear-gradient(45deg, #1976d2, #64b5f6)",
      color: "white",
      borderRadius: "50%",
      padding: "12px",
      "&:hover": {
        background: "linear-gradient(45deg, #1565c0, #42a5f5)",
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
    copyButton: {
      marginLeft: 2,
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: "rgba(25, 118, 210, 0.04)",
      },
    },
    translationBox: {
      position: 'relative',
      backgroundColor: "rgba(25, 118, 210, 0.04)",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
    },
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.mainPaper}>
        <Box p={4}>
          {/* Header Section */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 600,
                background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                {audioTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Created on: {new Date(audioDate).toLocaleString()}
              </Typography>
              <Box mt={2}>
                <Chip
                  icon={<TranslateIcon />}
                  label="Multi-language Support"
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

          {/* Content Section */}
          {entries.length > 0 && (
            <Box>

              {/* Translations Section */}
              {Object.entries(entries[0].translations_with_tts || {}).map(
                ([language, translationData]) => (
                  <Accordion
                    key={language}
                    sx={styles.accordion}
                    TransitionProps={{ unmountOnExit: true }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />
                      }
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <TranslateIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {language.toUpperCase()} Translation
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={styles.translationBox}>
                        <Typography
                          variant="body1"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {translationData.translation}
                        </Typography>
                        <IconButton 
                          onClick={() => handleCopyText(translationData.translation)}
                          sx={styles.copyButton}
                          size="small"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <AudioPlayer
                          src={translationData.audio_file_path}
                          onPlay={(e) => console.log(`Playing ${language} audio`)}
                          style={styles.audioPlayer}
                          customVolumeControls={[]}
                          customAdditionalControls={[]}
                          showJumpControls={false}
                        />
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDirectDownload(translationData.audio_file_path)}
                          sx={{
                            mt: 2,
                            background: "linear-gradient(45deg, #1976d2, #64b5f6)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(45deg, #1565c0, #42a5f5)",
                            },
                          }}
                        >
                          Download Audio
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default ViewttsAudioComponent;