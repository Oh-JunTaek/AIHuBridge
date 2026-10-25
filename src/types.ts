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
  sourceId?: string; // 이전 수집 파일은 표시명으로 호환한다.
  lang?: 'ko' | 'en' | 'unknown';
  publishedAt: string; // ISO
  category: Category;
  tags: string[];
  excerpt: string;        // 본문 앞부분 (규칙 요약 fallback)
  summary: string | null;  // RSS 설명문을 규칙으로 발췌한 내용
  readMinutes: number;
}

export interface NewsResult {
  status: 'success' | 'empty' | 'error';
  items: NewsItem[];
  fetchedAt: string | null;
  stale: boolean;
  warning: string | null;
  error: string | null;
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

export interface UiPreferences {
  lang: Lang;
  theme: Theme;
}

// ── AI 교육·행사 모집 캘린더 (F-002) ─────────────────────────────
export type EventType = 'seminar' | 'webinar' | 'workshop' | 'bootcamp' | 'hackathon' | 'competition' | 'training' | 'conference' | 'meetup' | 'other';

export type EventStatus =
  | 'recruiting'   // 모집 중
  | 'scheduled'    // 모집 예정
  | 'closed'       // 모집 마감
  | 'announced'    // 개최일 공개, 신청 마감 미확인
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
  eventDate?: string;               // 현지 날짜만 공개된 경우, 시각·시간대 추정 금지
  eventEndDate?: string | null;

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
  timezone: 'Asia/Seoul' | null;     // 현지 날짜만 공개된 행사는 null
  verification: 'rss-explicit' | 'manual' | 'public-event';
  sourceUrl?: string;               // 공개 일정 제공처
  topics?: string[];                // 제공처가 공개한 행사 주제
  dateEvidence: string;             // 신청 마감일을 확인한 원문 근거
  lang: 'ko' | 'en' | 'unknown';    // 출처 언어, 자동 추정하지 않음
}
