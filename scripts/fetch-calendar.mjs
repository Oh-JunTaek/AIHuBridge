import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRss } from './lib/rss.mjs';
import { collectCalendar, sources } from './lib/calendar-collector.mjs';
import { writeJson } from './lib/data-files.mjs';
import { collectGoogleEvents } from './lib/public-events.mjs';
import { visibleEvents } from '../src/lib/calendar-rules.mjs';

const output = fileURLToPath(new URL('../public/data/', import.meta.url));
async function main() {
  const old = JSON.parse(readFileSync(resolve(output, 'calendar.json'), 'utf8'));
  if (!Array.isArray(old)) throw new Error('기존 행사 데이터가 배열이 아닙니다');
  const result = await collectCalendar(sources, readRss, old);
  const publicEvents = await collectGoogleEvents(old);
  result.sources.push(publicEvents.source);
  result.events = visibleEvents([...result.events, ...publicEvents.events]);
  // 전부 실패하면 파일을 갱신하지 않고 실패로 보고한다. 샘플로 대체하지 않는다.
  if (result.sources.every((source) => source.status === 'error')) {
    console.table(result.sources);
    throw new Error('행사 출처 전체 수집 실패: 기존 정상 데이터를 유지합니다');
  }
  const meta = { schemaVersion: 2, fetchedAt: new Date().toISOString(), total: result.events.length,
    status: result.sources.some((source) => source.status === 'error') ? 'partial' : 'success',
    sources: result.sources, policy: '명시적 모집 마감 또는 공개 개최일이 확인된 향후 AI 행사만 공개' };
  writeJson(resolve(output, 'calendar.json'), result.events);
  writeJson(resolve(output, 'calendar-meta.json'), meta);
  console.log('검증 기준을 통과한 행사: ' + result.events.length + '건');
  console.table(result.sources);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
