import type { NewsItem } from '../types';
export function groupNews(items: NewsItem[]): { primary: NewsItem; related: NewsItem[] }[];
