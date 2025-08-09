import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com';

export const synthesizeText = createAsyncThunk(
  'synthesis/synthesizeText',
  async (synthesisData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('user_id', synthesisData.userId);
      formData.append('source_lang', synthesisData.sourceLang);
      formData.append('target_langs', synthesisData.targetLangs.join(','));
      formData.append('doc', synthesisData.text);
      formData.append('title', 'Text to Speech');

      const response = await axios.post(`${BASE_URL}/synthesize`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Synthesis failed');
    }
  }
);

export const synthesizeDocument = createAsyncThunk(
  'synthesis/synthesizeDocument',
  async (synthesisData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('user_id', synthesisData.userId);
      formData.append('source_lang', synthesisData.sourceLang);
      formData.append('target_langs', synthesisData.targetLangs.join(','));
      formData.append('file', synthesisData.file);
      formData.append('title', 'Document to Speech');

      const response = await axios.post(`${BASE_URL}/synthesize_document`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Document synthesis failed');
    }
  }
);

const initialState = {
  sourceLanguage: 'en',
  targetLanguages: ['lg'],
  inputText: '',
  selectedFile: null,
  isLoading: false,
  error: null,
  audioURLs: {},
  taskId: null,
  processingStatus: null,
  history: [],
  activeTab: 0,
};

const synthesisSlice = createSlice({
  name: 'synthesis',
  initialState,
  reducers: {
    setSourceLanguage: (state, action) => {
      state.sourceLanguage = action.payload;
    },
    setTargetLanguages: (state, action) => {
      state.targetLanguages = action.payload;
    },
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setTaskId: (state, action) => {
      state.taskId = action.payload;
    },
    setProcessingStatus: (state, action) => {
      state.processingStatus = action.payload;
    },
    setAudioURLs: (state, action) => {
      state.audioURLs = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSynthesis: (state) => {
      state.inputText = '';
      state.selectedFile = null;
      state.audioURLs = {};
      state.taskId = null;
      state.processingStatus = null;
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
      .addCase(synthesizeText.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(synthesizeText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskId = action.payload.task_id || action.payload.id;
        state.audioURLs = action.payload.audio_urls || {};
      })
      .addCase(synthesizeText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(synthesizeDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(synthesizeDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskId = action.payload.task_id || action.payload.id;
        state.audioURLs = action.payload.audio_urls || {};
      })
      .addCase(synthesizeDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSourceLanguage,
  setTargetLanguages,
  setInputText,
  setSelectedFile,
  setActiveTab,
  setTaskId,
  setProcessingStatus,
  setAudioURLs,
  clearError,
  clearSynthesis,
  addToHistory,
} = synthesisSlice.actions;

export default synthesisSlice.reducer;
