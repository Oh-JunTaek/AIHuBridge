import test from 'node:test';
import assert from 'node:assert/strict';
import { Work24Error, safeWork24Error } from './lib/work24-errors.mjs';

test('고용24 진단에는 허용된 분류와 HTTP 상태만 출력한다', () => {
  assert.equal(safeWork24Error(new Work24Error('http_error', 403)), 'HTTP 오류 응답 (HTTP 403)');
  assert.equal(safeWork24Error(new Work24Error('http_error', 'secret')), 'HTTP 오류 응답');
  assert.equal(safeWork24Error(new Error('secret https://example.com/?authKey=secret')), '확인되지 않은 오류');
  const error = new Work24Error('unknown-secret', 200);
  assert.doesNotMatch(safeWork24Error(error), /secret/);
});
