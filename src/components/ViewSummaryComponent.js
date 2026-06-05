import React, { useEffect, useState } from "react";
import { Typography, Snackbar, Alert } from "@mui/material";
import SummarizeIcon from '@mui/icons-material/Summarize';
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ResultViewLayout, ResultSection } from './result-view';

const ViewSummaryComponent = ({ translationId, showBack = true }) => {
  const navigate = useNavigate();
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response = await dataAPI.getSummary(translationId);
        if (response.entries?.length > 0) {
          const entry = response.entries[0];
          setScriptDate(entry.Date || entry.date || new Date().toISOString());
          setScriptTitle(entry.title || "AI Summary");
          setSummary(entry.Summary || entry.summary || "No summary available.");
        }
      } catch {
        setSnackbarMessage("Failed to fetch summary");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    if (translationId) fetchEntries();
    else setLoading(false);
  }, [translationId]);

  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage("Copied to clipboard");
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Failed to copy");
      setSnackbarOpen(true);
    }
  };

  const formatText = (text) => {
    if (!text) {
      return (
        <Typography variant="body1" sx={{ color: 'rgba(17, 17, 17, 0.4)' }}>
          No content available
        </Typography>
      );
    }
    const safeText = typeof text === 'string' ? text : String(text);
    return safeText.split("\n").map((str, index) => (
      <Typography key={index} variant="body1" sx={{ mb: 1.5, color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85 }}>
        {str.trim() || " "}
      </Typography>
    ));
  };

  return (
    <>
      <ResultViewLayout
        type="summary"
        title={scriptTitle}
        subtitle="AI Summary"
        date={scriptDate}
        onBack={showBack ? () => navigate(-1) : undefined}
        loading={loading}
        empty={!loading && !summary}
        emptyMessage="No summary available"
        emptyIcon={SummarizeIcon}
        badges={[{ label: 'Neural analysis' }]}
      >
        <ResultSection
          title="Summary"
          icon={SummarizeIcon}
          onCopy={() => handleCopyText(summary)}
          highlight
        >
          {formatText(summary)}
        </ResultSection>
      </ResultViewLayout>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ borderRadius: '12px' }}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default ViewSummaryComponent;
