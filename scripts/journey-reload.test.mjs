import test from 'node:test';
import assert from 'node:assert/strict';
import { resetJourneyFiltersOnReload } from '../src/lib/journey-reload.mjs';

test('커리큘럼 목록 새로고침에서만 선택 조건을 제거한다', () => {
  const base = 'https://example.com/AIHuBridge/path?purpose=career&topic=qa&topic=data&other=1#part';
  assert.equal(resetJourneyFiltersOnReload(base, '/AIHuBridge/', 'reload'), '/AIHuBridge/path?other=1#part');
  assert.equal(resetJourneyFiltersOnReload(base, '/AIHuBridge/', 'navigate'), null);
  assert.equal(resetJourneyFiltersOnReload(base, '/AIHuBridge/', 'back_forward'), null);
  assert.equal(resetJourneyFiltersOnReload('https://example.com/AIHuBridge/path?purpose=career&journey=qa-first', '/AIHuBridge/', 'reload'), null);
  assert.equal(resetJourneyFiltersOnReload('https://example.com/AIHuBridge/path/qa-first?purpose=career', '/AIHuBridge/', 'reload'), null);
  assert.equal(resetJourneyFiltersOnReload('https://example.com/AIHuBridge/qualifications?topic=qa', '/AIHuBridge/', 'reload'), null);
  assert.equal(resetJourneyFiltersOnReload('https://example.com/path?purpose=create', '/', 'reload'), '/path');
});
