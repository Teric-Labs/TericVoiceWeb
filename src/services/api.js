/**
 * Centralized API Service for African Voices Platform
 * World-class API integration with subscription tracking and error handling
 */

import axios from 'axios';

// Base configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'https://phosai-backend-api.onrender.com';
const REQUEST_TIMEOUT = 60000; // 60 seconds for long operations
const LONG_REQUEST_TIMEOUT = 300000; // 5 minutes for document processing operations

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for subscription tracking
apiClient.interceptors.request.use(
  (config) => {
    // Add user_id to all requests if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.uid || user.userId; // Support both uid and userId
    
    console.log('🔵 API Interceptor: User from localStorage:', user);
    console.log('🔵 API Interceptor: Extracted userId:', userId);
    console.log('🔵 API Interceptor: Request URL:', config.url);
    console.log('🔵 API Interceptor: Request method:', config.method);
    console.log('🔵 API Interceptor: Request data type:', typeof config.data);
    console.log('🔵 API Interceptor: Is FormData:', config.data instanceof FormData);
    
    if (userId) {
      if (config.data instanceof FormData) {
        console.log('🔵 API Interceptor: Adding user_id to FormData:', userId);
        config.data.append('user_id', userId);
        
        // Debug: Log all FormData entries
        console.log('🔵 API Interceptor: FormData contents after adding user_id:');
        for (let pair of config.data.entries()) {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      } else if (config.data) {
        console.log('🔵 API Interceptor: Adding user_id to JSON data:', userId);
        config.data.user_id = userId;
      } else {
        console.log('🔵 API Interceptor: Creating new data object with user_id:', userId);
        config.data = { user_id: userId };
      }
    } else {
      console.log('🔵 API Interceptor: No userId found in user object');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and subscription checks
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      // Handle subscription limit exceeded
      const message = error.response.data?.message || 'Usage limit exceeded';
      if (message.includes('Usage limit exceeded') || message.includes('subscription')) {
        // Trigger upgrade prompt
        window.dispatchEvent(new CustomEvent('subscription-limit-exceeded', {
          detail: { message, endpoint: error.config?.url }
        }));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * SUBSCRIPTION & PRICING APIs
 */
export const subscriptionAPI = {
  // Get pricing tiers
  getPricingTiers: async (currency = 'USD') => {
    const response = await apiClient.get('/api/pricing-tiers', {
      params: { currency }
    });
    return response.data;
  },

  // Check usage limits
  checkUsage: async (endpoint) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.uid || user.userId; // Support both uid and userId
    console.log('🔍 Checking usage for endpoint:', endpoint);
    console.log('👤 User from localStorage:', user);
    console.log('🆔 User ID (uid):', user.uid);
    console.log('🆔 User ID (userId):', user.userId);
    console.log('🆔 Final User ID:', userId);
    
    if (!userId) {
      console.error('❌ No user ID found in localStorage');
      throw new Error('User not authenticated');
    }
    
    // Create FormData with both user_id and endpoint to ensure consistency
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('endpoint', endpoint);
    
    console.log('📤 Sending form data:', {
      user_id: userId,
      endpoint: endpoint
    });
    
    console.log('📤 FormData contents before sending:');
    for (let pair of formData.entries()) {
      console.log(`  ${pair[0]}: ${pair[1]}`);
    }
    
    try {
      // Use a direct axios call to avoid interceptor issues
      const response = await axios.post(`${BASE_URL}/api/check-usage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: REQUEST_TIMEOUT
      });
      console.log('✅ Usage check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Usage check failed:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Get usage stats
  getUsageStats: async (userId) => {
    const response = await apiClient.get(`/api/usage-stats/${userId}`);
    return response.data;
  },

  // Process payment with Stripe
  processPayment: async (paymentData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.uid || user.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('tier_id', paymentData.tierId);
    formData.append('payment_method', paymentData.paymentMethod);
    formData.append('amount', paymentData.amount);
    formData.append('currency', paymentData.currency || 'USD');
    
    // Add payment method specific data
    if (paymentData.paymentMethod === 'card') {
      formData.append('card_number', paymentData.cardNumber);
      formData.append('expiry_date', paymentData.expiryDate);
      formData.append('cvv', paymentData.cvv);
      formData.append('cardholder_name', paymentData.cardholderName);
      formData.append('email', paymentData.email);
      formData.append('country', paymentData.country);
      formData.append('address', paymentData.address);
      formData.append('city', paymentData.city);
      formData.append('zip_code', paymentData.zipCode);
    } else if (paymentData.paymentMethod === 'mobile') {
      formData.append('phone_number', paymentData.phoneNumber);
      formData.append('provider', paymentData.provider);
      formData.append('email', paymentData.email);
    }
    
    try {
      const response = await axios.post(`${BASE_URL}/api/process-payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  },

  // Create Stripe payment intent
  createPaymentIntent: async (amount, currency = 'USD', metadata = {}) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.uid || user.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('amount', amount);
    formData.append('currency', currency);
    formData.append('metadata', JSON.stringify(metadata));
    
    try {
      const response = await axios.post(`${BASE_URL}/api/create-payment-intent`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.uid || user.userId;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('payment_intent_id', paymentIntentId);
    formData.append('payment_method_id', paymentMethodId);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/confirm-payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  },

  // Create Stripe checkout session
  createCheckoutSession: async (priceId, userId) => {
    const response = await apiClient.post('/create-checkout-session', {
      price_id: priceId,
      user_id: userId
    });
    return response.data;
  },

  // Subscribe all users to free tier
  subscribeAllUsersFree: async () => {
    const response = await apiClient.post('/api/subscribe-all-users-free');
    return response.data;
  },

  // Sync Firebase users
  syncFirebaseUsers: async () => {
    const response = await apiClient.post('/api/sync-firebase-users');
    return response.data;
  }
};

/**
 * AUDIO TRANSCRIPTION APIs
 */
export const transcriptionAPI = {
  // Upload audio file for transcription
  uploadAudio: async (audioFile, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('source_lang', sourceLang);
    // Append each target language as a separate form field
    targetLangs.forEach(lang => {
      formData.append('target_langs', lang);
    });
    formData.append('user_id', userId);

    const response = await apiClient.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Upload recorded audio
  uploadRecordedAudio: async (audioFile, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('recorded_audio', audioFile);
    formData.append('source_lang', sourceLang);
    // Append each target language as a separate form field
    targetLangs.forEach(lang => {
      formData.append('target_langs', lang);
    });
    formData.append('user_id', userId);

    const response = await apiClient.post('/upload_recorded_audio/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get audio files
  getAudios: async (userId) => {
    const response = await apiClient.post('/get_audios', { user_id: userId });
    return response.data;
  },

  // Get specific audio
  getAudio: async (docId) => {
    const response = await apiClient.post('/get_audio', { doc_id: docId });
    return response.data;
  }
};

/**
 * VIDEO PROCESSING APIs
 */
export const videoAPI = {
  // Upload video file (for YouTube URLs)
  uploadVideo: async (youtubeUrl, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('youtube_link', youtubeUrl);
    formData.append('source_lang', sourceLang);
    // Append each target language as a separate form field
    targetLangs.forEach(lang => {
      formData.append('target_langs', lang);
    });
    formData.append('user_id', userId);

    const response = await apiClient.post('/videoUpload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  },

  // Get video
  getVideo: async (docId) => {
    const response = await apiClient.post('/get_video', { doc_id: docId });
    return response.data;
  },

  // Extract audio from video file
  extractAudioFromVideo: async (videoFile, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('video_file', videoFile);
    formData.append('source_lang', sourceLang);
    // Append each target language as a separate form field
    targetLangs.forEach(lang => {
      formData.append('target_langs', lang);
    });
    formData.append('user_id', userId);

    const response = await apiClient.post('/extract_audio_from_video/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  }
};

/**
 * TRANSLATION APIs
 */
export const translationAPI = {
  // Translate text
  translateText: async (text, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('doc', text);
    formData.append('source_lang', sourceLang);
    formData.append('user_id', userId);
    formData.append('title', 'Text Translation');
    
    // Append each target language individually
    targetLangs.forEach(lang => {
      formData.append('target_langs', lang);
    });

    const response = await apiClient.post('/translate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Translate document
  translateDocument: async (file, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_lang', sourceLang);
    targetLangs.forEach(lang => formData.append('target_langs', lang));
    formData.append('user_id', userId);

    const response = await apiClient.post('/translate_document/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  },

  // Get document
  getDocument: async (docId) => {
    const response = await apiClient.post('/get_document', { doc_id: docId });
    return response.data;
  },

  // Get document translations
  getDocumentTranslations: async (userId) => {
    const response = await apiClient.post('/get_doucument_translations', { user_id: userId });
    return response.data;
  },

  // Get translations
  getTranslations: async (userId) => {
    const response = await apiClient.post('/get_translations', { user_id: userId });
    return response.data;
  },

  // Get specific translation
  getTranslation: async (docId) => {
    const response = await apiClient.post('/get_translation', { doc_id: docId });
    return response.data;
  }
};

/**
 * SUMMARIZATION APIs
 */
export const summarizationAPI = {
  // Summarize text (using document endpoint with text file)
  summarizeText: async (text, userId) => {
    // Create a text file from the text content
    const textBlob = new Blob([text], { type: 'text/plain' });
    const textFile = new File([textBlob], 'text.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', textFile);
    formData.append('source_lang', 'en');
    formData.append('user_id', userId);

    const response = await apiClient.post('/summarize_document/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Summarize audio from video
  summarizeAudioFromVideo: async (videoFile, sourceLang, userId) => {
    const formData = new FormData();
    formData.append('video_file', videoFile);
    formData.append('source_lang', sourceLang);
    formData.append('user_id', userId);

    const response = await apiClient.post('/summarize_audio_from_video/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Summarize document
  summarizeDocument: async (file, sourceLang, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_lang', sourceLang);
    formData.append('user_id', userId);

    const response = await apiClient.post('/summarize_document/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Summarize upload
  summarizeUpload: async (audioFile, sourceLang, userId) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('source_lang', sourceLang);
    formData.append('user_id', userId);

    const response = await apiClient.post('/summarize_upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get summaries
  getSummaries: async (userId) => {
    const response = await apiClient.post('/get_summaries', { user_id: userId });
    return response.data;
  },

  // Get specific summary
  getSummary: async (docId) => {
    const response = await apiClient.post('/get_summary', { doc_id: docId });
    return response.data;
  }
};

/**
 * TEXT-TO-SPEECH APIs
 */
export const ttsAPI = {
  // Synthesize text to speech
  synthesizeText: async (text, voice, userId) => {
    console.log('🔵 ttsAPI.synthesizeText called with:', { text: text?.substring(0, 50) + '...', voice, userId });
    
    const formData = new FormData();
    formData.append('doc', text);  // Backend expects 'doc' field
    formData.append('source_lang', 'en');  // Required field
    // Backend expects target_langs as individual form fields, not JSON string
    formData.append('target_langs', 'en');  // Single target language
    formData.append('user_id', userId);
    // Remove voice field - backend doesn't expect it

    console.log('🔵 ttsAPI.synthesizeText FormData contents:');
    for (let pair of formData.entries()) {
      console.log(`  ${pair[0]}: ${pair[1]}`);
    }

    console.log('🔵 ttsAPI.synthesizeText making request to /vocify');
    const response = await apiClient.post('/vocify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('🔵 ttsAPI.synthesizeText response:', response.data);
    return response.data;
  },

  // Get vocify voices
  getVocifyVoices: async (userId) => {
    const response = await apiClient.post('/get_vocify_voices', { user_id: userId });
    return response.data;
  },

  // Get specific vocify voice
  getVocifyVoice: async (docId) => {
    const response = await apiClient.post('/get_vocify_voice', { doc_id: docId });
    return response.data;
  },

  // Translate document with TTS
  translateDocumentWithTTS: async (file, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_lang', sourceLang);
    formData.append('target_langs', JSON.stringify(targetLangs));
    formData.append('user_id', userId);

    const response = await apiClient.post('/translate_document_with_tts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  },

  // Get document voice
  getDocumentVoice: async (docId) => {
    const response = await apiClient.post('/get_document_voice', { doc_id: docId });
    return response.data;
  },

  // Get document voices
  getDocumentVoices: async (userId) => {
    const response = await apiClient.post('/get_document_voices', { user_id: userId });
    return response.data;
  }
};

/**
 * VOICE-TO-VOICE APIs
 */
export const voiceToVoiceAPI = {
  // Voice to voice conversion
  voiceToVoice: async (audioFile, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('recorded_audio', audioFile);
    formData.append('source_lang', sourceLang);
    targetLangs.forEach(lang => formData.append('target_langs', lang));
    formData.append('user_id', userId);

    const response = await apiClient.post('/recorded_audio_vv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Recorded audio voice to voice
  recordedAudioVV: async (audioFile, sourceLang, targetLangs, userId) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('source_lang', sourceLang);
    formData.append('target_langs', JSON.stringify(targetLangs));
    formData.append('user_id', userId);

    const response = await apiClient.post('/recorded_audio_vv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get voices
  getVoices: async (userId) => {
    const response = await apiClient.post('/get_voices', { user_id: userId });
    return response.data;
  },

  // Get TTS voice
  getTTSVoice: async (docId) => {
    const response = await apiClient.post('/get_ttsvoice', { doc_id: docId });
    return response.data;
  }
};

/**
 * BLOG APIs
 */
export const blogAPI = {
  // Create blog post
  createBlogPost: async (title, content, userId) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('user_id', userId);

    const response = await apiClient.post('/blog/', formData);
    return response.data;
  },

  // Get article
  getArticle: async (docId) => {
    const response = await apiClient.post('/get_article', { doc_id: docId });
    return response.data;
  },

  // Get articles
  getArticles: async (userId) => {
    const response = await apiClient.post('/get_articles', { user_id: userId });
    return response.data;
  },

  // Delete blog post
  deleteBlogPost: async (docId) => {
    const response = await apiClient.post('/blog/delete', { doc_id: docId });
    return response.data;
  }
};

/**
 * DATA RETRIEVAL APIs
 */
export const dataAPI = {
  // Get all audios for user
  getAudios: async (userId) => {
    const response = await apiClient.post('/get_audios', { user_id: userId });
    return response.data;
  },

  // Get specific audio by doc_id
  getAudio: async (docId) => {
    const response = await apiClient.post('/get_audio', { doc_id: docId });
    return response.data;
  },

  // Get audio data by doc_id
  getAudioData: async (docId) => {
    const response = await apiClient.post('/get_audio_data', { doc_id: docId });
    return response.data;
  },

  // Get specific video by doc_id
  getVideo: async (docId) => {
    const response = await apiClient.post('/get_audio_data', { doc_id: docId });
    return response.data;
  },

  // Get all videos for user
  getVideos: async (userId) => {
    const response = await apiClient.post('/get_video', { user_id: userId });
    return response.data;
  },

  // Get all translations for user
  getTranslations: async (userId) => {
    const response = await apiClient.post('/get_translations', { user_id: userId });
    return response.data;
  },

  // Get specific translation by doc_id
  getTranslation: async (docId) => {
    const response = await apiClient.post('/get_translation', { doc_id: docId });
    return response.data;
  },

  // Get document translations for user
  getDocumentTranslations: async (userId) => {
    const response = await apiClient.post('/get_doucument_translations', { user_id: userId });
    return response.data;
  },

  // Get specific document by doc_id
  getDocument: async (docId) => {
    const response = await apiClient.post('/get_document', { doc_id: docId });
    return response.data;
  },

  // Get all summaries for user
  getSummaries: async (userId) => {
    const response = await apiClient.post('/get_summaries', { user_id: userId });
    return response.data;
  },

  // Get specific summary by doc_id
  getSummary: async (docId) => {
    const response = await apiClient.post('/get_summary', { doc_id: docId });
    return response.data;
  },

  // Get all TTS voices for user
  getVocifyVoices: async (userId) => {
    const response = await apiClient.post('/get_vocify_voices', { user_id: userId });
    return response.data;
  },

  // Get specific TTS voice by doc_id
  getVocifyVoice: async (docId) => {
    const response = await apiClient.post('/get_vocify_voice', { doc_id: docId });
    return response.data;
  },

  // Get document voices for user
  getDocumentVoices: async (userId) => {
    const response = await apiClient.post('/get_document_voices', { user_id: userId });
    return response.data;
  },

  // Get specific document voice by doc_id
  getDocumentVoice: async (docId) => {
    const response = await apiClient.post('/get_document_voice', { doc_id: docId });
    return response.data;
  },

  // Get all voice-to-voice translations for user
  getVoices: async (userId) => {
    const response = await apiClient.post('/get_voices', { user_id: userId });
    return response.data;
  },

  // Get specific TTS voice by doc_id
  getTTSVoice: async (docId) => {
    const response = await apiClient.post('/get_ttsvoice', { doc_id: docId });
    return response.data;
  },

  // Get all blog articles
  getArticles: async () => {
    const response = await apiClient.post('/get_articles', { user_id: 'all' });
    return response.data;
  },

  // Get specific article by doc_id
  getArticle: async (docId) => {
    const response = await apiClient.post('/get_article', { doc_id: docId });
    return response.data;
  }
};

/**
 * SYSTEM MONITORING APIs
 */
export const systemAPI = {
  // Get subscription monitoring status
  getSubscriptionMonitoringStatus: async () => {
    const response = await apiClient.get('/api/subscription-monitoring-status');
    return response.data;
  },

  // Get performance stats
  getPerformanceStats: async () => {
    const response = await apiClient.get('/api/performance-stats');
    return response.data;
  },

  // Clear cache
  clearCache: async () => {
    const response = await apiClient.post('/api/clear-cache');
    return response.data;
  },

  // Get monitoring status
  getMonitoringStatus: async () => {
    const response = await apiClient.get('/api/monitoring-status');
    return response.data;
  },

  // Health check endpoint
  healthCheck: async () => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  // Get billing history for user
  getBillingHistory: async (userId) => {
    const response = await apiClient.get(`/api/billing-history/${userId}`);
    return response.data;
  },

  // Get subscription limits for user
  getSubscriptionLimits: async (userId) => {
    const response = await apiClient.get(`/api/subscription-limits/${userId}`);
    return response.data;
  },

  // Batch check subscriptions for multiple users
  batchCheckSubscriptions: async (userIds) => {
    const response = await apiClient.post('/api/batch-check-subscriptions', userIds);
    return response.data;
  },

  // Clear subscription cache
  clearSubscriptionCache: async () => {
    const response = await apiClient.post('/api/clear-subscription-cache');
    return response.data;
  },

  // Subscribe all users to free tier
  subscribeAllUsersToFreeTier: async () => {
    const response = await apiClient.post('/api/subscribe-all-users-free');
    return response.data;
  },

  // Sync Firebase users
  syncFirebaseUsers: async () => {
    const response = await apiClient.post('/api/sync-firebase-users');
    return response.data;
  },

  // Test payment flows
  testPaymentFlows: async () => {
    const response = await apiClient.post('/api/test-payment-flows');
    return response.data;
  },

  // Get subscription lifecycle
  getSubscriptionLifecycle: async (userId) => {
    const response = await apiClient.get(`/api/subscription-lifecycle/${userId}`);
    return response.data;
  }
};

/**
 * AI AGENTS APIs (PhosConversation)
 */
const PHOSCONVERSATION_BASE_URL = 'https://phosconversation.onrender.com';

// Create separate axios instance for PhosConversation API
const phosConversationClient = axios.create({
  baseURL: PHOSCONVERSATION_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for PhosConversation API
// Note: We don't auto-add user_id here because each API function handles it explicitly
// This prevents duplicate user_id fields which could cause backend validation errors
phosConversationClient.interceptors.request.use(
  (config) => {
    // Log request for debugging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('PhosConversation API Request:', {
        url: config.url,
        method: config.method,
        hasData: !!config.data
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const agentsAPI = {
  // Upload files and create agent
  uploadFiles: async (files, title, description, sourceLang, userId) => {
    if (!files || files.length === 0) {
      throw new Error('At least one file is required');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!title || !description || !sourceLang) {
      throw new Error('Title, description, and source language are required');
    }

    const formData = new FormData();
    // Append each file with the key 'files' (backend expects List[UploadFile])
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('title', title);
    formData.append('description', description);
    formData.append('source_lang', sourceLang);
    formData.append('user_id', userId);

    try {
      const response = await phosConversationClient.post('/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
        timeout: LONG_REQUEST_TIMEOUT
      });
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.detail || 'Failed to create agent');
      }
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const errorDetail = error.response.data?.detail || error.response.data?.message || 'Failed to create agent';
        throw new Error(errorDetail);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error: No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },

  // Start conversation with agent (text to text)
  startConversation: async (agentId, query, targetLang = 'en', userId) => {
    // Use URLSearchParams for form-urlencoded content type
    const params = new URLSearchParams();
    params.append('agent_id', agentId);
    params.append('query', query);
    params.append('target_lang', targetLang);
    // Note: user_id is not required by the endpoint, but we can include it if needed

    const response = await phosConversationClient.post('/agents/conversations', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  // Process voice input and return voice response (voice to voice)
  processVoice: async (audioFile, agentId, targetLang, userId) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('agent_id', agentId);
    formData.append('target_lang', targetLang);
    formData.append('user_id', userId);

    const response = await phosConversationClient.post('/process_voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  },

  // Process voice input and return text response (voice to text)
  processVoiceText: async (audioFile, agentId, targetLang, userId) => {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    formData.append('agent_id', agentId);
    formData.append('target_lang', targetLang);
    formData.append('user_id', userId);

    const response = await phosConversationClient.post('/process_voice_text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  },

  // Update agent's knowledge base
  updateAgentIndex: async (agentId, files, userId) => {
    const formData = new FormData();
    formData.append('agent_id', agentId);
    formData.append('user_id', userId);
    files.forEach(file => formData.append('files', file));

    const response = await phosConversationClient.post('/agents/update_index', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: LONG_REQUEST_TIMEOUT
    });
    return response.data;
  },

  // Get user agents
  getUserAgents: async (userId) => {
    const formData = new FormData();
    formData.append('user_id', userId);

    const response = await phosConversationClient.post('/user-agents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get agent info
  getAgentInfo: async (agentId, userId) => {
    const formData = new FormData();
    formData.append('agent_id', agentId);
    formData.append('user_id', userId);

    const response = await phosConversationClient.post('/agent-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await phosConversationClient.get('/health');
    return response.data;
  }
};

/**
 * UTILITY FUNCTIONS
 */

// Check if user can use endpoint before making request
export const checkUsageBeforeRequest = async (endpoint) => {
  try {
    const usageCheck = await subscriptionAPI.checkUsage(endpoint);
    if (!usageCheck.allowed) {
      throw new Error(usageCheck.message || 'Usage limit exceeded');
    }
    return true;
  } catch (error) {
    console.error('Usage check failed:', error);
    throw error;
  }
};

// Get user from localStorage
export const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.uid || user.userId; // Support both uid and userId
    console.log('🔍 getCurrentUser - Raw localStorage data:', localStorage.getItem('user'));
    console.log('👤 getCurrentUser - Parsed user:', user);
    console.log('🆔 getCurrentUser - User ID (uid):', user.uid);
    console.log('🆔 getCurrentUser - User ID (userId):', user.userId);
    console.log('🆔 getCurrentUser - Final User ID:', userId);
    return { ...user, userId: userId }; // Ensure userId is always available
  } catch (error) {
    console.error('Error getting current user:', error);
    return {};
  }
};

// Handle API errors with subscription awareness
export const handleAPIError = (error, endpoint) => {
  if (error.response?.status === 403) {
    const message = error.response.data?.message || 'Usage limit exceeded';
    return {
      type: 'subscription_limit',
      message,
      endpoint,
      shouldUpgrade: true
    };
  }
  
  return {
    type: 'general_error',
    message: error.message || 'An error occurred',
    endpoint,
    shouldUpgrade: false
  };
};

// Export all APIs as a single object
export default {
  subscription: subscriptionAPI,
  transcription: transcriptionAPI,
  video: videoAPI,
  translation: translationAPI,
  summarization: summarizationAPI,
  tts: ttsAPI,
  voiceToVoice: voiceToVoiceAPI,
  blog: blogAPI,
  system: systemAPI,
  agents: agentsAPI,
  utils: {
    checkUsageBeforeRequest,
    getCurrentUser,
    handleAPIError
  }
};
