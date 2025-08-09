import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com';

export const uploadAudio = createAsyncThunk(
  'transcription/uploadAudio',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

export const uploadRecordedAudio = createAsyncThunk(
  'transcription/uploadRecordedAudio',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/upload_recorded_audio/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

const initialState = {
  sourceLanguage: 'en',
  targetLanguages: [],
  audioBlob: null,
  audioURL: '',
  selectedFile: null,
  isRecording: false,
  isPlaying: false,
  isLoading: false,
  progress: 0,
  response: null,
  docId: null,
  error: null,
  history: [],
};

const transcriptionSlice = createSlice({
  name: 'transcription',
  initialState,
  reducers: {
    setSourceLanguage: (state, action) => {
      state.sourceLanguage = action.payload;
    },
    setTargetLanguages: (state, action) => {
      state.targetLanguages = action.payload;
    },
    setAudioBlob: (state, action) => {
      state.audioBlob = action.payload;
    },
    setAudioURL: (state, action) => {
      state.audioURL = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    clearAudio: (state) => {
      state.audioBlob = null;
      state.audioURL = '';
      state.selectedFile = null;
      state.isPlaying = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    addToHistory: (state, action) => {
      state.history.unshift(action.payload);
      if (state.history.length > 50) {
        state.history.pop();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.progress = 0;
      })
      .addCase(uploadAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
        state.progress = 100;
        state.docId = action.payload.doc_id || action.payload.id;
      })
      .addCase(uploadAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.progress = 0;
      })
      .addCase(uploadRecordedAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.progress = 0;
      })
      .addCase(uploadRecordedAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.response = action.payload;
        state.progress = 100;
        state.docId = action.payload.doc_id || action.payload.id;
      })
      .addCase(uploadRecordedAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.progress = 0;
      });
  },
});

export const {
  setSourceLanguage,
  setTargetLanguages,
  setAudioBlob,
  setAudioURL,
  setSelectedFile,
  setIsRecording,
  setIsPlaying,
  setProgress,
  clearAudio,
  clearError,
  addToHistory,
} = transcriptionSlice.actions;

export default transcriptionSlice.reducer;
