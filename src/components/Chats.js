import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Stack,
  useTheme,
  AppBar,
  Toolbar,
  Skeleton,
  Tooltip,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  useMediaQuery,
  Button,
  styled,
  LinearProgress
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  Check as CheckIcon,
  Upload as UploadIcon,
  Description as FileIcon,
  DeleteOutline as RemoveFileIcon
} from '@mui/icons-material';

const API_BASE_URL = 'https://agents.tericlab.com:8000';
const SIDEBAR_WIDTH = 300;

// Styled components
const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  borderLeft: `1px solid ${theme.palette.divider}`,
  height: '100vh',
  position: 'fixed',
  right: 0,
  top: 0,
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const UploadZone = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const FilePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'relative',
  '&:hover .delete-button': {
    opacity: 1,
  },
}));

const FileDeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.2s ease',
}));

const StyledMessage = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  maxWidth: '70%',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: theme.shadows[1],
}));

const Chats = ({ agentId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [retryAttempts, setRetryAttempts] = useState({});
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const maxRetries = 3;

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  // Simulated streaming effect for bot responses
  const streamResponse = async (response) => {
    setIsStreaming(true);
    let streamedText = '';
    const words = response.split(' ');
    
    for (let word of words) {
      streamedText += word + ' ';
      setStreamingText(streamedText);
      // Simulate random typing speed
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 20));
    }
    
    setIsStreaming(false);
    return streamedText.trim();
  };

  const handleUpdateAgent = async () => {
    if (selectedFiles.length === 0) {
      showSnackbar('Please select files to update the agent', 'warning');
      return;
    }

    setIsUpdating(true);
    const formData = new FormData();
    formData.append('agent_id', agentId);
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/agents/update_index`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update agent');

      const result = await response.json();
      showSnackbar('Agent updated successfully', 'success');
      setSelectedFiles([]);
    } catch (error) {
      showSnackbar('Failed to update agent', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleScroll = useCallback(async (e) => {
    const element = e.target;
    if (element.scrollTop === 0 && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        const formData = new FormData();
        formData.append("agent_id", agentId);
        formData.append("page", page + 1);
        
        const response = await fetch(`${API_BASE_URL}/messages/history`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        if (data.messages.length === 0) {
          setHasMore(false);
        } else {
          setMessages(prev => [...data.messages, ...prev]);
          setPage(prev => prev + 1);
        }
      } catch (error) {
        showSnackbar('Failed to load more messages', 'error');
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [page, hasMore, isLoadingMore, agentId]);

 

  

  useEffect(() => {
    if (!isLoadingMore) {
      scrollToBottom();
    }
  }, [messages, isLoadingMore, scrollToBottom]);

  useEffect(() => {
    const fetchAgentInfo = async () => {
      try {
        const formData = new FormData();
        formData.append("agent_id", agentId);
        
        const response = await fetch(`${API_BASE_URL}/agent-info`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Failed to fetch agent info');
        
        const data = await response.json();
        setAgentInfo(data);
      } catch (error) {
        showSnackbar('Failed to load agent information', 'error');
      } finally {
        setIsLoadingInfo(false);
      }
    };

    fetchAgentInfo();
  }, [agentId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRetry = async (messageIndex) => {
    const message = messages[messageIndex];
    if (!message || message.role !== 'user') return;

    setRetryAttempts(prev => ({
      ...prev,
      [messageIndex]: (prev[messageIndex] || 0) + 1
    }));

    await handleSubmit(null, message.content);
  };

  const handleCopyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      showSnackbar('Message copied to clipboard');
    } catch (error) {
      showSnackbar('Failed to copy message', 'error');
    }
  };

  const handleExportChat = () => {
    try {
      const exportData = {
        agent: agentInfo,
        messages: messages,
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showSnackbar('Chat history exported successfully');
    } catch (error) {
      showSnackbar('Failed to export chat history', 'error');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    showSnackbar('Chat history cleared');
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(timestamp));
  };

  const getConversationContext = useCallback(() => {
    const contextMessages = [];
    let userCount = 0;
    let assistantCount = 0;
    
    for (let i = messages.length - 1; i >= 0 && (userCount < 3 || assistantCount < 3); i--) {
      const message = messages[i];
      if (message.role === 'user' && userCount < 3) {
        contextMessages.unshift(message);
        userCount++;
      } else if (message.role === 'assistant' && assistantCount < 3) {
        contextMessages.unshift(message);
        assistantCount++;
      }
    }
    
    return contextMessages;
  }, [messages]);

  const handleSubmit = async (e, retryContent = null) => {
    e?.preventDefault();
    
    const messageContent = retryContent || input.trim();
    if (!messageContent) return;

    const userMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!retryContent) setInput('');
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("agent_id", agentId);
      formData.append("query", messageContent);
      formData.append("target_lang", "en");
      
      const response = await fetch(`${API_BASE_URL}/agents/conversations`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Stream the response
      const streamedResponse = await streamResponse(data.answer);
      
      const botMessage = {
        role: 'assistant',
        content: streamedResponse,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };
      
      setMessages(prev => prev.map(msg => 
        msg === userMessage ? { ...msg, status: 'delivered' } : msg
      ));
      setMessages(prev => [...prev, botMessage]);
      setErrorCount(0);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorCount(prev => prev + 1);
      
      if (errorCount >= maxRetries) {
        showSnackbar('Connection lost. Attempting to reconnect...', 'warning');
        setIsReconnecting(true);
        reconnectTimeoutRef.current = setTimeout(() => {
          setIsReconnecting(false);
          setErrorCount(0);
        }, 5000);
      }

      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        status: 'error'
      };
      setMessages(prev => prev.map(msg => 
        msg === userMessage ? { ...msg, status: 'error' } : msg
      ));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setStreamingText('');
    }
  };

  const renderSidebarContent = () => (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Agent Settings
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto', mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Update Knowledge Base
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload new documents to enhance your agent knowledge. Supported formats: PDF, TXT, DOCX
        </Typography>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <UploadZone onClick={() => fileInputRef.current?.click()}>
          <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Drop files here or click to upload
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Maximum file size: 10MB
          </Typography>
        </UploadZone>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Selected Files ({selectedFiles.length})
            </Typography>
            <Box sx={{ mt: 2, mb: 3 }}>
              {selectedFiles.map((file, index) => (
                <FilePreview elevation={0} key={file.name}>
                  <FileIcon color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                  <FileDeleteButton
                    className="delete-button"
                    size="small"
                    onClick={() => {
                      const newFiles = selectedFiles.filter((_, i) => i !== index);
                      setSelectedFiles(newFiles);
                    }}
                  >
                    <RemoveFileIcon fontSize="small" />
                  </FileDeleteButton>
                </FilePreview>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={handleUpdateAgent}
              disabled={isUpdating}
              fullWidth
              size="large"
              sx={{
                height: 48,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {isUpdating ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Updating Agent...
                </>
              ) : (
                'Update Agent'
              )}
            </Button>
          </Box>
        )}

        {isUpdating && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="indeterminate" />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              This may take a few minutes depending on file size
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  

  return (
      <Box sx={{ display: 'flex' }}>
        <MainContent>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
            <AppBar position="static" color="primary" elevation={0}>
              <Toolbar>
                <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
                  <BotIcon />
                </Avatar>
                
                {isLoadingInfo ? (
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="200px" sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                    <Skeleton variant="text" width="150px" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                  </Box>
                ) : (
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="div">
                      {agentInfo?.agent_name || 'Unknown Agent'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LanguageIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        Source Language: {agentInfo?.agent_lang || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                )}
  
                <Tooltip title="Chat options">
                  <IconButton color="inherit" onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                    <MoreIcon />
                  </IconButton>

                  </Tooltip>
                  </Toolbar>
                </AppBar>
      
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={() => setMenuAnchorEl(null)}
                >
                  <MenuItem onClick={handleExportChat}>
                    <DownloadIcon sx={{ mr: 1 }} /> Export Chat
                  </MenuItem>
                  <MenuItem onClick={handleClearChat}>
                    <DeleteIcon sx={{ mr: 1 }} /> Clear Chat
                  </MenuItem>
                </Menu>
      
                <Box
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 3,
                    '&::-webkit-scrollbar': {
                      width: '0.4em'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0,0,0,.1)',
                      borderRadius: '24px'
                    }
                  }}
                >
                  <Container maxWidth="md">
                    {isLoadingMore && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <CircularProgress size={20} />
                      </Box>
                    )}
                    
                    <Stack spacing={2}>
                      {messages.map((message, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-start',
                            gap: 1
                          }}
                        >
                          {message.role === 'assistant' && (
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                              <BotIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                          )}
                          
                          <Box sx={{ maxWidth: '70%' }}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                                color: message.role === 'user' ? 'common.white' : 'text.primary'
                              }}
                            >
                              <Typography variant="body1">
                                {message.content}
                                {message === messages[messages.length - 1] && 
                                 message.role === 'assistant' && 
                                 isStreaming && (
                                  <Box component="span" sx={{ display: 'inline-block', ml: 0.5 }}>
                                    <Typography component="span" sx={{ animation: 'blink 1s infinite' }}>
                                      ▋
                                    </Typography>
                                  </Box>
                                )}
                              </Typography>
                            </Paper>
                            
                            <Box
                              sx={{
                                mt: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(message.timestamp)}
                              </Typography>
                              
                              {message.status === 'error' && (
                                <Tooltip title="Retry message">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRetry(index)}
                                    disabled={retryAttempts[index] >= maxRetries}
                                  >
                                    <ErrorIcon fontSize="small" color="error" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              {message.status === 'delivered' && (
                                <Tooltip title="Message delivered">
                                  <CheckIcon fontSize="small" color="success" />
                                </Tooltip>
                              )}
                              
                              <Tooltip title="Copy message">
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopyMessage(message.content)}
                                >
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
      
                          {message.role === 'user' && (
                            <Avatar sx={{ bgcolor: 'grey.300', width: 32, height: 32 }}>
                              <PersonIcon sx={{ fontSize: 20 }} />
                            </Avatar>
                          )}
                        </Box>
                      ))}
      
                      {/* Streaming message preview */}
                      {isStreaming && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-start'
                          }}
                        >
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                            <BotIcon sx={{ fontSize: 20 }} />
                          </Avatar>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              maxWidth: '70%'
                            }}
                          >
                            <Typography>
                              {streamingText}
                              <Box component="span" sx={{ display: 'inline-block', ml: 0.5 }}>
                                <Typography component="span" sx={{ animation: 'blink 1s infinite' }}>
                                  ▋
                                </Typography>
                              </Box>
                            </Typography>
                          </Paper>
                        </Box>
                      )}
      
                      <div ref={messagesEndRef} />
                    </Stack>
                  </Container>
                </Box>
      
                <Paper
                  component="form"
                  onSubmit={handleSubmit}
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 0
                  }}
                >
                  <Container maxWidth="md">
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={isReconnecting ? "Reconnecting..." : "Type your message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isReconnecting || isStreaming}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                      <IconButton
                        type="submit"
                        disabled={!input.trim() || isLoading || isReconnecting || isStreaming}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'common.white',
                          width: 48,
                          height: 48,
                          '&:hover': {
                            bgcolor: 'primary.dark'
                          },
                          '&.Mui-disabled': {
                            bgcolor: 'action.disabledBackground',
                            color: 'action.disabled'
                          }
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Container>
                </Paper>
              </Box>
            </MainContent>
      
            {/* Static Sidebar */}
            <Sidebar>
              {renderSidebarContent()}
            </Sidebar>
      
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
      
            <style jsx global>{`
              @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0; }
                100% { opacity: 1; }
              }
            `}</style>
          </Box>
        );
      };
      
      export default Chats;