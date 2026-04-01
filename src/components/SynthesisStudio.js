import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Grid, TextField, Typography, IconButton, 
  Card, Chip, Stack, LinearProgress, Avatar, Tooltip, Zoom, Fade, Alert, Badge,
  FormControl, Select, MenuItem, Divider, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  VolumeUp, CloudDownload, DeleteSweep, GraphicEq, Verified, 
  FiberManualRecord, MusicNote, Description, CloudUpload, TaskAlt, 
  LibraryBooks, AutoStories
} from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';
import { ttsAPI, handleAPIError } from '../services/api';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GLASS = { 
  background: 'rgba(255, 255, 255, 0.03)', 
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.08)', 
  borderRadius: '28px' 
};

const LANGUAGES = [
  { code: 'all', name: 'All Experts' },
  { code: 'en', name: 'English / Pidgin' },
  { code: 'ach', name: 'Acholi' },
  { code: 'teo', name: 'Ateso' },
  { code: 'fat', name: 'Fante' },
  { code: 'hau', name: 'Hausa' },
  { code: 'ibo', name: 'Igbo' },
  { code: 'kik', name: 'Kikuyu' },
  { code: 'kin', name: 'Kinyarwanda' },
  { code: 'lug', name: 'Luganda' },
  { code: 'lgg', name: 'Lugbara' },
  { code: 'luo', name: 'Luo' },
  { code: 'pcm', name: 'Nigerian Pidgin' },
  { code: 'nyn', name: 'Runyankore' },
  { code: 'swa', name: 'Swahili' },
  { code: 'twi', name: 'Twi' },
  { code: 'wol', name: 'Wolof' },
  { code: 'yor', name: 'Yoruba' },
];

const LANGUAGE_MAP = {
  'en': ['pcm'], // Map English to Pidgin voices
};

