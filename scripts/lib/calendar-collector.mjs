import { createHash } from 'node:crypto';
import { isCalendarEvent, isWebUrl, visibleEvents } from '../../src/lib/calendar-rules.mjs';

// 공고를 제공할 수 있는 실제 RSS만 사용한다. 기술 글은 항목별로 다시 제외한다.
export const sources = [
  { id: 'kakao', name: '카카오 기술 블로그', url: 'https://tech.kakao.com/blog/feed/', lang: 'ko' },
];
const DATE = '(20\\d{2})[.\\-/]\\s*(\\d{1,2})[.\\-/]\\s*(\\d{1,2})(?:일|\\.)?(?:[ \\t]+(\\d{1,2}):(\\d{2}))?';
const isoOrNull = (value) => value && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;

// 연도가 있는 명시적 날짜만 지원한다. 게시일·연도 없는 날짜·상대 날짜를 추정하지 않는다.
export function parseKoreanDate(match, endOfDay = false) {
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const y = Number(year), m = Number(month), d = Number(day);
  const hh = hour === undefined ? (endOfDay ? 23 : 0) : Number(hour);
  const mm = minute === undefined ? (endOfDay ? 59 : 0) : Number(minute);
  const ss = hour === undefined && endOfDay ? 59 : 0;
  if (m < 1 || m > 12 || d < 1 || hh > 23 || mm > 59
    || new Date(Date.UTC(y, m, 0)).getUTCDate() < d) return null;
  return new Date(Date.UTC(y, m - 1, d, hh - 9, mm, ss, ss === 59 ? 999 : 0)).toISOString();
}

function labelledDate(text, label, endOfDay = false) {
  const match = text.match(new RegExp(`(?:${label})\\s*[:：]\\s*${DATE}(?![\\d:/+~-])`, 'i'));
  if (!match) return null;
  const suffix = text.slice(match.index + match[0].length).split('\n')[0];
  // 지원하지 않는 시각·다른 시간대·축약 범위를 날짜만 있는 공고로 오인하지 않는다.
  if (/^\s*(?:[~∼～/+\-]|오전|오후|AM\b|PM\b|UTC\b|GMT\b|\d{1,2}\s*시|\d{1,2}[:.])/i.test(suffix)) {
    return { date: null, evidence: match[0] };
  }
  return { date: parseKoreanDate(match, endOfDay), evidence: match[0] };
}

export function rssItemToEvent(source, item, now = Date.now()) {
  const title = String(item.title || '').trim();
  const content = String(item.contentSnippet || item.content || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ');
  const text = `${title}\n${content}`;
  if (!isWebUrl(item.link) || !/(?:\bAI\b|인공지능|생성형|LLM|머신러닝|딥러닝|RAG|에이전트)/i.test(text)
    || !/(?:모집|신청|접수|등록)/.test(text)
    || /(?:다시보기|다시 보기|후기|회고|결과 발표|종료|마감되었습니다)/.test(title)) return null;
  const type = /해커톤/.test(title) ? 'hackathon' : /공모전|경진대회/.test(title) ? 'competition'
    : /부트캠프/.test(title) ? 'bootcamp' : /워크숍|워크샵/.test(title) ? 'workshop'
    : /웨비나/.test(title) ? 'webinar' : /세미나|컨퍼런스/.test(title) ? 'seminar'
    : /교육|강좌|강의/.test(title) ? 'training' : null;
  if (!type) return null;
  let deadline = labelledDate(text, '(?:신청|접수|등록)\\s*마감(?:일|일시)?', true);
  let start = labelledDate(text, '(?:신청|접수|등록)\\s*시작(?:일|일시)?');
  const period = text.match(new RegExp(`(?:신청|접수|모집)\\s*기간\\s*[:：]\\s*${DATE}\\s*[~∼～]\\s*${DATE}(?![\\d:/+~-])`));
  if (period) {
    start = { date: parseKoreanDate(period.slice(0, 6)), evidence: period[0] };
    const end = parseKoreanDate([period[0], ...period.slice(6)], true);
    if (deadline && deadline.date !== end) return null;
    const suffix = text.slice(period.index + period[0].length).split('\n')[0];
    if (/^\s*(?:오전|오후|AM\b|PM\b|UTC\b|GMT\b|\d{1,2}\s*시)/i.test(suffix)) return null;
    deadline = { date: end, evidence: period[0] };
  }
  if (!deadline?.date || (start && !start.date)) return null;
  const eventDate = labelledDate(text, '(?:행사|교육|개최)\\s*(?:일시|일|시작일)');
  // 일시 라벨이 있지만 해석할 수 없으면 잘못 추정하지 않고 제외한다.
  if (eventDate && !eventDate.date) return null;
  const event = {
    id: createHash('sha256').update(`${source.id}:${item.link}`).digest('hex').slice(0, 12),
    sourceId: source.id, title, host: source.name, type, category: 'general',
    applicationStart: start?.date ?? null, applicationEnd: deadline.date,
    eventStart: eventDate?.date ?? null, eventEnd: null,
    isOnline: null, location: null, feeType: 'unknown', feeAmount: null, region: null,
    url: item.link, status: 'recruiting', confirmedAt: null,
    publishedAt: isoOrNull(item.isoDate || item.pubDate), fetchedAt: new Date(now).toISOString(),
    timezone: 'Asia/Seoul', verification: 'rss-explicit', dateEvidence: deadline.evidence, lang: source.lang,
  };
  return isCalendarEvent(event) ? visibleEvents([event], now)[0] ?? null : null;
}

export async function collectCalendar(sourceList, parseFeed, previous = [], now = Date.now()) {
  const events = [], results = [];
  for (const source of sourceList) {
    try {
      const feed = await parseFeed(source.url);
      if (!Array.isArray(feed.items)) throw new Error('RSS 항목 배열이 없습니다');
      const items = feed.items.slice(0, 100);
      const accepted = items.map((item) => rssItemToEvent(source, item, now)).filter(Boolean);
      events.push(...accepted);
      results.push({ id: source.id, status: 'success', received: items.length, accepted: accepted.length, rejected: items.length - accepted.length });
    } catch (error) {
      const retained = visibleEvents(previous.filter((event) => event.sourceId === source.id), now);
      events.push(...retained);
      results.push({ id: source.id, status: 'error', retained: retained.length, error: String(error.message || error) });
    }
  }
  return { events: visibleEvents(events, now), sources: results };
}
