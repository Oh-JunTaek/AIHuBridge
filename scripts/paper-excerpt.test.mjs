import test from 'node:test';
import assert from 'node:assert/strict';
import { paperExcerpt } from '../src/lib/paper-excerpt.mjs';

test('arXiv 관리 머리말을 지우고 원문 문장을 발췌한다', () => {
  const text = 'This paper studies robust visual inference in a range of realistic environments. Another sentence follows after this complete sentence.';
  assert.equal(paperExcerpt({ excerpt: `arXiv:2611.06953v1 Announce Type: new Abstract: ${text}` }, 90), 'This paper studies robust visual inference in a range of realistic environments.');
});
test('긴 문장은 단어 경계에서 생략을 알리고 수식은 번역하거나 변형하지 않는다', () => {
  const text = 'For $x_i$ we propose a method with many words that continues beyond the display boundary without punctuation';
  const result = paperExcerpt({ excerpt: text }, 48);
  assert.ok(result.includes('$x_i$'));
  assert.ok(result.endsWith('…'));
  assert.ok(text.startsWith(result.slice(0, -1)));
});
test('머리말이 없는 초록과 빈 초록을 안전하게 처리한다', () => {
  assert.equal(paperExcerpt({ excerpt: 'A complete abstract.' }), 'A complete abstract.');
  assert.equal(paperExcerpt({ excerpt: 'arXiv:2611.12345v1 Announce Type: cross Abstract: ' }), '');
  assert.equal(paperExcerpt({ excerpt: '', summary: null }), '');
});
