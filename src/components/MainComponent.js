import React, { useState,useRef,useEffect} from 'react';
import { 
  Box, Typography, Button, TextField, Select, MenuItem, FormControl,  Paper, Chip, Grid, Container, IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar
} from '@mui/material';
import { 
  Mic, VolumeUp, Translate, KeyboardVoice,Summarize,
  SwapHoriz, Stop, CloudUpload,Star,Language, ArrowDropDown,AccountCircle, Login
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import VoiceRecognitionResult from './VoiceRecognitionResult';
import VoicifyResult from './VoicifyResult';
import SummaryResult from './SummaryResult';
import PremiumFeaturesModal from './PremiumFeaturesModal';
import TranslationPremiumModal from './TranslationPremiumModal';
import EnhancedHeroSection from './EnhancedHeroSection';
import ServiceSections from './ServiceSections'; 
// Styled Feature Chip Component

const TEMP_USER_LIMIT = 100;

const FeatureChip = ({ feature, isActive, onClick }) => (
  <Chip
    label={feature.label}
    icon={feature.icon}
    onClick={onClick}
    sx={{
      height: '48px',
      borderRadius: '24px',
      fontWeight: 600,
      fontSize: '14px',
      px: 2,
      py: 3,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      backgroundColor: isActive ? 'primary.main' : 'background.paper',
      color: isActive ? 'white' : 'text.primary',
      boxShadow: isActive ? '0 4px 20px rgba(25, 118, 210, 0.25)' : 'none',
      '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: isActive ? 'primary.main' : 'background.paper',
      },
      '& .MuiChip-icon': {
        color: isActive ? 'white' : 'primary.main',
        marginRight: '8px',
      }
    }}
  />
);



