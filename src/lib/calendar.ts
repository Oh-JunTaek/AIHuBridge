/**
 * AI 교육·행사 모집 캘린더 스토어 (F-002)
 * ─────────────────────────────────────────────
 * - public/data/calendar.json 로드
 * - D-day 계산 (마감일 기준)
 * - 필터링: status, type, isOnline, region, category
 */
import { create } from 'zustand';
import type { CalendarEvent } from '../types';

const CALENDAR_URL = `${import.meta.env.BASE_URL}data/calendar.json`;

interface CalendarState {
  events: CalendarEvent[];
  status: 'idle' | 'loading' | 'error';
  loadEvents: () => Promise<void>;
  /** 마감일 기준 D-day 계산 */
  getDDay: (end: string | null) => { label: string; isPast: boolean } | null;
  /** 필터링 */
  filter: (opts: FilterOpts) => CalendarEvent[];
}

interface FilterOpts {
  status?: string[];
  type?: string[];
  isOnline?: boolean;
  region?: string;
  category?: string;
  search?: string;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  status: 'idle',
  loadEvents: async () => {
    set({ status: 'loading' });
    try {
      const res = await fetch(CALENDAR_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as CalendarEvent[];
      set({ events: json, status: 'idle' });
    } catch (e) {
      console.error('[HuBridge] 캘린더 로드 실패', e);
      set({ events: [], status: 'error' });
    }
  },

  getDDay: (end: string | null) => {
    if (!end) return null;
    const d = new Date(end);
    if (Number.isNaN(d.getTime())) return null;
    const ms = d.getTime() - Date.now();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return { label: `D-${days}`, isPast: false };
    } else if (days === 0) {
      return { label: '마감임박', isPast: false };
    } else {
      return { label: `마감 ${Math.abs(days)}일 지남`, isPast: true };
    }
  },

  filter: (opts: FilterOpts = {}) => {
    const { events } = get();
    return events.filter((e) => {
      if (opts.status && !opts.status.includes(e.status)) return false;
      if (opts.type && !opts.type.includes(e.type)) return false;
      if (opts.isOnline !== undefined && e.isOnline !== opts.isOnline) return false;
      if (opts.region && e.region !== opts.region) return false;
      if (opts.category && e.category !== opts.category) return false;
      if (opts.search) {
        const q = opts.search.toLowerCase();
        if (!e.title.toLowerCase().includes(q) && !e.host.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  },
}));
