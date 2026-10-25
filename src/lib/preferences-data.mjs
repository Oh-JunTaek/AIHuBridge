export function normalizePreferences(value) {
  return { lang: 'ko', theme: ['light', 'dark', 'system'].includes(value?.theme) ? value.theme : 'system' };
}
export function readPreferences(storage, key) {
  try { return normalizePreferences(JSON.parse(storage.getItem(key) || 'null')); }
  catch { return normalizePreferences(null); }
}
export function writePreferences(storage, key, preferences) {
  try { storage.setItem(key, JSON.stringify(normalizePreferences(preferences))); return true; }
  catch { return false; }
}
