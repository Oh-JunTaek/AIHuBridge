import test from 'node:test';
import assert from 'node:assert/strict';
import { groupNews } from '../src/lib/news-groups.mjs';

const item = (id, title, patch = {}) => ({ id, title, url: `https://example.com/${id}`, source: id, sourceId: 'koreagnews', category: '언론', publishedAt: '2026-11-09T01:00:00Z', ...patch });

test('실제 제목 표본은 같은 발표 후보를 보존하며 API와 모델 공개를 나눈다', () => {
  const a = item('a', "LG AI연구원, 독파모 'K-엑사원 2.5' API 무료개방 - 연합뉴스");
  const b = item('b', 'LG, ‘K-엑사원 2.5’ API 무료 개방… 글로벌 AI 주도권 잡는다 - 서울경제TV');
  const c = item('c', "LG 'K-엑사원 2.5' 공개…에이전틱 AI 성능 70% 높였다 - 아시아경제");
  const groups = groupNews([a, b, c]);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].related, [b]);
  assert.equal(groups[1].primary, c);
});

test('다른 버전·전망·시간차·논문은 묶지 않고 공식 원문은 대표로 표시한다', () => {
  const a = item('a', 'Qwen 3.5 모델 공개');
  const official = item('official', 'Qwen 3.5 model released', { sourceId: 'openai' });
  const different = item('different', 'Qwen 3.6 모델 공개');
  const forecast = item('forecast', 'Qwen 3.5 Release Date: What We Know So Far');
  const late = item('late', 'Qwen 3.5 모델 공개', { publishedAt: '2026-10-01T01:00:00Z' });
  const paper = item('paper', 'Qwen 3.5 모델 공개', { category: '연구/논문' });
  const groups = groupNews([a, official, different, forecast, late, paper]);
  assert.equal(groups.length, 5);
  assert.equal(groups[0].primary, official);
  assert.deepEqual(groups[0].related, [a]);
  assert.equal(groups.flatMap((group) => [group.primary, ...group.related]).length, 6);
});

test('버전이 없거나 동일 사건이라고 단정하기 어려운 소식은 독립 표시한다', () => {
  const items = [item('one', '카카오 AI 모델 공개'), item('two', '카카오 AI 모델 공개'), item('three', 'GPT-6 Cyber 취약점 신규 발견')];
  assert.equal(groupNews(items).length, 3);
});
