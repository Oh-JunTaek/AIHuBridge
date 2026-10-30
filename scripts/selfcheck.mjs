/**
 * AI Compass — 자기진단 / selfcheck
 *   node scripts/selfcheck.mjs
 *
 * 검증 항목:
 *  1. data/news.json 존재 + 스키마 (id/title/url/source/publishedAt/category/summary)
 *  2. data/meta.json 존재
 *  3. certifications / path 참조 무결성
 *  4. (옵션) 모든 인증 URL에 HEAD 요청 → 200/301/302 여부
 *
 * GitHub Actions에서 CI에 붙이면 "배포 전 검증"이 됩니다.
 */
import { readFileSync } from 'node:fs';
import { isCalendarEvent, visibleEvents } from '../src/lib/calendar-rules.mjs';
import { isNewsArray } from '../src/lib/news-data.mjs';
import { newsSources } from '../src/lib/news-sources.mjs';
import { isCertification } from '../src/lib/cert-rules.mjs';
import { loadStaticData } from './lib/static-data.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pubDir = resolve(root, 'public/data');

let ok = true;
function check(name, cond, extra = '') {
  const mark = cond ? '✅' : '❌';
  if (!cond) ok = false;
  console.log(`${mark} ${name}${extra ? ' — ' + extra : ''}`);
}

// 1) news.json 스키마
let newsCount = 0;
let newsItems = [];
try {
  const ns = JSON.parse(readFileSync(resolve(pubDir, 'news.json'), 'utf8'));
  if (!isNewsArray(ns)) throw new Error('뉴스 배열·필드 타입·URL·날짜·중복 검증 실패');
  newsCount = ns.length;
  newsItems = ns;
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
  if (m.sourceResults) {
    const ids = newsSources.map((source) => source.id);
    check('뉴스 출처별 수집 상태와 건수', Array.isArray(m.sourceResults)
      && m.sourceResults.length === ids.length
      && new Set(m.sourceResults.map((result) => result.id)).size === ids.length
      && m.sourceResults.every((result) => ids.includes(result.id) && ['success', 'failed'].includes(result.status))
      && newsItems.every((item) => ids.includes(item.sourceId))
      && ids.every((id) => m.counts[id] === newsItems.filter((item) => item.sourceId === id).length));
  }
} catch (e) {
  check('meta.json', false, '미수집 — npm run refresh 먼저 실행');
}

// 3) certifications.ts 정적 참조 무결성
try {
  const { certifications } = await loadStaticData(new URL('../src/data/certifications.ts', import.meta.url));
  const idMatches = certifications.map((item) => item.id);
  const urlMatches = certifications.map((item) => item.url);
  const dupIds = idMatches.length - new Set(idMatches).size;
  check('certifications.ts id 중복', dupIds === 0, `${idMatches.length}곳, 중복 ${dupIds}`);
  check('certifications.ts url 최소 1개', urlMatches.length >= 10, `${urlMatches.length}개`);
  check('교육 비용·참여 조건·공식 근거', certifications.every(isCertification));
} catch (e) {
  check('certifications.ts', false, e.message);
}

// 모든 학습 단계의 참조가 실제 인증·교육 항목에 연결되는지 검사한다.
try {
  const { stages } = await loadStaticData(new URL('../src/data/path.ts', import.meta.url));
  const { certifications } = await loadStaticData(new URL('../src/data/certifications.ts', import.meta.url));
  const { qualifications } = await loadStaticData(new URL('../src/data/qualifications.ts', import.meta.url));
  const ids = new Set([...certifications, ...qualifications].map((item) => item.id));
  check('자격시험 ID·필수 정보·공식 링크', new Set(qualifications.map((item) => item.id)).size === qualifications.length && qualifications.every((item) => item.id && item.name && item.provider && item.classification && item.language.length && item.fee && item.prerequisites && item.validity && /^https:\/\//.test(item.url) && item.preparation.every((resource) => /^https:\/\//.test(resource.url))), `${qualifications.length}개 항목`);
  const refs = stages.flatMap((stage) => stage.items.map((item) => item.refId));
  check('학습 경로 교육 참조 무결성', refs.length > 0 && refs.every((ref) => ids.has(ref)), `${refs.length}개 항목`);
} catch (e) {
  check('path.ts', false, e.message);
}

// 행사 0건은 정상일 수 있다. 대신 일정 근거·미확인 값·메타 일치를 검사한다.
try {
  const events = JSON.parse(readFileSync(resolve(pubDir, 'calendar.json'), 'utf8'));
  const meta = JSON.parse(readFileSync(resolve(pubDir, 'calendar-meta.json'), 'utf8'));
  check('행사 데이터 스키마와 일정 근거', Array.isArray(events) && events.every(isCalendarEvent));
  check('행사 ID·URL 중복', new Set(events.map((event) => event.id)).size === events.length
    && new Set(events.map((event) => event.url)).size === events.length);
  check('행사 메타 일치', meta.schemaVersion === 2 && meta.total === events.length
    && Number.isFinite(Date.parse(meta.fetchedAt)) && ['success', 'partial', 'cleaned'].includes(meta.status));
  console.log(`현재 기본 조회 대상 AI 일정: ${visibleEvents(events).length}건`);
} catch (error) {
  check('행사 데이터 검사', false, error.message);
}

console.log(`\n${ok ? '🎉 selfcheck 통과' : '⚠️  항목 실패 — 수정 필요'}`);
process.exit(ok ? 0 : 1);
