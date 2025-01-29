import React, { useState } from 'react';
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
  LinearProgress
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { X } from 'lucide-react';

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
  };

  const removeFile = (fileToRemove) => {
    if (isMultiple) {
      setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
    } else {
      setSelectedFiles(null);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }
    if (!selectedFiles || (isMultiple && selectedFiles.length === 0)) {
      setError('Please select file(s) to upload');
      return;
    }
    if (!speakLanguage) {
      setError('Please select a source language');
      return;
    }
    if (!transcribeLanguages.length) {
      setError('Please select at least one target language');
      return;
    }

    setError('');
    setUploading(true);
    try {
      await onSubmit({ speakLanguage, transcribeLanguages, selectedFiles, description });
      handleClose();
    } catch (err) {
      setError('An error occurred during submission. Please try again.');
    }
    setUploading(false);
  };

  return (
    <Modal 
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
          minWidth: { xs: '90%', sm: 600 },
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '24px',
          p: 0,
          outline: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(25, 118, 210, 0.1)',
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
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
            }}
          >
            Audio Transcription Setup
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <FormControl fullWidth>
              <TextField
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="Description"
                placeholder="Enter a brief description of the audio content"
                multiline
                rows={2}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </FormControl>

            <FormControl fullWidth>
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
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
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
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  borderRadius: '12px',
                  p: 1.5,
                  textTransform: 'none',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                  }
                }}
              >
                {isMultiple ? 'Upload Audio Files' : 'Upload Audio File'}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept="audio/*"
                  multiple={isMultiple}
                />
              </Button>

              {/* File List */}
              {selectedFiles && (
                <Box sx={{ mt: 2 }}>
                  {isMultiple ? (
                    selectedFiles.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeFile(file)}
                        sx={{ m: 0.5 }}
                      />
                    ))
                  ) : (
                    selectedFiles && (
                      <Chip
                        label={selectedFiles.name}
                        onDelete={() => removeFile(selectedFiles)}
                        sx={{ m: 0.5 }}
                      />
                    )
                  )}
                </Box>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Footer */}
        <Box 
          sx={{ 
            p: 3, 
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
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
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={uploading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
              }
            }}
          >
            {uploading ? 'Processing...' : 'Start Transcription'}
          </Button>
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
    </Modal>
  );
};

export default LanguageAndUploadModal;