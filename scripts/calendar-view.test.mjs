import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarEntries, entriesOnDay, groupDayEntries, koreaDate, monthDays, periodEvents, shiftMonth } from '../src/lib/calendar-view.mjs';

const event = { id: 'public', eventDate: '2026-10-30', eventEndDate: '2026-11-02', eventStart: null, eventEnd: null, applicationEnd: null };
test('유형별 뱃지는 같은 행사를 중복 계산하지 않고 추가 건수를 묶음', () => {
  const hackathon = { ...event, type: 'hackathon' };
  const another = { ...hackathon, id: 'second' };
  const seminar = { ...event, id: 'seminar', type: 'seminar' };
  const groups = groupDayEntries([hackathon, another, hackathon, seminar].map((event) => ({ event })));
  assert.equal(groups.length, 2);
  assert.equal(groups.find((group) => group.type === 'hackathon').count, 2);
  assert.equal(groups.find((group) => group.type === 'seminar').count, 1);
  assert.deepEqual(groupDayEntries([]), []);
});
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
test('여러 날 행사는 양 끝만 표시하고 월·날짜 선택도 같은 기준 적용', () => {
  const entries = calendarEntries([event]);
  assert.equal(entriesOnDay(entries, '2026-10-30').length, 1);
  assert.equal(entriesOnDay(entries, '2026-11-01').length, 0);
  assert.equal(entriesOnDay(entries, '2026-11-02').length, 1);
  assert.equal(entriesOnDay(entries, '2026-11-03').length, 0);
  assert.equal(periodEvents([event], '2026-10').length, 1);
  assert.equal(periodEvents([event], '2026-11').length, 1);
  assert.equal(periodEvents([event], '2026-12').length, 0);
  assert.equal(periodEvents([event], '2026-11', '2026-11-01').length, 0);
});
test('신청 시작·마감·개최·종료 중 확인된 날짜만 표시', () => {
  const item = { ...event, applicationStart: '2026-10-01T00:00:00+09:00', applicationEnd: '2026-10-05T23:59:00+09:00', eventDate: '2026-10-07', eventEndDate: null };
  const entries = calendarEntries([item]);
  assert.deepEqual(entries.map((entry) => entry.start).sort(), ['2026-10-01', '2026-10-05', '2026-10-07']);
  assert.equal(entriesOnDay(entries, '2026-10-03').length, 0);
  assert.equal(calendarEntries([{ ...item, applicationStart: null, applicationEnd: null }]).length, 1);
});
test('장기 교육은 중간 달 전체를 점유하지 않으며 전체 기간 목록에서는 검색 가능', () => {
  const long = { ...event, eventDate: '2025-01-01', eventEndDate: '2027-01-01' };
  assert.equal(periodEvents([long], '2026-10').length, 0);
  assert.equal(periodEvents([long], '2026-10', null, true).length, 1);
});
test('날짜 선택·전체 기간 전환과 같은 날의 중복 마커 처리', () => {
  const both = { ...event, applicationEnd: '2026-10-30T14:59:59.999Z' };
  assert.equal(entriesOnDay(calendarEntries([both]), '2026-10-30').length, 2);
  assert.equal(periodEvents([both], '2026-10', '2026-10-30').length, 1);
  assert.equal(periodEvents([both], '2026-10', '2026-10-29').length, 0);
  assert.equal(periodEvents([event], '2026-12', null, true).length, 1);
});
