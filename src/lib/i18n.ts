import { useUser } from './user';

export type Lang = 'ko' | 'en';

export const LANGUAGES: { value: Lang; label: { ko: string; en: string } }[] = [
  { value: 'ko', label: { ko: '한국어', en: 'Korean' } },
  { value: 'en', label: { ko: '영어', en: 'English' } },
];

export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

type Dict = Record<string, unknown>;

const ko: Dict = {
  ui: {
    min: '분',
    example: '예)',
    related: '관련:',
    more: '↻ 다른 용어 보기',
  },
  nav: {
    briefing: '브리핑',
    research: '리서치',
    path: '학습 경로',
    certs: '인증 뱃지',
    quiz: '퀴즈',
    dev: '자기진단',
    settings: '설정',
  },
  footer: { copy: '개인용 학습 보드 · 로컬 저장만 사용 · 언제든 초기화 가능' },
  settings: {
    title: '설정',
    theme: '야간 모드',
    light: '라이트',
    dark: '다크',
    system: '시스템',
    language: '언어 (Language)',
    saved: '변경사항이 저장되었습니다',
    themeHint: '시스템: OS 다크모드 설정을 따릅니다.',
  },
  home: {
    heading: '오늘의 AI 브리핑',
    loading: '뉴스를 불러오는 중…',
    allResearch: '전체 리서치',
    concept: '오늘의 AI 개념',
    sub: 'AI 최신 소식, 무료 학습 경로, 인증 뱃지까지. 비전공자도 쉽게 따라오는 개인용 AI 러닝 패드',
    tagline: '뉴스, 학습, 인증 — 너만의 AI 데스크탑',
    streak: '🔥 {0}일 연속 학습 · Lv.{1} (XP {2})',
    pick: '오늘의 Pick 4',
    recent: '요즘 본 기사',
    badges: '나의 뱃지',
    noNews: '뉴스가 없어요. 터미널에서 npm run refresh 를 실행해 보세요. →',
    devLink: '자기진단',
    briefingLabel: '오늘의 AI 한 줄 브리핑',
    nextUp: 'Lv.{0} 다음 레벨업 추천',
    study: '학습 하러 가기 →',
    more: '더 보기 →',
    progress: '{0}/{1} 항목 완료 ({2}%)',
  },
  research: {
    title: '리서치',
    sub: 'AI 최신 소식 {0}건 · 카테고리로 걸러보기',
    empty: '이 카테고리엔 아직 기사가 없어요. npm run refresh 로 최신을 받아오세요.',
    devLink: '개발용 자기진단 → 마지막 수집 시각 확인',
  },
  path: {
    title: '학습 경로',
    sub: '비전공자를 위한 4단계 루트 — 완료하면 뱃지가 생겨요',
    progress: '{0}/{1} 항목 완료 ({2}%)',
    filterLevel: '난이도:',
    filterCategory: '분야:',
    filterAll: '전체',
    filterReset: '필터 초기화',
    toCerts: '뱃지 보러 가기',
  },
  certs: {
    title: '인증 뱃지',
    back: '학습 경로로 돌아가기',
    note: '완료 체크 버튼으로 개인 진행 상황을 기록하세요. (localStorage·공유 안 됨)',
    footer: '인증은 공식 페이지에서 직접 응시하세요. (링크는 2026-10 기준 실측 URL)',
    checked: '✓ 체크 완료',
    checkedOn: '완료 체크됨',
    checkedOff: '완료로 표시',
    free: '무료',
    official: '공식 페이지',
    tab: { course: '무료 과정', exam: '수험 인증', micro: '스킬 배지' },
  },
  quiz: {
    qTitle: '용어 맞추기',
    prompt: '다음은 어떤 용어에 대한 설명인가요?',
    title: '퀴즈',
    rate: '정답률 {0}% ({1}/{2})',
    daily: '📅 오늘의 문제',
    practice: '🎯 연습 8문제',
    next: '다음 문제',
    empty: '내일도 새 문제가 등장해요. (날짜에 따라 문항이 달라집니다)',
    correct: '정답! 🎉',
    wrong: '틀렸어요. 정답은 “{0}”예요.',
    example: '예)',
  },
  dev: {
    title: '🧪 자기진단',
    sub: '(개발자 전용) 사이트 자가 점검. 배포용 아님, 로컬 저장 기준.',
    fetchedAt: '마지막 RSS 수집 시각',
    count: '저장된 뉴스 건수',
    tiers: '요약 티어',
    sourceCounts: '소스별 건수',
    userState: '사용자 상태 (localStorage)',
    tiFormat: 'LLM {0} · 규칙 {1} · excerpt {2}',
    helpTitle: '도움말',
    help1: 'LLM 요약 켜기: DevTools ≥ Application ≥ localStorage 에서 aiCompassSummon = ollama 설정 → npm run refresh',
    help2: '데이터 초기화: 같은 화면서 aiHuBridge/user 키 삭제',
    help3: '전체 자동 검증: 터미널에서 npm run selfcheck',
    noFetch: '미수집 (npm run refresh)',
    ruleFallback: '규칙 요약 사용 중 (LLM 미연결)',
  },
  notFound: {
    message: '페이지를 찾을 수 없어요. (AI가 아니라 라우터가 못 찾았을 뿐이에요 😄)',
    back: '브리핑으로 돌아가기',
  },
  category: {
    '업체/제품': '업계·제품',
    '연구/논문': '연구·논문',
    '정책/규제': '정책·규제',
    오픈소스: '오픈소스',
    언론: '언론',
    '블로그/개인': '블로그',
  },
  level: { 초급: '초급', 중급: '중급', 고급: '고급' },
  pathCategory: {
    '개론/개념': '개론·개념',
    언어모델: '언어모델',
    '프롬프트·도구': '프롬프트·도구',
    '에이전트·앱': '에이전트·앱',
    '클라우드·MLOps': '클라우드·MLOps',
    '비즈니스·전략': '비즈니스·전략',
  },
  pathStage: {
    understand: { title: '1. 알기', sub: '용어 하나씩, 두려움 없이' },
    try: { title: '2. 해보기', sub: '코드 없이 체험하는 AI' },
    certify: { title: '3. 통과하기', sub: '작은 걸음부터 인증을 쌓아가기' },
    expert: { title: '4. 전문가 되기', sub: '심화하고 연결고리 만들기' },
  },
};

