import test from 'node:test';
import assert from 'node:assert/strict';
import { curatedCalendarEvents } from '../src/data/curated-calendar.mjs';
import { eventBoundary, isCalendarEvent, retainedEvents } from '../src/lib/calendar-rules.mjs';
import { isAccessibleFromKorea, matchesRegion } from '../src/lib/calendar-audience.mjs';
import { periodEvents } from '../src/lib/calendar-view.mjs';
import { selectPublishableEvents } from './lib/calendar-eligibility.mjs';

test('공식 확인한 국내 행사는 날짜 근거를 유지하며 서울 기본 달력에 나타난다', () => {
  const now = Date.parse('2026-11-09T11:30:00Z');
  assert.equal(curatedCalendarEvents.length, 3);
  assert.ok(curatedCalendarEvents.every(isCalendarEvent));
  const visible = retainedEvents(curatedCalendarEvents, now).filter((event) => isAccessibleFromKorea(event) && matchesRegion(event, '서울'));
  assert.equal(visible.length, 3);
  assert.ok(periodEvents(visible, '2026-11', '2026-11-12').some((event) => event.id === 'manual-intel-ai-summit-seoul-2026'));
  const nvidia = visible.find((event) => event.id === 'manual-nvidia-ai-day-seoul-2026');
  assert.equal(eventBoundary(nvidia), Date.parse('2026-11-10T15:00:00Z'));
  assert.equal(retainedEvents([nvidia], Date.parse('2026-12-11T15:00:00Z')).length, 0);
  assert.equal(visible.find((event) => event.id === 'manual-intel-ai-summit-seoul-2026').applicationEnd, null);
});

test('일일 수집은 기존에 보관한 해외 현장 행사도 최종 공개 결과에서 제외한다', () => {
  const base = curatedCalendarEvents[0];
  const korean = { ...base, id: 'seoul', url: 'https://example.org/seoul' };
  const overseas = { ...base, id: 'cairo', url: 'https://example.org/cairo', location: 'Cairo', region: 'Cairo', isOnline: false };
  const online = { ...base, id: 'virtual', url: 'https://example.org/virtual', location: 'Cairo', region: 'Cairo', isOnline: true };
  const ambiguous = { ...base, id: 'unknown', url: 'https://example.org/unknown', location: null, region: null, isOnline: null };
  assert.deepEqual(new Set(selectPublishableEvents([korean, overseas, online, ambiguous], Date.parse('2026-11-09T11:30:00Z')).map((event) => event.id)), new Set(['seoul', 'virtual']));
});
