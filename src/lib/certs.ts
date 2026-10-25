import type { Certification } from '../types';
import { certifications } from '../data/certifications';
import { feeLabel } from './cert-rules.mjs';

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
  return feeLabel(c.credentialFee);
}
