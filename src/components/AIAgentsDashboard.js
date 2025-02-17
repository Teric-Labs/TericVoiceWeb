import React, { useState, useEffect,useCallback } from 'react';
import { Box, Typography, Grid, Button, Container, Stack, Drawer, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Alert, Chip, Card, CardContent, CardActions, CircularProgress, useTheme, useMediaQuery, Divider, Tooltip, IconButton } from '@mui/material';
import { Add as AddIcon, Language as LanguageIcon, Chat as ChatIcon, Upload as UploadIcon, SentimentDissatisfied as EmptyStateIcon, InfoOutlined as InfoIcon, Article as DocumentIcon, Mic as MicIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://phosaiv-98414212-8607-468b-9fc3.cranecloud.io';
  
const AIAgentsDashboard = () => {
  const theme = useTheme();
  const [user, setUser] = useState({ username: '', userId: '' });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newAgent, setNewAgent] = useState({ title: '', description: '', sourceLanguage: '', documents: [] });
  const [createLoading, setCreateLoading] = useState(false);
  const supportedLanguages = ['en', 'lg', 'sw', 'at', 'ac', 'nyn','rw','lgg','fr'];
  const navigate = useNavigate();
  useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      }, []);

useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Fetch agents immediately after setting user
          const fetchAgents = async () => {
            try {
              const formData = new FormData();
              formData.append('user_id', userData.userId);
              const response = await axios.post(`${API_BASE_URL}/user-agents`, formData);
              setAgents(response.data.agents || []);
            } catch (err) {
              setError('Failed to load AI agents. Please try again later.');
            } finally {
              setLoading(false);
            }
          };
      
          fetchAgents();
        } else {
          setLoading(false);
        }
      }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
    setError('');
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewAgent({ title: '', description: '', sourceLanguage: '', documents: [] });
    setError('');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Please upload only PDF, Word, Excel, or CSV files.');
    }
    setNewAgent(prev => ({ ...prev, documents: [...prev.documents, ...validFiles] }));
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
      formData.append('user_id', user.userId);
      formData.append('title', newAgent.title);
      formData.append('description', newAgent.description);
      formData.append('source_lang', newAgent.sourceLanguage);
      newAgent.documents.forEach(doc => formData.append('files', doc));

      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleDialogClose();
    } catch (err) {
      setError('Failed to create AI agent. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };


  const handleTextChat= useCallback((agentId) => {
      navigate(`/dashboard/chats/${agentId}`);
    }, [navigate]);

  const handleVoiceChat = useCallback((agentId) => {
    navigate(`/dashboard/aivoice/${agentId}`);
  }, [navigate]);


  const EmptyState = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 4, background: 'rgba(255, 255, 255, 0.8)', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
      <EmptyStateIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3, opacity: 0.8 }} />
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(45deg, #1976d2, #64b5f6)', backgroundClip: 'text', textFillColor: 'transparent' }}>
        No AI Agents Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
        Create your first AI agent to start analyzing documents and chatting with your data
      </Typography>
      <Button variant="contained" onClick={handleDialogOpen} startIcon={<AddIcon />} sx={{ borderRadius: '28px', textTransform: 'none', background: 'linear-gradient(45deg, #1976d2, #64b5f6)', px: 4, py: 1.5, '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[4] } }}>
        Create AI Agent
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(100, 181, 246, 0.05))' }}>
        <CircularProgress size={48} sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(100, 181, 246, 0.05))', py: 4 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #1976d2, #64b5f6)', backgroundClip: 'text', textFillColor: 'transparent' }}>
              AI Agents Dashboard
            </Typography>
            <Tooltip title="Create AI agents to analyze your documents and chat with your data">
              <IconButton size="small" sx={{ color: 'primary.main' }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Button variant="contained" onClick={handleDialogOpen} startIcon={<AddIcon />} sx={{ borderRadius: '28px', textTransform: 'none', background: 'linear-gradient(45deg, #1976d2, #64b5f6)', px: 3, py: 1, '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[4] } }}>
            Create New Agent
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {agents.length === 0 ? <EmptyState /> : (
          <Grid container spacing={3}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent.id}>
                <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid rgba(25, 118, 210, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] } }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {agent.title}
                      </Typography>
                      <Chip icon={<LanguageIcon sx={{ fontSize: 16 }} />} label={agent.sourceLanguage} size="small" sx={{ backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', fontWeight: 500 }} />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 100,fontSize: 10, color: '#1976d2' }}>
                        AgentID: {agent.agent_id}
                      </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: '48px', lineHeight: 1.6 }}>
                      {agent.description}
                    </Typography>
                  </CardContent>
                  <Divider sx={{ mx: 2, opacity: 0.1 }} />
                  <CardActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                      <Button 
                        variant="contained" 
                        startIcon={<ChatIcon />} 
                        onClick={() => handleTextChat(agent.agent_id)} 
                        sx={{ 
                          flex: 1,
                          borderRadius: '28px', 
                          textTransform: 'none', 
                          background: 'linear-gradient(45deg, #1976d2, #64b5f6)', 
                          '&:hover': { transform: 'translateY(-2px)' } 
                        }}
                      >
                        Text Chat
                      </Button>
                      <Button 
                        variant="contained" 
                        startIcon={<MicIcon />} 
                        onClick={() => handleVoiceChat(agent.agent_id)} 
                        sx={{ 
                          flex: 1,
                          borderRadius: '28px', 
                          textTransform: 'none', 
                          background: 'linear-gradient(45deg, #64b5f6, #1976d2)', 
                          '&:hover': { transform: 'translateY(-2px)' } 
                        }}
                      >
                        Voice Chat
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 2 } }}>
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
         {/* Drawer for Chat */}
        
      </Container>
    </Box>
  );
};

export default AIAgentsDashboard;