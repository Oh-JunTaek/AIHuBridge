// dist/404.html을 dist/ 루트에 복사 → SPA fallback (GitHub Pages)
import { copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));
console.log('✅ dist/404.html (SPA fallback) created');

// 약관에서 저장소와 동일한 라이선스 원문을 열 수 있도록 함께 배포한다.
copyFileSync(resolve(__dirname, '../LICENSE'), resolve(distDir, 'LICENSE.txt'));
console.log('✅ 코드 라이선스 원문 배포 파일 생성');
