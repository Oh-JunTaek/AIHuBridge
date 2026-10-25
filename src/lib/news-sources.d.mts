import type { Category } from '../types';
export interface NewsSource { id: string; name: string; url: string; category: Category; lang: 'ko' | 'en' }
export const newsSources: readonly NewsSource[];
