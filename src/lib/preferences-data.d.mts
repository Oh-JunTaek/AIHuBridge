import type { UiPreferences } from '../types';
export function normalizePreferences(value: unknown): UiPreferences;
export function readPreferences(storage: Pick<Storage, 'getItem'>, key: string): UiPreferences;
export function writePreferences(storage: Pick<Storage, 'setItem'>, key: string, preferences: UiPreferences): boolean;
