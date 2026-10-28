import type { NewsItem } from '../types';
export const DAY: number;
export const NEWS_DEFAULT_DAYS: number;
export const EVENT_HISTORY_DAYS: number;
export function newsRetentionDays(item: NewsItem): number;
export function keepNews(item: NewsItem, now?: number): boolean;
