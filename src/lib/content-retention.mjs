import { newsFacets } from './news-facets.mjs';

export const DAY = 86400000;
export const NEWS_DEFAULT_DAYS = 7;
export const EVENT_HISTORY_DAYS = 30;

// 중복 분류에서는 자료 성격을 우선한다. 수집일로 보관 기간을 연장하지 않는다.
export function newsRetentionDays(item) {
  const facets = newsFacets(item);
  if (facets.publication === 'paper' || item.category === '연구/논문' || item.paperCategories?.length) return 180;
  return facets.topics.models.length ? 90 : 30;
}
export function keepNews(item, now = Date.now()) {
  const published = Date.parse(item.publishedAt);
  return Number.isFinite(published) && published <= now + 300000
    && published + newsRetentionDays(item) * DAY > now;
}
