import React,{useState} from 'react';
import { Box, Typography, Button, FormControl, InputLabel,Modal, Select, MenuItem, Chip, OutlinedInput, Stack, useTheme } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import UploadIcon from '@mui/icons-material/Upload';

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
  
  const handleTranscribeLanguageChange = (event) => {
    const { target: { value } } = event;
    setTranscribeLanguages(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFileChange =(event)=>{
    const files = event.target.files;
    if (isMultiple) {
      setSelectedFiles([...files]);
    } else {
      setSelectedFiles(files[0]);
    }
  }

  const handleSubmit=()=>{onSubmit({speakLanguage,transcribeLanguages,selectedFiles})}
  return (
    <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        minWidth: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        outline: 'none',
      }}
      open={open}
      onClose={handleClose}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
        Choose Your Languages and Upload File(s)
      </Typography>
      <Stack spacing={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="speak-language-label">Speak Language</InputLabel>
          <Select
            labelId="speak-language-label"
            value={speakLanguage}
            onChange={(event) => setSpeakLanguage(event.target.value)}
            startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />}
            input={<OutlinedInput label="Speak Language" startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />} />}
          >
            {languageOptions.map((language) => (
              <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="transcribe-language-label">Transcribe To</InputLabel>
          <Select
            labelId="transcribe-language-label"
            multiple
            value={transcribeLanguages}
            onChange={handleTranscribeLanguageChange}
            input={<OutlinedInput label="Transcribe To" startAdornment={<TranslateIcon sx={{ mr: 1, color: 'action.active' }} />} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ bgcolor: theme.palette.grey[300] }} />
                ))}
              </Box>
            )}
          >
            {languageOptions.map((language) => (
              <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          sx={{ textTransform: 'none', fontWeight: 'medium' }}
        >
          Upload Files
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="audio/*"
            multiple={isMultiple}
          />
        </Button>
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none', fontWeight: 'medium' }}>
          Start Transcription
        </Button>
      </Box>
    </Box>
    </Modal>
  );
};

export default LanguageAndUploadModal;
