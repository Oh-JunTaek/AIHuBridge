import sharp from 'sharp';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// 사용자가 제공한 원본 PNG는 유지하고, 표시용 WebP만 생성한다.
const names = ['news-design', 'learning-design', 'dashboard', 'resources', 'completion', 'qualifications', 'social'];
for (const name of names) {
  const input = new URL(`../src/assets/exhibit-${name}.png`, import.meta.url);
  const output = new URL(`../src/assets/exhibit-${name}.webp`, import.meta.url);
  await sharp(fileURLToPath(input)).webp({ quality: 88, effort: 5 }).toFile(fileURLToPath(output));
  console.log(`${name}: ${(await stat(input)).size} → ${(await stat(output)).size} bytes`);
}
