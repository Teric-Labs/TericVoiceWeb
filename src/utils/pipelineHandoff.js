/**
 * Cross-studio pipeline handoff.
 *
 * Lets one studio/result view send data (text, languages, segments) to
 * another studio. Uses sessionStorage so the payload survives a route
 * change but is single-use — the target studio consumes and clears it on
 * mount. Keyed by target so a stale payload for studio A never leaks into
 * studio B.
 */
const KEY = 'avoices_pipeline_handoff';

/** Stash a payload for a target studio and return its route. */
export function sendToStudio(target, payload = {}) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ target, payload, ts: Date.now() }));
  } catch {
    /* sessionStorage unavailable — handoff silently degrades to plain nav */
  }
}

/** Consume (read + clear) the payload if it targets `target`. */
export function consumePipeline(target) {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.target !== target) return null;
    sessionStorage.removeItem(KEY);
    // Ignore payloads older than 5 minutes (avoids surprise prefills).
    if (data.ts && Date.now() - data.ts > 5 * 60 * 1000) return null;
    return data.payload || {};
  } catch {
    return null;
  }
}

export const STUDIO_ROUTES = {
  translate: '/dashboard/translate',
  synthesize: '/dashboard/synthesize',
  voiceover: '/dashboard/voiceovers',
  dubbing: '/dashboard/dubbing',
};
