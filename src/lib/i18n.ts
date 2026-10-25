
export type Lang = 'ko';  // 한국어 전용 (영어 지원 제거)

// 언어 고정 (한국어 전용)
export const LANG = { value: 'ko' as Lang, label: '한국어' } as const;

export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

type Dict = Record<string, unknown>;

const ko: Dict = {
  ui: {
    min: '분',
  },
  nav: {
    briefing: '브리핑',
    research: 'AI뉴스',
    path: '학습 커리큘럼',
    certs: '인증 기관 교육',
    calendar: 'AI 캘린더',

    settings: '설정',
  },
  footer: { copy: 'AI 소식·교육·일정을 한곳에서' },
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
    sub: 'AI 최신 소식부터 교육·인증 정보와 다양한 AI 행사까지 한곳에서 확인하세요.',
    tagline: 'AI 소식·교육·행사를 연결합니다.',
    pick: '오늘의 Pick 4',
    recent: '최근 소식',
    noNews: '뉴스 정보를 불러오지 못했거나 등록된 뉴스가 없습니다. 잠시 후 다시 확인해 주세요.',
    devLink: '자기진단',
    briefingLabel: '오늘의 AI 한 줄 브리핑',
    more: '더 보기 →',
    study: '학습 하러 가기 →',
  },
  research: {
    title: '리서치',
    sub: 'AI 최신 소식 {0}건 · 카테고리로 걸러보기',
    empty: '이 카테고리에는 현재 표시할 기사가 없습니다.',
    devLink: '개발용 자기진단 → 마지막 수집 시각 확인',
  },
  path: {
    title: '학습 경로',
    sub: '기초 쌓기부터 공식 교육·인증으로 이어지는 4단계 학습 경로',
    filterLevel: '난이도:',
    filterCategory: '분야:',
    filterAll: '전체',
    filterReset: '필터 초기화',
    toCerts: '인증기관 교육 보기',
  },
  certs: {
    title: '인증기관 교육',
    back: '학습 경로로 돌아가기',
    note: '교육과 시험의 비용·조건은 공식 페이지에서 확인하세요. 개인 완료 기록은 제공하지 않습니다.',
    footer: '비용과 조건은 변경될 수 있습니다. 각 카드의 검토일·공식 근거와 신청 화면을 확인하세요.',
    free: '무료',
    official: '공식 페이지',
    tab: { course: '학습 과정', exam: '수험 인증', micro: '스킬 배지' },
  },
  dev: {
    title: '🧪 자기진단',
    sub: '뉴스와 AI 일정의 수집 현황을 확인합니다.',
    fetchedAt: '마지막 RSS 수집 시각',
    count: '저장된 뉴스 건수',
    tiers: '뉴스 설명 방식',
    sourceCounts: '소스별 건수',
    tiFormat: '규칙 발췌 {0} · 원문 설명 {1}',
    helpTitle: '도움말',
    help1: '뉴스 설명은 RSS 원문을 규칙으로 발췌합니다. 자동 번역이나 생성형 요약은 제공하지 않습니다.',
    help2: '데이터 초기화: 같은 화면서 aiHuBridge/user 키 삭제',
    help3: '전체 자동 검증: 터미널에서 npm run selfcheck',
    noFetch: '미수집 (npm run refresh)',
    ruleFallback: 'RSS 설명문 발췌 사용 중',
  },
  notFound: {
    message: '페이지를 찾을 수 없어요. (AI가 아니라 라우터가 못 찾았을 뿐이에요 😄)',
    back: '브리핑으로 돌아가기',
  },
  category: {
    '업계/제품': '업계·제품',
    '연구/논문': '연구·논문',
    '정책/규제': '정책·규제',
    오픈소스: '오픈소스',
    언론: '언론',
    '블로그/개인': '블로그',
  },
  level: { 초급: '초급', 중급: '중급', 고급: '고급' },
  pathCategory: {
    '프로그래밍·데이터': '프로그래밍·데이터',
    'AI 수학': 'AI 수학',
    '개론/개념': '개론·개념',
    언어모델: '언어모델',
    '프롬프트·도구': '프롬프트·도구',
    '에이전트·앱': '에이전트·앱',
    '클라우드·MLOps': '클라우드·MLOps',
    '비즈니스·전략': '비즈니스·전략',
  },
  pathStage: {
    foundation: { title: '0. 기초 쌓기', sub: 'AI 개념 → 파이썬 → 수학·데이터 기초' },
    try: { title: '1. 해보기', sub: '코드 없이 체험하는 AI' },
    certify: { title: '2. 통과하기', sub: '작은 걸음부터 인증을 쌓아가기' },
    expert: { title: '3. 전문가 되기', sub: '심화하고 연결고리 만들기' },
  },
};

export const messages: Record<Lang, Dict> = { ko };

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
  const lang: Lang = 'ko';
  return (key: string, ...args: (string | number)[]) => t(lang, key, ...args);
}
