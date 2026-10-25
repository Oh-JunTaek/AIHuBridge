import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePreferences, readPreferences, writePreferences } from '../src/lib/preferences-data.mjs';
test('이전 학습·인증·퀴즈 기록과 영어 값은 이어받지 않고 테마만 유지', () => {
  const result = normalizePreferences({ theme: 'dark', lang: 'en', completedCourseIds: ['course'], earnedCertChecks: ['cert'], quizHistory: [], xp: 200 });
  assert.deepEqual(result, { lang: 'ko', theme: 'dark' });
});
test('손상된 저장 값·저장소 접근 예외에도 기본 화면 설정 제공', () => {
  for (const getItem of [() => '{잘못된 JSON', () => { throw new Error('저장소 차단'); }, () => 'null']) {
    assert.deepEqual(readPreferences({ getItem }, 'key'), { lang: 'ko', theme: 'system' });
  }
});
test('설정 저장 실패는 예외 대신 실패 상태로 반환', () => {
  assert.equal(writePreferences({ setItem() { throw new Error('용량 초과'); } }, 'key', { lang: 'ko', theme: 'light' }), false);
});
test('저장할 때도 표시 설정 외의 개인 기록은 제외', () => {
  let saved;
  assert.equal(writePreferences({ setItem(_key, value) { saved = value; } }, 'key', { theme: 'dark', streak: 3 }), true);
  assert.deepEqual(JSON.parse(saved), { lang: 'ko', theme: 'dark' });
});
