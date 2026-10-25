import type { NewsItem } from '../types';

import { requestNews } from './news-data.mjs';

export function loadNewsResult(signal?: AbortSignal) {
  return requestNews(import.meta.env.BASE_URL, fetch, Date.now(), signal);
}

// 진단 화면 등 기존 목록 사용처를 위한 호환 함수.
export async function loadNews(): Promise<NewsItem[]> {
  return (await loadNewsResult()).items;
}

/** 오늘 날짜 기준 최신 뉴스 위주. 카테고리 필터 지원 */
export function filterNews(
  items: NewsItem[],
  opts: { category?: string; tag?: string; limit?: number } = {},
) {
  const withDate = items.filter((i) => !!i.publishedAt);
  withDate.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const out = withDate.filter(
    (i) => (!opts.category || i.category === opts.category) && (!opts.tag || i.tags.includes(opts.tag)),
  );
  return opts.limit ? out.slice(0, opts.limit) : out;
}

/** 읽는데 걸리는 분 시간 계산 (기준: 220자/분) */
export function readMinutes(excerpt: string, title = ''): number {
  const chars = (excerpt?.length ?? 0) + (title.length ?? 0);
  return Math.max(1, Math.round(chars / 220));
}

export const CATEGORY_LABEL = {
  '업계/제품': '업계·제품',
  '연구/논문': '연구·논문',
  '정책/규제': '정책·규제',
  '오픈소스': '오픈소스',
  '언론': '언론',
  '블로그/개인': '블로그',
};
