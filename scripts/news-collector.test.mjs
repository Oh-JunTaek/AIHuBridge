import test from 'node:test';
import assert from 'node:assert/strict';
import { articleUrl, collectNews } from './lib/news-collector.mjs';
import { isNewsArray, requestNews, selectNews } from '../src/lib/news-data.mjs';

const now = Date.parse('2026-10-25T12:00:00Z');
const sources = [
  { id: 'one', name: '공식 출처', url: 'https://example.org/feed', category: '업계/제품', lang: 'en' },
  { id: 'two', name: '한국어 출처', url: 'https://example.kr/feed', category: '언론', lang: 'ko' },
];
const raw = (patch = {}) => ({ title: 'AI safety — Research | Open Source', link: 'https://example.org/story',
  pubDate: '2026-10-25T00:00:00Z', contentSnippet: '첫 번째 설명입니다. 두 번째 설명입니다.', ...patch });
const collect = (readFeed, extra = {}) => collectNews({ readFeed, now, sources, ...extra });

test('제목 구분자와 원문을 보존하며 추적 URL만 정리', async () => {
  const { items } = await collect(async () => ({ items: [raw({ link: 'https://example.org/story?utm_source=rss&id=5#top' })] }));
  assert.equal(items.length, 1);
  assert.equal(items[0].title, raw().title);
  assert.equal(items[0].url, 'https://example.org/story?id=5');
  assert.equal(isNewsArray(items), true);
  assert.equal(articleUrl('javascript:alert(1)'), null);
  assert.equal(articleUrl('https://user:password@example.org'), null);
});

test('발행일 누락·무효·미래 기사는 수집 당일로 둔갑하지 않음', async () => {
  const result = await collect(async () => ({ items: [raw(), raw({ pubDate: null }), raw({ pubDate: '날짜 없음' }), raw({ pubDate: '2027-01-01T00:00:00Z' })] }));
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].publishedAt, '2026-10-25T00:00:00.000Z');
  assert.equal(result.meta.sourceResults[0].rejected, 3);
});

test('isoDate 지원, 앞 8개가 무효여도 뒤의 정상 기사를 수집', async () => {
  const result = await collect(async () => ({ items: [...Array.from({ length: 8 }, () => raw({ pubDate: null })), raw({ pubDate: null, isoDate: '2026-10-24T00:00:00Z' })] }));
  assert.equal(result.items[0].publishedAt, '2026-10-24T00:00:00.000Z');
});

test('부분 실패에서 기존 유효 기사 보존, 날짜·마지막 성공 시각 유지', async () => {
  const baseline = await collect(async () => ({ items: [raw()] }), { sources: [sources[0]] });
  const result = await collect(async (url) => {
    if (url === sources[0].url) throw new Error('연결 실패');
    return { items: [raw({ link: 'https://example.kr/new' })] };
  }, { previous: baseline.items, previousMeta: baseline.meta, now: now + 3600000 });
  assert.equal(result.items.length, 2);
  assert.equal(result.meta.status, 'partial');
  assert.deepEqual(result.meta.unavailableSources, ['one']);
  assert.equal(result.meta.sourceResults[0].retained, 1);
  assert.equal(result.meta.sourceResults[0].lastSuccessAt, new Date(now).toISOString());
  assert.equal(result.items.find((item) => item.sourceId === 'one').publishedAt, baseline.items[0].publishedAt);
});

test('발행 후 7일이 지난 기사와 깨진 이전 데이터는 보존하지 않음', async () => {
  const baseline = await collect(async () => ({ items: [raw()] }), { sources: [sources[0]] });
  const result = await collect(async (url) => {
    if (url === sources[0].url) throw new Error('연결 실패');
    return { items: [raw({ link: 'https://example.kr/new' })] };
  }, { previous: [{ ...baseline.items[0], publishedAt: '2026-10-01T00:00:00Z' }, { title: '깨진 데이터' }] });
  assert.equal(result.meta.sourceResults[0].retained, 0);
  assert.equal(result.items.length, 1);
});

test('전체 실패는 이전 기사가 있어도 실패하고 빈 정상 RSS와 구분', async () => {
  const baseline = await collect(async () => ({ items: [raw()] }));
  await assert.rejects(collect(async () => { throw new Error('장애'); }, { previous: baseline.items }), /전체 출처/);
  await assert.rejects(collect(async () => ({ items: [] })), /0건/);
  const result = await collect(async (url) => ({ items: url === sources[0].url ? [] : [raw()] }), { previous: baseline.items });
  assert.equal(result.meta.sourceResults[0].status, 'success');
  assert.equal(result.meta.sourceResults[0].count, 0);
  assert.equal(result.meta.status, 'success');
  assert.equal(result.items.some((item) => item.sourceId === 'one'), false);
});

test('같은 제목의 다른 원문은 유지, 같은 URL 추적 변형은 제거', async () => {
  const result = await collect(async () => ({ items: [raw(), raw({ link: 'https://example.org/story?utm_medium=rss' }), raw({ link: 'https://example.org/other' })] }));
  assert.equal(result.items.length, 2);
  assert.equal(isNewsArray(result.items), true);
});

test('언어·출처·분야·검색을 함께 적용하고 원본 배열 순서 유지', async () => {
  const { items } = await collect(async (url) => ({ items: [raw({ link: url + '/story' })] }));
  const before = structuredClone(items);
  assert.equal(selectNews(items, { lang: 'ko', source: sources[1].name, category: '언론', query: 'AI safety' }).length, 1);
  assert.equal(selectNews(items, { lang: 'en', source: sources[1].name }).length, 0);
  assert.equal(selectNews(items, { query: '존재하지 않는 주제' }).length, 0);
  assert.deepEqual(items, before);
});

test('부분 실패와 오래된 수집 경고를 동시에 표시', async () => {
  const { items, meta } = await collect(async (url) => {
    if (url === sources[0].url) throw new Error('장애');
    return { items: [raw()] };
  });
  const result = await requestNews('/', async (url) => new Response(JSON.stringify(url.endsWith('meta.json') ? meta : items)), now + 37 * 3600000);
  assert.match(result.warning, /36시간/);
  assert.match(result.warning, /일부 출처/);
});

test('실패 출처의 이전 기사와 URL이 겹치면 새로 수집한 원문을 우선', async () => {
  const baseline = await collect(async () => ({ items: [raw({ title: '이전 제목' })] }), { sources: [sources[0]] });
  const result = await collect(async (url) => {
    if (url === sources[1].url) throw new Error('실패');
    return { items: [raw({ title: '새 제목' })] };
  }, { previous: [{ ...baseline.items[0], sourceId: 'two', source: sources[1].name }], previousMeta: { sourceResults: {} } });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].title, '새 제목');
});

test('출처별 최신 8건을 선택하며 오래된 앞쪽 기사가 최신 기사를 밀어내지 않음', async () => {
  const result = await collect(async () => ({ items: Array.from({ length: 12 }, (_, index) => raw({
    link: `https://example.org/${index}`, pubDate: new Date(now - (12 - index) * 3600000).toISOString(),
  })) }), { sources: [sources[0]] });
  assert.equal(result.items.length, 8);
  assert.equal(result.items[0].url, 'https://example.org/11');
  assert.equal(result.items[7].url, 'https://example.org/4');
});
