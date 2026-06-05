export const SITE_NAME = 'Avoices';
export const SITE_TAGLINE = 'AI Voice Platform for Africa & Beyond';

export const SITE_URL = (
  process.env.REACT_APP_SITE_URL || 'https://voices.phosaico.com'
).replace(/\/$/, '');

export const DEFAULT_DESCRIPTION =
  'Avoices is an AI voice platform for transcription, translation, text-to-speech, video dubbing, voiceovers, and summarization in 50+ languages — including Luganda, Swahili, Amharic, and Yoruba.';

export const DEFAULT_KEYWORDS = [
  'AI voice platform',
  'speech to text',
  'text to speech',
  'video dubbing',
  'voiceover',
  'African languages',
  'Luganda transcription',
  'Swahili TTS',
  'voice translation',
  'audio transcription',
  'Avoices',
  'PhosAI',
].join(', ');

export const DEFAULT_OG_IMAGE = `${SITE_URL}/microphone.png`;

export const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/get-started', changefreq: 'monthly', priority: '0.9' },
  { path: '/pricing', changefreq: 'weekly', priority: '0.9' },
  { path: '/documentation', changefreq: 'monthly', priority: '0.8' },
  { path: '/language-support', changefreq: 'monthly', priority: '0.8' },
];

export const PAGE_SEO = {
  '/': {
    title: 'Avoices — AI Voice Platform for Transcription, Dubbing & TTS',
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    jsonLd: 'home',
  },
  '/get-started': {
    title: 'Get Started — Avoices AI Voice Platform',
    description:
      'Create your free Avoices account and start transcribing, translating, synthesizing speech, dubbing videos, and building voiceovers in minutes.',
    keywords: 'Avoices signup, AI voice free trial, speech AI platform',
  },
  '/pricing': {
    title: 'Pricing — Avoices AI Voice Plans',
    description:
      'Compare Avoices pricing plans for transcription, translation, text-to-speech, video dubbing, voiceovers, and enterprise voice AI workloads.',
    keywords: 'Avoices pricing, AI voice plans, transcription credits, TTS pricing',
  },
  '/documentation': {
    title: 'Documentation — Avoices Developer & Product Guide',
    description:
      'Explore Avoices product documentation and API guides for transcription, translation, synthesis, dubbing, voiceovers, and conversational AI.',
    keywords: 'Avoices API, voice AI documentation, speech API guide',
  },
  '/language-support': {
    title: 'Language Support — 50+ Languages on Avoices',
    description:
      'Avoices supports 50+ languages for transcription, translation, and text-to-speech — with strong coverage for African languages and global locales.',
    keywords: 'African language AI, Luganda, Swahili, Amharic, Yoruba, multilingual speech',
  },
};

export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  email: 'phosaico@gmail.com',
  sameAs: [
    'https://x.com/phosai',
  ],
};

export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/documentation?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const SOFTWARE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free trial available',
  },
  featureList: [
    'Speech transcription',
    'Video transcription',
    'Text translation',
    'Text-to-speech synthesis',
    'Video dubbing',
    'Voiceover narration',
    'Document summarization',
    'Voice-to-voice translation',
    'Conversational AI agents',
  ],
};
