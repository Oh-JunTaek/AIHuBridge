import test from 'node:test';
import assert from 'node:assert/strict';
import { curatedCalendarEvents } from '../src/data/curated-calendar.mjs';
import { eventBoundary, isCalendarEvent, retainedEvents } from '../src/lib/calendar-rules.mjs';
import { matchesAudience, matchesRegion } from '../src/lib/calendar-audience.mjs';
import { periodEvents } from '../src/lib/calendar-view.mjs';

test('공식 확인한 국내 행사는 날짜 근거를 유지하며 서울 기본 달력에 나타난다', () => {
  const now = Date.parse('2026-11-09T11:30:00Z');
  assert.equal(curatedCalendarEvents.length, 3);
  assert.ok(curatedCalendarEvents.every(isCalendarEvent));
  const visible = retainedEvents(curatedCalendarEvents, now).filter((event) => matchesAudience(event, 'domestic') && matchesRegion(event, '서울'));
  assert.equal(visible.length, 3);
  assert.ok(periodEvents(visible, '2026-11', '2026-11-12').some((event) => event.id === 'manual-intel-ai-summit-seoul-2026'));
  const nvidia = visible.find((event) => event.id === 'manual-nvidia-ai-day-seoul-2026');
  assert.equal(eventBoundary(nvidia), Date.parse('2026-11-10T15:00:00Z'));
  assert.equal(retainedEvents([nvidia], Date.parse('2026-12-11T15:00:00Z')).length, 0);
  assert.equal(visible.find((event) => event.id === 'manual-intel-ai-summit-seoul-2026').applicationEnd, null);
});
