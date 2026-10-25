import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UiPreferences } from '../types';
import type { Theme } from './i18n';
import { config } from './config';
import { normalizePreferences, readPreferences, writePreferences } from './preferences-data.mjs';

const Context = createContext({ preferences: normalizePreferences(null), setTheme: (_theme: Theme) => {}, persisted: true });
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UiPreferences>(() => {
    try { return readPreferences(localStorage, config.storageKey); }
    catch { return normalizePreferences(null); }
  });
  const [persisted, setPersisted] = useState(true);
  useEffect(() => {
    // 이전 학습·퀴즈·인증 체크 기록은 읽거나 이어받지 않고 화면 설정만 저장한다.
    try { setPersisted(writePreferences(localStorage, config.storageKey, preferences)); }
    catch { setPersisted(false); }
  }, [preferences]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = preferences.theme === 'dark' || (preferences.theme === 'system' && query.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.lang = 'ko';
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [preferences.theme]);
  const setTheme = (theme: Theme) => setPreferences(normalizePreferences({ theme }));
  return <Context.Provider value={{ preferences, setTheme, persisted }}>{children}</Context.Provider>;
}
export const usePreferences = () => useContext(Context);
