import test from 'node:test';
import assert from 'node:assert/strict';
import { nextCarouselOffset } from '../src/lib/carousel.mjs';

test('전시 공간은 한 장씩 이동하고 끝에서 처음으로 순환한다', () => {
  assert.equal(nextCarouselOffset(0, 600, 200, 1), 200);
  assert.equal(nextCarouselOffset(400, 600, 200, 1), 600);
  assert.equal(nextCarouselOffset(600, 600, 200, 1), 0);
  assert.equal(nextCarouselOffset(0, 600, 200, -1), 600);
  assert.equal(nextCarouselOffset(3, 600, 200, -1), 600);
});
test('카드가 더 적거나 남은 거리가 짧아도 범위 밖으로 이동하지 않는다', () => {
  assert.equal(nextCarouselOffset(0, 0, 200, 1), 0);
  assert.equal(nextCarouselOffset(400, 500, 200, 1), 500);
  assert.equal(nextCarouselOffset(100, 500, 200, -1), 0);
});
