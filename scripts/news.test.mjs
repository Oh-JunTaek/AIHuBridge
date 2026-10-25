import test from 'node:test';
import assert from 'node:assert/strict';
import { isNewsArray, requestNews } from '../src/lib/news-data.mjs';

const now = Date.parse('2026-10-25T12:00:00.000Z');
const article = { id: 'news-1', title: '새로운 AI 소식', url: 'https://example.org/news', source: '공식 출처',
  publishedAt: '2026-10-25T00:00:00.000Z', category: '업계/제품', tags: ['AI'], excerpt: '원문 설명', summary: '규칙 발췌', readMinutes: 1 };
const json = (value) => new Response(JSON.stringify(value), { headers: { 'content-type': 'application/json' } });
function fetcher(news = [article], meta = { fetchedAt: new Date(now).toISOString(), total: 1 }) {
  return async (url) => url.endsWith('/meta.json') ? json(meta) : json(news);
}

test('뉴스와 메타 모두 프로젝트 하위 경로로 요청하며 정상 결과 구분', async () => {
  const urls = [];
  const result = await requestNews('/AIHuBridge/', async (url, options) => {
    urls.push(url);
    assert.equal(options.cache, 'no-cache');
    assert.ok(options.signal instanceof AbortSignal);
    return fetcher()(url);
  }, now);
  assert.equal(result.status, 'success');
  assert.equal(result.stale, false);
  assert.deepEqual(urls.sort(), ['/AIHuBridge/data/meta.json', '/AIHuBridge/data/news.json']);
});
test('실제 빈 목록은 오류와 다르게 표시', async () => {
  const result = await requestNews('/AIHuBridge/', fetcher([], { fetchedAt: new Date(now).toISOString(), total: 0 }), now);
  assert.equal(result.status, 'empty');
  assert.equal(result.error, null);
});
test('HTTP 실패를 정상 0건으로 처리하지 않음', async () => {
  const result = await requestNews('/AIHuBridge/', async () => new Response('', { status: 404 }), now);
  assert.equal(result.status, 'error');
  assert.match(result.error, /HTTP 404/);
});
test('깨진 JSON과 배열이 아닌 응답을 오류로 분류', async () => {
  const broken = await requestNews('/AIHuBridge/', async () => new Response('<html>오류</html>'), now);
  assert.equal(broken.status, 'error');
  assert.match(broken.error, /JSON/);
  assert.equal((await requestNews('/AIHuBridge/', fetcher({ items: [] }), now)).status, 'error');
});
test('누락된 태그·잘못된 URL·날짜·중복 기사 차단', () => {
  for (const patch of [{ tags: null }, { url: 'javascript:alert(1)' }, { publishedAt: '어제' }, { summary: {} }]) {
    assert.equal(isNewsArray([{ ...article, ...patch }]), false);
  }
  assert.equal(isNewsArray([article, article]), false);
});
test('메타 장애나 건수 불일치에도 정상 기사는 유지하고 경고', async () => {
  const missing = await requestNews('/AIHuBridge/', async (url) => url.endsWith('/meta.json') ? new Response('', { status: 503 }) : json([article]), now);
  assert.equal(missing.status, 'success');
  assert.equal(missing.items.length, 1);
  assert.equal(missing.fetchedAt, null);
  assert.ok(missing.warning);
  const mismatch = await requestNews('/AIHuBridge/', fetcher([article], { fetchedAt: new Date(now).toISOString(), total: 99 }), now);
  assert.ok(mismatch.warning);
});
test('오래되거나 미래로 잘못 기록된 수집 시각 안내', async () => {
  const old = await requestNews('/AIHuBridge/', fetcher([article], { fetchedAt: new Date(now - 37 * 3600000).toISOString(), total: 1 }), now);
  assert.equal(old.stale, true);
  assert.match(old.warning, /36시간/);
  const future = await requestNews('/AIHuBridge/', fetcher([article], { fetchedAt: new Date(now + 86400000).toISOString(), total: 1 }), now);
  assert.equal(future.fetchedAt, null);
});
test('네트워크 예외와 요청 취소를 처리', async () => {
  const controller = new AbortController();
  controller.abort();
  const result = await requestNews('/AIHuBridge/', async (_url, options) => {
    assert.equal(options.signal.aborted, true);
    throw new Error('연결 실패');
  }, now, controller.signal);
  assert.equal(result.status, 'error');
  assert.match(result.error, /연결/);
});
