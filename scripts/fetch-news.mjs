import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { writeJson } from './lib/data-files.mjs';
import { readNewsFeed } from './lib/news-feeds.mjs';
import { collectNews } from './lib/news-collector.mjs';

const data = new URL('../public/data/', import.meta.url);
function previousFile(name, fallback) {
  try { return JSON.parse(readFileSync(new URL(name, data), 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') console.warn(`이전 데이터를 읽지 못했습니다: ${name}`);
    return fallback;
  }
}

async function main() {
  const result = await collectNews({ readFeed: readNewsFeed,
    previous: previousFile('news.json', []), previousMeta: previousFile('meta.json', {}) });
  writeJson(fileURLToPath(new URL('news.json', data)), result.items);
  writeJson(fileURLToPath(new URL('meta.json', data)), result.meta);
  console.log(`뉴스 수집: ${result.items.length}건 (RSS 설명문 발췌), 상태: ${result.meta.status}`);
  console.table(result.meta.sourceResults);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
