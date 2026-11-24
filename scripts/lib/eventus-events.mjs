import { createHash } from 'node:crypto';
import { retainedEvents } from '../../src/lib/calendar-rules.mjs';
import { isAccessibleFromKorea } from '../../src/lib/calendar-audience.mjs';
import { mergeCalendarHistory, noticeStatus, observeNotice } from './calendar-history.mjs';
import { readPublicText } from './rss.mjs';

export const eventusSource = {
  id: 'eventus-events',
  name: '이벤터스',
  url: 'https://api.event-us.kr/api/v1/engine/search',
  sourceUrl: 'https://event-us.kr/search?keyword=AI',
};

const canonicalUrl = (subdomain, id) => {
  if (!subdomain || !id) return null;
  return `https://event-us.kr/${subdomain}/event/${id}`;
};

const isoDateOrNull = (value) => {
  if (!value || typeof value !== 'string') return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
};

export function normalizeEventUsItem(rawItem, now = Date.now()) {
  if (!rawItem || typeof rawItem !== 'object') return null;
  const id = rawItem.id?.raw || rawItem.Id;
  const subdomain = rawItem.subdomain?.raw || rawItem.AppSubDomain;
  const title = String(rawItem.title?.raw || rawItem.Title || '').trim();
  if (!id || !title || !/(?:\bAI\b|인공지능|생성형|머신러닝|딥러닝|\bLLM\b|에이전트|\bRAG\b|프롬프트|데이터|Robotics)/i.test(title)) {
    return null;
  }
  const url = canonicalUrl(subdomain, id);
  if (!url) return null;

  const rawStart = rawItem.start_date?.raw || rawItem.StartDate;
  const rawClose = rawItem.close_date?.raw || rawItem.CloseDate;
  const startIso = isoDateOrNull(rawStart);
  const closeIso = isoDateOrNull(rawClose);
  if (!startIso) return null;

  const systemType = String(rawItem.event_system_type?.raw || rawItem.EventSystemType || '').toLowerCase();
  const isOnline = systemType === 'online' ? true : systemType === 'offline' ? false : systemType === 'hybrid' ? true : null;
  const isHybrid = systemType === 'hybrid';

  const areaDetail = rawItem.area_detail?.raw || rawItem.ProjectInfoArea_Detail;
  const area = rawItem.area?.raw || rawItem.ProjectInfoArea;
  const location = isOnline === true && !isHybrid ? null : String(areaDetail || area || '국내').trim();

  const minMoney = rawItem.min_money?.raw !== undefined ? Number(rawItem.min_money?.raw) : rawItem.GroupRequestGroupMoney !== undefined ? Number(rawItem.GroupRequestGroupMoney) : null;
  const feeType = minMoney === 0 ? 'free' : Number.isFinite(minMoney) && minMoney > 0 ? 'paid' : 'unknown';
  const feeAmount = feeType === 'paid' ? minMoney : null;

  const type = /해커톤|hackathon/i.test(title) ? 'hackathon'
    : /공모전|경진대회|competition/i.test(title) ? 'competition'
    : /부트캠프|bootcamp/i.test(title) ? 'bootcamp'
    : /워크숍|워크샵|workshop/i.test(title) ? 'workshop'
    : /웨비나|webinar/i.test(title) ? 'webinar'
    : /컨퍼런스|conference|summit|서밋/i.test(title) ? 'conference'
    : /세미나|포럼|seminar|forum/i.test(title) ? 'seminar'
    : /밋업|meetup|모임/i.test(title) ? 'meetup'
    : /교육|강좌|강의|training|리터러시/i.test(title) ? 'training' : 'other';

  const host = rawItem.app_title?.raw || rawItem.AppTitle || subdomain || eventusSource.name;
  const eventDate = startIso.slice(0, 10);
  const eventEndDate = closeIso ? closeIso.slice(0, 10) : null;

  const event = {
    id: `eventus-${id}`,
    sourceId: eventusSource.id,
    title,
    host,
    type,
    category: 'general',
    applicationStart: null,
    applicationEnd: null,
    eventStart: startIso,
    eventEnd: closeIso,
    eventDate,
    eventEndDate,
    isOnline,
    ...(isHybrid ? { attendanceMode: 'hybrid' } : {}),
    location,
    region: location,
    territory: 'domestic',
    feeType,
    feeAmount,
    url,
    status: noticeStatus(title) || 'recruiting',
    confirmedAt: null,
    publishedAt: null,
    fetchedAt: new Date(now).toISOString(),
    timezone: 'Asia/Seoul',
    verification: 'public-event',
    dateEvidence: `이벤터스 공개 일정: ${eventDate}${eventEndDate && eventEndDate !== eventDate ? ' ~ ' + eventEndDate : ''} (${isOnline ? '온라인' : location || '현장'})`,
    sourceUrl: eventusSource.sourceUrl,
    lang: 'ko',
    topics: [],
  };

  return isAccessibleFromKorea(event) ? retainedEvents([event], now)[0] ?? null : null;
}

export async function collectEventUsEvents(previous = [], now = Date.now(), fetchFn = null) {
  const old = previous.filter((event) => event.sourceId === eventusSource.id && isAccessibleFromKorea(event));
  try {
    const payload = {
      query: 'AI',
      page: { current: 1, size: 40 },
      filters: {
        all: [
          { state: 'Start' },
          { disclosure_status: 'open' },
          { is_ignore: 'false' },
        ],
      },
      sort: [
        { start_date: 'desc' },
      ],
    };

    let data;
    if (fetchFn) {
      data = await fetchFn(eventusSource.url, payload);
    } else {
      const response = await fetch(eventusSource.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`이벤터스 API 응답 오류 (HTTP ${response.status})`);
      data = await response.json();
    }

    if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
      throw new Error('이벤터스 행사 목록 형식이 변경되었습니다');
    }

    const items = data.results;
    const fresh = retainedEvents(items.map((item) => normalizeEventUsItem(item, now)).filter(Boolean), now)
      .map((event) => observeNotice(event, old.find((item) => item.id === event.id), now));

    const seenIds = new Set(fresh.map((e) => e.id));
    const events = mergeCalendarHistory(fresh, old.filter((event) => !seenIds.has(event.id)), now);

    return {
      events,
      source: {
        id: eventusSource.id,
        status: 'success',
        received: items.length,
        accepted: fresh.length,
        retained: events.length - fresh.length,
      },
    };
  } catch (error) {
    const events = retainedEvents(old, now);
    return {
      events,
      source: {
        id: eventusSource.id,
        status: 'error',
        retained: events.length,
        error: String(error.message || error),
      },
    };
  }
}
