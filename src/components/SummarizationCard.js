import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Tabs, Tab, FormControl, Select, MenuItem,
  Button, TextField, Snackbar, Alert, Drawer,
  Stepper, Step, StepLabel, StepContent, Paper,
  Chip, InputLabel, Grid, Stack,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  AudioFile as AudioFileIcon,
  Movie as MovieIcon,
  Article as ArticleIcon,
  CheckCircle, CheckCircleOutline, AutoAwesome, Notes,
} from '@mui/icons-material';
import ViewSummaryComponent from './ViewSummaryComponent';
import { summarizationAPI, subscriptionAPI, getFriendlyErrorMessage } from '../services/api';
import { AC, G, GLASS, STEPPER_SX } from '../utils/mediaVault';
import CreditEstimateChip from './CreditEstimateChip';
import { AvoicesBackdropLoader } from './progress';
import useFileDrop from '../hooks/useFileDrop';
import { useStudioTour } from './onboarding';
import { TOUR_IDS, summarizeTour } from './onboarding/tours';
const SELECT_SX = {
  borderRadius: '12px', color: '#111111',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(17, 17, 17, 0.15)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: AC },
};
const LABEL_SX = { color: 'rgba(17, 17, 17, 0.5)', '&.Mui-focused': { color: AC } };

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
  document: { extensions: ['.pdf', '.doc', '.docx', '.txt'], accept: '.pdf,.doc,.docx,.txt', message: 'Please upload a PDF, DOC, DOCX, or TXT file' },
  audio: { extensions: ['.wav', '.mp3'], accept: '.wav,.mp3', message: 'Please upload a WAV or MP3 file' },
  video: { extensions: ['.mp4', '.avi', '.mov'], accept: '.mp4,.avi,.mov', message: 'Please upload an MP4, AVI, or MOV file' },
};

const MAX_FILE_SIZE = 500 * 1024 * 1024;
const SUMMARIZATION_COST = 2;

const TAB_CONFIG = [
  { label: 'Paste Text', icon: <ArticleIcon sx={{ fontSize: 17 }} />, step1: 'Enter Text Content' },
  { label: 'Document', icon: <CloudUploadIcon sx={{ fontSize: 17 }} />, step1: 'Upload Document' },
  { label: 'Audio', icon: <AudioFileIcon sx={{ fontSize: 17 }} />, step1: 'Upload Audio' },
  { label: 'Video', icon: <MovieIcon sx={{ fontSize: 17 }} />, step1: 'Upload Video' },
];

function StepNav({ onBack, onNext, backDisabled, nextDisabled, nextLabel = 'Next' }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <Button disabled={backDisabled} onClick={onBack} sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', color: 'rgba(17,17,17,0.6)' }}>Back</Button>
      <Button variant="contained" onClick={onNext} disabled={nextDisabled} sx={{ background: G, borderRadius: '10px', fontWeight: 800, textTransform: 'none', boxShadow: '0 4px 18px rgba(232, 160, 32, 0.25)' }}>{nextLabel}</Button>
    </Stack>
  );
}

