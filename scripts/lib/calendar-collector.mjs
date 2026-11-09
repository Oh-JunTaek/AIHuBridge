import { createHash } from 'node:crypto';
import { isCalendarEvent, isWebUrl, retainedEvents } from '../../src/lib/calendar-rules.mjs';
import { noticeStatus, observeNotice, mergeCalendarHistory } from './calendar-history.mjs';
import { isAccessibleFromKorea } from '../../src/lib/calendar-audience.mjs';

// 공고를 제공할 수 있는 실제 RSS만 사용한다. 기술 글은 항목별로 다시 제외한다.
export const sources = [
  { id: 'kakao', name: '카카오 기술 블로그', url: 'https://tech.kakao.com/blog/feed/', lang: 'ko' },
  { id: 'naver-d2', name: 'NAVER D2', url: 'https://d2.naver.com/d2.atom', lang: 'ko' },
  { id: 'aws-korea', name: 'AWS 한국 블로그', url: 'https://aws.amazon.com/ko/blogs/korea/feed/', lang: 'ko' },
  { id: 'microsoft-korea', name: 'Microsoft 한국 소식', url: 'https://news.microsoft.com/source/asia/feed/?lang=ko', lang: 'ko' },
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

// 명시된 한 줄의 참여 방식·장소만 사용한다. 주최사 위치나 URL로 참석 방식을 추정하지 않는다.
export function explicitParticipation(text) {
  const mode = [...text.matchAll(/(?:진행|참여|참가|개최)\s*방식\s*[:：]\s*([^\n\r]{1,100})/g)].map((match) => match[1].trim());
  const places = [...text.matchAll(/(?:행사\s*장소|개최\s*장소|장소)\s*[:：]\s*([^\n\r]{1,120})/g)].map((match) => match[1].trim());
  const values = [...mode, ...places];
  const online = values.some((value) => /^(?:온라인|비대면|online|virtual)(?:\s*(?:$|진행|개최|[（(]))/i.test(value));
  const offline = mode.some((value) => /^(?:오프라인|현장|대면|offline|in.person)(?:$|[\s(（,·])/i.test(value));
  const ambiguous = values.some((value) => /(?:미정|미확인|추후|예정|여부|온라인\s*(?:불가|미지원)|온라인\s*(?:또는|혹은)|온라인\s*(?:\/|·|및|과|와)\s*오프라인|오프라인\s*(?:\/|·|및|과|와)\s*온라인)/i.test(value));
  if (ambiguous || (online && offline)) return { isOnline: null, location: null };
  if (online) return { isOnline: true, location: null };
  if (offline && places.length === 1 && !/@|https?:|이메일|연락처|전화/i.test(places[0])) return { isOnline: false, location: places[0] };
  return { isOnline: null, location: null };
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
    : /웨비나/.test(title) ? 'webinar' : /컨퍼런스|콘퍼런스|서밋|summit|conference/i.test(title) ? 'conference' : /세미나|포럼/.test(title) ? 'seminar'
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
  const eventDate = labelledDate(text, '(?:행사|교육|개최)\\s*(?:일시|일|시작일)');
  // 일시 라벨이 있지만 해석할 수 없으면 잘못 추정하지 않고 제외한다.
  if (eventDate && !eventDate.date) return null;
  if ((!deadline?.date && !eventDate?.date) || (deadline && !deadline.date) || (start && !start.date)) return null;
  const participation = explicitParticipation(text);
  const dateOnly = eventDate && !/\d{1,2}:\d{2}/.test(eventDate.evidence);
  const event = {
    id: createHash('sha256').update(`${source.id}:${item.link}`).digest('hex').slice(0, 12),
    sourceId: source.id, title, host: source.name, type, category: 'general',
    applicationStart: start?.date ?? null, applicationEnd: deadline?.date ?? null,
    eventStart: dateOnly ? null : eventDate?.date ?? null, eventEnd: null,
    ...(dateOnly ? { eventDate: new Date(Date.parse(eventDate.date) + 9 * 3600000).toISOString().slice(0, 10) } : {}),
    isOnline: participation.isOnline, location: participation.location, feeType: 'unknown', feeAmount: null, region: participation.location,
    url: item.link, status: noticeStatus(title) || 'recruiting', confirmedAt: null,
    publishedAt: isoOrNull(item.isoDate || item.pubDate), fetchedAt: new Date(now).toISOString(),
    timezone: 'Asia/Seoul', verification: 'rss-explicit', dateEvidence: [deadline?.evidence, eventDate?.evidence, participation.isOnline === true ? '진행 방식: 온라인' : participation.isOnline === false ? `진행 방식: 오프라인 · 장소: ${participation.location}` : null].filter(Boolean).join(' · '), lang: source.lang,
  };
  return isCalendarEvent(event) ? retainedEvents([event], now)[0] ?? null : null;
}

export async function collectCalendar(sourceList, parseFeed, previous = [], now = Date.now()) {
  const events = [], results = [];
  for (const source of sourceList) {
    try {
      const feed = await parseFeed(source.url);
      if (!Array.isArray(feed.items)) throw new Error('RSS 항목 배열이 없습니다');
      const items = feed.items.slice(0, 100);
      const old = previous.filter((event) => event.sourceId === source.id && isAccessibleFromKorea(event));
      const accepted = items.map((item) => {
        const previousEvent = old.find((event) => event.url === item.link);
        let event = rssItemToEvent(source, item, now);
        if (!event && previousEvent && noticeStatus(item.title)) {
          event = { ...previousEvent, title: item.title, scheduleUnknown: true, fetchedAt: new Date(now).toISOString() };
        }
        if (!event || !isAccessibleFromKorea({ ...event, dateEvidence: `${event.dateEvidence} ${item.contentSnippet ?? item.content ?? ''}` })) return null;
        return observeNotice(event, previousEvent, now);
      }).filter(Boolean);
      // 현재 목록에서 다시 확인된 공고가 부적격이거나 확인 불가라면 과거 상태를 재노출하지 않는다.
      const seenUrls = new Set(items.map((item) => item.link).filter(Boolean));
      const stored = mergeCalendarHistory(accepted, old.filter((event) => !seenUrls.has(event.url)), now);
      events.push(...stored);
      results.push({ id: source.id, status: 'success', received: items.length, accepted: accepted.length, retained: stored.length - accepted.length, rejected: items.length - accepted.length });
    } catch (error) {
      const retained = retainedEvents(previous.filter((event) => event.sourceId === source.id && isAccessibleFromKorea(event)), now);
      events.push(...retained);
      results.push({ id: source.id, status: 'error', retained: retained.length, error: String(error.message || error) });
    }
  }
  return { events: retainedEvents(events, now), sources: results };
}
