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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Translate as TranslateIcon,
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import axios from "axios";

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Acholi", code: "ach" },
  { name: "Ateso", code: "teo" },
  { name: "Swahili", code: "sw" },
  { name: "French", code: "fr" },
  { name: "Kinyarwanda", code: "rw" },
];

const ViewSummaryComponent = ({ translationId }) => {
  const [entries, setEntries] = useState([]);
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [document, setDocument] = useState("");
  const [summary, setSummary] = useState("");
  const [language, setLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.post("https://20.106.179.250:8080/get_summary", {
          doc_id: translationId,
        });

        if (response.data.entries && response.data.entries.length > 0) {
          const entry = response.data.entries[0];
          setEntries(response.data.entries);
          setScriptDate(entry.Date || new Date().toISOString());
          setScriptTitle(entry.title || "Untitled Summary");
          setDocument(entry.Original_transcript || "No original content available.");
          setSummary(entry.Summary || "No summary available.");
          setLanguage(entry.source_lang || "unknown");
        }
      } catch (error) {
        console.error("Failed to fetch entries", error);
        showNotification("Failed to fetch summary data");
      }
    };

    if (translationId) {
      fetchEntries();
    }
  }, [translationId]);

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Text copied to clipboard");
    } catch (error) {
      showNotification("Failed to copy text");
    }
  };

  const handleTranslate = async () => {
    if (!targetLanguage) {
      showNotification("Please select a target language");
      return;
    }

    setIsTranslating(true);
    try {
      const response = await axios.post("https://avoices-13747549899.us-central1.run.app/translate_text", {
        text: summary,
        source_lang: language,
        target_lang: targetLanguage,
      });

      if (response.data && response.data.translated_text) {
        setTranslatedSummary(response.data.translated_text);
      } else {
        throw new Error("Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      showNotification("Failed to translate text");
    } finally {
      setIsTranslating(false);
    }
  };

  const formatText = (text) => {
    if (!text) {
      return [
        <Typography key="empty" variant="body1">
          No content available
        </Typography>,
      ];
    }

    return text.split("\n").map((str, index) => (
      <Typography
        key={index}
        variant="body1"
        sx={{ fontFamily: "Poppins", mb: 1 }}
      >
        {str.trim() || " "}
      </Typography>
    ));
  };

  const styles = {
    mainPaper: {
      borderRadius: "24px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(25, 118, 210, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    },
    contentBox: {
      backgroundColor: "rgba(25, 118, 210, 0.04)",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      position: "relative",
    },
    copyButton: {
      position: "absolute",
      top: "8px",
      right: "8px",
      color: theme.palette.primary.main,
    },
    accordion: {
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "16px",
    },
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.mainPaper}>
        <Box p={4}>
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
                {scriptTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Created on: {new Date(scriptDate).toLocaleString()}
              </Typography>
              <Box mt={2}>
                <Chip
                  icon={<DescriptionIcon />}
                  label={`Source: ${language.toUpperCase()}`}
                  sx={{ mr: 1, mb: 1 }}
                  color="primary"
                />
                <Chip
                  icon={<TranslateIcon />}
                  label="Translation Available"
                  sx={{ mb: 1 }}
                  color="secondary"
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box mb={4}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Summary
            </Typography>
            <Box sx={styles.contentBox}>{formatText(summary)}</Box>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Translate to</InputLabel>
                  <Select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    label="Translate to"
                  >
                    {languageOptions.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  startIcon={<TranslateIcon />}
                  onClick={handleTranslate}
                  disabled={isTranslating || !targetLanguage}
                >
                  {isTranslating ? "Translating..." : "Translate"}
                </Button>
              </Grid>
            </Grid>
            {translatedSummary && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: theme.palette.secondary.main }}
                >
                  Translated Summary
                </Typography>
                <Box sx={styles.contentBox}>{formatText(translatedSummary)}</Box>
              </Box>
            )}
          </Box>

          <Accordion sx={styles.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Original Content
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={styles.contentBox}>{formatText(document)}</Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ViewSummaryComponent;
