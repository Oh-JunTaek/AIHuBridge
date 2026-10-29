import test from 'node:test';
import assert from 'node:assert/strict';
import { middleCarouselIndex, nextCarouselIndex } from '../src/lib/carousel.mjs';

test('전시 공간은 한 장씩 이동하고 양쪽 끝에서 순환한다', () => {
  assert.equal(nextCarouselIndex(0, 4, 1), 1);
  assert.equal(nextCarouselIndex(3, 4, 1), 0);
  assert.equal(nextCarouselIndex(0, 4, -1), 3);
  assert.equal(nextCarouselIndex(2, 4, -1), 1);
});
test('복제 구간은 같은 항목의 가운데 구간으로 돌아간다', () => {
  assert.equal(middleCarouselIndex(8, 4), 4);
  assert.equal(middleCarouselIndex(3, 4), 7);
  assert.equal(middleCarouselIndex(12, 6), 6);
  assert.equal(middleCarouselIndex(-1, 4), 7);
  assert.equal(middleCarouselIndex(0, 0), 0);
});
test('항목이 추가되거나 없는 경우에도 순환 범위를 지킨다', () => {
  assert.equal(nextCarouselIndex(4, 5, 1), 0);
  assert.equal(nextCarouselIndex(0, 1, -1), 0);
  assert.equal(nextCarouselIndex(0, 0, 1), 0);
});
