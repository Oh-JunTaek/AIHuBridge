import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectSocialMedia, youtubeChannels } from './lib/social-collector.mjs';
import { writeJson } from './lib/data-files.mjs';

const output = fileURLToPath(new URL('../public/data/', import.meta.url));

async function main() {
  const socialPath = resolve(output, 'social.json');
  let old = [];
  if (existsSync(socialPath)) {
    try {
      const parsed = JSON.parse(readFileSync(socialPath, 'utf8'));
      if (Array.isArray(parsed)) old = parsed;
    } catch {}
  }

  const result = await collectSocialMedia(old);

  // 전체가 에러인 경우 파일 덮어쓰기 방지
  if (result.sources.length > 0 && result.sources.every((s) => s.status === 'error')) {
    console.table(result.sources);
    throw new Error('소셜 미디어 전체 수집 실패: 기존 정상 데이터를 유지합니다');
  }

  const meta = {
    schemaVersion: 1,
    fetchedAt: new Date().toISOString(),
    total: result.posts.length,
    status: result.sources.some((s) => s.status !== 'success') ? 'partial' : 'success',
    sources: result.sources,
    policy: 'AI 선도 대기업 공식 미디어 및 소셜 채널의 최근 7일 게시물',
  };

  writeJson(resolve(output, 'social.json'), result.posts);
  writeJson(resolve(output, 'social-meta.json'), meta);

  console.log('수집된 최근 7일 소셜/미디어 게시물: ' + result.posts.length + '건');
  console.table(result.sources);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