// Language Selector with Animation
const LanguageSelector = ({
  sourceLanguage,
  targetLanguages,
  onSourceChange,
  onTargetChange,
  languageOptions,
}) => {
  // Helper function to get language label
  const getLanguageLabel = (value) => {
    const lang = languageOptions.find(lang => lang.value === value);
    return lang ? lang.label : '';
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        mb: 6,
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
          border: '1px solid rgba(25, 118, 210, 0.08)',
          padding: '24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Source Language Selection */}
          <Grid item xs={12} md={5}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 600 
              }}
            >
              Translate from
            </Typography>
            <FormControl fullWidth>
              <Select
                value={sourceLanguage}
                onChange={(e) => onSourceChange(e.target.value)}
                IconComponent={ArrowDropDown}
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language sx={{ color: 'primary.main', fontSize: 20 }} />
                    {getLanguageLabel(value)}
                  </Box>
                )}
                sx={{
                  height: '56px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(25, 118, 210, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem 
                    key={lang.value} 
                    value={lang.value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <Language sx={{ color: 'primary.main', fontSize: 20 }} />
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Swap Button */}
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              sx={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                  transform: 'scale(1.05)',
                }
              }}
              onClick={() => {
                const temp = sourceLanguage;
                onSourceChange(targetLanguages[0] || '');
                onTargetChange([temp]);
              }}
            >
              <SwapHoriz />
            </IconButton>
          </Grid>

          {/* Target Language Selection */}
          <Grid item xs={12} md={5}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 600 
              }}
            >
              Translate to
            </Typography>
            <FormControl fullWidth>
              <Select
                multiple
                value={Array.isArray(targetLanguages) ? targetLanguages : []}
                onChange={(e) => {
                  const value = e.target.value;
                  onTargetChange(Array.isArray(value) ? value : [value]);
                }}
                IconComponent={ArrowDropDown}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Box
                        key={value}
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: '6px',
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.875rem'
                        }}
                      >
                        <Language sx={{ color: 'primary.main', fontSize: 16 }} />
                        {getLanguageLabel(value)}
                      </Box>
                    ))}
                  </Box>
                )}
                sx={{
                  minHeight: '56px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(25, 118, 210, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem 
                    key={lang.value} 
                    value={lang.value}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    <Language sx={{ color: 'primary.main', fontSize: 20 }} />
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};


 const BASE_URL="https://agents.tericlab.com:8080"
const MainComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [inputText, setInputText] = useState('');
  const [ttsResult,setTTSResult]=useState('')
  const [translationResult, setTranslationResult] = useState(''); 
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguages, setTargetLanguages] = useState(); 
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const [progress, setProgress] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [voiceRecognitionResults, setVoiceRecognitionResults] = useState({});
  const [voifyResults, setvoifyResults] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summaryResult, setSummaryResult] = useState('');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isTranslationPremiumModalOpen, setIsTranslationPremiumModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [remainingActions, setRemainingActions] = useState(TEMP_USER_LIMIT);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'lg', label: 'Luganda' },
    { value: 'sw', label: 'Kiswahili' },
    { value: 'ac', label: 'Acholi' },
    { value: 'at', label: 'Ateso' },
    { value: 'nyn', label: 'Runyankore' },
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem('temp_user_id');
    const storedUsageCount = localStorage.getItem('temp_usage_count');
    const storedLoggedInUser = localStorage.getItem('logged_in_user');

    if (storedLoggedInUser) {
      const parsedUser = JSON.parse(storedLoggedInUser);
      setIsLoggedIn(true);
      setUserId(parsedUser.userId);
    } else if (storedUserId && storedUsageCount) {
      setUserId(storedUserId);
      setUsageCount(parseInt(storedUsageCount, 10));
    } else {
      const newUserId = uuidv4();
      localStorage.setItem('temp_user_id', newUserId);
      localStorage.setItem('temp_usage_count', '0');
      setUserId(newUserId);
    }
  }, []);

 
  useEffect(() => {
    const initializeUser = () => {
      const storedUserId = localStorage.getItem('temp_user_id');
      const storedUsageCount = parseInt(localStorage.getItem('temp_usage_count') || '0', 10);
      const storedLoggedInUser = localStorage.getItem('logged_in_user');

      if (storedLoggedInUser) {
        const parsedUser = JSON.parse(storedLoggedInUser);
        setIsLoggedIn(true);
        setUserId(parsedUser.userId);
        setUsageCount(0); // Reset for logged-in users
        setRemainingActions(Infinity);
      } else if (storedUserId) {
        setUserId(storedUserId);
        setUsageCount(storedUsageCount);
        setRemainingActions(TEMP_USER_LIMIT - storedUsageCount);
        if (storedUsageCount >= TEMP_USER_LIMIT) {
          setIsLimitReached(true);
        }
      } else {
        const newUserId = uuidv4();
        localStorage.setItem('temp_user_id', newUserId);
        localStorage.setItem('temp_usage_count', '0');
        setUserId(newUserId);
        setRemainingActions(TEMP_USER_LIMIT);
      }
    };

    initializeUser();
  }, []);
  const trackAction = (actionCallback) => {
    if (isLoggedIn) {
      actionCallback();
      return;
    }

    if (usageCount >= TEMP_USER_LIMIT) {
      setShowLoginPrompt(true);
      setSnackbarMessage('Free trial limit reached. Please sign in to continue.');
      setShowSnackbar(true);
      return;
    }

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    setRemainingActions(TEMP_USER_LIMIT - newCount);
    localStorage.setItem('temp_usage_count', newCount.toString());
    
    if (newCount === TEMP_USER_LIMIT) {
      setIsLimitReached(true);
      setSnackbarMessage('This is your last free action. Please sign in to continue using all features.');
      setShowSnackbar(true);
    } else if (newCount === TEMP_USER_LIMIT - 2) {
      setSnackbarMessage(`Only ${TEMP_USER_LIMIT - newCount} actions remaining in your free trial.`);
      setShowSnackbar(true);
    }

    actionCallback();
  };

  const handleFormSubmit = async (endpoint, formData, callback) => {
    trackAction(async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (callback) callback(response.data);
      } catch (error) {
        console.error('Error:', error);
        setSnackbarMessage('An error occurred. Please try again.');
        setShowSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    });
  };
  const handleTextSummarySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('source_lang', sourceLanguage);
    formData.append('doc', summaryText);
    formData.append('title', 'Text Summary');
    handleFormSubmit('/surmarize', formData, (response) => {
      setSummaryResult(response);
      setIsSummaryOpen(true)
    });
  };

  // Handle document upload for summary
  const handleDocumentSummarySubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      console.error('No file uploaded.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('source_lang', sourceLanguage);
    formData.append('file', uploadedFile);
    formData.append('title', 'Document Summary');

    handleFormSubmit('/summarize_document/', formData, (response) => {
      setSummaryResult(response);
      setIsSummaryOpen(true)
    });
  };
  const handleAudioSubmit = () => {
    if (!audioFile && !audioBlob) {
      console.error('No audio data available.');
      return;
    }
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('source_lang', sourceLanguage);
    targetLanguages.forEach((lang) => formData.append('target_langs', lang));
    formData.append('title', activeTab === 2 ? 'Voice Recognition' : 'Voice to Voice');

    if (audioFile) {
      const endpoint = activeTab === 2 ? '/upload' : '/voicox';
      formData.append('audio_file', audioFile);
      handleFormSubmit(endpoint, formData,(response) => {
        if (activeTab === 2) {
          const processedResponse = {
            translations: response.translations || {},
            audio_link: response.audio_link || []
          };
          setVoiceRecognitionResults(processedResponse);
          setIsDrawerOpen(true);
        } else if (activeTab === 3) {
          setvoifyResults(response)
          setIsOpen(true)
        }
      });
    } else if (audioBlob) {
      const mp3File = new File([audioBlob], 'recorded_audio.mp3', { type: 'audio/mp3' });
      formData.append('recorded_audio', mp3File);
      const endpoint = activeTab === 2 ? '/upload_recorded_audio/' : '/recorded_audio_vv';
      handleFormSubmit(endpoint, formData,(response) => {
        if (activeTab === 2) {
          setVoiceRecognitionResults(response);
          setIsDrawerOpen(true);
        } else if (activeTab === 3) {
          setvoifyResults(response)
          setIsOpen(true)
        }
      });
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioBlob(null); 
    }
  };

  const handleDocumentUpload =(e) =>{
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
       
    }
  }
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const chunks = [];

        recorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data);
        });

        recorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            setAudioBlob(arrayBuffer);
          };
          setAudioURL(URL.createObjectURL(blob));
          console.log(`Recording stopped. Blob size: ${blob.size} bytes`);
        });

        recorder.start();
        mediaRecorder.current = recorder;
        setIsRecording(true); 
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }
  };
  const handleTranslateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log('Source Language:', sourceLanguage);
    console.log('Target Languages:', targetLanguages);
    formData.append('user_id', userId);
    formData.append('source_lang', sourceLanguage);
    formData.append('target_langs', targetLanguages);
    formData.append('doc', inputText);
    formData.append('title', 'Text Translation');
    handleFormSubmit('/translate', formData, (response) => {
      const firstValue = Object.values(response)[0];
      setTranslationResult(firstValue);
    });
  };

  const handleTextToVoiceSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('source_lang', sourceLanguage);
    targetLanguages.forEach((lang) => formData.append('target_langs', lang));
    formData.append('doc', inputText);
    formData.append('title', 'Text to Voice');
    handleFormSubmit('/vocify', formData, (response) => {
      if (response.translations) {
        const firstLangKey = Object.keys(response.translations)[0];
        if (firstLangKey && response.translations[firstLangKey]) {
          const audioFilePath = response.translations[firstLangKey].audio_file_path;
          setTTSResult(audioFilePath);
        }
      }
    });
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress + 1;
          return prevProgress >= 95 ? 95 : nextProgress;
        });
      }, 300);

      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    }
  }, [isLoading]);

  const LoginPromptDialog = () => (
    <Dialog open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
      <DialogTitle>Continue with Full Access</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Youve reached the limit of {TEMP_USER_LIMIT} free actions. Sign in to enjoy:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>• Unlimited translations</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>• Advanced voice features</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>• Document summarization</Typography>
          <Typography variant="body1">• Premium support</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={() => setShowLoginPrompt(false)}
          variant="outlined"
          sx={{ borderRadius: '20px' }}
        >
          Maybe Later
        </Button>
        <Button
          variant="contained"
          startIcon={<Login />}
          sx={{
            borderRadius: '20px',
            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
          }}
          onClick={() => {
            // Implement your login logic here
            setShowLoginPrompt(false);
          }}
        >
          Sign In Now
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Usage indicator component
  const UsageIndicator = () => {
    if (isLoggedIn) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        justifyContent: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          Free Trial: {remainingActions} actions remaining
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AccountCircle />}
          sx={{ borderRadius: '20px' }}
          onClick={() => setShowLoginPrompt(true)}
        >
          Sign in for unlimited access
        </Button>
      </Box>
    );
  };
  const renderProgressBar = () => (
    isLoading && (
      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ 
          width: '100%', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          mb:2,
        }}>
          {/* Progress bar */}
          <Box sx={{ 
            width: '100%', 
            height: '8px',
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <Box
              sx={{
                width: `${progress}%`,
                height: '100%',
                bgcolor: 'primary.main',
                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                transition: 'width 0.3s ease-in-out',
                borderRadius: '4px',
              }}
            />
          </Box>
          
          {/* Progress text */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            {progress}%
          </Typography>
          
          {/* Loading message */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}
          >
            Hold on tight, were almost done! Your file is being processed and will be ready in 30-40 seconds. 
            Please keep this page open for the best experience. If you need any help, we are here!
          </Typography>
          <Box>
          <Button
                variant="outlined"
                startIcon={<Star />}
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 2,
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  }
                }}
              >
                Contact Support
              </Button>
          </Box>
        </Box>
      </Box>
    )
  );
  const features = [
    { icon: <Translate />, label: 'Text Translation' },
    { icon: <VolumeUp />, label: 'Text to Voice' },
    { icon: <Mic />, label: 'Voice Recognition' },
    { icon: <KeyboardVoice />, label: 'Voice to Voice' },
    { icon: <Summarize />, label: 'Text Summarization' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ minHeight: '100vh', py: 8 }}>
        {/* Hero Section */}
        <EnhancedHeroSection/>

        {/* Main Interface */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: '24px',
            maxWidth: '1200px',
            margin: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
          }}
        >
        <UsageIndicator />
          {/* Features Navigation */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 6,
            }}
          >
            {features.map((feature, index) => (
              <FeatureChip
                key={index}
                feature={feature}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 6 }} />

          {/* Language Selection */}
          <LanguageSelector
          sourceLanguage={sourceLanguage}
          targetLanguages={targetLanguages}
          onSourceChange={setSourceLanguage}
          onTargetChange={setTargetLanguages}
          languageOptions={languageOptions}
        />

          {/* Feature-specific Content */}
          <Box sx={{ mt: 4 }}>
            {activeTab === 0 && (
              <form onSubmit={handleTranslateSubmit}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter text to translate..."
                      variant="filled"
                      sx={{
                        '& .MuiFilledInput-root': {
                          borderRadius: '16px',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      value={translationResult}
                      placeholder="Translation will appear here..."
                      variant="filled"
                      disabled
                      sx={{
                        '& .MuiFilledInput-root': {
                          borderRadius: '16px',
                          backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap:2 }}>
                <Button
                      variant="outlined"
                      onClick={() => setIsTranslationPremiumModalOpen(true)}
                      startIcon={<Star />}
                      sx={{
                        borderRadius: '28px',
                        px: 4,
                        py: 2,
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                    >
                      Try Premium Features
                    </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: '28px',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <TranslationPremiumModal
                      isOpen={isTranslationPremiumModalOpen}
                      onClose={() => setIsTranslationPremiumModalOpen(false)}
                    />
                </Box>
              </form>
            )}

            {activeTab === 1 && (
              <form onSubmit={handleTextToVoiceSubmit}>
                <Box sx={{ textAlign: 'center' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text for speech synthesis..."
                    variant="filled"
                    sx={{ mb: 4 }}
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    gap: 2 
                  }}>
                  {ttsResult && <AudioPlayer src={ttsResult} autoPlay onPlay={e => console.log("onPlay")}  customVolumeControls={[]} customAdditionalControls={[]} showJumpControls={false}/>}
                  <Button
                      variant="outlined"
                      onClick={() => setIsPremiumModalOpen(true)}
                      sx={{
                        borderRadius: '28px',
                        px: 4,
                        py: 2,
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                      startIcon={<Star />}
                    >
                      Unlock Premium Features
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        borderRadius: '28px',
                        px: 4,
                        py: 2,
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                        }
                      }}
                    >
                      Generate Audio
                    </Button>
                  </Box>
                  <PremiumFeaturesModal
                  isOpen={isPremiumModalOpen}
                  onClose={() => setIsPremiumModalOpen(false)}
                />
                </Box>
              </form>
            )}

            {(activeTab === 2 || activeTab === 3) && (
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 3,
                    mb: 4 
                  }}>
                    <IconButton
                      sx={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: isRecording ? 'error.main' : 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: isRecording ? 'error.dark' : 'primary.dark' }
                      }}
                      onClick={toggleRecording}
                    >
                      {isRecording ? <Stop /> : <Mic />}
                    </IconButton>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      component="label"
                      sx={{
                        borderRadius: '28px',
                        px: 4,
                        py: 1.5,
                        height: '48px'
                      }}
                    >
                      Upload Audio
                      <input type="file" hidden accept="audio/*" onChange={handleAudioUpload} />
                    </Button>
                    <Button
                      onClick={handleAudioSubmit}
                      variant="contained"
                      sx={{
                        borderRadius: '28px',
                        px: 4,
                        py: 2,
                        height: '48px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                  <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    {isRecording ? 'Recording... Click to stop' : 'Click microphone to start recording'}
                  </Typography>
                  <VoiceRecognitionResult
                            results={voiceRecognitionResults}
                            isOpen={isDrawerOpen}
                            onClose={() => setIsDrawerOpen(false)}
                          />
                          <VoicifyResult 
                            response={voifyResults}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                          />
                      </Box>
              
            )}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              {renderProgressBar()}
              </Box>
            )}

            {activeTab === 4 && (
              <form>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Enter or paste your text to summarize..."
                    variant="filled"
                    sx={{ mb: 4 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between',mb: 4}}>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      component="label"
                      sx={{ borderRadius: '28px', px: 4 }}
                    >
                      Upload Document
                      <input
                        type="file"
                        hidden
                        accept="application/pdf, text/plain, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleDocumentUpload}
                      />
                    </Button>
                    <Button
                      onClick={handleDocumentSummarySubmit}
                      variant="contained"
                      sx={{
                        borderRadius: '28px',
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                        },
                      }}
                    >
                      Summarize Document
                    </Button>
                    <Button
                        onClick={handleTextSummarySubmit}
                        variant="contained"
                        sx={{
                          borderRadius: '28px',
                          px: 4,
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                          },
                          mt: 2,
                        }}
                      >
                        Summarize Text
                      </Button>
                  </Box>
                  <SummaryResult
                    response={summaryResult}
                    isOpen={isSummaryOpen}
                    onClose={() => setIsSummaryOpen(false)}
                  />
                </Box>
              </form>
              
            )}
          </Box>
          <LoginPromptDialog />
          <Snackbar
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={() => setShowSnackbar(false)}
            message={snackbarMessage}
          />
        </Paper>
        <ServiceSections/>
      </Box>
    </Container>
  );
};

export default MainComponent;
