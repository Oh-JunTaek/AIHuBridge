import test from 'node:test';
import assert from 'node:assert/strict';
import { groupOf, groupResults, qualificationGroups } from '../src/lib/qualification-groups.mjs';

test('각 급수는 한 카드로 묶이고 선택한 급수는 유지된다', () => {
  for (const group of qualificationGroups) {
    const levels = group.ids.map((id) => ({ id }));
    assert.equal(groupResults(levels).length, 1);
    assert.equal(groupResults(levels.slice(1))[0].id, group.ids[1]);
    assert.equal(groupOf(group.ids[1]).name, group.name);
  }
  assert.deepEqual(groupResults([{id:'other'}, {id:'ai-pot-2'}]).map((x) => x.id), ['other', 'ai-pot-2']);
});
