// 수집기와 브라우저가 같은 기준으로 날짜·공개 가능 여부를 판단한다.
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const optionalDate = (value) => value === null || validDate(value);
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
// 시간대가 제공되지 않은 날짜는 가장 먼저 그 날짜를 맞는 UTC+14 기준부터 제외한다.
// 시각이 확인된 행사처럼 정확한 시작 시간으로 표시하지 않는다.
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
    && ['recruiting', 'scheduled', 'closed', 'completed', 'announced'].includes(event.status)
    && ['rss-explicit', 'manual', 'public-event'].includes(event.verification)
    && (event.timezone === 'Asia/Seoul' || (event.verification === 'public-event' && event.timezone === null))
    && optionalDate(event.applicationEnd)
    && (event.applicationEnd !== null || (event.verification === 'public-event' && validDay(event.eventDate)))
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
  if (!event.applicationEnd) return 'announced';
  if (event.eventEnd && Date.parse(event.eventEnd) <= now) return 'completed';
  if (Date.parse(event.applicationEnd) <= now) return 'closed';
  if (event.applicationStart && Date.parse(event.applicationStart) > now) return 'scheduled';
  return 'recruiting';
}
export function visibleEvents(events, now = Date.now()) {
  const seen = new Set();
  return events.filter(isCalendarEvent).filter((event) => {
    const key = new URL(event.url); key.hash = '';
    const url = key.href;
    if (seen.has(url) || seen.has(event.id) || (event.applicationEnd && Date.parse(event.applicationEnd) <= now)
      || (event.eventDate && firstPossibleStart(event.eventDate) <= now)
      || (event.eventStart && Date.parse(event.eventStart) <= now)) return false;
    seen.add(url); seen.add(event.id); return true;
  }).map((event) => ({ ...event, status: eventStatus(event, now) }))
    .sort((a, b) => orderTime(a) - orderTime(b));
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