const RAW_SPEAKERS = [
  { id: "kin_female_1", lang: "kin", gender: "female" },
  { id: "nyn_female_248", lang: "nyn", gender: "female" },
  { id: "lgg_female_245", lang: "lgg", gender: "female" },
  { id: "teo_female_241", lang: "teo", gender: "female" },
  { id: "ach_female_242", lang: "ach", gender: "female" },
  { id: "swa_male_246", lang: "swa", gender: "male" },
  { id: "swa_female_1", lang: "swa", gender: "female" },
  { id: "swa_male_3", lang: "swa", gender: "male" },
  { id: "fat_male_1", lang: "fat", gender: "male" },
  { id: "fat_female_2", lang: "fat", gender: "female" },
  { id: "fat_male_3", lang: "fat", gender: "male" },
  { id: "fat_female_4", lang: "fat", gender: "female" },
  { id: "hau_male_8", lang: "hau", gender: "male" },
  { id: "hau_male_6", lang: "hau", gender: "male" },
  { id: "hau_female_1", lang: "hau", gender: "female" },
  { id: "hau_female_3", lang: "hau", gender: "female" },
  { id: "hau_male_4", lang: "hau", gender: "male" },
  { id: "hau_male_2", lang: "hau", gender: "male" },
  { id: "hau_female_7", lang: "hau", gender: "female" },
  { id: "hau_female_5", lang: "hau", gender: "female" },
  { id: "ibo_female_1", lang: "ibo", gender: "female" },
  { id: "ibo_female_3", lang: "ibo", gender: "female" },
  { id: "ibo_male_6", lang: "ibo", gender: "male" },
  { id: "ibo_male_4", lang: "ibo", gender: "male" },
  { id: "ibo_male_8", lang: "ibo", gender: "male" },
  { id: "ibo_female_7", lang: "ibo", gender: "female" },
  { id: "ibo_female_5", lang: "ibo", gender: "female" },
  { id: "ibo_male_2", lang: "ibo", gender: "male" },
  { id: "kik_female_2", lang: "kik", gender: "female" },
  { id: "kik_male_4", lang: "kik", gender: "male" },
  { id: "kik_male_1", lang: "kik", gender: "male" },
  { id: "kik_female_3", lang: "kik", gender: "female" },
  { id: "lug_female_4", lang: "lug", gender: "female" },
  { id: "lug_male_3", lang: "lug", gender: "male" },
  { id: "lug_female_5", lang: "lug", gender: "female" },
  { id: "lug_male_2", lang: "lug", gender: "male" },
  { id: "lug_female_8", lang: "lug", gender: "female" },
  { id: "lug_male_1", lang: "lug", gender: "male" },
  { id: "lug_male_6", lang: "lug", gender: "male" },
  { id: "lug_female_7", lang: "lug", gender: "female" },
  { id: "luo_male_3", lang: "luo", gender: "male" },
  { id: "luo_male_4", lang: "luo", gender: "male" },
  { id: "luo_female_3", lang: "luo", gender: "female" },
  { id: "luo_female_4", lang: "luo", gender: "female" },
  { id: "luo_male_1", lang: "luo", gender: "male" },
  { id: "luo_female_1", lang: "luo", gender: "female" },
  { id: "luo_female_2", lang: "luo", gender: "female" },
  { id: "luo_male_2", lang: "luo", gender: "male" },
  { id: "nyn_male_7", lang: "nyn", gender: "male" },
  { id: "nyn_female_5", lang: "nyn", gender: "female" },
  { id: "nyn_male_6", lang: "nyn", gender: "male" },
  { id: "nyn_male_8", lang: "nyn", gender: "male" },
  { id: "nyn_female_4", lang: "nyn", gender: "female" },
  { id: "nyn_female_2", lang: "nyn", gender: "female" },
  { id: "nyn_female_1", lang: "nyn", gender: "female" },
  { id: "nyn_male_3", lang: "nyn", gender: "male" },
  { id: "twi_male_3", lang: "twi", gender: "male" },
  { id: "twi_female_2", lang: "twi", gender: "female" },
  { id: "twi_female_4", lang: "twi", gender: "female" },
  { id: "twi_male_1", lang: "twi", gender: "male" },
  { id: "ach_male_4", lang: "ach", gender: "male" },
  { id: "ach_female_6", lang: "ach", gender: "female" },
  { id: "ach_female_2", lang: "ach", gender: "female" },
  { id: "ach_male_1", lang: "ach", gender: "male" },
  { id: "ach_male_5", lang: "ach", gender: "male" },
  { id: "ach_male_3", lang: "ach", gender: "male" },
  { id: "ach_female_7", lang: "ach", gender: "female" },
  { id: "ach_female_8", lang: "ach", gender: "female" },
  { id: "swa_female_6", lang: "swa", gender: "female" },
  { id: "swa_male_8", lang: "swa", gender: "male" },
  { id: "swa_female_2", lang: "swa", gender: "female" },
  { id: "swa_female_5", lang: "swa", gender: "female" },
  { id: "swa_male_4", lang: "swa", gender: "male" },
  { id: "yor_female_1", lang: "yor", gender: "female" },
  { id: "yor_female_7", lang: "yor", gender: "female" },
  { id: "yor_male_2", lang: "yor", gender: "male" },
  { id: "yor_male_6", lang: "yor", gender: "male" },
  { id: "yor_male_4", lang: "yor", gender: "male" },
  { id: "yor_male_8", lang: "yor", gender: "male" },
  { id: "yor_female_3", lang: "yor", gender: "female" },
  { id: "yor_female_5", lang: "yor", gender: "female" },
  { id: "wol_male_1", lang: "wol", gender: "male" },
  { id: "wol_female_1", lang: "wol", gender: "female" },
  { id: "pcm_male_1", lang: "pcm", gender: "male" },
  { id: "pcm_female_2", lang: "pcm", gender: "female" },
  { id: "pcm_female_4", lang: "pcm", gender: "female" },
  { id: "pcm_female_5", lang: "pcm", gender: "female" },
  { id: "pcm_female_3", lang: "pcm", gender: "female" },
  { id: "pcm_female_1", lang: "pcm", gender: "female" },
  { id: "pcm_male_2", lang: "pcm", gender: "male" },
  { id: "pcm_female_6", lang: "pcm", gender: "female" },
  { id: "pcm_male_3", lang: "pcm", gender: "male" },
  { id: "pcm_male_5", lang: "pcm", gender: "male" }
];

