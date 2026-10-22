import type { Certification, InternalBadge } from '../types';
import { certifications } from '../data/certifications';

/** 인증 → 카테고리 라벨 */
export const certTypeLabel: Record<Certification['type'], string> = {
  exam: '시험',
  micro: '마이크로 자격',
  course: '과정',
};

export const certTypeList: Certification['type'][] = ['exam', 'micro', 'course'];

export function certsByType(): Record<Certification['type'], Certification[]> {
  return {
    exam: certifications.filter((c) => c.type === 'exam'),
    micro: certifications.filter((c) => c.type === 'micro'),
    course: certifications.filter((c) => c.type === 'course'),
  };
}

export function getCert(id: string): Certification | undefined {
  return certifications.find((c) => c.id === id);
}

export function costLabel(c: Certification): string {
  const usd = c.costUSD ?? 0;
  if (usd === 0) return c.type === 'exam' ? '무료 시험' : '무료';
  // 간단 통화표시. KRW 환산은 개괄적으로 1:1400.
  const krw = usd * 1400;
  return `USD $${usd} (약 ₩${krw.toLocaleString()})`;
}

/** 학습 진도로부터 삼는 내부 뱃지 */
export function computeBadges(state: {
  completedCourseIds: string[];
  earnedCertChecks: string[];
  quizHistory: { ok: boolean }[];
  streak: number;
}): InternalBadge[] {
  const passedQuiz = state.quizHistory.filter((q) => q.ok).length;
  const badges: InternalBadge[] = [
    {
      id: 'first-course',
      label: '첫 학습 시작',
      earned: state.completedCourseIds.length >= 1,
      icon: '🌱',
      description: '무료 과정 1개 완료 체크',
    },
    {
      id: 'streak-3',
      label: '3일 연속',
      earned: state.streak >= 3,
      icon: '🔥',
      description: '3일 연속 방문',
    },
    {
      id: 'quiz-10',
      label: '단어 10회 정답',
      earned: passedQuiz >= 10,
      icon: '✅',
      description: '퀴즈 10문 연속(누적) 정답',
    },
    {
      id: 'all-courses',
      label: '무료 과정 마스터',
      earned:
        state.completedCourseIds.filter((id) => getCert(id)?.type === 'course')
          .length >= 5,
      icon: '🎓',
      description: '무료 과정 5개 완료',
    },
  ];
  return badges;
}
