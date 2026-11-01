import test from 'node:test';
import assert from 'node:assert/strict';
import { Work24Error, safeWork24Error, safeResponseShape, safeResponseCategory } from './lib/work24-errors.mjs';

test('고용24 진단에는 허용된 분류와 HTTP 상태만 출력한다', () => {
  assert.equal(safeWork24Error(new Work24Error('http_error', 403)), 'HTTP 오류 응답 (HTTP 403)');
  assert.equal(safeWork24Error(new Work24Error('http_error', 'secret')), 'HTTP 오류 응답');
  assert.equal(safeWork24Error(new Error('secret https://example.com/?authKey=secret')), '확인되지 않은 오류');
  const error = new Work24Error('unknown-secret', 200);
  assert.doesNotMatch(safeWork24Error(error), /secret/);
});

test('원문 메시지와 키를 노출하지 않고 고정된 분류만 반환한다', () => {
  assert.equal(safeResponseCategory({ jobsList:{ message:'인증키 secret 오류' } }), '인증 관련');
  assert.equal(safeResponseCategory({ jobsList:{ message:'검색 결과가 없습니다' } }), '결과 없음');
  assert.equal(safeResponseCategory({ error:{ message:'secret' } }), '기타 메시지');
  assert.doesNotMatch(safeWork24Error(new Work24Error('schema_error', undefined, undefined, 'secret')), /secret/);
});

test('응답 구조 진단은 미리 허용된 키 이름만 포함한다', () => {
  const shape = safeResponseShape({ response: { authKey:'secret' }, secret:'private' }, 'HRDNet', 'scn_cnt');
  assert.equal(shape, '최상위=response, 기대항목=없음, 건수=없음, 유형=기타, 내부=기타');
  assert.doesNotMatch(safeWork24Error(new Work24Error('schema_error', undefined, shape)), /secret|private/);
  assert.doesNotMatch(safeWork24Error(new Work24Error('schema_error', undefined, 'secret')), /secret/);
});
