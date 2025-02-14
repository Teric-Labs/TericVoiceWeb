import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Tooltip,
  Snackbar,
  IconButton,
  Alert,
  Card,
  CardContent,
  Stack,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Divider
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  GitHub as GitHubIcon,
  Assignment as AssignmentIcon,
  OpenInNew as OpenInNewIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const supportedLanguages = [
  { name: 'English', code: 'en', native: 'English', description: 'Default language for international users' },
  { name: 'Luganda', code: 'lg', native: 'Oluganda', description: 'Primary language in central Uganda' },
  { name: 'Runyankole', code: 'nyn', native: 'Runyankore', description: 'Spoken in western Uganda' },
  { name: 'Acholi', code: 'ach', native: 'Lwo', description: 'Northern Uganda regional language' },
  { name: 'Ateso', code: 'teo', native: 'Ateso', description: 'Eastern Uganda regional language' },
  { name: 'Swahili', code: 'sw', native: 'Kiswahili', description: 'East African lingua franca' }
];

const CodeBlock = ({ code, onCopy, title, description }) => (
  <Box sx={{ mb: 4 }}>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <Paper 
      variant="outlined" 
      sx={{ 
        position: 'relative',
        '&:hover .copy-button': {
          opacity: 1
        }
      }}
    >
      <Box
        sx={{
          backgroundColor: '#1e1e1e',
          p: 3,
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: '300px'
        }}
      >
        <pre style={{ margin: 0, color: '#fff', fontFamily: 'Monaco, monospace', fontSize: '14px' }}>
          <code>{code}</code>
        </pre>
      </Box>
      <Tooltip title="Copy Code">
        <IconButton
          className="copy-button"
          onClick={() => onCopy(code)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            opacity: 0.4,
            transition: 'opacity 0.2s',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              opacity: 1
            }
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  </Box>
);

const ChatGuide = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            External Website Integration Guide
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Follow these steps to embed your AI chatbot into any external website. This guide provides the necessary scripts and configuration details for successful integration.
          </Typography>
          <Divider />
        </Grid>

        {/* Agent ID Section */}
        <Grid item xs={12}>
          <Card elevation={0} variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h5">
                  Step 1: Get Your Agent ID
                </Typography>
              </Stack>
              <Typography variant="body1" paragraph>
                Before beginning the integration, you will need an Agent ID. This identifier connects your embedded chatbot to your configured AI agent. Visit the Agents Dashboard to view your existing agents or create a new one.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard/agents')}
                sx={{ mr: 2 }}
              >
                Go to Agents Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Language Support Section */}
        <Grid item xs={12}>
          <Card elevation={0} variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <InfoIcon color="primary" />
                <Typography variant="h5">
                  Step 2: Supported Languages
                </Typography>
              </Stack>
              <Typography variant="body1" paragraph>
                Your chatbot supports the following languages. Use the appropriate language code in your configuration to set the primary language for your implementation.
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell><strong>Language</strong></TableCell>
                      <TableCell><strong>Code</strong></TableCell>
                      <TableCell><strong>Native Name</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supportedLanguages.map((lang) => (
                      <TableRow key={lang.code} hover>
                        <TableCell>{lang.name}</TableCell>
                        <TableCell>
                          <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                            {lang.code}
                          </code>
                        </TableCell>
                        <TableCell>{lang.native}</TableCell>
                        <TableCell>{lang.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Implementation Section */}
        <Grid item xs={12}>
          <Card elevation={0} variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <OpenInNewIcon color="primary" />
                <Typography variant="h5">
                  Step 3: Implementation
                </Typography>
              </Stack>
              
              <CodeBlock
                title="1. Add Required Scripts"
                description="Add these scripts to your HTML file before the closing </body> tag"
                code={`<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://tobiusaolo.github.io/chatbot-plugin/static/js/chat.bundle.js"></script>`}
                onCopy={handleCopy}
              />
              
              <CodeBlock
                title="2. Initialize Chatbot"
                description="Replace YOUR_AGENT_ID with the ID from your Agents Dashboard and set your desired language code"
                code={`<script>
  setTimeout(() => {
    if (window.initAIChatPlugin) {
      window.initAIChatPlugin({
        agentId: 'YOUR_AGENT_ID',  // Get this from your Agents Dashboard
        targetLang: 'en',          // Use language code from the table above
        botName: 'My AI Chatbot',
        containerId: 'ai-chat-root'
      });
    }
  }, 3000);
</script>`}
                onCopy={handleCopy}
              />
              
              <CodeBlock
                title="3. Add Container Element"
                description="Add this div where you want the chatbot to appear on your webpage"
                code={`<div id="ai-chat-root"></div>`}
                onCopy={handleCopy}
              />

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Need help with implementation?
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<GitHubIcon />}
                    href="https://github.com/tobiusaolo/chatbotEmbeddingTemplete.git"
                    target="_blank"
                  >
                    View Sample Implementation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    component={Link}
                    href="/documentation"
                  >
                    View Full Documentation
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          Code copied to clipboard
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChatGuide;