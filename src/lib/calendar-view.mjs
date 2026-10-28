export function koreaDate(time = Date.now()) {
  return new Date(time + 9 * 3600000).toISOString().slice(0, 10);
}
export function shiftMonth(month, amount) {
  const date = new Date(`${month}-01T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 7);
}
export function monthDays(month) {
  const first = new Date(`${month}-01T00:00:00.000Z`);
  const offset = first.getUTCDay();
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(first.getTime() + (index - offset) * 86400000).toISOString().slice(0, 10);
    return { date, day: Number(date.slice(8)), inMonth: date.startsWith(month) };
  });
}
export function calendarEntries(events) {
  return events.flatMap((event) => {
    const entries = [];
    const start = event.eventDate || (event.eventStart ? koreaDate(Date.parse(event.eventStart)) : null);
    if (start) {
      entries.push({ event, start, end: start, kind: 'event' });
    }
    const end = event.eventEndDate || (event.eventEnd ? koreaDate(Date.parse(event.eventEnd)) : null);
    if (end) {
      entries.push({ event, start: end, end, kind: 'end' });
    }
    if (event.applicationStart) {
      const opening = koreaDate(Date.parse(event.applicationStart));
      entries.push({ event, start: opening, end: opening, kind: 'application' });
    }
    if (event.applicationEnd) {
      const deadline = koreaDate(Date.parse(event.applicationEnd));
      entries.push({ event, start: deadline, end: deadline, kind: 'deadline' });
    }
    return entries;
  });
}
export function entriesOnDay(entries, day) {
  return entries.filter((entry) => entry.start <= day && entry.end >= day);
}
// 같은 행사의 여러 표시는 유형별 건수에 한 번만 반영한다.
export function groupDayEntries(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const type = entry.event.type;
    if (!groups.has(type)) groups.set(type, new Map());
    const events = groups.get(type);
    if (!events.has(entry.event.id)) events.set(entry.event.id, entry.event);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([type, events]) => ({ type, events: [...events.values()], count: events.size }));
}
export function periodEvents(events, month, selectedDay = null, all = false) {
  if (all && !selectedDay) return events;
  const first = selectedDay || `${month}-01`;
  const last = selectedDay || new Date(Date.parse(`${shiftMonth(month, 1)}-01T00:00:00.000Z`) - 86400000).toISOString().slice(0, 10);
  const ids = new Set(calendarEntries(events).filter((entry) => entry.start <= last && entry.end >= first).map((entry) => entry.event.id));
  return events.filter((event) => ids.has(event.id));
}
