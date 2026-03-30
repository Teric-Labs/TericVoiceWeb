import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, Grid, IconButton, MenuItem,
  Select, TextField, Alert, Stack, Chip, LinearProgress,
  Typography, Tooltip, Menu,
} from '@mui/material';
import {
  Translate, CloudUpload, SwapHoriz, 
  ContentCopy, GetApp, CheckCircle, 
  Description, PictureAsPdf, Article,
  AutoAwesome, History, Storage
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setSourceLanguage, setTargetLanguage, setInputText, setTranslatedText,
  appendTranslatedChunk, setSelectedFile, translateText, translateDocument,
} from '../store/slices/translationSlice';
import { translationAPI, BASE_URL } from '../services/api';

const G = 'linear-gradient(135deg, #8b5cf6, #a855f7)'; // Purple Gradient
const GLASS = { 
  background: 'rgba(255,255,255,0.03)', 
  border: '1px solid rgba(255,255,255,0.06)', 
  borderRadius: '16px',
  backdropFilter: 'blur(10px)'
};

const SUPPORTED_LANGUAGES = [
  { value: 'en',  label: 'English' },
  { value: 'lg',  label: 'Luganda' },
  { value: 'sw',  label: 'Kiswahili' },
  { value: 'ac',  label: 'Acholi' },
  { value: 'at',  label: 'Ateso' },
  { value: 'nyn', label: 'Runyankore' },
];

