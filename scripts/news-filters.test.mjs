import test from 'node:test';
import assert from 'node:assert/strict';
import { newsFacets } from '../src/lib/news-facets.mjs';
import { selectNews } from '../src/lib/news-data.mjs';
import { readNewsFeed, arxivRecent } from './lib/news-feeds.mjs';
import { newsSources } from '../src/lib/news-sources.mjs';
import { collectNews } from './lib/news-collector.mjs';

const now = Date.parse('2026-10-28T12:00:00Z');
const article = (patch = {}) => ({ id: '1', title: 'Introducing a new language model', sourceId: 'openai', source: 'OpenAI 공식 발표',
  url: 'https://example.org/1', category: '업계/제품', lang: 'en', publishedAt: '2026-10-25T00:00:00.000Z',
  excerpt: '', summary: null, tags: [], readMinutes: 1, ...patch });

test('국내 출처 구분은 기사 언어 또는 보도 대상 국가와 별개', () => {
  const foreign = article({ lang: 'ko' });
  const domestic = article({ id: '2', sourceId: 'aitimes', lang: 'en', url: 'https://example.org/2' });
  assert.equal(newsFacets(foreign).origin, 'overseas');
  assert.deepEqual(selectNews([foreign, domestic], { now, origin: 'domestic' }), [domestic]);
});

test('언어·음성·영상 모델을 복수 분류하고 일반 연설을 모델로 오인하지 않음', () => {
  const facets = newsFacets(article({ title: 'New multimodal language model generates audio and video' }));
  assert.ok(['language', 'audio', 'video', 'multimodal'].every((kind) => facets.topics.models.includes(kind)));
  assert.equal(newsFacets(article({ title: 'CEO delivers a speech at a conference' })).topics.models.length, 0);
});

test('출처 이름으로 공개 라이선스를 추정하지 않고 부정·혼합 표현 구분', () => {
  assert.equal(newsFacets(article({ sourceId: 'huggingface', title: 'New model release' })).openness, 'unknown');
  assert.equal(newsFacets(article({ title: 'This model is not open-source' })).openness, 'closed');
  assert.equal(newsFacets(article({ title: 'An open-weight model' })).openness, 'weights');
  assert.equal(newsFacets(article({ title: 'Open-source and proprietary models compared' })).openness, 'unknown');
});

test('원문 논문 분류 코드와 서베이·벤치마크 표현을 탐색에 사용', () => {
  const paper = article({ sourceId: 'arxiv', category: '연구/논문', title: 'A survey of visual benchmarks', paperCategories: ['cs.CV'] });
  assert.ok(newsFacets(paper).topics.papers.includes('vision'));
  assert.equal(selectNews([paper], { now, topicGroup: 'papers', topic: 'vision', paperKind: 'survey' }).length, 1);
  assert.equal(selectNews([paper], { now, topicGroup: 'papers', topic: 'audio' }).length, 0);
});

test('분야별 주제와 기업 필터 적용, metadata를 Meta 기업으로 오인하지 않음', () => {
  assert.equal(newsFacets(article({ title: 'Metadata management for datasets' })).companies.includes('Meta'), false);
  const item = article({ title: '엔비디아 GPU 인프라 투자 발표', sourceId: 'aitimes' });
  assert.equal(selectNews([item], { now, topicGroup: 'products', topic: 'infrastructure', company: 'NVIDIA' }).length, 1);
  assert.equal(selectNews([item], { now, topicGroup: 'products', topic: 'tools' }).length, 0);
});

test('모델 소식의 개발사 발표·공개 방식·유형 필터를 함께 적용', () => {
  const item = article({ title: 'Introducing an open-source audio model' });
  assert.equal(selectNews([item], { now, modelsOnly: true, publication: 'developer', topicGroup: 'models', topic: 'audio', openness: 'open' }).length, 1);
  assert.equal(selectNews([item], { now, modelsOnly: true, openness: 'closed' }).length, 0);
});

test('arXiv 휴일 빈 RSS는 3초 간격 후 공식 최근 제출 Atom으로 보완', async () => {
  const urls = [], waits = [];
  const url = newsSources.find((source) => source.id === 'arxiv').url;
  const result = await readNewsFeed(url, async (current) => { urls.push(current); return { items: current === url ? [] : [{ title: '새 논문' }] }; }, async (ms) => waits.push(ms));
  assert.deepEqual(urls, [url, arxivRecent]);
  assert.deepEqual(waits, [3000]);
  assert.equal(result.collectionMode, 'recent-atom');
  assert.equal(result.items.length, 1);
});

test('정상 논문 RSS가 있으면 대체 요청 없이 그대로 사용', async () => {
  let requests = 0;
  const url = newsSources.find((source) => source.id === 'arxiv').url;
  const feed = { items: [{ title: '최신 논문', pubDate: '2026-10-25T00:00:00Z' }] };
  assert.equal(await readNewsFeed(url, async () => { requests++; return feed; }, async () => assert.fail()), feed);
  assert.equal(requests, 1);
});

test('arXiv RSS 요청 장애도 공식 Atom으로만 보완하며 실패를 샘플로 채우지 않음', async () => {
  const url = newsSources.find((source) => source.id === 'arxiv').url;
  const result = await readNewsFeed(url, async (current) => {
    if (current === url) throw new Error('RSS 장애');
    return { items: [{ title: '실제 논문' }] };
  }, async () => {});
  assert.equal(result.collectionMode, 'recent-atom');
  await assert.rejects(readNewsFeed(url, async () => { throw new Error('공식 출처 장애'); }, async () => {}), /공식 출처 장애/);
});

test('논문은 원문 분류별로 나눠 선택해 단일 분야가 수량을 독점하지 않음', async () => {
  const source = { id: 'papers', name: '테스트 논문', url: 'https://example.org/feed', category: '연구/논문', lang: 'en', kind: 'paper', limit: 2 };
  const items = [0, 1, 2].map((id) => ({ title: 'New AI model', link: `https://example.org/${id}`, pubDate: `2026-10-25T0${3-id}:00:00Z`, feedCategories: [{ $: { term: id < 2 ? 'cs.CV' : 'cs.CL' } }], summary: 'We propose a new framework.' }));
  const result = await collectNews({ sources: [source], now: Date.parse('2026-10-26T00:00:00Z'), readFeed: async () => ({ items }) });
  assert.deepEqual(new Set(result.items.flatMap((item) => item.paperCategories)), new Set(['cs.CV', 'cs.CL']));
  assert.ok(result.items.every((item) => item.excerpt));
});

test('AI 전용 선별에서 비AI 0건은 정상, AI 항목의 잘못된 날짜는 수집 실패', async () => {
  const source = { id: 'geeknews', name: '긱뉴스', url: 'https://example.org/feed', category: '언론', lang: 'ko', aiOnly: true };
  const other = { ...source, id: 'other', aiOnly: false };
  const valid = { title: 'AI 소식', link: 'https://example.org/new', pubDate: '2026-10-25T00:00:00Z' };
  // 각 출처 URL을 구분하여 정상적인 비AI 목록만 제외하는 경우를 검사한다.
  const result = await collectNews({ sources: [source, { ...other, url: 'https://example.org/other' }], now: Date.parse('2026-10-26T00:00:00Z'), readFeed: async (url) => ({ items: url === source.url ? [{ ...valid, title: '데이터베이스 운영' }] : [valid] }) });
  assert.equal(result.meta.status, 'success');
  assert.equal(result.meta.sourceResults[0].count, 0);
  await assert.rejects(collectNews({ sources: [source], readFeed: async () => ({ items: [{ ...valid, pubDate: null }] }) }), /전체 출처/);
});
