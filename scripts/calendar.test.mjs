import test from 'node:test';
import assert from 'node:assert/strict';
import { collectCalendar, rssItemToEvent } from './lib/calendar-collector.mjs';
import { deadlineLabel, isCalendarEvent, visibleEvents } from '../src/lib/calendar-rules.mjs';

const now = Date.parse('2026-10-25T03:00:00.000Z');
const source = { id: 'test', name: '검사 기관', lang: 'ko', url: 'https://example.org/feed' };
const item = (content = '신청 마감: 2026.11.20\n행사 일시: 2026.11.22 14:00') => ({
  title: 'AI 워크숍 참가자 모집', contentSnippet: content,
  link: 'https://example.org/event', pubDate: '2026-10-01T00:00:00Z',
});
const event = () => rssItemToEvent(source, item(), now);

test('명시적 마감일과 행사일을 구분하고 날짜만 있으면 한국시간 하루 끝으로 처리', () => {
  const result = event();
  assert.equal(result.applicationEnd, '2026-11-20T14:59:59.999Z');
  assert.equal(result.eventStart, '2026-11-22T05:00:00.000Z');
  assert.equal(result.publishedAt, '2026-10-01T00:00:00.000Z');
  assert.equal(result.confirmedAt, null);
  assert.equal(result.feeType, 'unknown');
  assert.equal(result.isOnline, null);
});
test('게시일만 있는 공고와 연도 없는 마감일은 제외', () => {
  assert.equal(rssItemToEvent(source, item('참가자를 모집합니다'), now), null);
  assert.equal(rssItemToEvent(source, item('신청 마감: 11.20'), now), null);
  assert.equal(rssItemToEvent(source, item('신청 일시: 2026.11.20\n진행 방식: 온라인'), now), null);
});
test('신청 마감 후에도 개최 전 행사는 유지하고 마감 상태로 변경', () => {
  const result = event();
  const deadline = Date.parse(result.applicationEnd);
  assert.equal(visibleEvents([result], deadline - 1).length, 1);
  assert.equal(visibleEvents([result], deadline).length, 1);
  assert.equal(visibleEvents([result], deadline + 1).length, 1);
});
test('일반 기술 글·다시보기·AI와 무관한 행사는 제외', () => {
  for (const title of ['개인화 추천을 위한 랭킹 모델 개발기', 'AI 워크숍 다시보기', 'Hello world!', '가죽 공예 워크숍 모집']) {
    assert.equal(rssItemToEvent(source, { ...item(), title, contentSnippet: '신청 마감: 2026.11.20' }, now), null);
  }
});
test('잘못된 날짜와 역전된 일정은 제외', () => {
  assert.equal(rssItemToEvent(source, item('신청 마감: 2026.02.30'), now), null);
  assert.equal(rssItemToEvent(source, item('신청 마감: 2026.11.20 25:00'), now), null);
  assert.equal(rssItemToEvent(source, item('신청 마감: 2026.11.20\n행사 일시: 2026.11.19 14:00'), now), null);
});
test('지원하지 않는 시각·시간대와 서로 충돌하는 마감일은 추정하지 않음', () => {
  for (const content of ['신청 마감: 2026.11.20 오후 2시', '신청 마감: 2026.11.20 12:00 UTC', '접수 기간: 2026.11.01 ~ 2026.11.20\n신청 마감: 2026.11.21']) {
    assert.equal(rssItemToEvent(source, item(content), now), null);
  }
});
test('명시적 접수 기간의 시작일과 마감일 추출', () => {
  const result = rssItemToEvent(source, item('접수 기간: 2026.11.01 ~ 2026.11.20'), now);
  assert.equal(result.applicationStart, '2026-10-31T15:00:00.000Z');
  assert.equal(result.applicationEnd, '2026-11-20T14:59:59.999Z');
  assert.equal(result.status, 'scheduled');
});
test('30일 보관 기한을 넘긴 과거 공고와 샘플·구형 데이터는 제외', () => {
  assert.equal(rssItemToEvent(source, item('신청 마감: 2026.09.01'), now), null);
  assert.equal(isCalendarEvent({ ...event(), id: 'sample-001' }), false);
  assert.equal(isCalendarEvent({ ...event(), verification: undefined }), false);
  assert.equal(isCalendarEvent({ ...event(), feeType: true }), false);
});
test('중복 URL과 ID는 한 건만 유지', () => {
  const result = event();
  assert.equal(visibleEvents([result, { ...result, id: 'other', url: result.url + '#apply' }], now).length, 1);
});
test('마감까지 24시간 미만이어도 한국시간 날짜 차이로 D-day 계산', () => {
  assert.deepEqual(deadlineLabel('2026-10-25T15:30:00.000Z', Date.parse('2026-10-25T14:30:00.000Z')), { label: 'D-1', isPast: false });
  assert.deepEqual(deadlineLabel('2026-10-25T14:59:59.999Z', now), { label: '오늘 마감', isPast: false });
  assert.deepEqual(deadlineLabel('2026-10-25T02:59:59.999Z', now), { label: '모집 마감', isPast: true });
  assert.equal(deadlineLabel(null, now), null);
});
test('출처 실패 시 검증된 미마감 데이터만 보존', async () => {
  const old = { ...event(), isOnline: true };
  const result = await collectCalendar([source], async () => { throw new Error('검사용 연결 실패'); }, [old, { ...old, id: 'expired', applicationEnd: '2026-10-24T00:00:00.000Z' }], now);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].fetchedAt, old.fetchedAt);
  assert.equal(result.sources[0].status, 'error');
});
test('정상 RSS의 유효 공고 0건은 샘플로 대체하지 않음', async () => {
  const result = await collectCalendar([source], async () => ({ items: [item('신청 마감: 2026.09.01')] }), [], now);
  assert.equal(result.events.length, 0);
  assert.equal(result.sources[0].status, 'success');
  assert.equal(result.sources[0].rejected, 1);
});
test('스크립트 URL·배열이 아닌 RSS 응답 거부', async () => {
  assert.equal(rssItemToEvent(source, { ...item(), link: 'javascript:alert(1)' }, now), null);
  const result = await collectCalendar([source], async () => ({ items: '잘못된 응답' }), [], now);
  assert.equal(result.sources[0].status, 'error');
});

