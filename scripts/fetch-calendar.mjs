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
const CATEGORY_SOURCES = {
  government: [
    { id: 'ai-edu-center', name: 'AI 교육진흥센터', url: 'https://aiedu.go.kr/rss.do', type: 'training', category: 'ai-core', lang: 'ko', region: '전국' },
  ],
  corporate: [
    { id: 'naver-ai', name: '네이버 AI', url: 'https://news.blog.naver.com/NaverPostList.naver', type: 'seminar', category: 'ai-applied', lang: 'ko', region: '경기' },
    { id: 'kakao-ai', name: '카카오 AI', url: 'https://tech.kakao.com/blog/feed/', type: 'workshop', category: 'ai-applied', lang: 'ko', region: '서울' },
  ],
  bootcamp: [
    { id: 'fastcampus', name: '패스트캠퍼스', url: 'https://www.fastcampus.co.kr/feed', type: 'bootcamp', category: 'ai-applied', lang: 'ko', region: '전국' },
  ],
  webinar: [
    { id: 'aws-ai', name: 'AWS Genius', url: 'https://aws.amazon.com/blogs/ai/feed/', type: 'webinar', category: 'ai-applied', lang: 'en', region: '전국' },
  ],
  hackathon: [
    { id: 'devpost-ai', name: 'Devpost AI', url: 'https://devpost.com/hackathons.json', type: 'hackathon', category: 'general', lang: 'en', region: '전국' },
  ],
  competition: [
    { id: 'ai-challenge', name: 'AI 충전소', url: 'https://aichallenge.or.kr/feed', type: 'competition', category: 'ai-core', lang: 'ko', region: '전국' },
  ],
  community: [
    { id: 'ai-society', name: 'AI학회', url: 'https://aidea.or.kr/feed', type: 'seminar', category: 'ai-core', lang: 'ko', region: '서울' },
  ],
};


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
  let events = [];
  let sourceInfo = {};

  // ── 실제 출처 수집 시도 ─────────────────────────────────────
  const { all, collectedFrom } = await fetchFromSources();
  if (all.length > 0) {
    events = all;
    sourceInfo = { collected: collectedFrom };
  }

  // ── fallback: 샘플 데이터 사용 ───────────────────────────────
  if (events.length === 0) {
    events = SAMPLE_EVENTS;
    sourceInfo = { note: '샘플 데이터 기반 (실제 RSS 수집 실패)' };
  }

  // 마감일 기준 정렬 (오름차순)
  events.sort((a, b) => {
    const ta = a.applicationEnd ? new Date(a.applicationEnd).getTime() : Infinity;
    const tb = b.applicationEnd ? new Date(b.applicationEnd).getTime() : Infinity;
    return ta - tb;
  });

  const meta = {
    fetchedAt: new Date().toISOString(),
    total: events.length,
    categories: Object.keys(CATEGORY_SOURCES),
    ...sourceInfo,
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