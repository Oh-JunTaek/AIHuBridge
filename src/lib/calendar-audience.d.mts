import type { CalendarEvent } from '../types';
export function eventTerritory(event: CalendarEvent): 'domestic' | 'overseas' | 'unknown';
export function matchesAudience(event: CalendarEvent, audience?: string): boolean;
