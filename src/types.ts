import type { Lang, Theme } from './lib/i18n';

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
  summary: string | null;  // RSS 설명문을 규칙으로 발췌한 내용
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
  /** UI 선호: 언어 (ko/en) */
  lang: Lang;
  /** UI 선호: 다크모드 (light/dark/system) */
  theme: Theme;
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

// ── AI 교육·행사 모집 캘린더 (F-002) ─────────────────────────────
export type EventType = 'seminar' | 'webinar' | 'workshop' | 'bootcamp' | 'hackathon' | 'competition' | 'training';

export type EventStatus =
  | 'recruiting'   // 모집 중
  | 'scheduled'    // 모집 예정
  | 'closed'       // 모집 마감
  | 'completed';

export interface CalendarEvent {
  id: string;                      // hash(ID)
  title: string;                   // 교육/행사명
  host: string;                    // 주최기관
  type: EventType;                 // 종류
  category: 'ai-core' | 'ai-applied' | 'data' | 'mlops' | 'general';

  // 일시 (ISO 문자열, null 허용)
  applicationStart: string | null; // 신청 시작일
  applicationEnd: string | null;    // 마감일 (D-day 계산용)
  eventStart: string | null;        // 행사 시작일
  eventEnd: string | null;          // 행사 종료일

  // 분포
  isOnline: boolean | null;
  location: string | null;          // 미확인 시 null
  feeType: 'free' | 'paid' | 'unknown';
  feeAmount: number | null;         // 유료 시 금액 (KRW)
  region: string | null;            // 미확인 시 null

  // 메타
  url: string;                      // 공식 신청 링크
  status: EventStatus;
  confirmedAt: string | null;       // 수동으로 내용 확인한 날짜
  publishedAt: string | null;       // 공고 게시일 (모집일과 별개)
  fetchedAt: string;
  timezone: 'Asia/Seoul';
  verification: 'rss-explicit' | 'manual';
  dateEvidence: string;             // 신청 마감일을 확인한 원문 근거
  lang: 'ko' | 'en';                // 출처 언어
}
