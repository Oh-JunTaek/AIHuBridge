import { isWebUrl, retainedEvents } from '../../src/lib/calendar-rules.mjs';
import { noticeStatus, observeNotice, mergeCalendarHistory } from './calendar-history.mjs';
import { readPublicText } from './rss.mjs';
import { communityRegion } from './community-region.mjs';

export const googleEventsSource = {
  id: 'google-developer-events', name: 'Google 개발자 커뮤니티',
  url: 'https://developers.google.com/community/GDG_DevFest_Events.json',
  sourceUrl: 'https://developers.google.com/events',
};

const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

export function normalizeGoogleEvent(id, item, now = Date.now()) {
  if (!item || typeof item !== 'object' || typeof item.event_title !== 'string'
    || !validDay(item.start_date) || (item.end_date && (!validDay(item.end_date) || item.end_date < item.start_date))) return null;
  const title = item.event_title.trim();
  if (/(?:\bTBD\b|\bTBA\b|미정|다시보기)/i.test(title)) return null;
  const tags = typeof item.tags === 'string' ? item.tags : '';
  if (!/(?:\bAI\b|artificial intelligence|machine learning|Gemini|LLM|generative|agentic|인공지능|생성형)/i.test(`${title} ${tags}`)) return null;
  if (!isWebUrl(item.links?.url)) return null;
  const url = new URL(item.links.url);
  // 공식 공개 목록에 있는 커뮤니티 행사 링크만 사용한다.
  if (url.protocol !== 'https:' || url.hostname !== 'gdg.community.dev') return null;
  url.search = ''; url.hash = '';
  const type = /해커톤|hackathon|agent.?athon/i.test(title) ? 'hackathon'
    : /공모전|경진대회|competition|contest/i.test(title) ? 'competition'
    : /devfest|conference|summit|컨퍼런스/i.test(title) ? 'conference'
    : /bootcamp|부트캠프/i.test(title) ? 'bootcamp'
    : /workshop|워크숍|워크샵|lab\b/i.test(title) ? 'workshop'
    : /webinar|웨비나/i.test(title) ? 'webinar'
    : /meet.?up|모임/i.test(title) ? 'meetup'
    : /seminar|세미나|tech\s*talk|session|세션/i.test(title) ? 'seminar'
    : /training|course|교육|강좌/i.test(title) ? 'training' : 'other';
  const venue = item.venue_details;
  const location = typeof venue?.venue_city === 'string' && venue.venue_city.trim() ? venue.venue_city.trim() : null;
  const event = {
    id: `gdg-${id}`, sourceId: googleEventsSource.id, title,
    host: typeof item.chapter_name === 'string' && item.chapter_name.trim() ? item.chapter_name.trim() : googleEventsSource.name,
    type, category: 'general', applicationStart: null, applicationEnd: null,
    eventStart: null, eventEnd: null, eventDate: item.start_date, eventEndDate: item.end_date || null,
    isOnline: item.audience_type === 'VIRTUAL' ? true : item.audience_type === 'IN_PERSON' ? false : null,
    location, region: location, feeType: 'unknown', feeAmount: null,
    territory: communityRegion(item.chapter_latitude, item.chapter_longitude), territoryBasis: 'community-location',
    url: url.href, status: noticeStatus(title) || 'announced', confirmedAt: null, publishedAt: null,
    fetchedAt: new Date(now).toISOString(), timezone: null,
    verification: 'public-event', dateEvidence: `공개 행사 일정: ${item.start_date}${item.end_date && item.end_date !== item.start_date ? ' ~ ' + item.end_date : ''} (현지 날짜·시각 미확인)`,
    sourceUrl: googleEventsSource.sourceUrl, lang: 'unknown',
    topics: tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 8),
  };
  return retainedEvents([event], now)[0] ?? null;
}

export async function collectGoogleEvents(previous = [], now = Date.now(), read = readPublicText) {
  try {
    const data = JSON.parse(await read(googleEventsSource.url));
    if (!data || typeof data !== 'object' || Array.isArray(data) || !Object.values(data).every((value) => value && typeof value === 'object'
      && !Array.isArray(value) && typeof value.event_title === 'string' && typeof value.start_date === 'string')) {
      throw new Error('공개 행사 목록의 형식이 변경되었습니다');
    }
    const entries = Object.entries(data);
    const fresh = retainedEvents(entries.map(([id, item]) => {
      const old = previous.find((event) => event.id === `gdg-${id}`);
      let event = normalizeGoogleEvent(id, item, now);
      // 원문에 연기·취소만 있고 새 날짜가 없으면 기존 날짜를 변경 전 참고 위치로 유지한다.
      if (!event && old && noticeStatus(item.event_title)) {
        event = { ...old, title: item.event_title, scheduleUnknown: true, fetchedAt: new Date(now).toISOString() };
      }
      return event ? observeNotice(event, old, now) : null;
    }).filter(Boolean), now);
    const old = previous.filter((event) => event.sourceId === googleEventsSource.id);
    const events = mergeCalendarHistory(fresh, old, now);
    return { events, source: { id: googleEventsSource.id, status: 'success', received: entries.length, accepted: fresh.length, retained: events.length - fresh.length, rejected: entries.length - fresh.length } };
  } catch (error) {
    const events = retainedEvents(previous.filter((event) => event.sourceId === googleEventsSource.id), now);
    return { events, source: { id: googleEventsSource.id, status: 'error', retained: events.length, error: String(error.message || error) } };
  }
}
