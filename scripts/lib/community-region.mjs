import { readFileSync } from 'node:fs';
const { geometry } = JSON.parse(readFileSync(new URL('../data/korea-boundary.json', import.meta.url), 'utf8'));

function insideRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// 주최 커뮤니티의 공개 위치는 지역 구분에만 쓰고 좌표 자체는 저장·표시하지 않는다.
// Natural Earth의 공개 도메인 대한민국 경계이며 실제 행사장·온라인 접속 가능 국가를 보증하지 않는다.
export function communityRegion(latitude, longitude) {
  if (![latitude, longitude].every((value) => typeof value === 'number' || typeof value === 'string')) return 'unknown';
  if (latitude === null || longitude === null || latitude === '' || longitude === '') return 'unknown';
  const y = Number(latitude), x = Number(longitude);
  if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 180 || Math.abs(y) > 90 || (x === 0 && y === 0)) return 'unknown';
  const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
  if (polygons.some(([outer, ...holes]) => insideRing(x, y, outer) && !holes.some((hole) => insideRing(x, y, hole)))) return 'domestic';
  // 일반화된 경계 인근의 해안·섬 위치는 해외로 단정하지 않는다.
  if (x >= 124 && x <= 132 && y >= 32 && y <= 40) return 'unknown';
  return 'overseas';
}
