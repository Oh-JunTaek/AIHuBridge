import type { Certification, EducationFee } from '../types';
export function isCertification(value: unknown): value is Certification;
export function feeLabel(fee?: EducationFee): string;
export function isEducationAvailable(item: Certification, now?: number): boolean;
export interface CertificationFilters { type?: string; language?: string; cost?: string; query?: string }
export function selectCertifications(items: Certification[], filters?: CertificationFilters, now?: number): Certification[];
