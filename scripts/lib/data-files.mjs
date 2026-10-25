import { writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// 파일 쓰기가 중단되어도 기존 JSON이 일부만 쓰인 상태로 남지 않게 한다.
export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', 'utf8');
  renameSync(temporary, path);
}
