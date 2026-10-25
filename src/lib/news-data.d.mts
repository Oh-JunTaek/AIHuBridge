import type { NewsItem, NewsResult } from '../types';
export function isNewsItem(item: unknown): item is NewsItem;
export function isNewsArray(items: unknown): items is NewsItem[];
export interface NewsFilters { category?: string; tag?: string; lang?: string; source?: string; query?: string; limit?: number }
export function selectNews(items: NewsItem[], filters?: NewsFilters): NewsItem[];
export function requestNews(baseUrl: string, fetcher?: typeof fetch, now?: number, signal?: AbortSignal): Promise<NewsResult>;
