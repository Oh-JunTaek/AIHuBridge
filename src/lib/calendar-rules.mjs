// 수집기와 브라우저가 같은 기준으로 날짜·공개 가능 여부를 판단한다.
import { DAY, EVENT_HISTORY_DAYS } from './content-retention.mjs';
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const optionalDate = (value) => value === null || validDate(value);
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
// 날짜만 있는 자료의 목록 정렬용 기준이다. 실제 시작 시각이나 보관 만료로 사용하지 않는다.
const firstPossibleStart = (day) => Date.parse(`${day}T00:00:00+14:00`);
const orderTime = (event) => event.applicationEnd ? Date.parse(event.applicationEnd)
  : event.eventStart ? Date.parse(event.eventStart) : firstPossibleStart(event.eventDate);
export function isWebUrl(value) {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}
export function isCalendarEvent(event) {
  if (!event || typeof event !== 'object') return false;
  return ['id', 'title', 'host', 'dateEvidence'].every((key) => text(event[key]))
    && !event.id.startsWith('sample-') && isWebUrl(event.url)
    && ['seminar', 'webinar', 'workshop', 'bootcamp', 'hackathon', 'competition', 'training', 'conference', 'meetup', 'other'].includes(event.type)
    && ['ai-core', 'ai-applied', 'data', 'mlops', 'general'].includes(event.category)
    && ['recruiting', 'scheduled', 'closed', 'completed', 'announced', 'cancelled', 'postponed'].includes(event.status)
    && (event.noticeObservedAt === undefined || validDate(event.noticeObservedAt))
    && (event.scheduleUnknown === undefined || typeof event.scheduleUnknown === 'boolean')
    && ['rss-explicit', 'manual', 'public-event'].includes(event.verification)
    && (event.timezone === 'Asia/Seoul' || (event.verification === 'public-event' && event.timezone === null))
    && optionalDate(event.applicationEnd)
    && (event.applicationEnd !== null || validDate(event.eventStart) || (event.verification === 'public-event' && validDay(event.eventDate)))
    && (event.scheduleUnknown !== true || ['cancelled', 'postponed'].includes(event.status))
    && (event.eventDate === undefined || validDay(event.eventDate))
    && (event.eventEndDate === undefined || event.eventEndDate === null || (validDay(event.eventEndDate) && event.eventEndDate >= event.eventDate))
    && (event.sourceUrl === undefined || isWebUrl(event.sourceUrl))
    && (event.topics === undefined || (Array.isArray(event.topics) && event.topics.every(text)))
    && ['applicationStart', 'eventStart', 'eventEnd', 'publishedAt', 'confirmedAt'].every((key) => optionalDate(event[key]))
    && validDate(event.fetchedAt)
    && (event.verification !== 'manual' || validDate(event.confirmedAt))
    && (event.isOnline === null || typeof event.isOnline === 'boolean')
    && ['unknown', 'free', 'paid'].includes(event.feeType)
    && (event.feeAmount === null || (Number.isFinite(event.feeAmount) && event.feeAmount >= 0))
    && (event.location === null || text(event.location))
    && (event.region === null || text(event.region))
    && (event.territory === undefined || ['domestic', 'overseas', 'unknown'].includes(event.territory))
    && (event.territoryBasis === undefined || event.territoryBasis === 'community-location')
    && ['ko', 'en', 'unknown'].includes(event.lang)
    && (!event.applicationStart || (event.applicationEnd && Date.parse(event.applicationStart) <= Date.parse(event.applicationEnd)))
    && (!event.eventStart || !event.applicationEnd || Date.parse(event.applicationEnd) <= Date.parse(event.eventStart))
    && (!event.eventEnd || (event.eventStart && Date.parse(event.eventStart) <= Date.parse(event.eventEnd)));
}
export function eventStatus(event, now = Date.now()) {
  if (['cancelled', 'postponed'].includes(event.status)) return event.status;
  if (eventBoundary(event) <= now && (event.eventStart || event.eventDate || event.eventEnd)) return 'completed';
  if (!event.applicationEnd) return 'announced';
  if (Date.parse(event.applicationEnd) <= now) return 'closed';
  if (event.applicationStart && Date.parse(event.applicationStart) > now) return 'scheduled';
  return 'recruiting';
}
// 날짜만 확인되면 종료 시각을 만들지 않고 보관·표시 전환 경계만 계산한다.
// 해외 날짜는 마지막 시간대(UTC-12)의 하루 끝까지 보수적으로 유지한다.
export function eventBoundary(event) {
  if (event.scheduleUnknown && event.noticeObservedAt) return Date.parse(event.noticeObservedAt);
  if (event.eventEnd) return Date.parse(event.eventEnd);
  if (event.eventDate) return Date.parse(`${event.eventEndDate || event.eventDate}T00:00:00-12:00`) + DAY;
  if (event.eventStart) {
    const day = new Date(Date.parse(event.eventStart) + 9 * 3600000).toISOString().slice(0, 10);
    return Date.parse(`${day}T00:00:00+09:00`) + DAY;
  }
  return Date.parse(event.applicationEnd);
}
export function eventIsPast(event, now = Date.now()) {
  // 취소·연기는 보관 기한 안에서 기본 화면에도 원문 상태를 유지한다.
  return !['cancelled', 'postponed'].includes(event.status) && eventBoundary(event) <= now;
}
export function retainedEvents(events, now = Date.now()) {
  const seen = new Set();
  return events.filter(isCalendarEvent).filter((event) => {
    const key = new URL(event.url); key.hash = '';
    const url = key.href;
    const boundary = Math.max(eventBoundary(event), Date.parse(event.noticeObservedAt || '') || -Infinity);
    if (seen.has(url) || seen.has(event.id) || !Number.isFinite(boundary) || boundary + EVENT_HISTORY_DAYS * DAY <= now) return false;
    seen.add(url); seen.add(event.id); return true;
  }).map((event) => ({ ...event, status: eventStatus(event, now) }))
    .sort((a, b) => orderTime(a) - orderTime(b));
}
export function visibleEvents(events, now = Date.now(), includePast = false) {
  return retainedEvents(events, now).filter((event) => includePast || !eventIsPast(event, now));
}
export function registrationMatches(event, filter, now = Date.now()) {
  const state = eventStatus(event, now);
  if (filter === 'open') return !eventIsPast(event, now) && state === 'recruiting';
  if (filter === 'closed') return state === 'closed';
  if (filter === 'cancelled' || filter === 'postponed') return state === filter;
  if (filter === 'known') return event.applicationEnd !== null;
  if (filter === 'unknown') return event.applicationEnd === null;
  return true;
}
export function eventStatusLabel(event, now = Date.now()) {
  const status = eventStatus(event, now);
  if (status === 'cancelled') return '취소 · 원문 확인';
  if (status === 'postponed') return '연기 · 변경 일정 원문 확인';
  if (status === 'completed') return event.eventEnd ? '행사 종료' : '지난 행사 · 종료 시각 미확인';
  if (status === 'closed') return event.eventStart || event.eventDate ? '신청 마감 · 개최 일정 유지' : '지난 공고 · 개최일 미확인';
  if (status === 'scheduled') return '신청 예정';
  return status === 'announced' ? '개최 일정 · 신청 마감 미확인' : '신청 마감 전 · 마감일 확인됨';
}
export function deadlineLabel(end, now = Date.now()) {
  if (!validDate(end)) return null;
  const deadline = Date.parse(end);
  if (deadline <= now) return { label: '모집 마감', isPast: true };
  // 남은 24시간 단위가 아닌 한국시간 달력 날짜 차이를 표시한다.
  const day = (time) => Math.floor((time + 9 * 3600000) / 86400000);
  const days = day(deadline) - day(now);
  return { label: days === 0 ? '오늘 마감' : `D-${days}`, isPast: false };
}
