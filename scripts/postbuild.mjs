// dist/404.html을 dist/ 루트에 복사 → SPA fallback (GitHub Pages)
import { copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));
console.log('✅ dist/404.html (SPA fallback) created');
