import React, { useEffect, useState } from "react";
import {
  Box, Typography, IconButton, Paper, Snackbar, Button,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const G = 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)';
const GLASS = { 
  background: 'rgba(255,255,255,0.03)', 
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)', 
  borderRadius: '24px' 
};

const ViewSummaryComponent = ({ translationId, showBack = true }) => {
  const navigate = useNavigate();
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await dataAPI.getSummary(translationId);

        if (response.entries && response.entries.length > 0) {
          const entry = response.entries[0];
          setScriptDate(entry.Date || entry.date || new Date().toISOString());
          setScriptTitle(entry.title || "AI Summary Analysis");
          setSummary(entry.Summary || entry.summary || "No summary available.");
        }
      } catch (error) {
        showNotification("Failed to fetch summary data");
      }
    };

    if (translationId) fetchEntries();
  }, [translationId]);

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Intelligence copied to clipboard");
    } catch (error) {
      showNotification("Failed to copy text");
    }
  };

  const formatText = (text) => {
    if (!text) return <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.3)' }}>No content available</Typography>;
    
    // Defensive check: ensure text is a string before splitting
    const safeText = typeof text === 'string' ? text : String(text);
    
    return safeText.split("\n").map((str, index) => (
      <Typography key={index} variant="body1" sx={{ mb: 1.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
        {str.trim() || " "}
      </Typography>
    ));
  };

  return (
    <Box sx={{ background: '#0a0a0f', minHeight: '100%', p: 4 }}>
      {showBack && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontWeight: 700, borderRadius: '50px', px: 2, '&:hover': { color: '#0ea5e9', background: 'rgba(14,165,233,0.08)' } }}
        >
          Back to History
        </Button>
      )}
      <Paper elevation={0} sx={{ ...GLASS, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        {/* Simplified Header */}
        <Box sx={{ p: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {scriptTitle}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              AI SUMMARY ANALYZED • {new Date(scriptDate).toLocaleDateString()}
            </Typography>
          </Box>
          <IconButton onClick={() => handleCopyText(summary)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#0ea5e9' } }}>
            <CopyIcon />
          </IconButton>
        </Box>

        <Box p={4}>
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ ...GLASS, p: 4, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
              {formatText(summary)}
            </Paper>
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', display: 'block', textAlign: 'center', mt: 4 }}>
            Neural Synthesis Engine • V4 Premium Output
          </Typography>
        </Box>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Box sx={{ background: G, color: '#fff', px: 3, py: 1.5, borderRadius: '12px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            {snackbarMessage}
        </Box>
      </Snackbar>
    </Box>
  );
};

export default ViewSummaryComponent;
