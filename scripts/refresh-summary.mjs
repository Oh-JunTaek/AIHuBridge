import { appendFileSync, readFileSync } from 'node:fs';

const news = JSON.parse(readFileSync(new URL('../public/data/meta.json', import.meta.url), 'utf8'));
const calendar = JSON.parse(readFileSync(new URL('../public/data/calendar-meta.json', import.meta.url), 'utf8'));
const server = process.env.GITHUB_SERVER_URL || 'https://github.com';
const run = process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${server}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : '로컬 실행';
const output = [
  '## AI 정보 갱신 결과', '',
  `- 실행: ${run}`,
  `- 뉴스: ${news.total}건 / 수집 시각 ${news.fetchedAt}`,
  `- 뉴스 수집 상태: ${news.status ?? '이전 형식'} / 갱신 실패 출처: ${(news.unavailableSources ?? []).join(', ') || '없음'}`,
  `- AI 일정: ${calendar.total}건 / 수집 시각 ${calendar.fetchedAt}`,
  `- 일정 수집 상태: ${calendar.status}`,
  '- 성공한 수집 실행은 별도 배포 워크플로로 자동 연결됩니다.', '',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, output, 'utf8');
console.log(output);
