
export type Lang = 'ko';  // 한국어 전용 (영어 지원 제거)

// 언어 고정 (한국어 전용)
export const LANG = { value: 'ko' as Lang, label: '한국어' } as const;


type Dict = Record<string, unknown>;

const ko: Dict = {
  ui: {
    min: '분',
  },
  nav: {
    briefing: '홈',
    updates: 'AI 소식',
    learning: '학습관',
    information: '정보관',
    path: '추천 커리큘럼',
    certs: '수료관',
    qualifications: '자격관',
    resources: '학습 자료실',
    social: '기업 SNS',
    calendar: 'AI 캘린더',
  },
  footer: { copy: 'AI 소식·교육·일정을 한곳에서' },
  home: {
    heading: 'AI 소식 한눈에',
    loading: '소식을 불러오는 중…',
    allUpdates: 'AI 소식 모두 보기',
    sub: 'AI 최신 소식부터 교육·인증 정보와 다양한 AI 행사까지 한곳에서 확인하세요.',
    tagline: 'AI 소식·교육·행사를 연결합니다.',
    pick: '최근 소식 4건',
    recent: '최근 소식',
    noNews: '소식을 불러오지 못했거나 등록된 소식이 없습니다. 잠시 후 다시 확인해 주세요.',
    devLink: '자기진단',
    briefingLabel: '가장 최근 소식',
    more: '더 보기',
    study: '추천 커리큘럼 보기 →',
  },
  updates: {
    title: 'AI 소식',
    sub: '보도·공식 발표·연구 논문 {0}건',
    empty: '선택한 분야와 조건에 맞는 소식이 없습니다. 필터를 조정해 보세요.',
    devLink: '개발용 자기진단 → 마지막 수집 시각 확인',
  },
  path: {
    title: '추천 커리큘럼',
    sub: '기초 쌓기부터 공식 교육·인증으로 이어지는 4단계 학습 경로',
    filterLevel: '난이도:',
    filterCategory: '분야:',
    filterAll: '전체',
    filterReset: '조건 초기화',
    toCerts: '수료관 보기',
  },
  certs: {
    title: '수료관',
    back: '추천 커리큘럼으로 돌아가기',
    note: '수료증 발급 비용과 조건은 공식 페이지에서 확인하세요. 개인 완료 기록은 제공하지 않습니다.',
    footer: '비용과 조건은 변경될 수 있습니다. 각 카드의 검토일·공식 근거와 신청 화면을 확인하세요.',
    free: '무료',
    official: '공식 페이지',
    tab: { course: '학습 과정', exam: '자격시험', micro: '역량 인증' },
  },
  dev: {
    title: '🧪 자기진단',
    sub: 'AI 소식과 AI 일정의 수집 현황을 확인합니다.',
    fetchedAt: '마지막 수집 시각',
    count: '저장된 소식 건수',
    tiers: '소식 설명 방식',
    sourceCounts: '제공처별 건수',
    tiFormat: '설명문 있음 {0} · 제목·링크만 {1}',
    helpTitle: '도움말',
    help1: '소식 설명은 RSS·Atom 원문을 규칙으로 발췌합니다. 자동 번역이나 생성형 요약은 제공하지 않습니다.',
    help2: '데이터 초기화: 같은 화면서 aiHuBridge/user 키 삭제',
    help3: '전체 자동 검증: 터미널에서 npm run selfcheck',
    noFetch: '미수집 (npm run refresh)',
    ruleFallback: 'RSS 설명문 발췌 사용 중',
  },
  notFound: {
    message: '페이지를 찾을 수 없습니다. 주소를 확인해 주세요.',
    back: '홈으로 돌아가기',
  },
  category: {
    '업계/제품': '업계·제품',
    '연구/논문': '연구·논문',
    '정책/규제': '정책·규제',
    오픈소스: '오픈소스·개발',
    언론: '미디어·커뮤니티',
    '블로그/개인': '커뮤니티 글',
  },
  level: { 초급: '초급', 중급: '중급', 고급: '고급' },
  pathCategory: {
    '프로그래밍·데이터': '프로그래밍·데이터',
    'AI 수학': 'AI 수학',
    '개론/개념': '개론·개념',
    언어모델: '언어 모델',
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
