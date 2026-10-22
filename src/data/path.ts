/**
 * AI Compass 학습 로드맵 (비전공자 4단계).
 * 각 단계는 사이트의 '학습 경로' 페이지에서 진행 체크박스로 사용됩니다.
 */
export type Stage = {
  id: 'understand' | 'try' | 'certify' | 'expert';
  title: string;
  subtitle: string;
  icon: string;
  items: StageItem[];
};

export type StageItem = {
  id: string;
  label: string;
  kind: 'concept' | 'course' | 'cert';
  refId: string; // glossary.term / certification.id
  estMin: number; // 예상 소요 시간 (분)
};

export const stages: Stage[] = [
  {
    id: 'understand',
    title: '1. 알기',
    subtitle: '용어 하나씩, 두려움 없이',
    icon: '📚',
    items: [
      { id: 'u-llm', label: '대형 언어 모델(LLM) 이해', kind: 'concept', refId: '대형 언어 모델(LLM)', estMin: 2 },
      { id: 'u-prompt', label: '프롬프트·Temperature', kind: 'concept', refId: 'Temperature', estMin: 2 },
      { id: 'u-rag', label: 'RAG·벡터 DB·임베딩', kind: 'concept', refId: 'RAG', estMin: 3 },
      { id: 'u-agent', label: 'Agent와 Tool use', kind: 'concept', refId: 'Agent', estMin: 2 },
    ],
  },
  {
    id: 'try',
    title: '2. 해보기',
    subtitle: '코드 없이 체험하는 AI',
    icon: '🚀',
    items: [
      { id: 't-prompting', label: 'AI Prompting for Everyone', kind: 'course', refId: 'dlai-prompting', estMin: 420 },
      { id: 't-build', label: 'Build with Andrew', kind: 'course', refId: 'dlai-build-with-andrew', estMin: 30 },
      { id: 't-everyone', label: 'AI For Everyone', kind: 'course', refId: 'coursera-ai-for-everyone', estMin: 690 },
      { id: 't-eoai', label: 'Elements of AI', kind: 'course', refId: 'elementsofai', estMin: 360 },
      { id: 't-hf', label: 'Hugging Face LLM Course', kind: 'course', refId: 'hf-llm-course', estMin: 240 },
    ],
  },
  {
    id: 'certify',
    title: '3. 통과하기',
    subtitle: '작은 걸음부터 인증을 쌓아가기',
    icon: '🎯',
    items: [
      { id: 'c-ai900', label: 'Microsoft AI-900 (입문)', kind: 'cert', refId: 'msft-ai-900', estMin: 120 },
      { id: 'c-gcpai', label: 'Google Generative AI Leader', kind: 'cert', refId: 'gcp-generative-ai-leader', estMin: 120 },
      { id: 'c-awssai', label: 'AWS AI Business Strategist', kind: 'cert', refId: 'aws-ai-business-strategist', estMin: 120 },
    ],
  },
  {
    id: 'expert',
    title: '4. 전문가 되기',
    subtitle: '심화하고 연결고리 만들기',
    icon: '🧠',
    items: [
      { id: 'e-agentic', label: 'Agentic AI (심화)', kind: 'course', refId: 'dlai-agentic', estMin: 595 },
      { id: 'e-mlengineer', label: 'Google ML Engineer', kind: 'cert', refId: 'gcp-machine-learning-engineer', estMin: 240 },
      { id: 'e-applied', label: 'Microsoft Applied Skills', kind: 'cert', refId: 'msft-applied-skills-ai', estMin: 120 },
    ],
  },
];
