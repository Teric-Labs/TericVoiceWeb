import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, Grid, IconButton, MenuItem,
  Select, TextField, Alert, Tab, Tabs, Stack, Chip, LinearProgress,
  InputLabel,
} from '@mui/material';
import {
  Translate, CloudUpload, SwapHoriz, Language,
  PictureAsPdf, Description, Article,
  ContentCopy, Download, CheckCircle,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setSourceLanguage, setTargetLanguage, setInputText, setTranslatedText,
  setSelectedFile, setActiveTab, clearError, clearTranslation,
  translateText, translateDocument,
} from '../store/slices/translationSlice';
import DocumentTranslationDrawer from './DocumentTranslationDrawer';

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

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 5000;

const SUPPORTED_LANGUAGES = [
  { value: 'en',  label: 'English' },
  { value: 'lg',  label: 'Luganda' },
  { value: 'sw',  label: 'Kiswahili' },
  { value: 'ac',  label: 'Acholi' },
  { value: 'at',  label: 'Ateso' },
  { value: 'nyn', label: 'Runyankore' },
];

const SUPPORTED_FILE_TYPES = [
  { type: 'PDF',  extension: '.pdf' },
  { type: 'Word', extension: '.doc, .docx' },
  { type: 'Text', extension: '.txt' },
];

