import test from 'node:test';
import assert from 'node:assert/strict';
import { nextCarouselIndex } from '../src/lib/carousel.mjs';

test('전시 공간은 한 장씩 이동하고 양쪽 끝에서 순환한다', () => {
  assert.equal(nextCarouselIndex(0, 4, 1), 1);
  assert.equal(nextCarouselIndex(3, 4, 1), 0);
  assert.equal(nextCarouselIndex(0, 4, -1), 3);
  assert.equal(nextCarouselIndex(2, 4, -1), 1);
});
test('항목이 추가되거나 없는 경우에도 순환 범위를 지킨다', () => {
  assert.equal(nextCarouselIndex(4, 5, 1), 0);
  assert.equal(nextCarouselIndex(0, 1, -1), 0);
  assert.equal(nextCarouselIndex(0, 0, 1), 0);
});
