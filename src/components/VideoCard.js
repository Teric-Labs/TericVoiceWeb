import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Chip,
  Box,
  Alert,
  Typography,
  Container,
  IconButton,
  Paper,
  LinearProgress,
  Snackbar,
  Drawer,
  Card,
  CardContent,
  Fade,
  Zoom,
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  SwapHoriz,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
  VideoFile as VideoFileIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
} from "@mui/icons-material";
import axios from "axios";
import ViewVideoComponent from "./ViewVideoComponent";

const API_BASE_URL = "https://phosai-main-api.onrender.com";

const VideoCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [returnText, setReturnText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "lg", label: "Luganda", flag: "🇺🇬" },
    { value: "at", label: "Ateso", flag: "🇺🇬" },
    { value: "ac", label: "Acholi", flag: "🇺🇬" },
    { value: "sw", label: "Swahili", flag: "🇰🇪" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "rw", label: "Kinyarwanda", flag: "🇷🇼" },
    { value: "nyn", label: "Runyankore", flag: "🇺🇬" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{"username":"","userId":""}');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (!dropZoneRef.current?.contains(e.relatedTarget)) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelection(droppedFile);
      }
    };

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  const validateForm = () => {
    if (!sourceLanguage) {
      setError("Please select a source language");
      return false;
    }
    if (targetLanguages.length === 0) {
      setError("Please select at least one target language");
      return false;
    }
    
    if (!file) {
      setError("Please select a video file");
      return false;
    }
    return true;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile.size > 500 * 1024 * 1024) {
      setError("File size should not exceed 500MB");
      return;
    }
    if (!selectedFile.type.startsWith("video/")) {
      setError("Please upload a valid video file");
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Create video preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setVideoPreview(previewUrl);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSubmission = async () => {
    setDocId(null);
    setIsDrawerOpen(false);
    try {
      const formData = new FormData();
      formData.append("youtube_link", file);
      formData.append('user_id', user.userId);
      formData.append("source_lang", sourceLanguage);
      formData.append("target_langs", targetLanguages);

      const response = await axios.post(
        `${API_BASE_URL}/videoUpload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(Math.round(progress));
          },
        }
      );
      
      setDocId(response.data.doc_id);
      setIsDrawerOpen(true);
      setReturnText("Video uploaded successfully!");
      setShowBanner(true);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err.response?.data?.msg || "Error uploading video");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await handleFileSubmission();
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
  };

  const swapLanguages = () => {
    if (targetLanguages.length > 0) {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguages[0]);
      setTargetLanguages([temp]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 4, fontWeight: 300 }}
          >
            Upload your video and translate it to multiple languages with AI
          </Typography>
        </Box>
      </Fade>

      <Zoom in timeout={1000}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
            border: '1px solid rgba(33, 150, 243, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
            }
          }}
        >
          {loading && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress
                variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
                value={uploadProgress}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                    borderRadius: 4,
                  }
                }}
              />
              {uploadProgress > 0 && (
                <Typography variant="body2" color="primary" sx={{ mt: 1, textAlign: 'center' }}>
                  Uploading... {uploadProgress}%
                </Typography>
              )}
            </Box>
          )}

          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }} 
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </Fade>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Language Selection */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, backgroundColor: 'rgba(33, 150, 243, 0.02)', borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                    Language Settings
                  </Typography>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Source Language
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={sourceLanguage}
                          onChange={(e) => setSourceLanguage(e.target.value)}
                          sx={{ 
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(33, 150, 243, 0.3)',
                            }
                          }}
                        >
                          {languageOptions.map((lang) => (
                            <MenuItem key={lang.value} value={lang.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
                                <LanguageIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                {lang.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={2} sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <IconButton
                        onClick={swapLanguages}
                        disabled={targetLanguages.length === 0}
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            transform: 'scale(1.1) rotate(180deg)',
                            boxShadow: '0 12px 24px rgba(33, 150, 243, 0.4)',
                          },
                          '&:disabled': {
                            background: 'rgba(0,0,0,0.12)',
                            color: 'rgba(0,0,0,0.26)',
                          }
                        }}
                      >
                        <SwapHoriz />
                      </IconButton>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Target Languages
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          multiple
                          value={targetLanguages}
                          onChange={(e) => setTargetLanguages(e.target.value)}
                          sx={{ 
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(33, 150, 243, 0.3)',
                            }
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {selected.map((value) => {
                                const lang = languageOptions.find((lang) => lang.value === value);
                                return (
                                  <Chip
                                    key={value}
                                    label={`${lang?.flag} ${lang?.label}`}
                                    size="small"
                                    sx={{
                                      background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 30%, rgba(33, 203, 243, 0.1) 90%)',
                                      borderRadius: 2,
                                      border: '1px solid rgba(33, 150, 243, 0.3)',
                                      fontWeight: 500,
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {languageOptions.map((lang) => (
                            <MenuItem key={lang.value} value={lang.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
                                <LanguageIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                {lang.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>


              {/* File Upload Zone */}
              <Grid item xs={12}>
                <Card sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      ref={dropZoneRef}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        minHeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: `3px dashed ${isDragOver ? '#2196F3' : 'rgba(33, 150, 243, 0.3)'}`,
                        borderRadius: 3,
                        background: isDragOver 
                          ? 'linear-gradient(145deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)'
                          : 'linear-gradient(145deg, rgba(248, 249, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          border: '3px dashed #2196F3',
                          background: 'linear-gradient(145deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 203, 243, 0.05) 100%)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                      />
                      
                      {!file ? (
                        <Fade in timeout={600}>
                          <Box sx={{ textAlign: 'center' }}>
                            <VideoFileIcon 
                              sx={{ 
                                fontSize: 80, 
                                color: 'primary.main', 
                                mb: 2,
                                filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.3))',
                              }} 
                            />
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                              Drop your video here
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                              or click to browse files
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Supported formats: MP4, AVI, MOV, WMV • Max size: 500MB
                            </Typography>
                          </Box>
                        </Fade>
                      ) : (
                        <Zoom in timeout={600}>
                          <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
                            {videoPreview && (
                              <Box sx={{ mb: 3, position: 'relative' }}>
                                <video
                                  src={videoPreview}
                                  width="100%"
                                  height="200"
                                  style={{ 
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                  }}
                                  controls
                                />
                              </Box>
                            )}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              p: 2,
                              backgroundColor: 'rgba(33, 150, 243, 0.05)',
                              borderRadius: 2,
                              border: '1px solid rgba(33, 150, 243, 0.2)',
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {file.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatFileSize(file.size)}
                                  </Typography>
                                </Box>
                              </Box>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile();
                                }} 
                                color="error"
                                size="small"
                                sx={{ 
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Zoom>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? null : <CloudUploadIcon />}
                  sx={{
                    borderRadius: 6,
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: loading 
                      ? 'rgba(0,0,0,0.12)' 
                      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: loading 
                      ? 'none' 
                      : '0 8px 24px rgba(33, 150, 243, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: loading ? 'none' : 'translateY(-2px)',
                      boxShadow: loading 
                        ? 'none' 
                        : '0 12px 32px rgba(33, 150, 243, 0.5)',
                    },
                    '&:disabled': {
                      color: 'rgba(0,0,0,0.26)',
                    }
                  }}
                >
                  {loading ? "Processing Video..." : "Start Translation"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Zoom>

      <Snackbar
        open={showBanner}
        autoHideDuration={6000}
        onClose={() => setShowBanner(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          severity="success" 
          onClose={() => setShowBanner(false)}
          sx={{ borderRadius: 2 }}
        >
          {returnText}
        </Alert>
      </Snackbar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '600px' },
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        {docId && <ViewVideoComponent audioId={docId} />}
      </Drawer>
    </Container>
  );
};

export default VideoCard;