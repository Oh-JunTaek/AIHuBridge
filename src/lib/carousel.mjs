/** 전시 공간의 양 끝에서 반대편으로 순환한다. */
export function nextCarouselIndex(current, length, direction) {
  if (length <= 0) return 0;
  return (current + direction + length) % length;
}
