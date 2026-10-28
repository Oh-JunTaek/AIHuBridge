import test from 'node:test';
import assert from 'node:assert/strict';
import { DAY, keepNews, newsRetentionDays } from '../src/lib/content-retention.mjs';
import { selectNews } from '../src/lib/news-data.mjs';
import { collectNews } from './lib/news-collector.mjs';
import { eventBoundary, eventIsPast, eventStatus, eventStatusLabel, retainedEvents, visibleEvents, registrationMatches } from '../src/lib/calendar-rules.mjs';
import { collectGoogleEvents, normalizeGoogleEvent } from './lib/public-events.mjs';
import { collectCalendar, rssItemToEvent } from './lib/calendar-collector.mjs';
import { noticeStatus } from './lib/calendar-history.mjs';

const now = Date.parse('2026-10-28T12:00:00Z');
const source = { id: 'test', name: '검사 제공처', url: 'https://example.org/rss', lang: 'ko', category: '언론' };
const raw = (patch = {}) => ({ title: 'AI 산업 투자 동향', link: 'https://example.org/story', pubDate: new Date(now - DAY).toISOString(), contentSnippet: '산업 소식', ...patch });
const base = (await collectNews({ sources: [source], readFeed: async () => ({ items: [raw()] }), now })).items[0];
const news = (days, patch = {}) => ({ ...base, publishedAt: new Date(now - days * DAY).toISOString(), ...patch });
const publicItem = { event_title: 'AI Workshop', start_date: '2026-11-10', end_date: '2026-11-11', tags: 'AI', audience_type: 'VIRTUAL', chapter_name: 'GDG Seoul', links: { url: 'https://gdg.community.dev/events/details/test/' } };
const event = normalizeGoogleEvent('test', publicItem, now);

test('취소·연기 부정 표현과 일반 취소 정책 제목은 상태 공지로 오인하지 않음', () => {
  for (const title of ['AI Workshop not cancelled', '취소 없이 진행하는 AI 워크숍', 'AI 워크숍 취소 정책 안내']) assert.equal(noticeStatus(title), null);
});

test('자료 성격 우선 보관: 논문 180일, 모델 90일, 일반 30일과 정확한 만료 경계', () => {
  for (const [patch, limit] of [[{}, 30], [{ title: 'Introducing a language model' }, 90], [{ category: '연구/논문', title: 'Introducing a language model' }, 180]]) {
    const item = news(limit, patch);
    assert.equal(newsRetentionDays(item), limit);
    assert.equal(keepNews(item, now - 1), true);
    assert.equal(keepNews(item, now), false);
  }
});

test('재수집일이나 오래된 JSON이 원문 보관 기간을 연장하지 않음', () => {
  assert.equal(keepNews(news(31, { fetchedAt: new Date(now).toISOString() }), now), false);
  assert.equal(selectNews([news(31), news(80, { title: 'language model' })], { now }).length, 1);
});

test('정상 RSS에서 사라져도 보관하며 같은 URL 최신 내용 우선·중복 방지', async () => {
  const first = await collectNews({ sources: [source], now, readFeed: async () => ({ items: [raw()] }) });
  const second = await collectNews({ sources: [source], previous: first.items, now: now + DAY, readFeed: async () => ({ items: [raw({ link: 'https://example.org/new' })] }) });
  assert.equal(second.items.length, 2);
  assert.equal(second.meta.sourceResults[0].retained, 1);
  const third = await collectNews({ sources: [source], previous: second.items, now: now + DAY, readFeed: async () => ({ items: [raw({ title: '변경된 제목' })] }) });
  assert.equal(third.items.length, 2);
  assert.equal(third.items.find((item) => item.url === base.url).title, '변경된 제목');
  const empty = await collectNews({ sources: [source], previous: third.items, now: now + 2 * DAY, readFeed: async () => ({ items: [] }) });
  assert.equal(empty.items.length, 2);
  assert.equal(empty.meta.status, 'success');
});

test('회당 수집 한도를 넘겨도 이전 누적 자료를 잘라내지 않음', async () => {
  const previous = Array.from({ length: 12 }, (_, index) => ({ ...base, id: String(index), url: `https://example.org/old-${index}` }));
  const result = await collectNews({ sources: [source], previous, now, readFeed: async () => ({ items: [raw({ link: 'https://example.org/new' })] }) });
  assert.equal(result.items.length, 13);
  assert.equal(result.meta.sourceResults[0].retained, 12);
});

test('부분 실패에도 30·90·180일 정책 적용, 전체 실패는 기존 파일 보존을 위해 종료', async () => {
  const previous = [news(31), news(80, { id: 'model', url: 'https://example.org/model', title: 'language model' }), news(170, { id: 'paper', url: 'https://example.org/paper', category: '연구/논문' })];
  const second = { ...source, id: 'other', url: 'https://example.org/other' };
  const result = await collectNews({ sources: [source, second], previous, now, readFeed: async (url) => { if (url === source.url) throw Error('장애'); return { items: [] }; } });
  assert.equal(result.items.length, 2);
  assert.equal(result.meta.status, 'partial');
  await assert.rejects(collectNews({ sources: [source], previous, now, readFeed: async () => { throw Error('장애'); } }), /전체 출처/);
});

