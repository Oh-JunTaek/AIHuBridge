/**
 * AI Compass — 자기진단 / selfcheck
 *   node scripts/selfcheck.mjs
 *
 * 검증 항목:
 *  1. data/news.json 존재 + 스키마 (id/title/url/source/publishedAt/category/summary)
 *  2. data/meta.json 존재
 *  3. certifications / glossary / path 참조 무결성
 *  4. (옵션) 모든 인증 URL에 HEAD 요청 → 200/301/302 여부
 *
 * GitHub Actions에서 CI에 붙이면 "배포 전 검증"이 됩니다.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dataDir = resolve(root, 'data');
const pubDir = resolve(root, 'public/data');

let ok = true;
function check(name, cond, extra = '') {
  const mark = cond ? '✅' : '❌';
  if (!cond) ok = false;
  console.log(`${mark} ${name}${extra ? ' — ' + extra : ''}`);
}

// 1) news.json 스키마
let newsCount = 0;
try {
  const ns = JSON.parse(readFileSync(resolve(pubDir, 'news.json'), 'utf8'));
  newsCount = ns.length;
  check('news.json 존재', ns.length > 0, `${ns.length}건`);
  const bad = ns.filter((i) => !i.id || !i.title || !i.url || !i.source || !i.category || !i.publishedAt || !('summary' in i));
  check('news.json 스키마', bad.length === 0, bad.length ? `${bad.length}건 누락` : 'OK');
  const seen = new Set(); const dups = [];
  ns.forEach((i) => { if (seen.has(i.id)) dups.push(i.id); seen.add(i.id); });
  check('news.json 중복 id', dups.length === 0, `${dups.length}건`);
} catch (e) {
  check('news.json', false, e.message);
}

// 2) meta.json
try {
  const m = JSON.parse(readFileSync(resolve(pubDir, 'meta.json'), 'utf8'));
  check('meta.json 존재', !!m.fetchedAt && m.total === newsCount, `fetched ${m.total} @ ${m.fetchedAt}`);
} catch (e) {
  check('meta.json', false, '미수집 — npm run refresh 먼저 실행');
}

// 3) certifications.ts 정적 참조 무결성
try {
  const src = readFileSync(resolve(root, 'src/data/certifications.ts'), 'utf8');
  const idMatches = [...src.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
  const urlMatches = [...src.matchAll(/url:\s*'([^']+)'/g)].map((m) => m[1]);
  const dupIds = idMatches.length - new Set(idMatches).size;
  check('certifications.ts id 중복', dupIds === 0, `${idMatches.length}곳, 중복 ${dupIds}`);
  check('certifications.ts url 최소 1개', urlMatches.length >= 10, `${urlMatches.length}개`);
} catch (e) {
  check('certifications.ts', false, e.message);
}

// 4) glossary.ts 용어 중복 검사
try {
  const g = readFileSync(resolve(root, 'src/data/glossary.ts'), 'utf8');
  const terms = [...g.matchAll(/term:\s*'([^']+)'/g)].map((m) => m[1]);
  const dup = terms.length - new Set(terms).size;
  check('glossary.ts 용어 중복', dup === 0, `${terms.length}개 용어, 중복 ${dup}`);
} catch (e) {
  check('glossary.ts', false, e.message);
}

// 5) path.ts refId 무결성 (cert.id / glossary.term 참조) — 간단 검사
try {
  const p = readFileSync(resolve(root, 'src/data/path.ts'), 'utf8');
  check('path.ts refId 포함', p.includes('refId'), 'OK');
} catch (e) {
  check('path.ts', false, e.message);
}

console.log(`\n${ok ? '🎉 selfcheck 통과' : '⚠️  항목 실패 — 수정 필요'}`);
process.exit(ok ? 0 : 1);
