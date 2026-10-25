import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarEntries, entriesOnDay, koreaDate, monthDays, periodEvents, shiftMonth } from '../src/lib/calendar-view.mjs';

const event = { id: 'public', eventDate: '2026-10-30', eventEndDate: '2026-11-02', eventStart: null, eventEnd: null, applicationEnd: null };
test('달력은 일요일부터 42칸을 만들고 월 경계 날짜를 구분', () => {
  const days = monthDays('2026-10');
  assert.equal(days.length, 42);
  assert.equal(days[0].date, '2026-09-27');
  assert.equal(days.filter((day) => day.inMonth).length, 31);
  assert.equal(new Set(days.map((day) => day.date)).size, 42);
});
test('윤년 2월과 연도 전환 처리', () => {
  assert.equal(monthDays('2028-02').filter((day) => day.inMonth).length, 29);
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(shiftMonth('2027-01', -1), '2026-12');
});
test('한국시간 자정 경계와 현지 날짜를 서로 혼동하지 않음', () => {
  assert.equal(koreaDate(Date.parse('2026-10-25T15:00:00.000Z')), '2026-10-26');
  assert.equal(calendarEntries([event])[0].start, '2026-10-30');
});
test('행사 개최일과 신청 마감일을 별도 표시', () => {
  const timed = { id: 'timed', eventStart: '2026-11-05T15:00:00.000Z', eventEnd: null, applicationEnd: '2026-11-01T14:59:00.000Z' };
  const entries = calendarEntries([timed]);
  assert.equal(entries.find((entry) => entry.kind === 'event').start, '2026-11-06');
  assert.equal(entries.find((entry) => entry.kind === 'deadline').start, '2026-11-01');
});
test('여러 날 행사와 월 경계 일정을 빠짐없이 선택', () => {
  const entries = calendarEntries([event]);
  assert.equal(entriesOnDay(entries, '2026-11-01').length, 1);
  assert.equal(entriesOnDay(entries, '2026-11-03').length, 0);
  assert.equal(periodEvents([event], '2026-10').length, 1);
  assert.equal(periodEvents([event], '2026-11').length, 1);
  assert.equal(periodEvents([event], '2026-12').length, 0);
});
test('날짜 선택·전체 기간 전환과 같은 날의 중복 마커 처리', () => {
  const both = { ...event, applicationEnd: '2026-10-30T14:59:59.999Z' };
  assert.equal(entriesOnDay(calendarEntries([both]), '2026-10-30').length, 2);
  assert.equal(periodEvents([both], '2026-10', '2026-10-30').length, 1);
  assert.equal(periodEvents([both], '2026-10', '2026-10-29').length, 0);
  assert.equal(periodEvents([event], '2026-12', null, true).length, 1);
});
