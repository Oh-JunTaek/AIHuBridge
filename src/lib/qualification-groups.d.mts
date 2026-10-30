export type QualificationGroup = { name: string; ids: string[] };
export const qualificationGroups: QualificationGroup[];
export function groupOf(id: string): QualificationGroup | undefined;
export function groupResults<T extends { id: string }>(items: T[]): T[];
