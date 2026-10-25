import type { CalendarEvent } from '../types';
export interface CalendarEntry { event: CalendarEvent; start: string; end: string; kind: 'event' | 'deadline' }
export function koreaDate(time?: number): string;
export function shiftMonth(month: string, amount: number): string;
export function monthDays(month: string): { date: string; day: number; inMonth: boolean }[];
export function calendarEntries(events: CalendarEvent[]): CalendarEntry[];
export function entriesOnDay(entries: CalendarEntry[], day: string): CalendarEntry[];
export function periodEvents(events: CalendarEvent[], month: string, selectedDay?: string | null, all?: boolean): CalendarEvent[];
