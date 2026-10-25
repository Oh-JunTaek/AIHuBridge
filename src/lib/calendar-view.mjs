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
      const end = event.eventEndDate || (event.eventEnd ? koreaDate(Date.parse(event.eventEnd)) : start);
      entries.push({ event, start, end, kind: 'event' });
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
export function periodEvents(events, month, selectedDay = null, all = false) {
  if (all && !selectedDay) return events;
  const first = selectedDay || `${month}-01`;
  const last = selectedDay || new Date(Date.parse(`${shiftMonth(month, 1)}-01T00:00:00.000Z`) - 86400000).toISOString().slice(0, 10);
  const ids = new Set(calendarEntries(events).filter((entry) => entry.start <= last && entry.end >= first).map((entry) => entry.event.id));
  return events.filter((event) => ids.has(event.id));
}
