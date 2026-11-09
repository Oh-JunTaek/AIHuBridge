import type { CalendarEvent } from '../types';
export function eventTerritory(event: CalendarEvent): 'domestic' | 'overseas' | 'unknown';
export function isAccessibleFromKorea(event: CalendarEvent): boolean;
export function matchesRegion(event: CalendarEvent, query: string): boolean;
