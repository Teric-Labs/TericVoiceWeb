/**
 * In-memory cache for Media Vault / History tables.
 * Stale-while-revalidate: show cached data immediately, refresh quietly in background.
 */

const store = new Map();

export const CACHE_TTL_MS = 5 * 60 * 1000;
export const STALE_AFTER_MS = 45 * 1000;

export const VAULT_CACHE_KEYS = {
  ALL_ACTIVITY: 'all_activity',
  translation: 'translation',
  tts: 'tts',
  document_tts: 'document_tts',
  transcription: 'transcription',
  video: 'video',
  dubbing: 'dubbing',
  voiceover: 'voiceover',
  vox: 'vox',
  summary: 'summary',
};

function cacheKey(userId, sourceKey) {
  return `${userId}:${sourceKey}`;
}

export function getVaultCacheEntry(userId, sourceKey) {
  if (!userId || !sourceKey) return null;
  return store.get(cacheKey(userId, sourceKey)) || null;
}

export function setVaultCacheEntry(userId, sourceKey, data) {
  if (!userId || !sourceKey) return;
  store.set(cacheKey(userId, sourceKey), { data, fetchedAt: Date.now() });
}

export function invalidateVaultCache(userId, sourceKey = null) {
  if (!userId) return;
  if (sourceKey) {
    store.delete(cacheKey(userId, sourceKey));
    return;
  }
  const prefix = `${userId}:`;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

export function isCacheStale(entry, maxAgeMs = CACHE_TTL_MS) {
  if (!entry) return true;
  return Date.now() - entry.fetchedAt > maxAgeMs;
}

export function shouldBackgroundRefresh(entry) {
  if (!entry) return true;
  return Date.now() - entry.fetchedAt > STALE_AFTER_MS;
}

/**
 * @param {string} userId
 * @param {string} sourceKey
 * @param {() => Promise<*>} loader
 * @param {{ force?: boolean, silent?: boolean }} options
 */
export async function fetchVaultCached(userId, sourceKey, loader, { force = false } = {}) {
  const cached = getVaultCacheEntry(userId, sourceKey);

  if (!force && cached && !isCacheStale(cached)) {
    return { data: cached.data, fromCache: true, stale: shouldBackgroundRefresh(cached) };
  }

  const data = await loader();
  setVaultCacheEntry(userId, sourceKey, data);
  return { data, fromCache: false, stale: false };
}

export function readVaultCacheSync(userId, sourceKey) {
  const entry = getVaultCacheEntry(userId, sourceKey);
  if (!entry || isCacheStale(entry)) return null;
  return entry.data;
}
