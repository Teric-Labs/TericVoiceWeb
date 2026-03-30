import React, { useState, useEffect,useCallback } from 'react';
import { Box, Typography, Grid, Button, Container, Stack, Drawer, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Alert, Chip, Card, CardContent, CardActions, CircularProgress, useTheme, useMediaQuery, Divider, Tooltip, IconButton, Snackbar } from '@mui/material';
import { Add as AddIcon, Language as LanguageIcon, Chat as ChatIcon, Upload as UploadIcon, SentimentDissatisfied as EmptyStateIcon, InfoOutlined as InfoIcon, Article as DocumentIcon, Mic as MicIcon } from '@mui/icons-material';
import { agentsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom'
  
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const supportedLanguages = ['en', 'lg', 'sw', 'at', 'ac', 'nyn','rw','lgg','fr'];
  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
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
              const response = await agentsAPI.getUserAgents(userData.userId);
              setAgents(response.agents || []);
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
    setError(''); // Clear previous errors
    try {
      // Get user ID (support both uid and userId)
      const userId = user.userId || user.uid;

      if (!userId) {
        throw new Error('User ID is required. Please log in again.');
      }

      const result = await agentsAPI.uploadFiles(
        newAgent.documents,
        newAgent.title,
        newAgent.description,
        newAgent.sourceLanguage,
        userId
      );


      // Refresh agents list
      const response = await agentsAPI.getUserAgents(userId);
      setAgents(response.agents || []);
      handleDialogClose();
      showSnackbar('AI agent created successfully!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create AI agent. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
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
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)', backgroundClip: 'text', textFillColor: 'transparent' }}>
        No AI Agents Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
        Create your first AI agent to start analyzing documents and chatting with your data
      </Typography>
      <Button variant="contained" onClick={handleDialogOpen} startIcon={<AddIcon />} sx={{ borderRadius: '28px', textTransform: 'none', background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)', px: 4, py: 1.5, '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[4] } }}>
        Create AI Agent
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0f' }}>
        <CircularProgress size={48} sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0f', py: 4, position: 'relative', overflow: 'hidden' }}>
      {/* Aesthetic Background Elements */}
      <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', zIndex: 0 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Alert 
          severity="info" 
          icon={<InfoIcon sx={{ color: '#0ea5e9' }} />}
          sx={{ 
            mb: 4, borderRadius: '16px', background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)', color: '#f8fafc',
            '& .MuiAlert-icon': { color: '#0ea5e9' }
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.02em' }}>
            AI AGENTS SUITE • PRE-RELEASE ACCESS
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Our neural agent infrastructure is currently undergoing high-fidelity optimization. Full integration with the ASRVoices Studio is coming soon.
          </Typography>
        </Alert>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 900, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.04em' }}>
              AI Agents Dashboard
            </Typography>
          </Stack>
          <Button variant="contained" onClick={handleDialogOpen} startIcon={<AddIcon />} sx={{ borderRadius: '28px', textTransform: 'none', fontWeight: 800, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', px: 3, py: 1, boxShadow: '0 4px 20px rgba(139,92,246,0.3)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 28px rgba(139,92,246,0.45)' } }}>
            Create New Agent
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>{error}</Alert>}
        {agents.length === 0 ? <EmptyState /> : (
          <Grid container spacing={3}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent.id}>
                <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(14,165,233,0.3)', background: 'rgba(255,255,255,0.03)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                        {agent.title}
                      </Typography>
                      <Chip label={agent.sourceLanguage.toUpperCase()} size="small" sx={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', fontWeight: 800, fontSize: '0.65rem' }} />
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.3)', display: 'block', mb: 2 }}>
                        ID: {agent.agent_id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, minHeight: '48px', lineHeight: 1.6 }}>
                      {agent.description}
                    </Typography>
                  </CardContent>
                  <Divider sx={{ mx: 2, opacity: 0.05 }} />
                  <CardActions sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
                      <Button 
                        fullWidth
                        variant="contained" 
                        startIcon={<ChatIcon />} 
                        onClick={() => handleTextChat(agent.agent_id)} 
                        sx={{ 
                          borderRadius: '14px', 
                          textTransform: 'none', 
                          fontWeight: 800,
                          background: 'rgba(255,255,255,0.05)', 
                          color: '#f8fafc',
                          '&:hover': { background: 'rgba(14,165,233,0.1)', transform: 'translateY(-2px)' } 
                        }}
                      >
                        Chat
                      </Button>
                      <Button 
                        fullWidth
                        variant="contained" 
                        startIcon={<MicIcon />} 
                        onClick={() => handleVoiceChat(agent.agent_id)} 
                        sx={{ 
                          borderRadius: '14px', 
                          textTransform: 'none', 
                          fontWeight: 800,
                          background: 'rgba(255,255,255,0.05)', 
                          color: '#f8fafc',
                          '&:hover': { background: 'rgba(139,92,246,0.1)', transform: 'translateY(-2px)' } 
                        }}
                      >
                        Voice
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', p: 2 } }}>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#f8fafc' }}>Initialize Neural Agent</Typography>
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField 
                label="Agent Title" fullWidth value={newAgent.title} onChange={(e) => setNewAgent(prev => ({ ...prev, title: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } } }}
              />
              <TextField 
                label="Primary Objective" fullWidth multiline rows={3} value={newAgent.description} onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } } }}
              />
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Base Intelligence Language</InputLabel>
                <Select 
                  value={newAgent.sourceLanguage} label="Base Intelligence Language" onChange={(e) => setNewAgent(prev => ({ ...prev, sourceLanguage: e.target.value }))}
                  sx={{ borderRadius: '14px', color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
                >
                  {supportedLanguages.map((lang) => (
                    <MenuItem key={lang} value={lang} sx={{ color: '#0f172a' }}>{lang.toUpperCase()}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box>
                <Button component="label" variant="outlined" startIcon={<UploadIcon />} sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800, borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', mb: 2 }}>
                  Ingest Neural Data
                  <input type="file" hidden multiple onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" />
                </Button>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {newAgent.documents.map((file, index) => (
                    <Chip key={index} label={file.name} onDelete={() => setNewAgent(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }))} sx={{ borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#f8fafc' }} />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleDialogClose} sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateAgent} disabled={createLoading} sx={{ borderRadius: '14px', fontWeight: 800, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', px: 4 }}>
              {createLoading ? <CircularProgress size={24} /> : 'Initialize Agent'}
            </Button>
          </DialogActions>
        </Dialog>
         {/* Drawer for Chat */}
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AIAgentsDashboard;