import test from 'node:test';
import assert from 'node:assert/strict';
import { collectGoogleEvents, normalizeGoogleEvent } from './lib/public-events.mjs';
import { isCalendarEvent, deadlineLabel, visibleEvents } from '../src/lib/calendar-rules.mjs';
const now = Date.parse('2026-10-25T12:00:00.000Z');
const item = { event_title: 'AI Agent Workshop', start_date: '2026-11-10', end_date: '2026-11-11',
  tags: 'AI, Gemini', audience_type: 'VIRTUAL', chapter_name: '공개 개발자 커뮤니티',
  links: { url: 'https://gdg.community.dev/events/details/test/?utm_source=map' }, venue_details: { venue_city: '서울' } };
test('공개 행사는 날짜만 보존하고 마감·시각·요금은 추정하지 않음', () => {
  const event = normalizeGoogleEvent('1', item, now);
  assert.equal(isCalendarEvent(event), true);
  assert.equal(event.eventDate, '2026-11-10');
  assert.equal(event.applicationEnd, null);
  assert.equal(event.eventStart, null);
  assert.equal(event.timezone, null);
  assert.equal(event.feeType, 'unknown');
  assert.equal(event.status, 'announced');
  assert.equal(event.type, 'workshop');
  assert.equal(event.lang, 'unknown');
  assert.equal(normalizeGoogleEvent('2', { ...item, event_title: 'AI Community Day' }, now).type, 'other');
  assert.equal(event.url.includes('utm_'), false);
  assert.equal(deadlineLabel(event.applicationEnd, now), null);
});
test('보관 기한이 지난 행사·비AI·허용되지 않은 링크·불가능한 날짜 제외', () => {
  for (const patch of [{ start_date: '2026-09-01', end_date: '2026-09-02' }, { event_title: '일반 취업 모임', tags: 'Career' },
    { links: { url: 'https://example.org/event' } }, { start_date: '2026-02-30' }, { end_date: '2026-11-09' },
    { event_title: 'AI Workshop - date TBD' }]) {
    assert.equal(normalizeGoogleEvent('1', { ...item, ...patch }, now), null);
  }
});
test('날짜만 공개된 여러 날 행사는 마지막 날짜의 하루 끝까지 유지', () => {
  const event = normalizeGoogleEvent('1', item, now);
  const earliest = Date.parse('2026-11-12T00:00:00-12:00');
  assert.equal(visibleEvents([event], earliest - 1).length, 1);
  assert.equal(visibleEvents([event], earliest).length, 0);
});
test('컨퍼런스·해커톤·밋업 유형 구분', () => {
  for (const [title, type] of [['AI DevFest', 'conference'], ['Gemini Hackathon', 'hackathon'], ['AI Meetup', 'meetup']]) {
    assert.equal(normalizeGoogleEvent('1', { ...item, event_title: title }, now).type, type);
  }
});
test('공개 데이터 구조 변경 시 이전의 유효한 향후 일정 보존', async () => {
  const previous = normalizeGoogleEvent('1', item, now);
  const result = await collectGoogleEvents([previous], now, async () => JSON.stringify({ error: { message: '서비스 오류' } }));
  assert.equal(result.source.status, 'error');
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].fetchedAt, previous.fetchedAt);
});
test('정상 목록의 중복 URL은 제거하고 제외 건수 기록', async () => {
  const result = await collectGoogleEvents([], now, async () => JSON.stringify({ 1: item, 2: item }));
  assert.equal(result.events.length, 1);
  assert.equal(result.source.received, 2);
  assert.equal(result.source.rejected, 1);
});
