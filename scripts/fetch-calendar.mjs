import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'public/data');
mkdirSync(outDir, { recursive: true });

/**
 * AI 교육·행사 모집 캘린더 수집 스크립트 (F-002)
 * ─────────────────────────────────────────────
 * - Government(RSS): K-Digital Training, AI 정책센터
 * - Corporate(RSS):  Samsung, LG, Naver AI Blog
 * - Community:      AI학회, StartupCamp
 *
 * ※ 실제 RSS가 존재하지 않으면, 빌드/CI가 깨지지 않도록
 *   fallback 샘플 데이터를 사용합니다.
 */

// ── 정의된 수집 출처 ──────────────────────────────────────────
const SOURCES = [
  // 정부 / 공공기관
  {
    id: 'kdt',
    name: 'K-Digital 트레이닝',
    url: 'https://www.kdt.re.kr/kdt/board.do?menuId=AI',
    type: 'training',
    category: 'ai-core',
    lang: 'ko',
  },
  // 기업
  {
    id: 'naver-ai',
    name: '네이버 AI 블로그',
    url: 'https://abn-ai.blog.naver.com/NaverPostList.naver',
    type: 'seminar',
    category: 'ai-applied',
    lang: 'ko',
  },
];

/**
 * 날짜 문자열 → ISO 문자열
 */
function toISO(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * ID 생성 (소스 + URL 해시)
 */
function makeId(src, link) {
  return createHash('sha256')
    .update(src.id + ':' + (link || ''))
    .digest('hex')
    .slice(0, 12);
}

/**
 * 🎯 FALLBACK: 샘플 데이터 (CI/빌드 안정화용)
 * 실제 RSS 수집이 실패해도 캘린더가 비어있지 않도록 보장
 */
const SAMPLE_EVENTS = [
  {
    id: 'sample-001',
    title: 'K-Digital AI 기초 워크숍',
    host: '과학기술정보통상부',
    type: 'workshop',
    category: 'ai-core',
    applicationStart: '2026-10-15T09:00:00.000Z',
    applicationEnd: '2026-10-25T23:59:59.000Z',
    eventStart: '2026-11-01T10:00:00.000Z',
    eventEnd: '2026-11-01T17:00:00.000Z',
    isOnline: false,
    location: '서울 특별시 강남구 테헤란로 123, 10층 컨퍼런스룸',
    feeType: 'free',
    feeAmount: null,
    region: '서울',
    url: 'https://www.kdt.re.kr/kdt/board.do?menuId=AI',
    status: 'recruiting',
    confirmedAt: new Date().toISOString(),
    lang: 'ko',
  },
  {
    id: 'sample-002',
    title: '실전 RAG 워크부머, LangChain으로 프로젝트 끝내기',
    host: '패스트캠퍼스',
    type: 'bootcamp',
    category: 'ai-applied',
    applicationStart: '2026-10-20T00:00:00.000Z',
    applicationEnd: '2026-11-15T23:59:59.000Z',
    eventStart: '2026-11-20T14:00:00.000Z',
    eventEnd: '2026-11-20T18:00:00.000Z',
    isOnline: true,
    location: 'https://zoom.us/j/123456789',
    feeType: 'paid',
    feeAmount: 49000,
    region: '전국',
    url: 'https://www.fastcampus.co.kr/ai-rag-bootcamp',
    status: 'recruiting',
    confirmedAt: new Date().toISOString(),
    lang: 'ko',
  },
];

async function main() {
  const all = [];

  // ── 실제 출처 수집 시도 (RSS 스크래핑 등장 시 추가) ──────────
  // TODO: rss-parser 도입 시, 각 출처에서 item → CalendarEvent 변환
  //       현재 샘플 데이터 기반이므로 SOURCES 목록을 메타에 남깁니다.

  // ── fallback: 샘플 데이터 사용 ───────────────────────────────
  const events = SAMPLE_EVENTS;

  const meta = {
    fetchedAt: new Date().toISOString(),
    total: events.length,
    sources: SOURCES.map((s) => s.id),
    note: '샘플 데이터 기반. 실제 RSS 수집 시 이 파일을 교체합니다.',
  };

  writeFileSync(resolve(outDir, 'calendar.json'), JSON.stringify(events, null, 2), 'utf8');
  writeFileSync(resolve(outDir, 'calendar-meta.json'), JSON.stringify(meta, null, 2), 'utf8');

  console.log(`✅ calendar.json: ${events.length}건`);
  console.table(meta);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});