test('최근 7일 기본 조회와 전체 보관 자료 검색은 같은 자료에서 동작', () => {
  const items = [news(3), news(20, { id: 'old', url: 'https://example.org/old' })];
  assert.equal(selectNews(items, { days: 7, now }).length, 1);
  assert.equal(selectNews(items, { days: 30, query: '산업', now }).length, 2);
  assert.equal(selectNews(items, { now }).length, 2);
});

test('신청 마감·행사 종료·개최일 없는 지난 공고를 구분하고 30일 보관', () => {
  const rss = rssItemToEvent(source, { title: 'AI 워크숍 모집', link: 'https://example.org/event', contentSnippet: '신청 마감: 2026.10.27\n행사 일시: 2026.11.10 14:00' }, now);
  assert.equal(eventStatus(rss, now), 'closed');
  assert.equal(visibleEvents([rss], now).length, 1);
  const noDate = { ...rss, eventStart: null };
  assert.equal(eventIsPast(noDate, now), true);
  assert.match(eventStatusLabel(noDate, now), /지난 공고.*개최일 미확인/);
  assert.equal(visibleEvents([noDate], now).length, 0);
  assert.equal(visibleEvents([noDate], now, true).length, 1);
  const boundary = eventBoundary(noDate) + 30 * DAY;
  assert.equal(retainedEvents([noDate], boundary - 1).length, 1);
  assert.equal(retainedEvents([noDate], boundary).length, 0);
});

test('행사 종료 시각이 명시된 경우와 날짜만 공개된 경우를 혼동하지 않음', () => {
  const timed = { ...event, eventDate: undefined, eventEndDate: null, eventStart: '2026-10-28T01:00:00.000Z', eventEnd: '2026-10-28T02:00:00.000Z' };
  assert.equal(eventStatus(timed, now), 'completed');
  assert.equal(visibleEvents([timed], now, true).length, 1);
  assert.equal(eventBoundary(event), Date.parse('2026-11-12T00:00:00-12:00'));
  assert.equal(visibleEvents([event], Date.parse('2026-11-11T00:00:00Z')).length, 1);
});

test('신청 마감 전 필터는 미확인·취소·연기·마감·지난 행사를 신청 가능으로 표시하지 않음', () => {
  assert.equal(registrationMatches(event, 'open', now), false);
  const open = { ...event, applicationEnd: new Date(now + DAY).toISOString() };
  assert.equal(registrationMatches(open, 'open', now), true);
  for (const status of ['cancelled', 'postponed']) assert.equal(registrationMatches({ ...open, status }, 'open', now), false);
  assert.equal(registrationMatches(open, 'open', now + 2 * DAY), false);
});

test('공개 목록 취소·연기 상태를 기본 달력에도 보존하고 원문 변경 일정으로 갱신', async () => {
  let result = await collectGoogleEvents([event], now, async () => JSON.stringify({ test: { ...publicItem, event_title: 'Cancelled AI Workshop' } }));
  assert.equal(result.events[0].status, 'cancelled');
  assert.equal(visibleEvents(result.events, now).length, 1);
  const observed = result.events[0].noticeObservedAt;
  result = await collectGoogleEvents(result.events, now + DAY, async () => JSON.stringify({ test: { ...publicItem, event_title: 'Cancelled AI Workshop' } }));
  assert.equal(result.events[0].noticeObservedAt, observed);
  result = await collectGoogleEvents(result.events, now + DAY, async () => JSON.stringify({ test: { ...publicItem, event_title: 'Postponed AI Workshop', start_date: '2026-12-01', end_date: '2026-12-02' } }));
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].eventDate, '2026-12-01');
});

test('연기 공지에 새 날짜가 없으면 기존 날짜를 참고로 유지하고 관찰일을 반복 연장하지 않음', async () => {
  const read = async () => JSON.stringify({ test: { ...publicItem, event_title: 'Postponed AI Workshop - TBD', start_date: '' } });
  const first = await collectGoogleEvents([event], now, read);
  assert.equal(first.events[0].scheduleUnknown, true);
  assert.equal(first.events[0].eventDate, event.eventDate);
  const later = await collectGoogleEvents(first.events, now + DAY, read);
  assert.equal(later.events[0].noticeObservedAt, first.events[0].noticeObservedAt);
  assert.equal(retainedEvents(later.events, now + 30 * DAY).length, 0);
});

test('정상 행사 목록에서 사라지거나 출처가 실패해도 보관 기간 내 지난 자료 유지', async () => {
  const after = Date.parse('2026-11-15T00:00:00Z');
  for (const read of [async () => '{}', async () => { throw Error('장애'); }]) {
    const result = await collectGoogleEvents([event], after, read);
    assert.equal(result.events.length, 1);
    assert.equal(visibleEvents(result.events, after).length, 0);
  }
});

test('RSS의 별도 취소 공지도 같은 링크 기존 일정에 반영하며 샘플 날짜를 만들지 않음', async () => {
  const old = rssItemToEvent(source, { title: 'AI 워크숍 모집', link: 'https://example.org/event', contentSnippet: '신청 마감: 2026.11.01\n행사 일시: 2026.11.10 14:00' }, now);
  const result = await collectCalendar([source], async () => ({ items: [{ title: '[취소] AI 워크숍', link: old.url }] }), [old], now);
  assert.equal(result.events[0].status, 'cancelled');
  assert.equal(result.events[0].scheduleUnknown, true);
  assert.equal(result.events[0].eventStart, old.eventStart);
});
