import type { CalendarEvent } from '../types';
export function isWebUrl(value: unknown): boolean;
export function isCalendarEvent(value: unknown): value is CalendarEvent;
export function eventStatus(event: CalendarEvent, now?: number): CalendarEvent['status'];
export function visibleEvents(events: unknown[], now?: number): CalendarEvent[];
export function deadlineLabel(end: string | null, now?: number): { label: string; isPast: boolean } | null;
