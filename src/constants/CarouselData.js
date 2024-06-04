// Import images from the assets folder
import audioToTextImg from '../assets/text.jpg';
import textToTextImg from '../assets/text2.jpg';
import textToSpeechImg from '../assets/voice.jpg';
import voiceToVoiceImg from '../assets/text2text.jpg';

const carouselData = [
  {
    title: 'Convert Audio to Text',
    description: 'Transform your audio files, videos, and lectures into text effortlessly. Experience lightning-fast transcription for any audio-related content. Precision and speed at your fingertips!',
    imgPath: audioToTextImg, 
  },
  {
    title: 'Convert Text to Text',
    description: 'Unlock seamless text-to-text translations, including African languages, bridging communication gaps. Fast, accurate, and culturally nuanced for all your translation needs.',
    imgPath: textToTextImg,
  },
  {
    title: 'Convert Text to Speech',
    description: 'Tired of reading? Let your text speak for itself!  we turn documents, and more into professional audio. Listen on the go the possibilities are endless! Try it free today!',
    imgPath: textToSpeechImg,
  },
  {
    title: 'Voice to Voice Translation',
    description: 'World shrink with every word! Speak your mind, in any language. Our real-time voice translator breaks down barriers. Conversations flow naturally, wherever you go. Try it free!',
    imgPath: voiceToVoiceImg,
  },
];

export default carouselData;
