import React, { useState,useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Chip,
  Box,
  Tab,
  Tabs,
  Alert,
  Typography,
  Container,
  IconButton,
  Paper,
  LinearProgress,
  Snackbar,
  Drawer
} from "@mui/material";
import {
  YouTube as YouTubeIcon,
  CloudQueue as DropBoxIcon,
  FileUpload as FileUploadIcon,
  SwapHoriz,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import axios from "axios";
import ViewVideoComponent from "./ViewVideoComponent";

const API_BASE_URL = "https://avoicesfinny-13747549899.us-central1.run.app";

const VideoCard = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [returnText, setReturnText] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [uploadTab, setUploadTab] = useState(0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docId, setDocId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "lg", label: "Luganda" },
    { value: "at", label: "Ateso" },
    { value: "ach", label: "Acholi" },
    { value: "sw", label: "Swahili" },
    { value: "fr", label: "French" },
    { value: "rw", label: "Kinyarwanda" },
    { value: "nyn", label: "Runyankore" },
  ];

  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    }, []);

  const handleTabChange = (event, newValue) => {
    setUploadTab(newValue);
    setVideoLink("");
    setFile(null);
    setError(null);
    setUploadProgress(0);
  };

  const validateForm = () => {
    if (!sourceLanguage) {
      setError("Please select a source language");
      return false;
    }
    if (targetLanguages.length === 0) {
      setError("Please select at least one target language");
      return false;
    }
    if (!videoTitle.trim()) {
      setError("Please enter a video title");
      return false;
    }
    if (uploadTab !== 2 && !videoLink.trim()) {
      setError("Please enter a video link");
      return false;
    }
    if (uploadTab === 2 && !file) {
      setError("Please select a video file");
      return false;
    }
    return true;
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
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
    }
  };

  const handleLinkSubmission = async () => {
    setDocId(null);
    setIsDrawerOpen(false);
    try {
      const formData = new FormData();
      formData.append('user_id', user.userId);
      formData.append("source_lang", sourceLanguage);
      formData.append("target_langs", targetLanguages);
      formData.append("video_type", uploadTab === 0 ? "youtube" : "dropbox");
      formData.append("video_link", videoLink);
      formData.append("title", videoTitle);

      const response = await axios.post(
        `${API_BASE_URL}/extract_audio_from_video/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDocId(response.data.doc_id);
      setIsDrawerOpen(true);
      setReturnText("Video processed successfully!");
      setShowBanner(true);
    } catch (err) {
      console.error("Error submitting link:", err);
      setError(err.response?.data?.detail || "Error processing video");
    }
  };

  const handleFileSubmission = async () => {
    setDocId(null);
    setIsDrawerOpen(false);
    try {
      const formData = new FormData();
      formData.append("youtube_link", file); // Backend expects 'youtube_link' as the file field name
      formData.append('user_id', user.userId);
      formData.append("source_lang", sourceLanguage);
      formData.append("target_langs", targetLanguages);
      formData.append("title", videoTitle);

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
      if (uploadTab === 2) {
        await handleFileSubmission();
      } else {
        await handleLinkSubmission();
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const renderUploadForm = () => {
    switch (uploadTab) {
      case 0:
        return (
          <TextField
            fullWidth
            label="YouTube Video Link"
            variant="outlined"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            sx={{ mt: 2 }}
          />
        );
      case 1:
        return (
          <TextField
            fullWidth
            label="Dropbox Video Link"
            variant="outlined"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="https://dropbox.com/..."
            sx={{ mt: 2 }}
          />
        );
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <input
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              id="video-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="video-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<FileUploadIcon />}
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 2,
                  borderWidth: '2px',
                  mb: 3
                }}
              >
                Choose Video File
              </Button>
            </label>
            {file && (
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <Typography variant="body2">{file.name}</Typography>
                <IconButton size="small" onClick={() => setFile(null)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {loading && (
          <LinearProgress
            variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
            value={uploadProgress}
            sx={{ mb: 2 }}
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={showBanner}
          autoHideDuration={6000}
          onClose={() => setShowBanner(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success" onClose={() => setShowBanner(false)}>
            {returnText}
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Translate From
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              value={sourceLanguage}
                              onChange={(e) => setSourceLanguage(e.target.value)}
                              sx={{ minHeight: '56px', borderRadius: '12px' }}
                            >
                              {languageOptions.map((lang) => (
                                <MenuItem key={lang.value} value={lang.value}>
                                  <LanguageIcon sx={{ color: 'primary.main', fontSize: 20, mr: 1 }} />
                                  {lang.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
            
                        <Grid item xs={12} md={2} sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: { xs: 2, md: 4 } 
                        }}>
                          <IconButton
                            onClick={() => {
                              const temp = sourceLanguage;
                              setSourceLanguage(targetLanguages[0] || '');
                              setTargetLanguages([temp]);
                            }}
                            sx={{
                              width: 48,
                              height: 48,
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'primary.dark' },
                            }}
                          >
                            <SwapHoriz />
                          </IconButton>
                        </Grid>
            
                        <Grid item xs={12} md={5}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Translate To
                          </Typography>
                          <FormControl fullWidth>
                            <Select
                              multiple
                              value={targetLanguages}
                              onChange={(e) => setTargetLanguages(e.target.value)}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip
                                      key={value}
                                      label={languageOptions.find((lang) => lang.value === value)?.label}
                                      sx={{
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        borderRadius: '6px',
                                        px: 1,
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            >
                              {languageOptions.map((lang) => (
                                <MenuItem key={lang.value} value={lang.value}>
                                  <LanguageIcon sx={{ color: 'primary.main', fontSize: 20, mr: 1 }} />
                                  {lang.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video Title"
                variant="outlined"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                error={!!error && !videoTitle}
              />
            </Grid>

            <Grid item xs={12}>
              <Tabs value={uploadTab} onChange={handleTabChange} centered>
                <Tab icon={<YouTubeIcon />} label="YouTube" />
                <Tab icon={<DropBoxIcon />} label="Dropbox" />
                <Tab icon={<FileUploadIcon />} label="Upload File" />
              </Tabs>
              {renderUploadForm()}
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderRadius: '28px',
                  px: 4,
                  py: 2,
                  borderWidth: '2px',
                  mb: 3
                }}
              >
                {loading ? "Processing..." : "Start Translation"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '600px' },
          },
        }}
      >
        {docId && <ViewVideoComponent audioId={docId} />}
      </Drawer>
    </Container>
  );
};

export default VideoCard;