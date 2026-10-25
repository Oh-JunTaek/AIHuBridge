import { create } from 'zustand';
import type { CalendarEvent } from '../types';
import { deadlineLabel, isCalendarEvent, visibleEvents } from './calendar-rules.mjs';

interface CalendarMeta {
  fetchedAt: string;
  status: 'success' | 'partial' | 'cleaned';
}
interface CalendarState {
  events: CalendarEvent[];
  meta: CalendarMeta | null;
  status: 'idle' | 'loading' | 'error';
  loadEvents: () => Promise<void>;
  getDDay: typeof deadlineLabel;
}
export const useCalendarStore = create<CalendarState>((set) => ({
  events: [], meta: null, status: 'idle',
  getDDay: deadlineLabel,
  loadEvents: async () => {
    set({ status: 'loading' });
    try {
      const response = await fetch(import.meta.env.BASE_URL + 'data/calendar.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('행사 데이터 요청 실패');
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isCalendarEvent)) throw new Error('행사 데이터 형식 오류');
      // 메타 장애로 정상 행사 목록까지 비우지 않는다.
      const meta = await fetch(import.meta.env.BASE_URL + 'data/calendar-meta.json', { cache: 'no-cache' })
        .then(async (res) => {
          if (!res.ok) return null;
          const value = await res.json();
          return value && typeof value.fetchedAt === 'string' && Number.isFinite(Date.parse(value.fetchedAt))
            && ['success', 'partial', 'cleaned'].includes(value.status) ? value as CalendarMeta : null;
        }).catch(() => null);
      set({ events: visibleEvents(data), meta, status: 'idle' });
    } catch (error) {
      console.error('[허브릿지] 행사 정보를 불러오지 못했습니다', error);
      set({ status: 'error' });
    }
  },
}));
