import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('공유 미리보기는 정적 HTML에 제목·설명과 실제 이미지 주소를 제공한다', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /property="og:title" content="[^"]+"/);
  assert.match(html, /property="og:description" content="[^"]+"/);
  assert.match(html, /property="og:image" content="https:\/\/oh-juntaek\.github\.io\/AIHuBridge\/icon\/HuBridge\.png"/);
  assert.ok(existsSync(new URL('../public/icon/HuBridge.png', import.meta.url)));
});
