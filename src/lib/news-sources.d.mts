import type { Category } from '../types';
export interface NewsSource { id: string; name: string; url: string; category: Category; lang: 'ko' | 'en'; origin: 'domestic' | 'overseas'; kind: 'developer' | 'community' | 'media' | 'paper' | 'government'; limit?: number; aiOnly?: boolean; aiTitleOnly?: boolean; titleOnly?: boolean; modelReleaseOnly?: boolean; titleKeywords?: readonly string[] }
export const newsSources: readonly NewsSource[];
