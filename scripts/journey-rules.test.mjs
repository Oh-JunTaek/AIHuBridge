import test from 'node:test';
import assert from 'node:assert/strict';
import { selectJourneyResources } from '../src/lib/journey-rules.mjs';

test('학습 단계는 확인된 후보 순서를 유지하고 종료된 후보를 대체한다', () => {
  const refs = [{ id:'old', slot:'practice', reason:'기본' }, { id:'new', slot:'practice', reason:'대체' }, { id:'book', slot:'reading', reason:'읽기' }];
  const items = [{ id:'old', active:false }, { id:'new', active:true }, { id:'book', active:true }];
  const pick = () => selectJourneyResources(refs, (id) => items.find((item) => item.id === id), (item) => item.active);
  assert.deepEqual(pick().map(({ ref }) => ref.reason), ['대체', '읽기']);
  items[0].active = true;
  assert.deepEqual(pick().map(({ item }) => item.id), ['old', 'book']);
  items[0].active = false; items[1].active = false;
  assert.deepEqual(pick().map(({ item }) => item.id), ['book']);
});
