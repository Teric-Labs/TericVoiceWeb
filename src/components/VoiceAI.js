import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, IconButton, Stack, Card, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, MenuItem, Select, FormControl, InputLabel, Tooltip, TextField, Chip, useTheme, Divider } from '@mui/material';
import { Mic, MicOff, Language as LanguageIcon, Upload as UploadIcon, VolumeUp, Add as AddIcon, Article as DocumentIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';

const VoiceAI = () => {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState([]);
  const [openAgentDialog, setOpenAgentDialog] = useState(false);
  const [agents, setAgents] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const conversationEndRef = useRef(null);
  
  const [newAgent, setNewAgent] = useState({
    title: '',
    description: '',
    sourceLanguage: '',
    documents: []
  });

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' }
  ];

  useEffect(() => {
    fetchAgents();
  }, []);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('https://phosai-dbec65d5-46be-45ae-9062.cranecloud.io/agents');
      if (!response.ok) throw new Error('Failed to fetch agents');
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError('Failed to load AI agents');
    }
  };

  const handleCreateAgent = async () => {
    if (!newAgent.title || !newAgent.description || !newAgent.sourceLanguage) {
      setError('Please fill in all required fields');
      return;
    }
    if (newAgent.documents.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    setCreateLoading(true);
    try {
      const formData = new FormData();
      Object.keys(newAgent).forEach(key => {
        if (key === 'documents') {
          newAgent.documents.forEach(doc => formData.append('documents', doc));
        } else {
          formData.append(key, newAgent[key]);
        }
      });

      const response = await fetch('https://phosai-dbec65d5-46be-45ae-9062.cranecloud.io/agents', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to create agent');
      await fetchAgents();
      handleDialogClose();
    } catch (err) {
      setError('Failed to create AI agent. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Please upload only PDF, Word, Excel, or CSV files.');
    }

    setNewAgent(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles]
    }));
  };

  const handleDialogClose = () => {
    setOpenAgentDialog(false);
    setNewAgent({
      title: '',
      description: '',
      sourceLanguage: '',
      documents: []
    });
    setError('');
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        if (event.results[0].isFinal) {
          processVoiceInput(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      setError('Failed to start voice recognition');
      setIsListening(false);
    }
  };

  const processVoiceInput = async (input) => {
    setIsProcessing(true);
    try {
      setConversation(prev => [...prev, { type: 'user', content: input }]);
      const response = await new Promise(resolve => 
        setTimeout(() => resolve("I understand your query. Let me help you with that."), 1500)
      );
      setConversation(prev => [...prev, { type: 'ai', content: response }]);
      speakResponse(response);
    } catch (err) {
      setError('Failed to process voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text) => {
    setIsSpeaking(true);
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError('Failed to convert text to speech');
      setIsSpeaking(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(100, 181, 246, 0.05))',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              Voice AI Assistant
            </Typography>
            <Tooltip title="Have natural conversations with AI in multiple languages">
              <IconButton size="small" sx={{ color: 'primary.main' }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                sx={{
                  borderRadius: '28px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {supportedLanguages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={() => setOpenAgentDialog(true)}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '28px',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                px: 3,
                py: 1,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              Create New Agent
            </Button>
          </Stack>
        </Stack>

        {/* Conversation Area */}
        <Card
          elevation={0}
          sx={{
            height: '70vh',
            borderRadius: '24px',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {conversation.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%'
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    background: msg.type === 'user' 
                      ? 'linear-gradient(45deg, #1976d2, #64b5f6)'
                      : 'rgba(255, 255, 255, 0.9)',
                    color: msg.type === 'user' ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: '16px',
                    border: msg.type === 'ai' ? '1px solid rgba(25, 118, 210, 0.1)' : 'none'
                  }}
                >
                  <Typography>{msg.content}</Typography>
                </Card>
              </Box>
            ))}
            <div ref={conversationEndRef} />
          </Box>

          <Divider />

          {/* Voice Control Panel */}
          <Box sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}>
            <Tooltip title={isListening ? 'Stop Listening' : 'Start Listening'}>
              <IconButton
                onClick={isListening ? () => setIsListening(false) : startListening}
                sx={{
                  width: 64,
                  height: 64,
                  background: isListening
                    ? 'linear-gradient(45deg, #f44336, #ff7961)'
                    : 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  color: 'white',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isListening ? (
                  <MicOff sx={{ fontSize: 32 }} />
                ) : (
                  <Mic sx={{ fontSize: 32 }} />
                )}
              </IconButton>
            </Tooltip>

            {isSpeaking && (
              <Card
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '28px',
                  background: 'rgba(25, 118, 210, 0.1)',
                }}
              >
                <VolumeUp color="primary" />
                <Typography color="primary.main">AI Speaking...</Typography>
              </Card>
            )}
          </Box>
        </Card>

        {/* Create Agent Dialog */}
         <Dialog open={openAgentDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 2 } }}>
                  <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Create New AI Agent</Typography>
                  </DialogTitle>
                  <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <Stack spacing={3} sx={{ mt: 1 }}>
                      <TextField label="Title" fullWidth value={newAgent.title} onChange={(e) => setNewAgent(prev => ({ ...prev, title: e.target.value }))} />
                      <TextField label="Description" fullWidth multiline rows={3} value={newAgent.description} onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))} />
                      <FormControl fullWidth>
                        <InputLabel>Source Language</InputLabel>
                        <Select value={newAgent.sourceLanguage} label="Source Language" onChange={(e) => setNewAgent(prev => ({ ...prev, sourceLanguage: e.target.value }))}>
                          {supportedLanguages.map((lang) => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Box>
                        <Button component="label" variant="outlined" startIcon={<UploadIcon />} sx={{ borderRadius: '28px', textTransform: 'none', mb: 2 }}>
                          Upload Documents
                          <input type="file" hidden multiple onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" />
                        </Button>
                        <Stack spacing={1}>
                          {newAgent.documents.map((file, index) => (
                            <Chip key={index} label={file.name} onDelete={() => setNewAgent(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }))} sx={{ borderRadius: '16px' }} />
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </DialogContent>
                  <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleDialogClose} sx={{ borderRadius: '28px', textTransform: 'none' }}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleCreateAgent} disabled={createLoading} sx={{ borderRadius: '28px', textTransform: 'none', background: 'linear-gradient(45deg, #1976d2, #64b5f6)', px: 3 }}>
                      {createLoading ? <CircularProgress size={24} /> : 'Create Agent'}
                    </Button>
                  </DialogActions>
                </Dialog>
      </Container>
    </Box>
  );
};

export default VoiceAI;