const TranslationStudio = () => {
  const dispatch = useAppDispatch();
  const {
    sourceLanguage, targetLanguage, inputText, translatedText,
    selectedFile, isLoading, error
  } = useAppSelector(state => state.translation);
  const { user } = useAppSelector(state => state.auth);

  const [exportAnchor, setExportAnchor] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 100, percentage: 0 });
  const [streamingActive, setStreamingActive] = useState(false);
  const [streamInfo, setStreamInfo] = useState('System Ready');
  const translationEndRef = useRef(null);

  // Synchronized Scrolling Logic (Optional Enhancement)
  const sourceRef = useRef(null);
  const targetRef = useRef(null);

  // Real-time EventSource Streaming
  useEffect(() => {
    let eventSource;
    const uid = user?.uid || user?.userId;
    
    if (streamingActive && uid) {
        console.log(`[Studio] Re-initializing stream for UID: ${uid}`);
        dispatch(setTranslatedText('')); 
        setStreamInfo('Initializing Stream...');
        
        // Ensure we point to the exact same host as the API
        const streamUrl = `${BASE_URL}/translate/stream/${uid}`;
        console.log(`[Studio] Connecting SSE: ${streamUrl}`);
        
        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
            console.log(`[Studio] SSE Connected Successfully`);
            setStreamInfo('Connected • Processing Document...');
        };

        eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.chunk) {
                    console.log(`[Studio] Received Chunk: ${data.chunk.substring(0, 30)}...`);
                    dispatch(appendTranslatedChunk(data.chunk));
                    if (translationEndRef.current) translationEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
                if (data.error) {
                    console.error("[Studio] Backend Stream Error:", data.error);
                    setStreamInfo(`Error: ${data.error}`);
                    setStreamingActive(false);
                }
            } catch (err) { 
                console.error("[Studio] Stream parse error:", err); 
            }
        };

        eventSource.onerror = (err) => {
            console.warn("[Studio] SSE Connection closed or completed.", err);
            setStreamInfo('Stream Finalized');
            eventSource.close();
            setStreamingActive(false);
        };

        return () => { if (eventSource) eventSource.close(); };
    }
  }, [streamingActive, user, dispatch]);

  // Synchronized Scrolling Logic
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    // We synchronize the other panel based on the percentage
    const targetPanel = e.target === sourceRef.current ? targetRef.current : sourceRef.current;
    if (targetPanel) {
        targetPanel.scrollTop = scrollPercentage * (targetPanel.scrollHeight - targetPanel.clientHeight);
    }
  };

  // Regular Progress Polling
  useEffect(() => {
    let interval;
    if (isLoading && user?.userId) {
      interval = setInterval(async () => {
        try {
          const status = await translationAPI.getTranslationStatus(user.userId);
          setProgress({ current: status.current || 0, total: status.total || 100, percentage: status.percentage || 0 });
          if (status.status === 'completed') setStreamingActive(false);
        } catch (e) { console.error("Status check error:", e); }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading, user?.userId]);

  const handleTranslate = async () => {
    if (!user?.userId) return;
    try {
      if (selectedFile) {
        const result = await dispatch(translateDocument({ 
          userId: user.userId, sourceLang: sourceLanguage, targetLang: targetLanguage, file: selectedFile 
        })).unwrap();
        if (result.status === 'started') setStreamingActive(true);
      } else if (inputText) {
        const result = await dispatch(translateText({ 
          userId: user.userId, sourceLang: sourceLanguage, targetLang: targetLanguage, text: inputText 
        })).unwrap();
        if (result.status === 'started') setStreamingActive(true);
      }
    } catch (e) { 
        console.error("Translation fail:", e); 
        setStreamInfo(`Error: ${e.message || 'Translation failed'}`);
    }
  };

  const handleClear = () => {
    dispatch(setInputText(''));
    dispatch(setSelectedFile(null));
    dispatch(setTranslatedText(''));
    setStreamingActive(false);
    setStreamInfo('System Ready');
  };

  const handleExport = async (format) => {
    setExportAnchor(null);
    if (!translatedText) return;
    try {
      const filename = selectedFile ? selectedFile.name.split('.')[0] : 'translation';
      let blob;
      if (format === 'docx') {
        blob = await translationAPI.exportToDocx(translatedText, filename);
      } else if (format === 'pdf') {
        blob = await translationAPI.exportToPdf(translatedText, filename);
      } else {
        blob = new Blob([translatedText], { type: 'text/plain' });
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setSuccessMsg(`Expert Export Completed: ${format.toUpperCase()}`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Expert Toolbar */}
      <Box sx={{ 
        ...GLASS, p: 2, mb: 3, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 2,
        borderLeft: '4px solid #8b5cf6'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, borderRadius: '8px', background: G, display: 'flex' }}>
            <AutoAwesome sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
              Professional Translation Studio
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              Expert Streaming Engine v2.0 • Active
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select 
                    value={sourceLanguage} 
                    onChange={e => dispatch(setSourceLanguage(e.target.value))}
                    sx={{ borderRadius: '8px', color: '#fff', fontSize: '0.85rem', bgcolor: 'rgba(255,255,255,0.05)', border: 'none' }}
                >
                    {SUPPORTED_LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#111' }}>{l.label}</MenuItem>)}
                </Select>
            </FormControl>
            <IconButton onClick={() => dispatch(setSourceLanguage(targetLanguage))} sx={{ color: '#8b5cf6' }}>
                <SwapHoriz />
            </IconButton>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select 
                    value={targetLanguage} 
                    onChange={e => dispatch(setTargetLanguage(e.target.value))}
                    sx={{ borderRadius: '8px', color: '#fff', fontSize: '0.85rem', bgcolor: 'rgba(255,255,255,0.05)' }}
                >
                    {SUPPORTED_LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#111' }}>{l.label}</MenuItem>)}
                </Select>
            </FormControl>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<Translate />}
            onClick={handleTranslate}
            disabled={isLoading || streamingActive || (!inputText && !selectedFile)}
            sx={{ 
                borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 3,
                background: G, boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                '&:hover': { background: '#7c3aed' }
            }}
          >
            {streamingActive ? 'Streaming...' : 'Start Expert Translation'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={(e) => setExportAnchor(e.currentTarget)}
            disabled={!translatedText || streamingActive}
            sx={{ 
                borderRadius: '10px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)', color: '#fff',
                '&:hover': { borderColor: '#8b5cf6', background: 'rgba(139, 92, 246, 0.05)' }
            }}
          >
            Export Final
          </Button>
          <Menu
            anchorEl={exportAnchor}
            open={Boolean(exportAnchor)}
            onClose={() => setExportAnchor(null)}
            PaperProps={{ sx: { bgcolor: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', minWidth: 180, borderRadius: '12px' } }}
          >
            <MenuItem onClick={() => handleExport('docx')} sx={{ py: 1.5 }}><Description sx={{ mr: 1.5, color: '#3b82f6' }} /> MS Word</MenuItem>
            <MenuItem onClick={() => handleExport('pdf')} sx={{ py: 1.5 }}><PictureAsPdf sx={{ mr: 1.5, color: '#ef4444' }} /> Adobe PDF</MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* Main Workspace Split */}
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Source Panel */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box 
            ref={sourceRef} 
            onScroll={handleScroll}
            sx={{ 
                ...GLASS, p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', 
                height: '60vh', overflowY: 'auto' 
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>
                    Source Material
                </Typography>
                <input type="file" id="studio-upload" style={{ display: 'none' }} onChange={(e) => dispatch(setSelectedFile(e.target.files[0]))} accept=".pdf,.docx,.doc,.txt" />
                {selectedFile ? (
                    <Chip label={selectedFile.name} onDelete={() => dispatch(setSelectedFile(null))} sx={{ bgcolor: 'rgba(56,189,248,0.1)', color: '#38bdf8' }} />
                ) : (
                    <Stack direction="row" spacing={1}>
                        {inputText && (
                            <Button variant="text" size="small" onClick={handleClear} sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'none', fontSize: '0.7rem' }}>
                                Clear Text
                            </Button>
                        )}
                        <Button variant="text" size="small" startIcon={<CloudUpload />} onClick={() => document.getElementById('studio-upload').click()} sx={{ color: '#38bdf8', textTransform: 'none' }}>
                            Load Document
                        </Button>
                    </Stack>
                )}
            </Stack>
            
            <TextField
              multiline fullWidth variant="standard"
              placeholder="Type or paste material here for translation. Large texts will stream in real-time..."
              value={inputText}
              onChange={e => dispatch(setInputText(e.target.value))}
              disabled={!!selectedFile}
              InputProps={{ 
                disableUnderline: true,
                sx: { 
                  color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.8,
                  fontFamily: '"JetBrains Mono", monospace',
                } 
              }}
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </Grid>

        {/* Translation Panel (Real-time Stream) */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box 
            ref={targetRef} 
            onScroll={handleScroll}
            sx={{ 
                ...GLASS, p: 3, flexGrow: 1, border: '1px solid rgba(139, 92, 246, 0.2)',
                background: 'rgba(139, 92, 246, 0.02)', display: 'flex', flexDirection: 'column',
                position: 'relative', height: '60vh', overflowY: 'auto'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: '#a855f7', fontWeight: 800 }}>
                    Expert Translation Result
                </Typography>
                <Stack direction="row" spacing={1}>
                    {streamingActive && <Chip size="small" label="Live Stream" sx={{ bgcolor: '#7c3aed', color: '#fff', fontSize: '0.65rem' }} />}
                    <Tooltip title="Copy to Clipboard">
                        <IconButton size="small" onClick={() => navigator.clipboard.writeText(translatedText)} sx={{ color: 'rgba(255,255,255,0.3)' }}>
                            <ContentCopy fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <TextField
              multiline fullWidth variant="standard"
              placeholder="System ready... start translation to begin streaming."
              value={translatedText}
              onChange={e => dispatch(setTranslatedText(e.target.value))}
              InputProps={{ 
                disableUnderline: true,
                sx: { 
                    color: '#f8fafc', fontSize: '0.95rem', lineHeight: 2,
                    fontFamily: '"Inter", sans-serif',
                    height: '100%', whiteSpace: 'pre-wrap', overflow: 'auto'
                } 
              }}
              sx={{ flexGrow: 1, '& .MuiInputBase-root': { alignItems: 'flex-start', height: '100%' } }}
            />
            <div ref={translationEndRef} />
            
            {(isLoading || streamingActive) && (
               <Box sx={{ 
                   position: 'absolute', bottom: 0, left: 0, right: 0, 
                   p: 2, background: 'linear-gradient(to top, #09090b 80%, transparent)',
                   borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 10
               }}>
                   <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#a855f7', fontWeight: 800, fontSize: '0.7rem' }}>
                            {streamInfo.toUpperCase()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                            {progress.percentage}% COMPLETE
                        </Typography>
                   </Stack>
                   <LinearProgress 
                        variant="determinate"
                        value={progress.percentage}
                        sx={{ borderRadius: 2, height: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: G } }} 
                   />
               </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Persistence Info Bar */}
      <Box sx={{ mt: 2, p: 1, px: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 2 }}>
         <Storage sx={{ fontSize: 14, color: '#10b981' }} />
         <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            Cloud Persistence Active: Each translated chunk is securely stored in real-time.
         </Typography>
         <Box sx={{ flexGrow: 1 }} />
         <History sx={{ fontSize: 14, color: '#3b82f6' }} />
         <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', '&:hover': { color: '#3b82f6' } }}>
            View Translation History
         </Typography>
      </Box>

      {/* Notifications */}
      <Stack sx={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: 'auto', zIndex: 3000 }}>
        {successMsg && (
          <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ borderRadius: '12px', bgcolor: '#064e3b', color: '#10b981', minWidth: 300 }}>
            {successMsg}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default TranslationStudio;