const en: Dict = {
  ui: {
    min: 'm',
    example: 'e.g.',
    related: 'Related:',
    more: '↻ Another term',
  },
  nav: {
    briefing: '브리핑',
    info: '정보관',
    learn: '학습관',
    research: 'AI뉴스',
    path: '학습 커리큘럼',
    certs: '인증기관교육',
    quiz: '퀴즈',
    dev: '개발자',
    settings: '설정',
  },
  footer: { copy: 'Personal learning board · local storage only · reset anytime' },
  settings: {
    title: 'Settings',
    theme: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    language: 'Language',
    saved: 'Saved',
    themeHint: 'System: follows your OS dark-mode setting.',
  },
  home: {
    heading: "Today's AI Briefing",
    loading: 'Loading…',
    allResearch: 'All research',
    concept: "Today's AI concept",
    sub: 'Latest AI news, free learning paths, and certification badges — an easy AI learning desk for non-engineers.',
    tagline: 'News, learning, certifications — your personal AI desk',
    streak: '🔥 {0}-day streak · Lv.{1} (XP {2})',
    pick: "Today's Pick 4",
    recent: 'Recently viewed',
    badges: 'My badges',
    noNews: "No news yet. Run 'npm run refresh' in your terminal. →",
    devLink: 'Diagnostics',
    briefingLabel: "Today's one-line AI briefing",
    nextUp: 'Lv.{0} — next level-up recommended',
    study: 'Go learn →',
    more: 'See more →',
    progress: '{0}/{1} items done ({2}%)',
  },
  research: {
    title: 'Research',
    sub: '{0} AI articles · filter by category',
    empty: 'No articles in this category yet. Run npm run refresh to update.',
    devLink: 'Diagnostics → last fetch time',
  },
  path: {
    title: 'Learning Path',
    sub: '4-stage route for non-engineers — earn badges as you complete.',
    progress: '{0}/{1} items done ({2}%)',
    filterLevel: 'Level:',
    filterCategory: 'Field:',
    filterAll: 'All',
    filterReset: 'Reset filter',
    toCerts: 'View certificates',
  },
  certs: {
    title: 'Certificates',
    back: 'Back to learning path',
    note: 'Toggle "complete" to track your progress. (Stored in localStorage, not shared.)',
    footer: 'Take exams directly on the official sites. (Links verified Oct 2026.)',
    checked: '✓ complete',
    checkedOn: 'Marked complete',
    checkedOff: 'Mark complete',
    free: 'Free',
    official: 'Official site',
    tab: { course: 'Free courses', exam: 'Exams', micro: 'Skill badges' },
  },
  quiz: {
    qTitle: 'Match the term',
    prompt: 'Which term is described below?',
    title: 'Quiz',
    rate: 'Accuracy {0}% ({1}/{2})',
    daily: "📅 Today's question",
    practice: '🎯 Practice (8 questions)',
    next: 'Next question',
    empty: 'A new question appears tomorrow. (Items change by date.)',
    correct: 'Correct! 🎉',
    wrong: 'Incorrect. The answer is “{0}”.',
    example: 'e.g.',
  },
  dev: {
    title: '🧪 Diagnostics',
    sub: '(developer only) self-check. not for production, local-storage based.',
    fetchedAt: 'Last RSS fetch',
    count: 'Stored news items',
    tiers: 'Summary tier',
    sourceCounts: 'Count by source',
    userState: 'User state (localStorage)',
    tiFormat: 'LLM {0} · rule {1} · excerpt {2}',
    helpTitle: 'Help',
    help1: 'Enable LLM summary: DevTools → Application → localStorage, set aiCompassSummon = ollama, then run npm run refresh',
    help2: 'Reset data: delete the aiHuBridge/user key in the same screen',
    help3: 'Full self-check: run npm run selfcheck in the terminal',
    noFetch: 'Not fetched yet (npm run refresh)',
    ruleFallback: 'Using rule-based summaries (LLM not connected)',
  },
  notFound: {
    message: 'Page not found. (Blame the router, not AI 😄)',
    back: 'Back to briefing',
  },
  category: {
    '업계/제품': 'Industry/Product',
    '연구/논문': 'Research/Papers',
    '정책/규제': 'Policy/Regulation',
    오픈소스: 'Open source',
    언론: 'Media',
    '블로그/개인': 'Blog/Personal',
  },
  level: { 초급: 'Beginner', 중급: 'Intermediate', 고급: 'Advanced' },
  pathCategory: {
    '개론/개념': 'Foundations',
    언어모델: 'Language Models',
    '프롬프트·도구': 'Prompts & Tools',
    '에이전트·앱': 'Agents & Apps',
    '클라우드·MLOps': 'Cloud & MLOps',
    '비즈니스·전략': 'Business & Strategy',
  },
  pathStage: {
    understand: { title: '1. Understand', sub: 'Learn one term at a time, fear-free' },
    try: { title: '2. Try', sub: 'AI without code' },
    certify: { title: '3. Certify', sub: 'Stack credentials step by step' },
    expert: { title: '4. Expert', sub: 'Deepen and connect the dots' },
  },
};

export const messages: Record<Lang, Dict> = { ko, en };

function walk(obj: unknown, path: string[]): unknown {
  return path.reduce<unknown>(
    (acc, k) =>
      acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
    obj,
  );
}

/** 다국어 문자열 조회. {0},{1}.. 자리표시자 치환 지원. */
export function t(lang: Lang, key: string, ...args: (string | number)[]): string {
  const raw = walk(messages[lang], key.split('.'));
  let s = typeof raw === 'string' && raw.length > 0 ? raw : key;
  args.forEach((a, i) => {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), String(a));
  });
  return s;
}

/** 컴포넌트에서 `const t = useT();` 로 사용 */
export function useT(): (key: string, ...args: (string | number)[]) => string {
  const { state } = useUser();
  const lang = state.lang ?? 'ko';
  return (key: string, ...args: (string | number)[]) => t(lang, key, ...args);
}
