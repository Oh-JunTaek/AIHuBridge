import { retainedEvents } from '../../src/lib/calendar-rules.mjs';

export function noticeStatus(title) {
  if (/not\s+(?:cancelled|canceled|postponed)|취소(?:되지|하지)|연기(?:되지|하지)|취소\s*없|연기\s*없/i.test(title)) return null;
  if (/^\s*[\[({]?\s*(?:cancelled\b|canceled\b|취소(?=[\s\])}:：-]|공지|안내|확정|됨|$))|(?:cancelled|canceled)\s*$|(?:행사|교육|워크숍|세미나|일정)\s*취소(?:\s*(?:안내|공지|확정))?\s*$/i.test(title)) return 'cancelled';
  if (/^\s*[\[({]?\s*(?:postponed\b|연기(?=[\s\])}:：-]|공지|안내|확정|됨|$))|postponed\s*$|(?:행사|교육|워크숍|세미나|일정)\s*연기(?:\s*(?:안내|공지|확정))?\s*$/i.test(title)) return 'postponed';
  return null;
}
export function observeNotice(event, previous, now) {
  const state = noticeStatus(event.title);
  if (!state) return event;
  return { ...event, status: state,
    noticeObservedAt: previous?.status === state && previous.noticeObservedAt ? previous.noticeObservedAt : new Date(now).toISOString() };
}
export function mergeCalendarHistory(fresh, previous, now) {
  const seenIds = new Set(fresh.map((event) => event.id));
  const seenUrls = new Set(fresh.map((event) => event.url));
  return retainedEvents([...fresh, ...previous.filter((event) => !seenIds.has(event.id) && !seenUrls.has(event.url))], now);
}