const SummarizationCard = () => {
  useStudioTour(TOUR_IDS.summarize, summarizeTour);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [textContent, setTextContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [wordCount, setWordCount] = useState('250');
  const [summaryId, setSummaryId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const [userBalance, setUserBalance] = useState(null);

  const fileInputRef = useRef(null);
  const isLowBalance = userBalance !== null && userBalance < SUMMARIZATION_COST;
  const hasContent = activeTab === 0 ? !!textContent.trim() : !!uploadedFile;

  const notify = useCallback((msg, sev = 'success') => setSnack({ open: true, msg, sev }), []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        const uid = parsed.uid || parsed.userId;
        if (uid) {
          subscriptionAPI.getBalance(uid)
            .then(data => setUserBalance(data.balance ?? data.credit_balance ?? null))
            .catch(() => {});
        }
      } catch { /* ignore */ }
    }
  }, []);

  const handleTabChange = useCallback((_, newValue) => {
    setActiveTab(newValue);
    setActiveStep(0);
    setUploadedFile(null);
    setTextContent('');
    setSummaryId(null);
    setError(null);
    setSuccessMsg(null);
  }, []);

  const handleNext = () => setActiveStep(s => s + 1);
  const handleBack = () => setActiveStep(s => Math.max(0, s - 1));

  const handleReset = () => {
    setActiveStep(0);
    setTextContent('');
    setUploadedFile(null);
    setSummaryId(null);
    setError(null);
    setSuccessMsg(null);
  };

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowed = ALLOWED_FILE_TYPES[fileType];
    if (!allowed.extensions.includes(fileExtension)) {
      setUploadedFile(null);
      notify(allowed.message, 'error');
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

  const dropAccept = useMemo(() => {
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    return ALLOWED_FILE_TYPES[fileType]?.extensions || [];
  }, [activeTab]);

  const { isDragOver, dropProps } = useFileDrop(
    files => handleFileUpload({ target: { files } }),
    { multiple: false, accept: dropAccept },
  );

  const handleSubmit = useCallback(async () => {
    if (!sourceLanguage || (!user.userId && !user.uid)) {
      setError('Please log in and select a language');
      return;
    }
    const userId = user.uid || user.userId;
    setSummaryId(null);
    setIsProcessing(true);
    setError(null);
    setSuccessMsg(null);
    try {
      let response;
      const count = wordCount || '250';
      switch (activeTab) {
        case 0:
          if (!textContent.trim()) throw new Error('Text content is required');
          response = await summarizationAPI.summarizeText(textContent, sourceLanguage, userId, count);
          break;
        case 1:
          if (!uploadedFile) throw new Error('Please select a document');
          response = await summarizationAPI.summarizeDocument(uploadedFile, sourceLanguage, userId, count);
          break;
        case 2:
          if (!uploadedFile) throw new Error('Please select an audio file');
          response = await summarizationAPI.summarizeUpload(uploadedFile, sourceLanguage, userId, count);
          break;
        case 3:
          if (!uploadedFile) throw new Error('Please select a video file');
          response = await summarizationAPI.summarizeAudioFromVideo(uploadedFile, sourceLanguage, userId, count);
          break;
        default:
          throw new Error('Invalid input mode');
      }
      const docId = response?.doc_id || response?.data?.doc_id;
      if (docId) {
        setSummaryId(docId);
        subscriptionAPI.getBalance(userId).then(data => {
          setUserBalance(data.balance ?? data.credit_balance ?? null);
          window.dispatchEvent(new CustomEvent('refresh-balance'));
        }).catch(() => {});
        setSuccessMsg('Summary generated successfully!');
        setActiveStep(3);
        window.dispatchEvent(new CustomEvent('library-updated'));
      } else {
        throw new Error('No document ID received from server');
      }
    } catch (err) {
      if (err.response?.status === 402) {
        window.dispatchEvent(new CustomEvent('subscription-limit-exceeded', {
          detail: { message: err.response?.data?.detail || 'Insufficient credits.', status: 402 },
        }));
        setError(err.response?.data?.detail || 'Insufficient credits for summarization.');
      } else {
        setError(getFriendlyErrorMessage(err, 'An error occurred during summarization'));
      }
    } finally {
      setIsProcessing(false);
    }
  }, [sourceLanguage, user.userId, user.uid, activeTab, textContent, uploadedFile, wordCount]);

  const renderFileUpload = () => {
    const fileType = activeTab === 1 ? 'document' : activeTab === 2 ? 'audio' : 'video';
    const allowed = ALLOWED_FILE_TYPES[fileType];
    return (
      <Box
        onClick={() => fileInputRef.current?.click()}
        {...dropProps}
        sx={{
          border: '1px dashed', borderColor: isDragOver ? AC : uploadedFile ? '#10b981' : 'rgba(17,17,17,0.12)',
          borderRadius: '16px', p: 4, textAlign: 'center', cursor: 'pointer',
          background: isDragOver ? 'rgba(232,160,32,0.1)' : uploadedFile ? 'rgba(16,185,129,0.05)' : 'rgba(17,17,17,0.02)',
          transition: 'all 0.25s ease',
          '&:hover': { borderColor: AC, background: 'rgba(232,160,32,0.04)' },
        }}
      >
        {uploadedFile ? (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
            <CheckCircle sx={{ color: '#10b981', fontSize: 22 }} />
            <Typography sx={{ color: '#10b981', fontWeight: 700 }}>{uploadedFile.name}</Typography>
          </Stack>
        ) : (
          <>
            <Box sx={{ width: 60, height: 60, borderRadius: '16px', background: 'rgba(232,160,32,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <CloudUploadIcon sx={{ fontSize: 30, color: AC }} />
            </Box>
            <Typography sx={{ color: '#111111', fontWeight: 700, mb: 0.5 }}>Click to upload or drag and drop</Typography>
            <Typography sx={{ color: 'rgba(17,17,17,0.5)', fontSize: '0.8rem' }}>{allowed.extensions.join(', ')} · Max 500MB</Typography>
          </>
        )}
        <input ref={fileInputRef} type="file" accept={allowed.accept} onChange={handleFileUpload} style={{ display: 'none' }} />
      </Box>
    );
  };

  const langLabel = languageOptions.find(o => o.value === sourceLanguage)?.label;

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, minHeight: '100vh', background: 'transparent', maxWidth: 1200, mx: 'auto' }}>

      <AvoicesBackdropLoader open={isProcessing} message="Analyzing content…" submessage="Building your summary" />

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: '12px' }}>{typeof error === 'string' ? error : error?.message}</Alert>}
      {successMsg && <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ mb: 2, borderRadius: '12px' }}>{successMsg}</Alert>}

      <Box sx={{ mb: 2, borderBottom: '1px solid rgba(17,17,17,0.07)' }}>
        <Tabs
          data-tour="studio-mode"
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 40, '& .MuiTabs-indicator': { background: G, height: 2 } }}
        >
          {TAB_CONFIG.map(({ label, icon }, i) => (
            <Tab key={i} label={label} icon={icon} iconPosition="start" sx={{
              textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40,
              color: activeTab === i ? AC : 'rgba(17,17,17,0.4)', '&.Mui-selected': { color: AC },
            }} />
          ))}
        </Tabs>
      </Box>

      <Stepper data-tour="studio-flow" activeStep={activeStep} orientation="vertical" sx={STEPPER_SX}>

        <Step>
          <StepLabel>Step 1: {TAB_CONFIG[activeTab].step1}</StepLabel>
          <StepContent>
            <Paper data-tour="studio-input" elevation={0} sx={{ p: 3, mb: 2, ...GLASS, mt: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: 'rgba(17,17,17,0.6)', mb: 2, fontWeight: 600 }}>
                {activeTab === 0
                  ? 'Paste the transcription or text you want condensed into a clear summary.'
                  : `Upload your ${activeTab === 1 ? 'document' : activeTab === 2 ? 'audio file' : 'video file'} for AI analysis.`}
              </Typography>
              {activeTab === 0 ? (
                <TextField
                  fullWidth multiline minRows={8} maxRows={14}
                  placeholder="Paste the content you want summarized…"
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', color: '#111111', lineHeight: 1.65 } }}
                />
              ) : renderFileUpload()}
            </Paper>
            <StepNav onBack={handleBack} onNext={handleNext} backDisabled={activeStep === 0} nextDisabled={!hasContent} />
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Step 2: Language & Summary Length</StepLabel>
          <StepContent>
            <Paper elevation={0} sx={{ p: 3, mb: 2, ...GLASS, mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={LABEL_SX}>Source Language</InputLabel>
                    <Select value={sourceLanguage} label="Source Language" onChange={e => setSourceLanguage(e.target.value)} sx={SELECT_SX}>
                      {languageOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth size="small" label="Target Word Count" type="number"
                    value={wordCount} onChange={e => setWordCount(e.target.value)}
                    InputProps={{ inputProps: { min: 10, max: 2000 } }}
                    sx={{ '& .MuiInputLabel-root': LABEL_SX, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </Grid>
              </Grid>
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(17,17,17,0.45)', mt: 2, fontWeight: 600 }}>
                Summary length is optimized for your selected language and context.
              </Typography>
            </Paper>
            <StepNav onBack={handleBack} onNext={handleNext} backDisabled={false} nextDisabled={false} />
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Step 3: Review & Generate Summary</StepLabel>
          <StepContent>
            <Paper elevation={0} sx={{ p: 3, mb: 2, ...GLASS, mt: 1 }}>
              <Stack spacing={1.5} sx={{ p: 2, background: 'rgba(232,160,32,0.05)', borderRadius: '12px', border: `1px solid ${AC}30`, mb: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#111111' }}><strong>Mode:</strong> {TAB_CONFIG[activeTab].label}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#111111' }}><strong>Language:</strong> {langLabel}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#111111' }}><strong>Target length:</strong> ~{wordCount} words</Typography>
                {activeTab === 0 && <Typography sx={{ fontSize: '0.8rem', color: '#111111' }}><strong>Input:</strong> {textContent.trim().split(/\s+/).filter(Boolean).length} words</Typography>}
                {uploadedFile && <Typography sx={{ fontSize: '0.8rem', color: '#111111' }}><strong>File:</strong> {uploadedFile.name}</Typography>}
                <Box><CreditEstimateChip service="summarization" quantity={1} balance={userBalance} /></Box>
              </Stack>
              <Button
                variant="contained" fullWidth startIcon={<AutoAwesome />}
                onClick={handleSubmit}
                disabled={isProcessing || !hasContent || !sourceLanguage || isLowBalance}
                sx={{ background: G, py: 1.5, borderRadius: '12px', fontWeight: 900, boxShadow: '0 4px 20px rgba(232,160,32,0.25)' }}
              >
                {isProcessing ? 'Analyzing…' : isLowBalance ? 'Insufficient Credits' : 'Generate AI Summary'}
              </Button>
            </Paper>
            <StepNav onBack={handleBack} onNext={handleNext} backDisabled={false} nextDisabled={!summaryId} nextLabel="View Summary" />
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Step 4: View Summary</StepLabel>
          <StepContent>
            <Paper elevation={0} sx={{ p: 4, mb: 2, ...GLASS, mt: 1, textAlign: 'center' }}>
              <CheckCircleOutline sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#111111', mb: 1 }}>Summary Ready!</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: 'rgba(17,17,17,0.6)', mb: 4 }}>
                Your AI-generated summary is ready to read and export.
              </Typography>
              {summaryId ? (
                <Button variant="contained" onClick={() => setIsDrawerOpen(true)} sx={{ background: G, px: 4, py: 1.5, borderRadius: '12px', fontWeight: 900, mb: 3 }}>
                  Open Summary
                </Button>
              ) : (
                <Typography sx={{ color: 'rgba(17,17,17,0.4)', mb: 3 }}>Complete Step 3 to generate a summary.</Typography>
              )}
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="outlined" onClick={handleBack} sx={{ borderRadius: '12px', fontWeight: 800, px: 3 }}>Back</Button>
                <Button variant="outlined" onClick={handleReset} sx={{ borderRadius: '12px', fontWeight: 800, px: 3 }}>Start Over</Button>
              </Stack>
            </Paper>
          </StepContent>
        </Step>

      </Stepper>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px' }}>{snack.msg}</Alert>
      </Snackbar>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, borderLeft: '1px solid rgba(17,17,17,0.08)' } }}>
        {summaryId && (
          <ViewSummaryComponent
            translationId={summaryId}
            onError={err => { notify(getFriendlyErrorMessage(err), 'error'); setIsDrawerOpen(false); }}
          />
        )}
      </Drawer>
    </Box>
  );
};

export default SummarizationCard;
