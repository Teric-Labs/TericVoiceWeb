import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com';

export const summarizeText = createAsyncThunk(
  'summarization/summarizeText',
  async (summarizationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('source_lang', summarizationData.sourceLang);
      formData.append('user_id', summarizationData.userId);
      formData.append('doc', summarizationData.text);

      const response = await axios.post(`${BASE_URL}/surmarize`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Summarization failed');
    }
  }
);

export const summarizeDocument = createAsyncThunk(
  'summarization/summarizeDocument',
  async (summarizationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('source_lang', summarizationData.sourceLang);
      formData.append('user_id', summarizationData.userId);
      formData.append('file', summarizationData.file);

      const response = await axios.post(`${BASE_URL}/summarize_document/`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Document summarization failed');
    }
  }
);

export const summarizeAudio = createAsyncThunk(
  'summarization/summarizeAudio',
  async (summarizationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('source_lang', summarizationData.sourceLang);
      formData.append('user_id', summarizationData.userId);
      formData.append('audio_file', summarizationData.file);

      const response = await axios.post(`${BASE_URL}/summarize_upload/`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Audio summarization failed');
    }
  }
);

export const summarizeVideo = createAsyncThunk(
  'summarization/summarizeVideo',
  async (summarizationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('source_lang', summarizationData.sourceLang);
      formData.append('user_id', summarizationData.userId);
      formData.append('video_file', summarizationData.file);

      const response = await axios.post(`${BASE_URL}/summarize_video/`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Video summarization failed');
    }
  }
);

const initialState = {
  sourceLanguage: 'en',
  inputText: '',
  selectedFile: null,
  isLoading: false,
  error: null,
  summary: '',
  translationId: null,
  history: [],
  activeTab: 0,
};

const summarizationSlice = createSlice({
  name: 'summarization',
  initialState,
  reducers: {
    setSourceLanguage: (state, action) => {
      state.sourceLanguage = action.payload;
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
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    setTranslationId: (state, action) => {
      state.translationId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSummarization: (state) => {
      state.inputText = '';
      state.selectedFile = null;
      state.summary = '';
      state.translationId = null;
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
      .addCase(summarizeText.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(summarizeText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary || action.payload;
        state.translationId = action.payload.translation_id || action.payload.id;
      })
      .addCase(summarizeText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(summarizeDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(summarizeDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary || action.payload;
        state.translationId = action.payload.translation_id || action.payload.id;
      })
      .addCase(summarizeDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(summarizeAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(summarizeAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary || action.payload;
        state.translationId = action.payload.translation_id || action.payload.id;
      })
      .addCase(summarizeAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(summarizeVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(summarizeVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary || action.payload;
        state.translationId = action.payload.translation_id || action.payload.id;
      })
      .addCase(summarizeVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSourceLanguage,
  setInputText,
  setSelectedFile,
  setActiveTab,
  setSummary,
  setTranslationId,
  clearError,
  clearSummarization,
  addToHistory,
} = summarizationSlice.actions;

export default summarizationSlice.reducer;