const TranslationCard = () => {
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [userClosedDrawer, setUserClosedDrawer] = useState(false);

  const {
    sourceLanguage, targetLanguage, inputText, translatedText,
    selectedFile, isLoading: loading, error, activeTab,
  } = useAppSelector(state => state.translation);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (translatedText && !loading && !error && !drawerOpen && !userClosedDrawer) {
      setTimeout(() => {
        setDrawerData({
          translations: { [targetLanguage]: translatedText },
          original: activeTab === 0 ? inputText : selectedFile?.name || 'Document',
          metadata: {
            file_name: activeTab === 0 ? 'Text Translation' : selectedFile?.name || 'Document',
            file_size: activeTab === 0 ? inputText.length : selectedFile?.size || 0,
            languages_translated: 1,
            processing_status: 'completed',
          },
        });
        setDrawerOpen(true);
      }, 200);
    }
  }, [translatedText, loading, error, targetLanguage, activeTab, inputText, selectedFile]);

  const handleTranslate = async () => {
    if (!user?.userId) return;
    setDrawerOpen(false);
    setDrawerData(null);
    setUserClosedDrawer(false);
    try {
      if (activeTab === 0) {
        if (inputText.length > MAX_TEXT_LENGTH) throw new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
        await dispatch(translateText({ userId: user.userId, sourceLang: sourceLanguage, targetLang: targetLanguage, text: inputText })).unwrap();
      } else {
        if (!selectedFile) throw new Error('No file selected');
        if (selectedFile.size > MAX_FILE_SIZE) throw new Error('File size exceeds 10MB limit');
        await dispatch(translateDocument({ userId: user.userId, sourceLang: sourceLanguage, targetLang: targetLanguage, file: selectedFile })).unwrap();
      }
    } catch {}
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileType = `.${file.name.split('.').pop().toLowerCase()}`;
    const validTypes = SUPPORTED_FILE_TYPES.map(t => t.extension.split(', ').map(e => e.toLowerCase())).flat();
    if (validTypes.includes(fileType)) {
      dispatch(setSelectedFile(file));
      dispatch(clearError());
    }
    event.target.value = null;
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(translatedText); } catch {}
  };

  const handleDownload = () => {
    const el = document.createElement('a');
    el.href = URL.createObjectURL(new Blob([translatedText], { type: 'text/plain' }));
    el.download = 'translation.txt';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const handleSwapLanguages = () => {
    dispatch(setSourceLanguage(targetLanguage));
    dispatch(setTargetLanguage(sourceLanguage));
  };

  return (
    <>
      <Box>
        {/* Tabs */}
        <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => dispatch(setActiveTab(v))}
            sx={{ minHeight: 40, '& .MuiTabs-indicator': { background: G, height: 2, borderRadius: 1 } }}
          >
            {['Text Translation', 'Document Translation'].map((label, i) => (
              <Tab key={i} label={label}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40, color: activeTab === i ? '#38bdf8' : 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#38bdf8' } }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Language Selectors */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth size="small">
              <InputLabel sx={LABEL_SX}>Source Language</InputLabel>
              <Select value={sourceLanguage} label="Source Language" onChange={e => dispatch(setSourceLanguage(e.target.value))} sx={SELECT_SX}>
                {SUPPORTED_LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleSwapLanguages} sx={{ width: 36, height: 36, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', '&:hover': { background: 'rgba(14,165,233,0.25)' } }}>
              <SwapHoriz fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth size="small">
              <InputLabel sx={LABEL_SX}>Target Language</InputLabel>
              <Select value={targetLanguage} label="Target Language" onChange={e => dispatch(setTargetLanguage(e.target.value))} sx={SELECT_SX}>
                {SUPPORTED_LANGUAGES.map(l => <MenuItem key={l.value} value={l.value} sx={{ color: '#0f172a' }}>{l.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Content */}
        {activeTab === 0 ? (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                multiline rows={8} fullWidth
                label="Input Text"
                placeholder="Enter text to translate…"
                value={inputText}
                onChange={e => dispatch(setInputText(e.target.value))}
                error={inputText.length > MAX_TEXT_LENGTH}
                helperText={`${inputText.length} / ${MAX_TEXT_LENGTH}`}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#0ea5e9' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } },
                  '& .MuiInputLabel-root': LABEL_SX,
                  '& .MuiFormHelperText-root': { color: '#64748b' },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                multiline rows={8} fullWidth
                label="Translated Text"
                placeholder="Translation will appear here…"
                value={translatedText}
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '14px', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#0ea5e9' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } },
                  '& .MuiInputLabel-root': LABEL_SX,
                }}
              />
              {translatedText && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Button variant="outlined" size="small" startIcon={<ContentCopy />} onClick={handleCopy}
                    sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: '#0ea5e9', color: '#38bdf8' } }}>
                    Copy
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<Download />} onClick={handleDownload}
                    sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: '#8b5cf6', color: '#a78bfa' } }}>
                    Download
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                border: '1.5px dashed',
                borderColor: selectedFile ? '#10b981' : 'rgba(255,255,255,0.12)',
                borderRadius: '14px', p: 4, textAlign: 'center', cursor: 'pointer',
                background: selectedFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.25s ease',
                '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.04)' },
              }}
              onClick={() => document.getElementById('transl-file-input')?.click()}
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
                  <Box sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>Click to upload document</Box>
                  <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>PDF, DOC, DOCX, TXT · Max 10MB</Box>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                    {SUPPORTED_FILE_TYPES.map(t => (
                      <Chip key={t.type} label={t.type} size="small"
                        sx={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.7rem' }} />
                    ))}
                  </Stack>
                </>
              )}
              <input id="transl-file-input" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
            </Box>
            {translatedText && (
              <Box sx={{ ...GLASS, p: 2.5, mt: 2, borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                  <Box sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>Translation Completed Successfully</Box>
                </Stack>
                <Box sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.5 }}>Results are displayed in the drawer on the right</Box>
              </Box>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </Alert>
        )}

        {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, height: 5, background: 'rgba(255,255,255,0.07)', '& .MuiLinearProgress-bar': { background: G } }} />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained" size="large" onClick={handleTranslate}
            disabled={loading || (!inputText && !selectedFile)}
            startIcon={<Translate />}
            sx={{
              borderRadius: '50px', textTransform: 'none', fontWeight: 700, px: 4, py: 1.3,
              background: G, boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
              '&:hover': { background: 'linear-gradient(135deg,#0284c7,#7c3aed)', boxShadow: '0 6px 28px rgba(14,165,233,0.5)', transform: 'translateY(-1px)' },
              '&.Mui-disabled': { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
            }}
          >
            {loading ? 'Translating…' : 'Translate'}
          </Button>
        </Box>
      </Box>

      <DocumentTranslationDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setUserClosedDrawer(true); }}
        translationData={drawerData}
        isLoading={loading}
        error={error}
        fileName={selectedFile?.name || 'Text Translation'}
      />
    </>
  );
};

export default TranslationCard;
