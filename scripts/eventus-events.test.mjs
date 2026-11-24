import test from 'node:test';
import assert from 'node:assert/strict';
import { collectEventUsEvents, normalizeEventUsItem } from './lib/eventus-events.mjs';
import { selectPublishableEvents } from './lib/calendar-eligibility.mjs';

const now = Date.parse('2026-11-24T00:00:00Z');

const mockRawItem = (overrides = {}) => ({
  id: { raw: '1001' },
  subdomain: { raw: 'testorg' },
  title: { raw: 'AI 실무 활용 세미나' },
  app_title: { raw: '인공지능 연구회' },
  start_date: { raw: '2026-12-01T05:00:00Z' },
  close_date: { raw: '2026-12-01T08:00:00Z' },
  event_system_type: { raw: 'offline' },
  area: { raw: '서울/경기/인천' },
  area_detail: { raw: '서울 강남구' },
  min_money: { raw: 0 },
  ...overrides,
});

test('이벤터스 공개 검색에서 국내 현장 및 온라인 AI 행사를 정규화한다', () => {
  const offlineItem = mockRawItem();
  const event = normalizeEventUsItem(offlineItem, now);
  assert.ok(event);
  assert.equal(event.id, 'eventus-1001');
  assert.equal(event.sourceId, 'eventus-events');
  assert.equal(event.title, 'AI 실무 활용 세미나');
  assert.equal(event.isOnline, false);
  assert.equal(event.location, '서울 강남구');
  assert.equal(event.territory, 'domestic');
  assert.equal(event.eventDate, '2026-12-01');
  assert.equal(event.feeType, 'free');
  assert.equal(event.feeAmount, null);
  assert.equal(event.url, 'https://event-us.kr/testorg/event/1001');

  const onlineItem = mockRawItem({
    id: { raw: '1002' },
    title: { raw: '생성형 LLM 온라인 웨비나' },
    event_system_type: { raw: 'online' },
    min_money: { raw: 25000 },
  });
  const onlineEvent = normalizeEventUsItem(onlineItem, now);
  assert.ok(onlineEvent);
  assert.equal(onlineEvent.isOnline, true);
  assert.equal(onlineEvent.location, null);
  assert.equal(onlineEvent.feeType, 'paid');
  assert.equal(onlineEvent.feeAmount, 25000);
});

test('하이브리드 행사는 온라인 참여 가능 및 장소를 동시에 보존한다', () => {
  const hybridItem = mockRawItem({
    id: { raw: '1003' },
    title: { raw: 'AI 컨퍼런스 온·오프라인 병행' },
    event_system_type: { raw: 'hybrid' },
    area_detail: { raw: '서울 서초구' },
  });
  const event = normalizeEventUsItem(hybridItem, now);
  assert.ok(event);
  assert.equal(event.isOnline, true);
  assert.equal(event.attendanceMode, 'hybrid');
  assert.equal(event.location, '서울 서초구');
});

test('AI와 무관한 제목이나 날짜가 없는 행사는 제외한다', () => {
  const nonAiItem = mockRawItem({ title: { raw: '일반 부동산 재테크 포럼' } });
  assert.equal(normalizeEventUsItem(nonAiItem, now), null);

  const noDateItem = mockRawItem({ start_date: { raw: '유효하지않은날짜' } });
  assert.equal(normalizeEventUsItem(noDateItem, now), null);
});

test('이벤터스 수집 실행 시 정상 결과를 반환하고 오류 시 기존 행사를 보존한다', async () => {
  const mockFetch = async () => ({
    results: [
      mockRawItem(),
      mockRawItem({ id: { raw: '1004' }, title: { raw: '일반 마케팅 특강' } }), // 비AI 제외
    ],
  });

  const result = await collectEventUsEvents([], now, mockFetch);
  assert.equal(result.source.status, 'success');
  assert.equal(result.source.received, 2);
  assert.equal(result.source.accepted, 1);
  assert.equal(result.events.length, 1);
  assert.equal(selectPublishableEvents(result.events, now).length, 1);

  // 오류 발생 시 기존 행사 보존 테스트
  const failingFetch = async () => { throw new Error('네트워크 타임아웃'); };
  const fallback = await collectEventUsEvents(result.events, now, failingFetch);
  assert.equal(fallback.source.status, 'error');
  assert.equal(fallback.events.length, 1);
  assert.equal(fallback.events[0].id, 'eventus-1001');
});
