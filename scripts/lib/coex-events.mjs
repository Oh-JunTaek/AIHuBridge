import { createHash } from 'node:crypto';
import { retainedEvents } from '../../src/lib/calendar-rules.mjs';
import { isAccessibleFromKorea } from '../../src/lib/calendar-audience.mjs';
import { mergeCalendarHistory, noticeStatus, observeNotice } from './calendar-history.mjs';
import { readPublicText } from './rss.mjs';

export const coexSource = {
  id: 'coex-events', name: '코엑스 행사 일정',
  url: 'https://www.coex.co.kr/event/full-schedules/?search_keyword=AI&list_type=LIST',
  sourceUrl: 'https://www.coex.co.kr/event/full-schedules/',
};

const decode = (value) => value.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
  if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
  const code = entity[2]?.toLowerCase() === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10);
  return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
}).replace(/\s+/g, ' ').trim();

const day = (value) => {
  const iso = value.replaceAll('.', '-');
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) && Number.isFinite(Date.parse(iso)) && new Date(iso).toISOString().slice(0, 10) === iso ? iso : null;
};
const field = (html, name) => {
  const found = html.match(new RegExp(`<[^>]+class=['"]${name}['"][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i'));
  return found ? decode(found[1]) : '';
};
const canonicalUrl = (value) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'www.coex.co.kr' || !url.pathname.startsWith('/exhibitions/')) return null;
    url.search = ''; url.hash = '';
    return url.href;
  } catch { return null; }
};

export function parseCoexList(html) {
  if (!/class=['"]BlogPost-list['"]/.test(html) || !/class=['"][^'"]*\bPagingList-current\b[^'"]*['"]/.test(html)) throw new Error('코엑스 행사 목록 형식이 변경되었습니다');
  const rows = [...html.matchAll(/<li\s+class=['"]BlogPost-item['"][^>]*>([\s\S]*?)<\/li>/gi)];
  if (!rows.length) throw new Error('코엑스 행사 목록을 읽지 못했습니다');
  const items = [];
  for (const [, row] of rows) {
    if (/class=['"]nopost['"]/.test(row) && /검색 결과가 없습니다/.test(row)) continue;
    const title = field(row, 'BlogEventItemCont-tit');
    const dates = field(row, 'BlogEventItemCont-date').match(/^(\d{4}\.\d{2}\.\d{2})\s*-\s*(\d{4}\.\d{2}\.\d{2})$/);
    const hall = field(row, 'BlogEventItemCont-hall');
    const href = row.match(/<a\s+href=['"]([^'"]+)['"][^>]*class=['"]BlogEventItem-link['"]/i)?.[1];
    if (!title || !dates || !hall || !href) throw new Error('코엑스 행사 항목 형식이 변경되었습니다');
    items.push({ title, start: day(dates[1]), end: day(dates[2]), hall, href: decode(href) });
  }
  const next = html.match(/<a\s+href=['"]([^'"]+)['"]\s+class=['"]PagingNextButton-link['"]/i)?.[1];
  let truncated = false;
  if (next) {
    const url = new URL(decode(next));
    truncated = Number(url.searchParams.get('var_page')) > 1;
  }
  return { items, truncated };
}

export function normalizeCoexEvent(item, now = Date.now()) {
  if (!item.start || !item.end || item.end < item.start || !/(?:\bAI\b|인공지능|생성형|machine learning|\bLLM\b)/i.test(item.title)) return null;
  const url = canonicalUrl(item.href);
  if (!url) return null;
  const type = /해커톤|hackathon/i.test(item.title) ? 'hackathon'
    : /워크숍|워크샵|workshop/i.test(item.title) ? 'workshop'
    : /세미나|seminar/i.test(item.title) ? 'seminar'
    : /컨퍼런스|conference|summit|서밋/i.test(item.title) ? 'conference'
    : /교육|강좌|training/i.test(item.title) ? 'training' : 'other';
  const event = {
    id: `coex-${createHash('sha256').update(url).digest('hex').slice(0, 16)}`,
    sourceId: coexSource.id, title: item.title, host: coexSource.name, type, category: 'general',
    applicationStart: null, applicationEnd: null, eventStart: null, eventEnd: null,
    eventDate: item.start, eventEndDate: item.end, isOnline: false,
    location: `서울 코엑스 · ${item.hall}`, region: '서울', territory: 'domestic',
    feeType: 'unknown', feeAmount: null, url, status: noticeStatus(item.title) || 'announced',
    confirmedAt: null, publishedAt: null, fetchedAt: new Date(now).toISOString(), timezone: 'Asia/Seoul',
    verification: 'public-event', dateEvidence: `코엑스 공개 일정: ${item.start} ~ ${item.end} · ${item.hall} (시간 미확인)`,
    sourceUrl: coexSource.sourceUrl, lang: 'ko', topics: [],
  };
  return isAccessibleFromKorea(event) ? retainedEvents([event], now)[0] ?? null : null;
}

export async function collectCoexEvents(previous = [], now = Date.now(), read = readPublicText) {
  const old = previous.filter((event) => event.sourceId === coexSource.id && isAccessibleFromKorea(event));
  try {
    const { items, truncated } = parseCoexList(await read(coexSource.url));
    const fresh = retainedEvents(items.map((item) => normalizeCoexEvent(item, now)).filter(Boolean), now)
      .map((event) => observeNotice(event, old.find((item) => item.id === event.id), now));
    const seenUrls = new Set(items.map((item) => canonicalUrl(item.href)).filter(Boolean));
    const events = mergeCalendarHistory(fresh, old.filter((event) => !seenUrls.has(event.url)), now);
    return { events, source: { id: coexSource.id, status: truncated ? 'partial' : 'success', received: items.length, accepted: fresh.length, retained: events.length - fresh.length, ...(truncated ? { error: '검색 결과 첫 페이지만 수집했습니다' } : {}) } };
  } catch (error) {
    const events = retainedEvents(old, now);
    return { events, source: { id: coexSource.id, status: 'error', retained: events.length, error: String(error.message || error) } };
  }
}
