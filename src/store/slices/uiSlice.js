import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: {
    mode: 'light',
    primaryColor: '#1976d2',
    secondaryColor: '#64b5f6',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    surfaceColor: '#f5f5f5',
  },
  sidebar: {
    open: false,
  },
  notifications: [],
  loading: {
    global: false,
    transcription: false,
    translation: false,
    synthesis: false,
    summarization: false,
  },
  modals: {
    languageModal: false,
    uploadModal: false,
    subscriptionModal: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
    setSidebarOpen: (state, action) => {
      state.sidebar.open = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      if (type === 'global') {
        state.loading.global = loading;
      } else {
        state.loading[type] = loading;
      }
    },
    setModalOpen: (state, action) => {
      const { modal, open } = action.payload;
      state.modals[modal] = open;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  setLoading,
  setModalOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
