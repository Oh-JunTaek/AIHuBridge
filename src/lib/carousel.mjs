/** 현재 위치에서 한 카드씩 이동하며 양쪽 끝에서 순환한다. */
export function nextCarouselOffset(current, max, step, direction) {
  if (max <= 0 || step <= 0) return 0;
  if (direction > 0 && current >= max - 6) return 0;
  if (direction < 0 && current <= 6) return max;
  return Math.max(0, Math.min(max, current + direction * step));
}
