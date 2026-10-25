/**
 * AI Compass 학습 로드맵 (비전공자 3단계).
 * 공식 교육 탐색용 단계이며 개인 체크·진도는 제공하지 않습니다.
 *
 * level(난이도): 초급 / 중급 / 고급
 * category(분야): 개론/개념 / 언어모델 / 프롬프트·도구 / 에이전트·앱 / 클라우드·MLOps / 비즈니스·전략
 * → 난이도별 혹은 분야별로 필터링할 수 있도록, 모든 항목에 명시합니다.
 */
export type Level = '초급' | '중급' | '고급';
export type PCategory =
  | '개론/개념'
  | '언어모델'
  | '프롬프트·도구'
  | '에이전트·앱'
  | '클라우드·MLOps'
  | '비즈니스·전략';

export type Stage = {
  id: 'try' | 'certify' | 'expert';
  title: string;
  subtitle: string;
  icon: string;
  items: StageItem[];
};

export type StageItem = {
  id: string;
  label: string;
  kind: 'course' | 'cert';
  refId: string; // certification.id
  estMin: number; // 예상 소요 시간 (분)
  level: Level;
  category: PCategory;
};

// 필터 UI 표시용 순서
export const levelOrder: Level[] = ['초급', '중급', '고급'];
export const categoryOrder: PCategory[] = [
  '개론/개념',
  '언어모델',
  '프롬프트·도구',
  '에이전트·앱',
  '클라우드·MLOps',
  '비즈니스·전략',
];

// 학습 경로 목록 필터 상태 (null = 전체)
export type PathFilter = { level: Level | null; category: PCategory | null };

export const stages: Stage[] = [
  {
    id: 'try',
    title: '1. 해보기',
    subtitle: '코드 없이 체험하는 AI',
    icon: '🚀',
    items: [
      { id: 't-prompting', label: 'AI Prompting for Everyone', kind: 'course', refId: 'dlai-prompting', estMin: 184, level: '초급', category: '프롬프트·도구' },
      { id: 't-build', label: 'Build with Andrew', kind: 'course', refId: 'dlai-build-with-andrew', estMin: 60, level: '초급', category: '에이전트·앱' },
      { id: 't-everyone', label: 'AI For Everyone', kind: 'course', refId: 'coursera-ai-for-everyone', estMin: 420, level: '초급', category: '비즈니스·전략' },
      { id: 't-eoai', label: 'Elements of AI', kind: 'course', refId: 'elementsofai', estMin: 360, level: '초급', category: '개론/개념' },
      { id: 't-hf', label: 'Hugging Face LLM Course', kind: 'course', refId: 'hf-llm-course', estMin: 240, level: '중급', category: '언어모델' },
    ],
  },
  {
    id: 'certify',
    title: '2. 통과하기',
    subtitle: '작은 걸음부터 인증을 쌓아가기',
    icon: '🎯',
    items: [
      { id: 'c-ai900', label: 'Microsoft AI-901 (입문)', kind: 'cert', refId: 'msft-ai-900', estMin: 120, level: '초급', category: '개론/개념' },
      { id: 'c-gcpai', label: 'Google Generative AI Leader', kind: 'cert', refId: 'gcp-generative-ai-leader', estMin: 120, level: '초급', category: '비즈니스·전략' },
      { id: 'c-awssai', label: 'AWS AI Business Strategist', kind: 'cert', refId: 'aws-ai-business-strategist', estMin: 120, level: '초급', category: '비즈니스·전략' },
    ],
  },
  {
    id: 'expert',
    title: '3. 전문가 되기',
    subtitle: '심화하고 연결고리 만들기',
    icon: '🧠',
    items: [
      { id: 'e-agentic', label: 'Agentic AI (심화)', kind: 'course', refId: 'dlai-agentic', estMin: 595, level: '중급', category: '에이전트·앱' },
      { id: 'e-mlengineer', label: 'Google ML Engineer', kind: 'cert', refId: 'gcp-machine-learning-engineer', estMin: 240, level: '고급', category: '클라우드·MLOps' },
      { id: 'e-applied', label: 'Microsoft Applied Skills', kind: 'cert', refId: 'msft-applied-skills-ai', estMin: 120, level: '중급', category: '클라우드·MLOps' },
    ],
  },
];
