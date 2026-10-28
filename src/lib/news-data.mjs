import { newsFacets } from './news-facets.mjs';
import { keepNews, DAY } from './content-retention.mjs';
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const date = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const categories = ['업계/제품', '연구/논문', '정책/규제', '오픈소스', '블로그/개인', '언론'];

export function isNewsItem(item) {
  if (!item || typeof item !== 'object') return false;
  let url;
  try { url = new URL(item.url); } catch { return false; }
  return ['id', 'title', 'source'].every((key) => text(item[key]))
    && (item.lang === undefined || ['ko', 'en', 'unknown'].includes(item.lang))
    && (item.sourceId === undefined || text(item.sourceId))
    && (item.paperCategories === undefined || (Array.isArray(item.paperCategories) && item.paperCategories.every(text)))
    && ['http:', 'https:'].includes(url.protocol)
    && date(item.publishedAt) && categories.includes(item.category)
    && Array.isArray(item.tags) && item.tags.every(text)
    && typeof item.excerpt === 'string' && (item.summary === null || typeof item.summary === 'string')
    && Number.isFinite(item.readMinutes) && item.readMinutes >= 1;
}

export function isNewsArray(items) {
  return Array.isArray(items) && items.every(isNewsItem)
    && new Set(items.map((item) => item.id)).size === items.length
    && new Set(items.map((item) => item.url)).size === items.length;
}

export function selectNews(items, { category, tag, lang, source, query = '', limit, origin, modelsOnly, topicGroup, topic, openness, publication, paperKind, company, days, now = Date.now() } = {}) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const selected = items.filter((item) => {
    const facets = newsFacets(item);
    return keepNews(item, now) && (!days || Date.parse(item.publishedAt) >= now - days * DAY)
    && (!category || item.category === category)
    && (!tag || item.tags.includes(tag)) && (!lang || (item.lang ?? 'unknown') === lang)
    && (!source || item.source === source)
    && (!origin || facets.origin === origin) && (!modelsOnly || facets.topics.models.length > 0)
    && (!topic || (topicGroup && facets.topics[topicGroup]?.includes(topic)))
    && (!openness || facets.openness === openness) && (!publication || facets.publication === publication)
    && (!paperKind || facets.paperKinds.includes(paperKind)) && (!company || facets.companies.includes(company))
    && words.every((word) => `${item.title} ${item.source} ${item.excerpt} ${item.tags.join(' ')}`.toLocaleLowerCase().includes(word));
  })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return limit ? selected.slice(0, limit) : selected;
}

export async function requestNews(baseUrl, fetcher = fetch, now = Date.now(), signal) {
  const timeout = AbortSignal.timeout(10000);
  const options = { cache: 'no-cache', signal: signal ? AbortSignal.any([signal, timeout]) : timeout };
  // 메타 정보 장애로 정상적으로 가져온 자료까지 숨기지 않는다.
  const metaRequest = Promise.resolve().then(() => fetcher(`${baseUrl}data/meta.json`, options))
    .then((response) => response.ok ? response.json() : null).catch(() => null);
  let items;
  try {
    const response = await fetcher(`${baseUrl}data/news.json`, options);
    if (!response.ok) throw new Error(`소식을 가져오지 못했습니다 (HTTP ${response.status})`);
    try { items = await response.json(); } catch { throw new Error('소식 데이터가 올바른 JSON이 아닙니다'); }
    if (!isNewsArray(items)) throw new Error('소식 데이터 형식이 올바르지 않습니다');
  } catch (error) {
    return { status: 'error', items: [], fetchedAt: null, stale: true, warning: null,
      error: error instanceof Error && error.message.startsWith('소식') ? error.message : '서버에 연결하지 못했습니다. 연결을 확인하고 다시 시도해 주세요' };
  }
  const meta = await metaRequest;
  const validMeta = meta && date(meta.fetchedAt) && meta.total === items.length && Date.parse(meta.fetchedAt) <= now + 300000;
  const fetchedAt = validMeta ? meta.fetchedAt : null;
  const stale = !fetchedAt || now - Date.parse(fetchedAt) > 36 * 3600000;
  const warnings = [];
  if (!validMeta) warnings.push('마지막 수집 시각을 확인하지 못했습니다. 소식 목록은 정상적으로 가져왔습니다');
  else {
    if (stale) warnings.push('수집 후 36시간 이상 지났습니다. 최신 정보는 원문에서 확인해 주세요');
    if (meta.status === 'partial' || (Array.isArray(meta.unavailableSources) && meta.unavailableSources.length)) {
      warnings.push('일부 출처를 갱신하지 못했습니다. 이전 자료는 원문 게시일 기준 보관 기간 안에서 유지하며, 최신 변경은 원문에서 확인하세요');
    }
  }
  const warning = warnings.join(' · ') || null;
  return { status: items.length ? 'success' : 'empty', items, fetchedAt, stale, warning, error: null };
}
