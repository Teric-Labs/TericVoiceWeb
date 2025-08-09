import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import transcriptionReducer from './slices/transcriptionSlice';
import translationReducer from './slices/translationSlice';
import synthesisReducer from './slices/synthesisSlice';
import summarizationReducer from './slices/summarizationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    transcription: transcriptionReducer,
    translation: translationReducer,
    synthesis: synthesisReducer,
    summarization: summarizationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
