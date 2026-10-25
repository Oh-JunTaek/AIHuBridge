import { newsSources } from './news-sources.mjs';
// ── AI 허브릿지 루트 설정 ─────────────────────────────────
// ※ AIHuBridge 폴더 안에서만 동작. 외부 저장소 참조 없음.

export const config = {
  siteName: 'AI 허브릿지',
  tagline: 'AI 소식·교육·행사를 연결합니다.',
  newsSources,

  /** 카테고리별 컬러 (따뜻한 우드톤) */
  categoryColor: {
    '업계/제품': 'bg-amber-100 text-amber-800',
    '연구/논문': 'bg-cyan-100 text-cyan-800',
    '정책/규제': 'bg-emerald-100 text-emerald-800',
    '오픈소스': 'bg-teal-100 text-teal-800',
    '언론': 'bg-rose-100 text-rose-800',
    '블로그/개인': 'bg-purple-100 text-purple-800',
  },

  /** 로컬 저장 키 */
  storageKey: 'aiHuBridge/user',
} as const;

export type NewsSource = (typeof config.newsSources)[number];

export const nav = config;
