/** 전시 공간의 양 끝에서 반대편으로 순환한다. */
export function nextCarouselIndex(current, length, direction) {
  if (length <= 0) return 0;
  return (current + direction + length) % length;
}

/** 복제된 카드의 실제 항목과 같은 가운데 묶음의 위치를 반환한다. */
export function middleCarouselIndex(index, length) {
  if (length <= 0) return 0;
  return length + ((index % length) + length) % length;
}
