import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Paper,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Container,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GetAppIcon from '@mui/icons-material/GetApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from "axios";

const ViewTranslationsComponent = ({ translationId }) => {
  const [entries, setEntries] = useState([]);
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const apiEndpoint = 'https://avoices-13747549899.us-central1.run.app/get_translation';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { doc_id: translationId });
        setEntries(response.data.entries);
        if (response.data.entries.length > 0) {
          setScriptDate(response.data.entries[0].Date);
          setScriptTitle(response.data.entries[0].title);
        }
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };
    fetchEntries();
  }, [translationId]);

  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const downloadAsText = () => {
    let content = `Title: ${scriptTitle}\nDate: ${scriptDate}\n\n`;
    if (entries.length > 0) {
      content += `Original (${entries[0].sourceLanguage}):\n${entries[0].Original_transcript}\n\n`;
      Object.entries(entries[0].Translations).forEach(([language, translation]) => {
        content += `${language.toUpperCase()}:\n${translation}\n\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptTitle || 'translation'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    handleDownloadClose();
  };

  const downloadAsDocx = () => {
    // Here you would implement DOCX conversion
    // For now, we'll use text as a fallback
    downloadAsText();
    handleDownloadClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a snackbar notification here
      console.log('Copied to clipboard');
    });
  };

  return (
    <Container maxWidth="xl">
      <Paper 
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 1
              }}
            >
              {scriptTitle}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}
            >
              Date Created: {scriptDate}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              onClick={handleDownloadClick}
              sx={{
                borderRadius: '28px',
                px: 3,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                }
              }}
            >
              Download
            </Button>
            <Menu
              anchorEl={downloadAnchorEl}
              open={Boolean(downloadAnchorEl)}
              onClose={handleDownloadClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                  mt: 1.5,
                }
              }}
            >
              <MenuItem onClick={downloadAsText}>Download as TXT</MenuItem>
              <MenuItem onClick={downloadAsDocx}>Download as DOCX</MenuItem>
            </Menu>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {entries.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary 
                }}
              >
                Original ({entries[0].sourceLanguage})
              </Typography>
              <Tooltip title="Copy to clipboard">
                <IconButton 
                  onClick={() => copyToClipboard(entries[0].Original_transcript)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <Typography variant="body1">
                {entries[0].Original_transcript}
              </Typography>
            </Paper>
          </Box>
        )}

        {entries.length > 0 && Object.entries(entries[0].Translations).map(([language, translation], index) => (
          <Accordion 
            key={index}
            sx={{
              mb: 2,
              border: 'none',
              '&:before': { display: 'none' },
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: '16px',
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {language.toUpperCase()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start' 
              }}>
                <Typography sx={{ flex: 1 }}>
                  {translation}
                </Typography>
                <IconButton 
                  onClick={() => copyToClipboard(translation)}
                  sx={{ 
                    ml: 2,
                    color: theme.palette.primary.main 
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export default ViewTranslationsComponent;