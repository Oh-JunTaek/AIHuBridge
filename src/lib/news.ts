import type { NewsItem } from '../types';

import { requestNews, selectNews, type NewsFilters } from './news-data.mjs';

export function loadNewsResult(signal?: AbortSignal) {
  return requestNews(import.meta.env.BASE_URL, fetch, Date.now(), signal);
}

// 진단 화면 등 기존 목록 사용처를 위한 호환 함수.
export async function loadNews(): Promise<NewsItem[]> {
  return (await loadNewsResult()).items;
}

/** 화면에서 선택한 조건만 적용한다. 개인 기록이나 선호는 저장하지 않는다. */
export function filterNews(
  items: NewsItem[],
  opts: NewsFilters = {},
) {
  return selectNews(items, opts);
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
