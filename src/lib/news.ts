import type { NewsItem } from '../types';

// 빌드 타임에선 fetch가 없고, 런타임(정적 배포 포함)엔 `public/data/news.json` 사용.
// Vite가 /data/news.json을 정적 에셋으로 서빙해 줍니다.
export async function loadNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`/data/news.json?ts=${Date.now()}`);
    if (!res.ok) return [];
    const json = (await res.json()) as NewsItem[];
    return json;
  } catch {
    return [];
  }
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
    (i) => !opts.category || i.category === opts.category,
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
