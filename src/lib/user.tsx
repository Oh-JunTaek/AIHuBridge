import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserState } from '../types';
import { config } from './config';

const empty: UserState = {
  lastActive: new Date().toISOString().slice(0, 10),
  streak: 0,
  completedCourseIds: [],
  earnedCertChecks: [],
  quizHistory: [],
  level: 1,
  xp: 0,
  lang: 'ko',
  theme: 'system',
};

function load(): UserState {
  try {
    const raw = localStorage.getItem(config.storageKey);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function save(state: UserState) {
  localStorage.setItem(config.storageKey, JSON.stringify(state));
}

const Ctx = createContext<{
  state: UserState;
  set: (updater: (s: UserState) => UserState) => void;
  mutate: (next: Partial<UserState>) => void;
}>({ state: empty, set: () => {}, mutate: () => {} });

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(load);

  const set = (updater: (s: UserState) => UserState) =>
    setState((s) => {
      const next = updater(s);
      save(next);
      return next;
    });

  const mutate = (next: Partial<UserState>) =>
    setState((s) => {
      const merged = { ...s, ...next, lastActive: today() };
      save(merged);
      return merged;
    });

  // 매일 방문 시 streak 갱신
  useEffect(() => {
    const todayStr = today();
    setState((s) => {
      const merged =
        s.lastActive === todayStr ? s : { ...s, lastActive: todayStr, streak: s.streak + 1 };
      save(merged);
      return merged;
    });
  }, []);

  // 🌙 언어 + 다크모드 ⇄ <html> 싱크 (런타임 즉시 반영)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const actual = state.theme === 'system' ? (mql.matches ? 'dark' : 'light') : state.theme;
      root.classList.toggle('dark', actual === 'dark');
      root.lang = state.lang ?? 'ko';
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, [state.theme, state.lang]);

  return <Ctx.Provider value={{ state, set, mutate }}>{children}</Ctx.Provider>;
}

export const useUser = () => useContext(Ctx);

function today() {
  return new Date().toISOString().slice(0, 10);
}
