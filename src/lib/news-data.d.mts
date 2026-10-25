import type { NewsItem, NewsResult } from '../types';
export function isNewsItem(item: unknown): item is NewsItem;
export function isNewsArray(items: unknown): items is NewsItem[];
export function requestNews(baseUrl: string, fetcher?: typeof fetch, now?: number, signal?: AbortSignal): Promise<NewsResult>;