const NATIVE_NAMES = {
  ach: { male: ['Okwera', 'Otim', 'Opio', 'Obol', 'Ocan', 'Okello', 'Oryem', 'Odong', 'Okot', 'Olara'], female: ['Akello', 'Apiyo', 'Adong', 'Lara', 'Aber', 'Akot', 'Anyango', 'Atim', 'Adengo', 'Amito'] },
  teo: { male: ['Omeda', 'Okurut', 'Odongo', 'Okello', 'Emuria', 'Ilungat', 'Etyang', 'Agaba'], female: ['Akiror', 'Aipo', 'Amuria', 'Teres', 'Asio', 'Apio', 'Akello', 'Aber'] },
  fat: { male: ['Kwame', 'Kofi', 'Kojo', 'Kweku', 'Kobina', 'Kwesi', 'Kwabena'], female: ['Ama', 'Akosua', 'Abena', 'Adjoa', 'Araba', 'Abba', 'Afua'] },
  hau: { male: ['Musa', 'Ibrahim', 'Abubakar', 'Umar', 'Sani', 'Usman', 'Ali', 'Hassan', 'Idris', 'Kabiru'], female: ['Aisha', 'Fatima', 'Amina', 'Zainab', 'Mariam', 'Halima', 'Hadiza', 'Nafisa', 'Rahma', 'Safiya'] },
  ibo: { male: ['Chinedu', 'Emeka', 'Obinna', 'Kelechi', 'Chukwuma', 'Ifeanyi', 'Nonso', 'Tochukwu'], female: ['Nneka', 'Chioma', 'Ifeoma', 'Amaka', 'Ada', 'Ego', 'Oluchi', 'Uzoma'] },
  kik: { male: ['Kamau', 'Maina', 'Mwangi', 'Njoroge', 'Kariuki', 'Kimani', 'Gachanja', 'Macharia'], female: ['Wanjiru', 'Nyambura', 'Muthoni', 'Wangari', 'Njeri', 'Wambui', 'Mumbi', 'Wanjiku'] },
  kin: { male: ['Kagabo', 'Bizimana', 'Uwimana', 'Jean', 'Gakuru', 'Munyaneza'], female: ['Mukamanzi', 'Uwase', 'Mutoni', 'Alice', 'Beata', 'Uwimana', 'Ingabire'] },
  lug: { male: ['Musa', 'Ssemulu', 'Kato', 'Zolo', 'Wasswa', 'Mukasa', 'Kizza', 'Serwadda', 'Musoke', 'Lule'], female: ['Namubiru', 'Nakato', 'Babirye', 'Nantongo', 'Nalumansi', 'Namaganda', 'Nakafeero', 'Namazzi'] },
  lgg: { male: ['Drani', 'Onzima', 'Bello', 'Drileba', 'Anguandia'], female: ['Akello', 'Adokorac', 'Ayikoru', 'Candiru', 'Asio'] },
  luo: { male: ['Otieno', 'Onyango', 'Ochieng', 'Odhiambo', 'Okoth', 'Omondi', 'Owino', 'Odongo'], female: ['Atieno', 'Anyango', 'Adhiambo', 'Achieng', 'Akoth', 'Amondi', 'Awino', 'Adongo'] },
  pcm: { male: ['Chief', 'Bobo', 'Presido', 'Uche', 'Oga', 'Bros', 'Paddy', 'Guy'], female: ['Sisi', 'Queen', 'Faith', 'Blessing', 'Joy', 'Mercy', 'Peace', 'Grace'] },
  nyn: { male: ['Mugisha', 'Tumusiime', 'Karyeiju', 'Niwagaba', 'Bainomugisha', 'Asiimwe'], female: ['Mbabazi', 'Kansime', 'Rose', 'Kyomugisha', 'Atuhaire', 'Amanya', 'Nimusiima'] },
  swa: { male: ['Bakari', 'Juma', 'Hassan', 'Saidi', 'Ali', 'Yusuf', 'Hamisi', 'Ramadhani'], female: ['Fatuma', 'Amina', 'Neema', 'Rehema', 'Zawadi', 'Asha', 'Mariam', 'Halima'] },
  twi: { male: ['Kwesi', 'Yaw', 'Kofi', 'Mensah', 'Boateng', 'Opoku', 'Osei'], female: ['Esi', 'Adwoa', 'Abena', 'Afia', 'Ama', 'Akosua', 'Yaa'] },
  wol: { male: ['Moussa', 'Modou', 'Cheikh', 'Abdou', 'Ousmane', 'Babacar'], female: ['Fatou', 'Mariama', 'Awa', 'Khady', 'Astou', 'Ndeye'] },
  yor: { male: ['Olu', 'Ade', 'Babatunde', 'Segun', 'Femi', 'Kunle', 'Tunde', 'Ayo'], female: ['Bisi', 'Adeoro', 'Funke', 'Yinka', 'Folake', 'Ronke', 'Toyin', 'Nike'] },
};

