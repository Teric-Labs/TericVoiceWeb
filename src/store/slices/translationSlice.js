import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { translationAPI } from '../../services/api';

export const translateText = createAsyncThunk(
  'translation/translateText',
  async (translationData, { rejectWithValue }) => {
    try {
      const response = await translationAPI.translateText(
        translationData.text,
        translationData.sourceLang,
        [translationData.targetLang],
        translationData.userId
      );
      
      // Extract the translated text from the response
      // Response structure: {"lg": {"en": "original", "lg": "translated"}}
      const targetLangData = Object.values(response)[0];
      if (targetLangData && typeof targetLangData === 'object') {
        // Get the translation in the target language
        const translatedText = targetLangData[translationData.targetLang];
        return {
          originalText: translationData.text,
          translatedText: translatedText || 'Translation not available',
          sourceLang: translationData.sourceLang,
          targetLang: translationData.targetLang
        };
      }
      
      return {
        originalText: translationData.text,
        translatedText: 'Translation failed',
        sourceLang: translationData.sourceLang,
        targetLang: translationData.targetLang
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Translation failed');
    }
  }
);

export const translateDocument = createAsyncThunk(
  'translation/translateDocument',
  async (translationData, { rejectWithValue }) => {
    try {
      const response = await translationAPI.translateDocument(
        translationData.file,
        translationData.sourceLang,
        [translationData.targetLang],
        translationData.userId
      );
      
      // Extract the translated text from the response
      // Response structure: {"msg": {"lg": "translated"}, "orignal": "original"}
      if (response.msg && response.msg[translationData.targetLang]) {
        return {
          originalText: response.orignal || 'Original text not available',
          translatedText: response.msg[translationData.targetLang],
          sourceLang: translationData.sourceLang,
          targetLang: translationData.targetLang
        };
      }
      
      return {
        originalText: response.orignal || 'Original text not available',
        translatedText: 'Translation failed',
        sourceLang: translationData.sourceLang,
        targetLang: translationData.targetLang
      };
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
        state.translatedText = action.payload.translatedText;
        // Add to history
        state.history.unshift({
          id: Date.now(),
          originalText: action.payload.originalText,
          translatedText: action.payload.translatedText,
          sourceLang: action.payload.sourceLang,
          targetLang: action.payload.targetLang,
          timestamp: new Date().toISOString(),
        });
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
        state.translatedText = action.payload.translatedText;
        // Add to history
        state.history.unshift({
          id: Date.now(),
          originalText: action.payload.originalText,
          translatedText: action.payload.translatedText,
          sourceLang: action.payload.sourceLang,
          targetLang: action.payload.targetLang,
          timestamp: new Date().toISOString(),
        });
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
