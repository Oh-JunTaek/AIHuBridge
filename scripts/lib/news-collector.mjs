import { createHash } from 'node:crypto';
import { newsSources } from '../../src/lib/news-sources.mjs';
import { isNewsItem } from '../../src/lib/news-data.mjs';
import { newsFacets } from '../../src/lib/news-facets.mjs';
import { keepNews } from '../../src/lib/content-retention.mjs';

const keywords = ['GPT', 'Gemini', 'Claude', 'Llama', 'Open Source', '오픈소스', 'NVIDIA', 'Microsoft', 'Google', 'AWS', 'Meta', 'DeepLearning', 'Hugging Face', '연구', '정책', '규제', '안전'];
const text = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const aiRelevant = (item) => /\bAI\b|OpenAI|LLM|Gemini|GPT|Claude|인공지능|생성형|머신러닝|딥러닝|음성\s*모델|영상\s*모델/i.test(`${item?.title ?? ''} ${item?.contentSnippet ?? ''}`);

export function articleUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || /^(fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    return url.href;
  } catch { return null; }
}

function publication(item, now) {
  for (const value of [item.isoDate, item.pubDate]) {
    if (typeof value !== 'string' || !value.trim()) continue;
    const time = Date.parse(value);
    if (Number.isFinite(time) && time <= now + 300000) return new Date(time).toISOString();
  }
  return null;
}

function normalizeArticle(item, source, now) {
  if (!item || typeof item !== 'object') return null;
  const title = text(item.title);
  const url = articleUrl(item.link);
  const publishedAt = publication(item, now);
  // 날짜를 수집 시각으로 대체하거나 일반 제목의 뒷부분을 언론사로 간주해 자르지 않는다.
  if (!title || !url || !publishedAt) return null;
  // HTML 본문 대신 RSS 파서의 평문 설명만 사용한다.
  const rawExcerpt = text(item.contentSnippet || (source.kind === 'paper' ? item.summary : '')).replace(/<[^>]*>/g, ' ');
  const excerpt = source.titleOnly || source.id === 'koreagnews' ? '' : rawExcerpt.slice(0, 480);
  const summary = excerpt.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ').slice(0, 240);
  const paperCategories = [...new Set([...(Array.isArray(item.categories) ? item.categories : []), ...(item.feedCategories ?? [])]
    .map((value) => typeof value === 'string' ? value : value?.$?.term).filter((value) => typeof value === 'string' && /^(?:cs|stat|eess)\.[A-Za-z]+$/.test(value)))];
  const article = {
    id: createHash('sha256').update(url).digest('hex').slice(0, 12),
    title, url, source: source.name, sourceId: source.id, publishedAt,
    category: source.category, lang: source.lang,
    tags: keywords.filter((key) => title.toLowerCase().includes(key.toLowerCase())).slice(0, 3),
    excerpt, summary: summary || null, readMinutes: Math.max(1, Math.round((excerpt.length + title.length) / 220)),
    ...(source.kind === 'paper' ? { paperCategories } : {}),
  };
  if (['developer', 'media', 'community'].includes(source.kind) && source.category !== '오픈소스' && newsFacets(article).topics.policy.length) article.category = '정책/규제';
  return article;
}

export async function collectNews({ readFeed, previous = [], previousMeta = {}, sources = newsSources, now = Date.now() }) {
  if (!Array.isArray(previous)) previous = [];
  const all = [], retained = [], sourceResults = [];
  for (const source of sources) {
    const existing = previous.filter((item) => isNewsItem(item)
      && (item.sourceId ? item.sourceId === source.id : item.source === source.name
        || (source.id === 'openai' && item.source === 'OpenAI Blog') || (source.id === 'arxiv' && item.source === 'arXiv cs.AI')))
      .map((item) => ({ ...item, url: articleUrl(item.url), source: source.name, sourceId: source.id, lang: source.lang }))
      .filter((item) => item.url && keepNews(item, now));
    try {
      const feed = await readFeed(source.url);
      if (!Array.isArray(feed?.items)) throw new Error('RSS 항목 배열이 없습니다');
      const candidates = source.aiOnly ? feed.items.filter(aiRelevant) : feed.items;
      const valid = candidates.map((item) => normalizeArticle(item, source, now)).filter(Boolean);
      if (candidates.length && !valid.length) throw new Error('발행일·제목·URL이 유효한 기사가 없습니다');
      let unique = [...new Map(valid.map((item) => [item.url, item])).values()]
        .filter((item) => keepNews(item, now))
        .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
      // 회당 신규 수집량은 기존 출처 한도를 유지하고, 이미 보관한 자료에는 한도를 적용하지 않는다.
      const limit = source.limit ?? 8;
      if (source.kind === 'paper') {
        const groups = new Map();
        for (const item of unique) {
          const key = item.paperCategories?.[0] ?? 'other';
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(item);
        }
        unique = [];
        while (unique.length < limit && [...groups.values()].some((group) => group.length)) {
          for (const group of groups.values()) if (group.length && unique.length < limit) unique.push(group.shift());
        }
      } else unique = unique.slice(0, limit);
      all.push(...unique);
      // 정상 RSS에서 사라진 자료도 원문 게시일 기준 보관 기간 안에서는 검색할 수 있다.
      const urls = new Set(unique.map((item) => item.url));
      const archived = existing.filter((item) => !urls.has(item.url));
      retained.push(...archived);
      sourceResults.push({ id: source.id, status: 'success', count: unique.length,
        retained: archived.length,
        rejected: feed.items.length - valid.length, mode: feed.collectionMode ?? 'rss', lastSuccessAt: new Date(now).toISOString() });
    } catch (error) {
      const kept = existing;
      retained.push(...kept);
      sourceResults.push({ id: source.id, status: 'failed', count: 0, retained: kept.length,
        lastSuccessAt: (Array.isArray(previousMeta?.sourceResults) ? previousMeta.sourceResults : [])
          .find((result) => result?.id === source.id)?.lastSuccessAt ?? null,
        error: error instanceof Error ? error.message : 'RSS 수집 실패' });
    }
  }
  if (sourceResults.every((result) => result.status === 'failed')) throw new Error('뉴스 전체 출처 수집 실패: 이전 파일을 유지합니다');
  // 같은 원문 URL만 합친다. 제목이 같은 서로 다른 기사를 임의로 삭제하지 않는다.
  const byUrl = new Map();
  for (const item of [...all, ...retained]) if (!byUrl.has(item.url)) byUrl.set(item.url, item);
  const items = [...byUrl.values()]
    .map((item) => ({ ...item, id: createHash('sha256').update(item.url).digest('hex').slice(0, 12) }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  if (!items.length) throw new Error('뉴스 수집 결과가 0건이므로 이전 정상 데이터를 유지합니다');
  const unavailableSources = sourceResults.filter((result) => result.status === 'failed').map((result) => result.id);
  return { items, meta: { fetchedAt: new Date(now).toISOString(), total: items.length,
    status: unavailableSources.length ? 'partial' : 'success', sourceResults, unavailableSources,
    counts: Object.fromEntries(sources.map((source) => [source.id, items.filter((item) => item.sourceId === source.id).length])),
    summaryTiers: { rule: items.filter((item) => item.summary).length, excerpt: items.filter((item) => !item.summary).length },
    summaryMethod: 'rss-extract' } };
}
