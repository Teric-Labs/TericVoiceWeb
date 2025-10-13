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
  CircularProgress,
  LinearProgress
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Translate as TranslateIcon,
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { dataAPI, translationAPI } from '../services/api';
import ProfessionalProgressBar from './ProfessionalProgressBar';

const languageOptions = [
  { name: "English", code: "en" },
  { name: "Luganda", code: "lg" },
  { name: "Acholi", code: "ac" },
  { name: "Ateso", code: "at" },
  { name: "Swahili", code: "sw" },
  { name: "French", code: "fr" },
  { name: "Kinyarwanda", code: "rw" },
  { name: "Runyankole", code: "nyn" },
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
  const [user, setUser] = useState({ username: '', userId: '', uid: '' });

  const theme = useTheme();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await dataAPI.getSummary(translationId);
        console.log('📋 ViewSummaryComponent - API Response:', response);

        if (response.entries && response.entries.length > 0) {
          const entry = response.entries[0];
          console.log('📋 ViewSummaryComponent - Entry data:', entry);
          setEntries(response.entries);
          setScriptDate(entry.Date || entry.date || new Date().toISOString());
          setScriptTitle(entry.title || "Untitled Summary");
          setDocument(entry.Original_transcript || entry.original_transcript || "No original content available.");
          setSummary(entry.Summary || entry.summary || "No summary available.");
          setLanguage(entry.source_lang || "unknown");
          
          console.log('📋 ViewSummaryComponent - Set data:', {
            scriptDate: entry.Date || entry.date,
            scriptTitle: entry.title,
            document: entry.Original_transcript || entry.original_transcript,
            summary: entry.Summary || entry.summary,
            language: entry.source_lang
          });
        } else {
          console.log('📋 ViewSummaryComponent - No entries found in response');
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

    if (!user.uid && !user.userId) {
      showNotification("User not authenticated");
      return;
    }

    setIsTranslating(true);
    try {
      const userId = user.uid || user.userId;
      console.log('🔄 Translating summary:', { 
        summary: summary.substring(0, 100) + '...', 
        sourceLang: language, 
        targetLang: targetLanguage, 
        userId 
      });

      const response = await translationAPI.translateText(summary, language, [targetLanguage], userId);
      console.log('🔄 Translation response:', response);

      // The backend returns translations directly as an object: { "lg": "translated text" }
      if (response && typeof response === 'object') {
        const translatedText = response[targetLanguage];
        if (translatedText) {
          setTranslatedSummary(translatedText);
          showNotification(`Successfully translated to ${targetLanguage.toUpperCase()}`);
        } else {
          throw new Error(`Translation not available for ${targetLanguage}`);
        }
      } else {
        throw new Error("Invalid translation response format");
      }
    } catch (error) {
      console.error("Translation error:", error);
      showNotification(`Failed to translate text: ${error.message || 'Unknown error'}`);
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
            <Box sx={styles.contentBox}>
              {formatText(summary)}
              <IconButton
                sx={styles.copyButton}
                onClick={() => handleCopyText(summary)}
                title="Copy summary"
              >
                <CopyIcon />
              </IconButton>
            </Box>
            
            {/* Translation Section */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.02)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Translate Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Translate this summary from {language.toUpperCase()} to another language
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Translate to</InputLabel>
                    <Select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      label="Translate to"
                      disabled={isTranslating}
                    >
                      {languageOptions
                        .filter(lang => lang.code !== language) // Don't show source language
                        .map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.name} ({lang.code.toUpperCase()})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    startIcon={isTranslating ? <CircularProgress size={20} color="inherit" /> : <TranslateIcon />}
                    onClick={handleTranslate}
                    disabled={isTranslating || !targetLanguage || targetLanguage === language}
                    sx={{ 
                      minWidth: 140,
                      background: isTranslating 
                        ? 'linear-gradient(45deg, #1976d2, #42a5f5)' 
                        : 'linear-gradient(45deg, #1976d2, #1565c0)',
                      '&:hover': {
                        background: isTranslating 
                          ? 'linear-gradient(45deg, #1976d2, #42a5f5)' 
                          : 'linear-gradient(45deg, #1565c0, #1976d2)',
                      }
                    }}
                  >
                    {isTranslating ? "Translating..." : "Translate"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {/* Professional Progress Bar for Translation */}
            <ProfessionalProgressBar
              isVisible={isTranslating}
              message="Translating Summary..."
              subMessage={`Converting to ${targetLanguage?.toUpperCase()}...`}
              type="translation"
              size="small"
              showSpinner={true}
            />
            {translatedSummary && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: theme.palette.secondary.main }}
                >
                  Translated Summary ({targetLanguage.toUpperCase()})
                </Typography>
                <Box sx={styles.contentBox}>
                  {formatText(translatedSummary)}
                  <IconButton
                    sx={styles.copyButton}
                    onClick={() => handleCopyText(translatedSummary)}
                    title="Copy translated summary"
                  >
                    <CopyIcon />
                  </IconButton>
                </Box>
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
              <Box sx={styles.contentBox}>
                {formatText(document)}
                <IconButton
                  sx={styles.copyButton}
                  onClick={() => handleCopyText(document)}
                  title="Copy original content"
                >
                  <CopyIcon />
                </IconButton>
              </Box>
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
