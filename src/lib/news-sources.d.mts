import type { Category } from '../types';
export interface NewsSource { id: string; name: string; url: string; category: Category; lang: 'ko' | 'en'; origin: 'domestic' | 'overseas'; kind: 'developer' | 'community' | 'media' | 'paper'; limit?: number; aiOnly?: boolean; titleOnly?: boolean }
export const newsSources: readonly NewsSource[];