test('수집 단계에서 명시된 국내 현장·온라인 일정만 수용하고 개최일만 있으면 시각을 추정하지 않는다', async () => {
  const records = [
    { ...item('행사 일시: 2026.11.22\n진행 방식: 온라인'), link: 'https://example.org/online' },
    { ...item('행사 일시: 2026.11.22 14:00\n진행 방식: 오프라인\n장소: 서울 코엑스'), link: 'https://example.org/seoul' },
    { ...item('행사 일시: 2026.11.22\n진행 방식: 오프라인\n장소: Cairo'), link: 'https://example.org/cairo' },
    { ...item('행사 일시: 2026.11.22\n장소: 온라인 신청 후 안내'), link: 'https://example.org/application' },
    { ...item('행사 일시: 2026.11.22\n진행 방식: 온라인\n한국에서 접속 불가'), link: 'https://example.org/restricted' },
    { ...item('행사 일시: 2026.11.22\n진행 방식: 온라인 또는 오프라인'), link: 'https://example.org/ambiguous' },
  ];
  const result = await collectCalendar([source], async () => ({ items: records }), [], now);
  assert.deepEqual(new Set(result.events.map((value) => value.url)), new Set(['https://example.org/online', 'https://example.org/seoul']));
  const online = result.events.find((value) => value.url.endsWith('/online'));
  assert.equal(online.eventDate, '2026-11-22');
  assert.equal(online.eventStart, null);
  assert.equal(online.applicationEnd, null);
  assert.equal(result.events.find((value) => value.url.endsWith('/seoul')).location, '서울 코엑스');
});

test('이전 온라인 공고가 해외 현장으로 변경되면 과거 온라인 상태를 재사용하지 않는다', async () => {
  const old = rssItemToEvent(source, item('행사 일시: 2026.11.22\n진행 방식: 온라인'), now);
  const updated = item('행사 일시: 2026.11.22\n진행 방식: 오프라인\n장소: Cairo');
  const result = await collectCalendar([source], async () => ({ items: [updated] }), [old], now);
  assert.equal(result.events.length, 0);
  const failure = await collectCalendar([source], async () => { throw new Error('장애'); }, [old], now);
  assert.equal(failure.events.length, 1);
});
