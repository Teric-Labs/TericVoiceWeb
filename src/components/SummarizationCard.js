import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box, Typography, Tabs, Tab, FormControl, Select, MenuItem,
  Button, TextField, Snackbar, Alert, Drawer, LinearProgress, InputLabel,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  AudioFile as AudioFileIcon,
  Movie as MovieIcon,
  Article as ArticleIcon,
  Send as SendIcon,
  CheckCircle,
} from '@mui/icons-material';
import ViewSummaryComponent from './ViewSummaryComponent';
import { summarizationAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import UpgradePromptModal from './UpgradePromptModal';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' };
const SELECT_SX = {
  borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
};
const LABEL_SX = { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#0ea5e9' } };

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'lg', label: 'Luganda' },
  { value: 'ac', label: 'Acholi' },
  { value: 'at', label: 'Ateso' },
  { value: 'lgg', label: 'Lugbara' },
  { value: 'sw', label: 'Swahili' },
  { value: 'fr', label: 'French' },
  { value: 'rw', label: 'Kinyarwanda' },
];

const ALLOWED_FILE_TYPES = {
  document: { extensions: ['.pdf', '.doc', '.docx', '.txt'], message: 'Please upload a PDF, DOC, DOCX, or TXT file' },
  audio:    { extensions: ['.wav', '.mp3'], message: 'Please upload a WAV or MP3 file' },
  video:    { extensions: ['.mp4', '.avi', '.mov'], message: 'Please upload an MP4, AVI, or MOV file' },
};

const MAX_FILE_SIZE = 500 * 1024 * 1024;

const TAB_ICONS = [
  <ArticleIcon sx={{ fontSize: 17 }} />,
  <CloudUploadIcon sx={{ fontSize: 17 }} />,
  <AudioFileIcon sx={{ fontSize: 17 }} />,
  <MovieIcon sx={{ fontSize: 17 }} />,
];
const TAB_LABELS = ['Paste Text', 'Upload Document', 'Upload Audio', 'Upload Video'];

const SummarizationCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [wordCount, setWordCount] = useState('250'); // Default to Standard Analysis
  const [translationId, setTranslationId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState(null);

  const fileInputRef = useRef(null);

  const notify = useCallback((msg, sev = 'success') => setSnack({ open: true, msg, sev }), []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, []);

  const handleTabChange = useCallback((_, newValue) => {
    setActiveTab(newValue);
    setUploadedFile(null);
    setTextContent('');
    setTranslationId(null);
    setError(null);
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];
    if (!allowedTypes.extensions.includes(fileExtension)) {
      setUploadedFile(null);
      notify(allowedTypes.message, 'error');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadedFile(null);
      notify(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`, 'error');
      return;
    }
    setUploadedFile(file);
    notify(`File selected: ${file.name}`);
  }, [activeTab, notify]);

  const handleSubmit = useCallback(async () => {
    if (!sourceLanguage || (!user.userId && !user.uid)) {
      setError('Please fill in all required fields');
      return;
    }
    const userId = user.uid || user.userId;
    setTranslationId(null);
    setIsDrawerOpen(false);
    setIsProcessing(true);
    setError(null);
    try {
      const usageResult = await checkUsageBeforeRequest('summarize');
      if (!usageResult.allowed) {
        setUpgradeData({ currentUsage: usageResult.current_usage || 0, limit: usageResult.limit || 0, endpoint: 'summarize', tier: usageResult.tier || 'free_trial' });
        setShowUpgradeModal(true);
        setIsProcessing(false);
        return;
      }
      let response;
      const count = wordCount || '250';
      switch (activeTab) {
        case 0:
          if (!textContent.trim()) throw new Error('Text content is required');
          response = await summarizationAPI.summarizeText(textContent, sourceLanguage, userId, count);
          break;
        case 1:
          if (!uploadedFile) throw new Error('Please select a document to upload');
          response = await summarizationAPI.summarizeDocument(uploadedFile, sourceLanguage, userId, count);
          break;
        case 2:
          if (!uploadedFile) throw new Error('Please select an audio file to upload');
          response = await summarizationAPI.summarizeUpload(uploadedFile, sourceLanguage, userId, count);
          break;
        case 3:
          if (!uploadedFile) throw new Error('Please select a video file to upload');
          response = await summarizationAPI.summarizeAudioFromVideo(uploadedFile, sourceLanguage, userId, count);
          break;
        default:
          throw new Error('Invalid tab selection');
      }
      if (response?.doc_id) {
        setTranslationId(response.doc_id);
        setIsDrawerOpen(true);
        notify('Summary generated successfully');
      } else {
        throw new Error('No document ID received from server');
      }
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      if (err.response?.status === 403) window.dispatchEvent(new CustomEvent('show-upgrade-modal'));
    } finally {
      setIsProcessing(false);
    }
  }, [sourceLanguage, user.userId, user.uid, activeTab, textContent, uploadedFile, notify]);

  const renderFileUpload = useCallback(() => {
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowedTypes = ALLOWED_FILE_TYPES[fileType];
    return (
      <Box
        sx={{
          border: '1.5px dashed',
          borderColor: uploadedFile ? '#10b981' : 'rgba(255,255,255,0.12)',
          borderRadius: '14px', p: 4, textAlign: 'center', cursor: 'pointer',
          background: uploadedFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.25s ease',
          '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)' },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadedFile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
            <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{uploadedFile.name}</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <CloudUploadIcon sx={{ fontSize: 26, color: '#8b5cf6' }} />
            </Box>
            <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
              Click to upload or drag and drop
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              Supports {allowedTypes.extensions.join(', ')} (Max 500MB)
            </Typography>
          </>
        )}
        <input ref={fileInputRef} type="file" accept={allowedTypes.extensions.join(',')} onChange={handleFileUpload} style={{ display: 'none' }} />
      </Box>
    );
  }, [activeTab, handleFileUpload, uploadedFile]);

  return (
    <>
      <Box sx={{ p: 0.5 }}>
        {/* Tabs Control */}
        <Box sx={{ mb: 3, background: 'rgba(255,255,255,0.03)', borderRadius: '16px', p: 0.5, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
                minHeight: 44,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    borderRadius: '12px',
                    minHeight: 40,
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        color: '#fff',
                        background: G,
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }
                }
            }}
          >
            {TAB_LABELS.map((label, i) => (
              <Tab key={i} label={label} icon={TAB_ICONS[i]} iconPosition="start" />
            ))}
          </Tabs>
        </Box>

        {/* Configuration Row */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={LABEL_SX}>Target Language</InputLabel>
            <Select value={sourceLanguage} label="Target Language" onChange={e => setSourceLanguage(e.target.value)} sx={SELECT_SX}>
              {languageOptions.map(o => <MenuItem key={o.value} value={o.value} sx={{ color: 'rgba(255,255,255,0.8)' }}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <TextField
              size="small"
              label="Target Word Count"
              type="number"
              value={wordCount}
              onChange={e => setWordCount(e.target.value)}
              InputProps={{ inputProps: { min: 10, max: 2000 } }}
              sx={{
                ...SELECT_SX,
                '& .MuiInputLabel-root': LABEL_SX,
                '& .MuiOutlinedInput-root': {
                   borderRadius: '12px',
                   '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                   '&:hover fieldset': { borderColor: '#0ea5e9' },
                   '&.Mui-focused fieldset': { borderColor: '#0ea5e9' }
                }
              }}
            />
          </FormControl>
          
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500, display: { xs: 'none', lg: 'block' } }}>
            Summary will be optimized for this region's context and length.
          </Typography>
        </Box>

        {/* Input Area */}
        <Box sx={{ mb: 3 }}>
          {activeTab === 0 ? (
            <TextField
              fullWidth multiline rows={8}
              placeholder="Paste the transcription or text you want to condense into an ethical, meaningful summary..."
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { 
                    borderRadius: '20px', 
                    color: '#f8fafc', 
                    background: 'rgba(255,255,255,0.02)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, 
                    '&:hover fieldset': { borderColor: '#0ea5e9' }, 
                    '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } 
                },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' },
              }}
            />
          ) : (
            <Box sx={{ ...GLASS, overflow: 'hidden' }}>
                {renderFileUpload()}
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}
            sx={{ mb: 2.5, borderRadius: '16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </Alert>
        )}

        {isProcessing && (
            <Box sx={{ mb: 3 }}>
                <LinearProgress sx={{ borderRadius: 4, height: 6, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#0ea5e9', textAlign: 'center', fontWeight: 600 }}>
                    AI NARRATOR IS ANALYZING CONTENT...
                </Typography>
            </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained" size="large" onClick={handleSubmit}
            disabled={isProcessing || !sourceLanguage || (activeTab === 0 && !textContent.trim()) || (activeTab !== 0 && !uploadedFile)}
            startIcon={<ArticleIcon />}
            sx={{
              borderRadius: '50px', textTransform: 'none', fontWeight: 800, px: 6, py: 1.8,
              fontSize: '1rem',
              background: G, boxShadow: '0 8px 32px rgba(139,92,246,0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { background: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)', boxShadow: '0 12px 40px rgba(139,92,246,0.5)', transform: 'translateY(-2px)' },
              '&.Mui-disabled': { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', boxShadow: 'none' },
            }}
          >
            {isProcessing ? 'DEEP ANALYSIS IN PROGRESS...' : 'GENERATE AI SUMMARY'}
          </Button>
        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, background: '#0f0f2d', borderLeft: '1px solid rgba(255,255,255,0.07)' } }}>
        {translationId && (
          <ViewSummaryComponent
            translationId={translationId}
            onError={err => { notify(err.message, 'error'); setIsDrawerOpen(false); }}
          />
        )}
      </Drawer>

      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentUsage={upgradeData?.currentUsage || 0}
        limit={upgradeData?.limit || 0}
        endpoint={upgradeData?.endpoint || 'summarize'}
        tier={upgradeData?.tier || 'free_trial'}
      />
    </>
  );
};

export default SummarizationCard;
