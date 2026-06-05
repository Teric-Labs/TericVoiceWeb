/**
 * Client-side credit estimator — mirrors backend CREDIT_RATES
 * (ASRAPI/utils/credit_manager.py). Used to show an estimate before
 * a job is submitted. The backend remains the source of truth.
 */
export const CREDIT_RATES = {
  transcription: 1.0,      // per minute of audio
  video_extraction: 1.5,  // per minute of video
  text_translation: 0.0005, // per character
  doc_translation: 5.0,    // per page
  summarization: 2.0,      // per job
  tts: 0.001,              // per character
  voice_cloning: 10.0,     // per job
  voice_to_voice: 2.0,     // per minute
  video_dubbing: 8.0,      // per minute of video
  voiceover_batch: 0.002,  // per character
};

/** Round like the backend (2 dp). */
export function estimateCredits(service, quantity) {
  const rate = CREDIT_RATES[service] ?? 1.0;
  const cost = rate * (Number(quantity) || 0);
  return Math.round(cost * 100) / 100;
}

/** Human-friendly estimate string, e.g. "~2.40 credits". */
export function formatEstimate(service, quantity, { min = 0 } = {}) {
  const cost = Math.max(estimateCredits(service, quantity), min);
  if (cost <= 0) return null;
  return `~${cost.toFixed(2)} credits`;
}
