export type Category =
  | '업계/제품'
  | '연구/논문'
  | '정책/규제'
  | '오픈소스'
  | '블로그/개인'
  | '언론';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string; // ISO
  category: Category;
  tags: string[];
  excerpt: string;        // 본문 앞부분 (규칙 요약 fallback)
  summary: string | null;  // LLM 요약 (없으면 null → 규칙 요약 사용)
  readMinutes: number;
}

export type CertType = 'exam' | 'micro' | 'course';

export interface Certification {
  id: string;
  name: string;
  provider: string;
  type: CertType;
  examCode?: string;
  costUSD?: number;
  costKRW?: number;
  validity?: string; // e.g. "2 years"
  freePrep: boolean; // 무료 복습 자료/학습경로 존재 여부
  language: 'ko' | 'en' | 'both';
  difficulty: '초급' | '중급' | '고급';
  url: string;
  verifiedAt: string; // YYYY-MM-DD
  note?: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  url: string;
  duration: string; // "7h4m"
  level: '초급' | '중급' | '고급';
  cost: '무료' | '유료';
  tags: string[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  related?: string[];
}

export interface UserState {
  /** "2024-01-31" */
  lastActive: string;
  streak: number;
  completedCourseIds: string[];
  earnedCertChecks: string[];
  quizHistory: QuizAttempt[];
  level: number;
  xp: number;
}

export interface QuizAttempt {
  id: string;
  term: string;
  answered: string;
  correct: string;
  ok: boolean;
  at: string;
}

export interface InternalBadge {
  id: string;
  label: string;
  earned: boolean;
  icon: string;
  description: string;
}