const COLORS = ['#f472b6', '#60a5fa', '#fbbf24', '#34d399', '#818cf8', '#fb7185', '#a78bfa', '#fb923c', '#2dd4bf', '#94a3b8', '#facc15'];

const speakerCounters = {};

const SPEAKERS = RAW_SPEAKERS.map((s, idx) => {
  const key = `${s.lang}_${s.gender}`;
  speakerCounters[key] = (speakerCounters[key] || 0) + 1;
  const currentIdx = speakerCounters[key] - 1;

  const langNames = NATIVE_NAMES[s.lang] || { male: ['Expert'], female: ['Expert'] };
  const nameList = s.gender === 'male' ? langNames.male : langNames.female;
  
  let name = nameList[currentIdx % nameList.length];
  if (currentIdx >= nameList.length) {
    const cycle = Math.floor(currentIdx / nameList.length) + 1;
    name = `${name} ${'I'.repeat(cycle)}`;
  }
  
  const langLabel = LANGUAGES.find(l => l.code === s.lang)?.name || s.lang.toUpperCase();
  
  return {
    ...s,
    name: name,
    persona: `Expert ${langLabel} Voice`,
    color: COLORS[idx % COLORS.length]
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const SynthesisStudio = () => {
  const [inputText, setInputText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpeaker, setSelectedSpeaker] = useState(SPEAKERS[0]);
  const [outputLang, setOutputLang] = useState(SPEAKERS[0].lang);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultAudio, setResultAudio] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // 0: Text, 1: Document
  
  // Document State
  const [docFile, setDocFile] = useState(null);
  const [docResults, setDocResults] = useState(null);
  const [docProgress, setDocProgress] = useState(0);
  const [isDocGenerating, setIsDocGenerating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const filteredSpeakers = activeFilter === 'all' 
    ? SPEAKERS 
    : SPEAKERS.filter(s => {
        const mapped = LANGUAGE_MAP[activeFilter];
        return mapped ? mapped.includes(s.lang) : s.lang === activeFilter;
    });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (isGenerating) {
        const timer = setInterval(() => {
            setProgress(p => (p >= 95 ? 95 : p + 2));
        }, 150);
        return () => clearInterval(timer);
    } else {
        setProgress(0);
    }
  }, [isGenerating]);

  // Sync language when speaker changes
  const handleSpeakerSelect = (speaker) => {
    setSelectedSpeaker(speaker);
    setOutputLang(speaker.lang);
  };

  const handleSynthesize = async () => {
    if (!inputText.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setResultAudio(null);

    try {
      const response = await ttsAPI.synthesizeText(
        inputText.trim(), 
        selectedSpeaker.id, 
        outputLang,
        user.uid || user.userId
      );
      
      if (response.audio_file_url) {
        setResultAudio(response.audio_file_url);
      } else if (response.doc_id) {
        const voiceData = await ttsAPI.getVocifyVoice(response.doc_id);
        const path = voiceData.entries?.[0]?.translations_with_tts?.[outputLang]?.audio_file_path 
                    || voiceData.entries?.[0]?.audio_file_path 
                    || voiceData.audio_url;
        if (path) setResultAudio(path);
        else throw new Error("Audio generation finalized but file path not found.");
      }
    } catch (err) {
      console.error("Synthesis Error:", err);
      const info = handleAPIError(err, 'synthesize');
      setError(info.message || "Expert Synthesis failed. Please verify your connection.");
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResultAudio(null);
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFile(file);
      setError(null);
    }
  };

  const handleDocumentSynthesize = async () => {
    if (!docFile || isDocGenerating) return;
    setIsDocGenerating(true);
    setError(null);
    setDocResults(null);
    setDocProgress(10);

    try {
      const response = await ttsAPI.translateDocumentWithTTS(
        docFile,
        outputLang, // Assumed source language
        [outputLang], // Just target the same language for now or multi-select if needed
        selectedSpeaker.id,
        user.uid || user.userId
      );
      
      if (response.translations) {
        setDocResults(response.translations);
      } else {
        throw new Error("Document synthesis returned no results.");
      }
    } catch (err) {
      console.error("Doc Synthesis Error:", err);
      setError("Document synthesis failed. Ensure the file is not corrupted and try again.");
    } finally {
      setIsDocGenerating(false);
      setDocProgress(100);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      {/* Header Area */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
            <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{ fontWeight: 900, letterSpacing: '-1px', mb: 0.2, color: '#fff' }}>
                Synthesis <span style={{ color: '#0ea5e9' }}>Studio</span>
            </Typography>
            <Typography variant="caption" component="div" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Verified sx={{ fontSize: 14, color: '#10b981' }} /> Neural Vocalization Hub
            </Typography>
        </Box>
        <Chip 
            icon={<FiberManualRecord sx={{ fontSize: 12, color: isGenerating ? '#f43f5e' : '#10b981' }} />}
            label={isGenerating ? "RENDERING..." : "ONLINE"} 
            size="small"
            sx={{ 
                px: 1, fontWeight: 900, fontSize: '0.65rem', 
                bgcolor: 'rgba(255,255,255,0.02)', color: '#fff', 
                border: '1px solid rgba(255,255,255,0.08)',
                alignSelf: { xs: 'flex-start', sm: 'auto' }
            }} 
        />
      </Stack>

      {/* Mode Navigation Tabs */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{
            '& .MuiTabs-indicator': { background: G, height: 3, borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': { 
                color: 'rgba(255,255,255,0.3)', fontWeight: 900, fontSize: isMobile ? '0.65rem' : '0.75rem', 
                textTransform: 'uppercase', letterSpacing: '1px', px: { xs: 2, sm: 4 }, py: 2,
                minHeight: 48,
                '&.Mui-selected': { color: '#fff' }
            }
          }}
        >
          <Tab icon={<GraphicEq sx={{ fontSize: 18 }} />} label="Voice Studio" iconPosition="start" />
          <Tab icon={<LibraryBooks sx={{ fontSize: 18 }} />} label="Document Hub" iconPosition="start" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {/* Workspace Column (Left) */}
        <Grid item xs={12} lg={8.5} xl={9}>
            <Stack spacing={2}>
                {/* Text Workspace */}
                <Box sx={{ ...GLASS, p: 2, minHeight: { xs: '40vh', lg: '55vh' }, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {activeTab === 0 ? <GraphicEq sx={{ color: '#8b5cf6', fontSize: 18 }} /> : <AutoStories sx={{ color: '#0ea5e9', fontSize: 18 }} />}
                            <Typography variant="button" sx={{ color: '#fff', fontWeight: 900, letterSpacing: '1px', fontSize: '0.6rem' }}>
                                {activeTab === 0 ? "Master Script Editor" : "Advanced Document Processor"}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, fontSize: '0.55rem', textTransform: 'uppercase' }}>Expert Settings:</Typography>
                            <FormControl size="small" variant="standard">
                                <Select
                                    value={outputLang}
                                    onChange={(e) => setOutputLang(e.target.value)}
                                    sx={{ 
                                        color: '#0ea5e9', fontSize: '0.7rem', fontWeight: 900, 
                                        '&:before, &:after': { display: 'none' },
                                        '& .MuiSelect-select': { py: 0.5, px: 1, bgcolor: 'rgba(14, 165, 233, 0.05)', borderRadius: '4px' }
                                    }}
                                >
                                    {LANGUAGES.filter(l => l.code !== 'all').map(lang => (
                                        <MenuItem key={lang.code} value={lang.code} sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                            {lang.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.05)' }} />
                            <Tooltip title={activeTab === 0 ? "Clear Content" : "Reset Document"} TransitionComponent={Zoom}>
                                <IconButton size="small" onClick={activeTab === 0 ? handleClear : () => setDocFile(null)} sx={{ color: 'rgba(255,255,255,0.1)', '&:hover': { color: '#f43f5e' } }}>
                                    <DeleteSweep fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    
                    {activeTab === 0 ? (
                        <TextField
                            multiline fullWidth variant="standard"
                            placeholder="Draft your professional script here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isGenerating}
                            InputProps={{ 
                                disableUnderline: true,
                                sx: { color: '#f8fafc', fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, px: 0.5 } 
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                    ) : (
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 4 }}>
                           {!docFile ? (
                               <Stack spacing={3} alignItems="center">
                                   <Box sx={{ 
                                       width: 80, height: 80, borderRadius: '24px', background: 'rgba(14, 165, 233, 0.05)', 
                                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                                       border: '2px dashed rgba(14, 165, 233, 0.2)'
                                   }}>
                                       <CloudUpload sx={{ fontSize: 40, color: '#0ea5e9' }} />
                                   </Box>
                                   <Box>
                                       <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>Neural Document Upload</Typography>
                                       <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 300, display: 'block' }}>
                                           Upload PDF, Word or Text documents for professional expert narration.
                                       </Typography>
                                   </Box>
                                   <input
                                       accept=".pdf,.docx,.doc,.txt"
                                       style={{ display: 'none' }}
                                       id="doc-upload-input"
                                       type="file"
                                       onChange={handleFileChange}
                                   />
                                   <label htmlFor="doc-upload-input">
                                       <Button component="span" variant="outlined" sx={{ 
                                           borderColor: 'rgba(14, 165, 233, 0.3)', color: '#0ea5e9', fontWeight: 900, px: 4, borderRadius: '12px',
                                           '&:hover': { borderColor: '#0ea5e9', background: 'rgba(14, 165, 233, 0.02)' }
                                       }}>
                                           Select Workstation File
                                       </Button>
                                   </label>
                               </Stack>
                           ) : (
                               <Stack spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
                                   <Description sx={{ fontSize: 60, color: '#10b981' }} />
                                   <Typography sx={{ fontWeight: 900, color: '#fff' }}>{docFile.name}</Typography>
                                   <Chip 
                                       label={`${(docFile.size / 1024 / 1024).toFixed(2)} MB`} 
                                       size="small" 
                                       sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 900 }} 
                                   />
                                   <Button 
                                       variant="text" size="small" color="error" 
                                       onClick={() => setDocFile(null)}
                                       sx={{ fontWeight: 900, mt: 2 }}
                                   >
                                       Remove File
                                   </Button>
                               </Stack>
                           )}
                        </Box>
                    )}

                    {(isGenerating || isDocGenerating) && (
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1.5, bgcolor: 'rgba(10,10,25,0.98)', borderTop: `1px solid ${isDocGenerating ? '#0ea5e9' : '#8b5cf6'}`, borderRadius: '0 0 28px 28px' }}>
                            <Stack spacing={0.5}>
                                <Typography variant="caption" sx={{ color: isDocGenerating ? '#0ea5e9' : '#8b5cf6', fontWeight: 900, letterSpacing: '1px', fontSize: '0.55rem' }}>
                                    {isDocGenerating ? "PROCESSING NEURAL DOCUMENT" : "SYNCHRONIZING NEURAL LAYERS"}
                                </Typography>
                                <LinearProgress variant="determinate" value={isDocGenerating ? docProgress : progress} sx={{ height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: isDocGenerating ? 'linear-gradient(90deg, #0ea5e9, #2dd4bf)' : G } }} />
                            </Stack>
                        </Box>
                    )}
                </Box>

                {/* Synthesis Control Hub */}
                <Stack spacing={2}>
                    <Box sx={{ ...GLASS, p: 2, border: `1px solid ${isGenerating ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}` }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: selectedSpeaker.color, width: 44, height: 44, fontSize: '1rem', fontWeight: 900 }}>
                                        {selectedSpeaker.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>{selectedSpeaker.name}</Typography>
                                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {LANGUAGES.find(l => l.code === selectedSpeaker.lang)?.name} neural Expert
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                                <Button 
                                    variant="contained" size="small" fullWidth={false}
                                    onClick={activeTab === 0 ? handleSynthesize : handleDocumentSynthesize}
                                    disabled={(activeTab === 0 ? !inputText.trim() : !docFile) || (isGenerating || isDocGenerating)}
                                    startIcon={(isGenerating || isDocGenerating) ? <MusicNote className="animate-pulse" /> : <VolumeUp />}
                                    sx={{ 
                                        borderRadius: '10px', background: activeTab === 0 ? G : 'linear-gradient(135deg, #0ea5e9, #2dd4bf)', fontWeight: 900, px: 4, py: 1,
                                        fontSize: '0.75rem', textTransform: 'none', 
                                        boxShadow: activeTab === 0 ? '0 4px 15px rgba(139, 92, 246, 0.2)' : '0 4px 15px rgba(14, 165, 233, 0.2)',
                                        '&:hover': { transform: 'translateY(-1px)' }
                                    }}
                                >
                                    {(isGenerating || isDocGenerating) ? "Neural Processing..." : (activeTab === 0 ? "Vocalize Script" : "Process Document")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Result Player / Document List */}
                    <Fade in={!!resultAudio || !!error || !!docResults}>
                        <Box sx={{ ...GLASS, p: 2, border: `1px solid ${error ? '#f43f5e' : (resultAudio || docResults ? '#10b981' : 'rgba(255,255,255,0.08)')}` }}>
                            {error ? (
                                <Alert severity="error" variant="filled" sx={{ bgcolor: 'transparent', color: '#f43f5e', fontSize: '0.75rem', p: 0.5 }}>{error}</Alert>
                            ) : activeTab === 0 && resultAudio ? (
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.6rem' }}>
                                            Neural Mastered Result
                                        </Typography>
                                        <Button 
                                            variant="text" size="small"
                                            startIcon={<CloudDownload sx={{ fontSize: 16 }} />} 
                                            href={resultAudio} 
                                            download 
                                            sx={{ color: '#0ea5e9', fontWeight: 900, fontSize: '0.7rem' }}
                                        >
                                            Export
                                        </Button>
                                    </Stack>
                                    <AudioPlayer 
                                        autoPlay 
                                        src={resultAudio} 
                                        style={{ 
                                            background: '#0a0a0f', 
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '10px',
                                            padding: '8px'
                                        }} 
                                        customAdditionalControls={[]}
                                        customVolumeControls={[]}
                                    />
                                </Stack>
                            ) : activeTab === 1 && docResults ? (
                                <Stack spacing={2}>
                                     <Stack direction="row" spacing={1} alignItems="center">
                                        <TaskAlt sx={{ color: '#10b981', fontSize: 18 }} />
                                        <Typography variant="button" sx={{ color: '#fff', fontWeight: 900, fontSize: '0.65rem' }}>Document Narration Ready</Typography>
                                     </Stack>
                                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {Object.entries(docResults).map(([lang, data]) => (
                                            <Box key={lang} sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#0ea5e9' }}>
                                                        {LANGUAGES.find(l => l.code === lang)?.name} Version
                                                    </Typography>
                                                    <IconButton size="small" href={data.audio_file_path} download sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                                        <CloudDownload sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Stack>
                                                <AudioPlayer 
                                                    src={data.audio_file_path} 
                                                    style={{ 
                                                        background: 'transparent', 
                                                        boxShadow: 'none',
                                                        padding: 0
                                                    }} 
                                                    customAdditionalControls={[]}
                                                    customVolumeControls={[]}
                                                />
                                            </Box>
                                        ))}
                                     </Box>
                                </Stack>
                            ) : null}
                        </Box>
                    </Fade>
                </Stack>
            </Stack>
        </Grid>

        {/* Expert Speaker Gallery Column (Right) */}
        <Grid item xs={12} lg={3.5} xl={3}>
            <Box sx={{ 
                ...GLASS, p: { xs: 1.5, md: 2 }, 
                height: { xs: 'auto', lg: '86vh' }, 
                display: 'flex', flexDirection: 'column' 
            }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="button" sx={{ mb: 1.5, display: 'block', color: 'rgba(255,255,255,0.3)', fontWeight: 900, textAlign: 'center', letterSpacing: '2px', fontSize: '0.6rem' }}>
                        Neural Experts
                    </Typography>
                    
                    {/* Language Filter Bar */}
                    <Box sx={{ 
                        display: 'flex', gap: 0.8, overflowX: 'auto', pb: 1, 
                        px: 0.5,
                        '&::-webkit-scrollbar': { height: '3px' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(139, 92, 246, 0.2)', borderRadius: '10px' }
                    }}>
                        {LANGUAGES.map(lang => (
                            <Chip
                                key={lang.code}
                                label={lang.name}
                                size="small"
                                onClick={() => setActiveFilter(lang.code)}
                                sx={{
                                    bgcolor: activeFilter === lang.code ? '#8b5cf6' : 'rgba(255,255,255,0.02)',
                                    color: activeFilter === lang.code ? '#fff' : 'rgba(255,255,255,0.4)',
                                    fontWeight: 700, fontSize: '0.62rem',
                                    height: '26px',
                                    flexShrink: 0,
                                    border: `1px solid ${activeFilter === lang.code ? '#8b5cf6' : 'rgba(255,255,255,0.04)'}`,
                                    '&:hover': { bgcolor: activeFilter === lang.code ? '#7c3aed' : 'rgba(255,255,255,0.06)' }
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                <Stack spacing={1} sx={{ 
                    overflowY: 'auto', 
                    maxHeight: { xs: '350px', lg: '100%' }, 
                    pr: 0.5, 
                    '&::-webkit-scrollbar': { width: '4px' }, 
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(139, 92, 246, 0.2)', borderRadius: '10px' } 
                }}>
                    {filteredSpeakers.map((s) => (
                        <Card 
                            key={s.id}
                            onClick={() => handleSpeakerSelect(s)}
                            sx={{ 
                                bgcolor: selectedSpeaker.id === s.id ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.015)',
                                border: `1px solid ${selectedSpeaker.id === s.id ? '#8b5cf6' : 'transparent'}`,
                                borderRadius: '12px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer', minHeight: '60px', display: 'flex', alignItems: 'center',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', transform: 'translateY(-1px)' }
                            }}
                        >
                            <Box sx={{ p: 1.2, width: '100%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    invisible={!isGenerating && selectedSpeaker.id !== s.id}
                                    sx={{ '& .MuiBadge-badge': { bgcolor: '#10b981', width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #0a0a0f' } }}
                                >
                                    <Avatar sx={{ bgcolor: s.color, fontWeight: 900, fontSize: '0.75rem', width: 32, height: 32 }}>{s.name[0]}</Avatar>
                                </Badge>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff', mb: 0.1, lineHeight: 1.1 }}>
                                        {s.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                                            {LANGUAGES.find(l => l.code === s.lang)?.code.toUpperCase()}
                                        </Typography>
                                        <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                                        <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
                                            {s.gender}
                                        </Typography>
                                    </Box>
                                </Box>
                                {selectedSpeaker.id === s.id && <Verified sx={{ fontSize: 14, color: '#0ea5e9' }} />}
                            </Box>
                        </Card>
                    ))}
                    {filteredSpeakers.length === 0 && (
                        <Typography variant="caption" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', mt: 5, fontStyle: 'italic' }}>
                            No experts found in this region.
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Grid>
      </Grid>

      <style>{`
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-pulse { animation: pulse 2s infinite ease-in-out; }
      `}</style>
    </Box>
  );
};

export default SynthesisStudio;
