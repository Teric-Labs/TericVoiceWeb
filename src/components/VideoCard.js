import React, { useState, useEffect, useRef } from "react";
import {
  TextField, Button, Select, MenuItem, FormControl,
  Box, Chip, Alert, Snackbar, Drawer, Tab, Tabs, Grid, LinearProgress,
  InputLabel, Stack,
} from "@mui/material";
import { CloudUpload, VideoCall, CheckCircle, Link as LinkIcon } from "@mui/icons-material";
import ViewVideoComponent from "./ViewVideoComponent";
import { videoAPI, checkUsageBeforeRequest, handleAPIError } from '../services/api';
import UpgradePromptModal from './UpgradePromptModal';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const SELECT_SX = {
  borderRadius: '12px', color: '#f8fafc', fontSize: '0.9rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
};
const LABEL_SX = { color: 'rgba(255,255,255,0.5)', '&.Mui-focused': { color: '#0ea5e9' } };

const languageOptions = [
  { value: "en",  label: "English",    flag: "🇺🇸" },
  { value: "lg",  label: "Luganda",    flag: "🇺🇬" },
  { value: "at",  label: "Ateso",      flag: "🇺🇬" },
  { value: "ac",  label: "Acholi",     flag: "🇺🇬" },
  { value: "sw",  label: "Swahili",    flag: "🇰🇪" },
  { value: "fr",  label: "French",     flag: "🇫🇷" },
  { value: "rw",  label: "Kinyarwanda", flag: "🇷🇼" },
  { value: "nyn", label: "Runyankore", flag: "🇺🇬" },
];

const VideoCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState(null);

  const fileInputRef = useRef(null);
  const notify = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleFileSelection = (file) => {
    if (file.size > 100 * 1024 * 1024) { setError("File size should not exceed 100MB"); return; }
    if (!file.type.startsWith("video/")) { setError("Please upload a valid video file"); return; }
    setSelectedFile(file);
    setError(null);
    notify('Video file selected successfully');
  };

  const validateForm = () => {
    if (!sourceLanguage) { setError("Please select a source language"); return false; }
    if (!targetLanguages.length) { setError("Please select at least one target language"); return false; }
    if (selectedTab === 0 && !selectedFile) { setError("Please select a video file"); return false; }
    if (selectedTab === 1 && !youtubeUrl.trim()) { setError("Please enter a YouTube URL"); return false; }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setDocId(null);
    setIsDrawerOpen(false);
    try {
      if (!user.userId) throw new Error('Please log in to use video processing services');
      const usageResult = await checkUsageBeforeRequest('videoUpload');
      if (!usageResult.allowed) {
        setUpgradeData({ currentUsage: usageResult.current_usage || 0, limit: usageResult.limit || 0, endpoint: 'videoUpload', tier: usageResult.tier || 'free_trial' });
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }
      const response = selectedTab === 0
        ? await videoAPI.extractAudioFromVideo(selectedFile, sourceLanguage, targetLanguages, user.userId)
        : await videoAPI.uploadVideo(youtubeUrl, sourceLanguage, targetLanguages, user.userId);
      setDocId(response.doc_id);
      setIsDrawerOpen(true);
      notify('Video processed successfully!');
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      if (err.response?.status === 403) window.dispatchEvent(new CustomEvent('show-upgrade-modal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}
          sx={{ minHeight: 40, '& .MuiTabs-indicator': { background: G, height: 2, borderRadius: 1 } }}>
          {[
            { label: 'Upload Video File', icon: <VideoCall sx={{ fontSize: 17 }} /> },
            { label: 'YouTube URL',       icon: <LinkIcon  sx={{ fontSize: 17 }} /> },
          ].map(({ label, icon }, i) => (
            <Tab key={i} label={label} icon={icon} iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40, color: selectedTab === i ? '#38bdf8' : 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#38bdf8' } }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Language Selectors */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={LABEL_SX}>Source Language</InputLabel>
            <Select value={sourceLanguage} label="Source Language" onChange={e => setSourceLanguage(e.target.value)} sx={SELECT_SX}>
              {languageOptions.map(o => <MenuItem key={o.value} value={o.value} sx={{ color: '#0f172a' }}>{o.flag} {o.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={LABEL_SX}>Target Languages</InputLabel>
            <Select multiple value={targetLanguages} label="Target Languages" onChange={e => setTargetLanguages(e.target.value)} sx={SELECT_SX}
              renderValue={sel => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {sel.map(v => <Chip key={v} label={languageOptions.find(o => o.value === v)?.label || v} size="small"
                    sx={{ background: 'rgba(14,165,233,0.2)', color: '#38bdf8', fontSize: '0.72rem', borderRadius: '50px' }} />)}
                </Box>
              )}>
              {languageOptions.map(o => <MenuItem key={o.value} value={o.value} sx={{ color: '#0f172a' }}>{o.flag} {o.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}
          sx={{ mb: 2.5, borderRadius: '12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </Alert>
      )}

      {/* Upload or URL */}
      {selectedTab === 0 ? (
        <Box sx={{ mb: 3 }}>
          <input ref={fileInputRef} type="file" accept="video/*" onChange={e => e.target.files[0] && handleFileSelection(e.target.files[0])} style={{ display: 'none' }} />
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '1.5px dashed',
              borderColor: selectedFile ? '#10b981' : 'rgba(255,255,255,0.12)',
              borderRadius: '14px', p: 4, textAlign: 'center', cursor: 'pointer',
              background: selectedFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)' },
            }}
          >
            {selectedFile ? (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
                <Box sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>{selectedFile.name}</Box>
              </Stack>
            ) : (
              <>
                <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <CloudUpload sx={{ fontSize: 26, color: '#0ea5e9' }} />
                </Box>
                <Box sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>Click to upload or drag and drop</Box>
                <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>MP4, AVI, MOV, WMV · Max 100MB</Box>
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=…"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#0ea5e9' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } },
              '& .MuiInputLabel-root': LABEL_SX,
            }}
          />
        </Box>
      )}

      {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, height: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained" size="large" onClick={handleSubmit}
          disabled={loading || (!selectedFile && !youtubeUrl.trim())}
          startIcon={<CloudUpload />}
          sx={{
            borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
            background: G, boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
            '&:hover': { background: 'linear-gradient(135deg,#0284c7,#7c3aed)', boxShadow: '0 6px 28px rgba(139,92,246,0.5)', transform: 'translateY(-1px)' },
            '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
          }}
        >
          {loading ? 'Processing…' : 'Process Video'}
        </Button>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px', fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, background: '#0f0f2d', borderLeft: '1px solid rgba(255,255,255,0.07)' } }}>
        {docId && <ViewVideoComponent audioId={docId} />}
      </Drawer>

      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentUsage={upgradeData?.currentUsage || 0}
        limit={upgradeData?.limit || 0}
        endpoint={upgradeData?.endpoint || 'videoUpload'}
        tier={upgradeData?.tier || 'free_trial'}
      />
    </Box>
  );
};

export default VideoCard;
