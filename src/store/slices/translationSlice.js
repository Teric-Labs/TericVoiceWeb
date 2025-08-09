import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://phosai-main-api.onrender.com';

export const translateText = createAsyncThunk(
  'translation/translateText',
  async (translationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('user_id', translationData.userId);
      formData.append('source_lang', translationData.sourceLang);
      formData.append('target_langs', translationData.targetLang);
      formData.append('doc', translationData.text);
      formData.append('title', 'Text Translation');

      const response = await axios.post(`${BASE_URL}/translate`, formData);
      return Object.values(response.data)[0];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Translation failed');
    }
  }
);

export const translateDocument = createAsyncThunk(
  'translation/translateDocument',
  async (translationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('user_id', translationData.userId);
      formData.append('source_lang', translationData.sourceLang);
      formData.append('target_langs', translationData.targetLang);
      formData.append('file', translationData.file);
      formData.append('title', 'Document Translation');

      const response = await axios.post(`${BASE_URL}/translate_document`, formData);
      return Object.values(response.data.msg)[0];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Document translation failed');
    }
  }
);

const initialState = {
  sourceLanguage: 'en',
  targetLanguage: 'lg',
  inputText: '',
  translatedText: '',
  selectedFile: null,
  isLoading: false,
  error: null,
  history: [],
  activeTab: 0,
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setSourceLanguage: (state, action) => {
      state.sourceLanguage = action.payload;
    },
    setTargetLanguage: (state, action) => {
      state.targetLanguage = action.payload;
    },
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    setTranslatedText: (state, action) => {
      state.translatedText = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTranslation: (state) => {
      state.inputText = '';
      state.translatedText = '';
      state.selectedFile = null;
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
      .addCase(translateText.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.translatedText = action.payload;
      })
      .addCase(translateText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(translateDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(translateDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.translatedText = action.payload;
      })
      .addCase(translateDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSourceLanguage,
  setTargetLanguage,
  setInputText,
  setTranslatedText,
  setSelectedFile,
  setActiveTab,
  clearError,
  clearTranslation,
  addToHistory,
} = translationSlice.actions;

export default translationSlice.reducer;
