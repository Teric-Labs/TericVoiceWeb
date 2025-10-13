import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel,
  Modal, 
  Select, 
  MenuItem, 
  Chip, 
  OutlinedInput, 
  Stack, 
  useTheme, 
  TextField,
  Paper,
  IconButton,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Fade,
  Zoom,
  Slide,
  alpha,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AutoDetectIcon from '@mui/icons-material/AutoDetect';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { X } from 'lucide-react';

// Enhanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(1deg); }
  66% { transform: translateY(4px) rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0px); 
  }
`;

// Enhanced Modal Container
const EnhancedModal = styled(Modal)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
  },
}));

// File Preview Component
const FilePreview = ({ file, onRemove, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (file && file.type.startsWith('audio/')) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(Math.round(audio.duration));
      });
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      sx={{
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(25, 118, 210, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                animation: `${pulse} 2s infinite`,
                animationDelay: `${0.1 * index}s`,
              }}
            >
              <VolumeUpIcon sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                {file.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {formatFileSize(file.size)} • {duration ? formatDuration(duration) : 'Loading...'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
              <IconButton
                size="small"
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: alpha('#1976d2', 0.1),
                  },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove file">
              <IconButton
                size="small"
                onClick={() => onRemove(file)}
                sx={{
                  color: '#f44336',
                  '&:hover': {
                    backgroundColor: alpha('#f44336', 0.1),
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Language Detection Component
const LanguageDetection = ({ onDetect, detectedLanguage, isDetecting }) => (
  <Card
    sx={{
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(100, 181, 246, 0.05))',
      border: '1px solid rgba(25, 118, 210, 0.2)',
      p: 2,
      mb: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
        }}
      >
        <AutoDetectIcon sx={{ color: 'white' }} />
      </Avatar>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
        AI Language Detection
      </Typography>
    </Box>
    
    <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
      Let our AI automatically detect the language in your audio file for better accuracy.
    </Typography>
    
    <Button
      variant="outlined"
      startIcon={isDetecting ? <CircularProgress size={16} /> : <AutoDetectIcon />}
      onClick={onDetect}
      disabled={isDetecting}
      sx={{
        borderRadius: '8px',
        borderColor: '#1976d2',
        color: '#1976d2',
        '&:hover': {
          backgroundColor: alpha('#1976d2', 0.1),
        },
      }}
    >
      {isDetecting ? 'Detecting...' : 'Detect Language'}
    </Button>
    
    {detectedLanguage && (
      <Fade in>
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ mt: 2, borderRadius: '8px' }}
        >
          <Typography variant="body2">
            <strong>Detected Language:</strong> {detectedLanguage}
          </Typography>
        </Alert>
      </Fade>
    )}
  </Card>
);

// Advanced Options Component
const AdvancedOptions = ({ options, onChange }) => (
  <Accordion sx={{ borderRadius: '12px', mb: 2 }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Advanced Options
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeTimestamps}
              onChange={(e) => onChange({ ...options, includeTimestamps: e.target.checked })}
              color="primary"
            />
          }
          label="Include timestamps in transcription"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeSpeakerLabels}
              onChange={(e) => onChange({ ...options, includeSpeakerLabels: e.target.checked })}
              color="primary"
            />
          }
          label="Include speaker identification"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={options.includeConfidenceScores}
              onChange={(e) => onChange({ ...options, includeConfidenceScores: e.target.checked })}
              color="primary"
            />
          }
          label="Include confidence scores"
        />
        <FormControl>
          <InputLabel>Audio Quality</InputLabel>
          <Select
            value={options.audioQuality}
            onChange={(e) => onChange({ ...options, audioQuality: e.target.value })}
            label="Audio Quality"
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="high">High Quality (Slower)</MenuItem>
            <MenuItem value="medium">Medium Quality (Balanced)</MenuItem>
            <MenuItem value="fast">Fast Processing (Lower Quality)</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </AccordionDetails>
  </Accordion>
);

const LanguageAndUploadModal = ({
  open,
  handleClose,
  speakLanguage,
  setSpeakLanguage,
  transcribeLanguages,
  setTranscribeLanguages,
  isMultiple,
  onSubmit,
  languageOptions
}) => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState(isMultiple ? [] : null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    includeTimestamps: false,
    includeSpeakerLabels: false,
    includeConfidenceScores: false,
    audioQuality: 'medium',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    'File Upload',
    'Language Selection',
    'Advanced Options',
    'Review & Submit'
  ];

  const handleTranscribeLanguageChange = (event) => {
    const { target: { value } } = event;
    setTranscribeLanguages(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Only audio files are allowed.');
    }

    if (isMultiple) {
      setSelectedFiles(validFiles);
    } else {
      setSelectedFiles(validFiles[0]);
    }
    
    setError('');
  };

  const removeFile = (fileToRemove) => {
    if (isMultiple) {
      setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
    } else {
      setSelectedFiles(null);
    }
  };

  const handleDetectLanguage = async () => {
    if (!selectedFiles || (isMultiple && selectedFiles.length === 0)) {
      setError('Please select audio files first');
      return;
    }
    
    setIsDetecting(true);
    try {
      // Simulate language detection API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDetectedLanguage('English'); // Mock detection result
      if (setSpeakLanguage) {
        setSpeakLanguage('en');
      }
    } catch (err) {
      setError('Language detection failed. Please try again.');
    }
    setIsDetecting(false);
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0:
        if (!selectedFiles || (isMultiple && selectedFiles.length === 0)) {
          errors.files = 'Please select at least one audio file';
        }
        break;
      case 1:
        if (!speakLanguage) {
          errors.sourceLanguage = 'Please select a source language';
        }
        if (!transcribeLanguages.length) {
          errors.targetLanguages = 'Please select at least one target language';
        }
        break;
      case 2:
        // Advanced options validation if needed
        break;
      case 3:
        if (!description.trim()) {
          errors.description = 'Please provide a description';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setUploading(true);
    try {
      await onSubmit({ 
        speakLanguage, 
        transcribeLanguages, 
        selectedFiles, 
        description,
        advancedOptions 
      });
      handleClose();
    } catch (err) {
      setError('An error occurred during submission. Please try again.');
    }
    setUploading(false);
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedFiles(isMultiple ? [] : null);
    setDescription('');
    setError('');
    setDetectedLanguage(null);
    setValidationErrors({});
    handleClose();
  };

  return (
    <EnhancedModal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="upload-modal-title"
    >
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '24px',
          p: 0,
          outline: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(100, 181, 246, 0.05))',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
              }}
            >
              <SmartToyIcon sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                AI Audio Processing Setup
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 3, pb: 0 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')}
              sx={{ mb: 3, borderRadius: '12px' }}
            >
              {error}
            </Alert>
          )}

          {/* Step 0: File Upload */}
          {activeStep === 0 && (
            <Fade in>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                  Upload Audio Files
                </Typography>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<FileUploadIcon />}
                  sx={{
                    borderRadius: '12px',
                    p: 2,
                    textTransform: 'none',
                    borderWidth: '2px',
                    borderStyle: 'dashed',
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    width: '100%',
                    mb: 3,
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: alpha('#1976d2', 0.05),
                    },
                  }}
                >
                  {isMultiple ? 'Upload Multiple Audio Files' : 'Upload Audio File'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept="audio/*"
                    multiple={isMultiple}
                  />
                </Button>

                {validationErrors.files && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {validationErrors.files}
                  </Typography>
                )}

                {/* File List */}
                {selectedFiles && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                      Selected Files ({isMultiple ? selectedFiles.length : 1})
                    </Typography>
                    {isMultiple ? (
                      selectedFiles.map((file, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <FilePreview file={file} onRemove={removeFile} index={index} />
                        </Box>
                      ))
                    ) : (
                      <FilePreview file={selectedFiles} onRemove={removeFile} index={0} />
                    )}
                  </Box>
                )}

                {/* Language Detection */}
                {selectedFiles && (
                  <LanguageDetection
                    onDetect={handleDetectLanguage}
                    detectedLanguage={detectedLanguage}
                    isDetecting={isDetecting}
                  />
                )}
              </Box>
            </Fade>
          )}

          {/* Step 1: Language Selection */}
          {activeStep === 1 && (
            <Fade in>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                  Language Configuration
                </Typography>

                <Stack spacing={3}>
                  <FormControl fullWidth error={!!validationErrors.sourceLanguage}>
                    <InputLabel id="speak-language-label">Source Language</InputLabel>
                    <Select
                      labelId="speak-language-label"
                      value={speakLanguage}
                      onChange={(event) => setSpeakLanguage(event.target.value)}
                      input={
                        <OutlinedInput 
                          label="Source Language"
                          sx={{ borderRadius: '12px' }}
                        />
                      }
                      startAdornment={<LanguageIcon sx={{ ml: 1, mr: 1, color: 'primary.main' }} />}
                    >
                      {languageOptions.map((language) => (
                        <MenuItem key={language.code} value={language.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{language.name}</Typography>
                            <Chip
                              label={language.code.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: alpha('#1976d2', 0.1),
                                color: '#1976d2',
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.sourceLanguage && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {validationErrors.sourceLanguage}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl fullWidth error={!!validationErrors.targetLanguages}>
                    <InputLabel id="transcribe-language-label">Target Languages</InputLabel>
                    <Select
                      labelId="transcribe-language-label"
                      multiple
                      value={transcribeLanguages}
                      onChange={handleTranscribeLanguageChange}
                      input={
                        <OutlinedInput 
                          label="Target Languages"
                          sx={{ borderRadius: '12px' }}
                        />
                      }
                      startAdornment={<TranslateIcon sx={{ ml: 1, mr: 1, color: 'primary.main' }} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const language = languageOptions.find(lang => lang.code === value);
                            return (
                              <Chip
                                key={value}
                                label={language ? language.name : value}
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  '& .MuiChip-deleteIcon': {
                                    color: 'white',
                                  }
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {languageOptions.map((language) => (
                        <MenuItem key={language.code} value={language.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{language.name}</Typography>
                            <Chip
                              label={language.code.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: alpha('#1976d2', 0.1),
                                color: '#1976d2',
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.targetLanguages && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {validationErrors.targetLanguages}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
              </Box>
            </Fade>
          )}

          {/* Step 2: Advanced Options */}
          {activeStep === 2 && (
            <Fade in>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                  Advanced Processing Options
                </Typography>
                <AdvancedOptions
                  options={advancedOptions}
                  onChange={setAdvancedOptions}
                />
              </Box>
            </Fade>
          )}

          {/* Step 3: Review & Submit */}
          {activeStep === 3 && (
            <Fade in>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', fontWeight: 600 }}>
                  Review & Submit
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    label="Description"
                    placeholder="Enter a brief description of the audio content"
                    multiline
                    rows={3}
                    error={!!validationErrors.description}
                    helperText={validationErrors.description}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />

                  {/* Summary Card */}
                  <Card sx={{ borderRadius: '12px', border: '1px solid rgba(25, 118, 210, 0.2)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                        Processing Summary
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Files:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {isMultiple ? selectedFiles.length : 1} audio file(s)
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Source Language:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {languageOptions.find(lang => lang.code === speakLanguage)?.name || 'Not selected'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Target Languages:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {transcribeLanguages.length} language(s)
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Quality:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {advancedOptions.audioQuality.charAt(0).toUpperCase() + advancedOptions.audioQuality.slice(1)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Footer */}
        <Box 
          sx={{ 
            p: 3, 
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(248, 249, 250, 0.8)',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
              }
            }}
          >
            Cancel
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                }}
              >
                Back
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={uploading}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                  }
                }}
              >
                {uploading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  'Start Processing'
                )}
              </Button>
            )}
          </Box>
        </Box>

        {uploading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px'
            }} 
          />
        )}
      </Paper>
    </EnhancedModal>
  );
};

export default LanguageAndUploadModal;