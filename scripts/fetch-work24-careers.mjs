import { fileURLToPath } from 'node:url';
import { writeJson } from './lib/data-files.mjs';
import { collectJobs, collectDuties, collectCodes, collectEvents } from './lib/work24-careers.mjs';

const today = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
const tasks = [
  ['jobs', process.env.WORK24_JOB_API_KEY, collectJobs],
  ['duties', process.env.WORK24_DUTY_API_KEY, collectDuties],
  ['codes', process.env.WORK24_CODES_API_KEY, collectCodes],
  ['events', process.env.WORK24_RECRUITMENT_API_KEY, (key) => collectEvents(key, today)],
];
let failed = false;
for (const [name, key, collect] of tasks) {
  if (!key) { console.log(`고용24 ${name}: 인증키 없음, 기존 자료 유지`); continue; }
  try {
    const data = await collect(key);
    writeJson(fileURLToPath(new URL(`../public/data/work24-${name}.json`, import.meta.url)), { fetchedAt: new Date().toISOString(), data });
    console.log(`고용24 ${name}: 갱신 완료`);
  } catch {
    // 응답이나 요청 URL은 인증키를 포함할 수 있어 출력하지 않는다.
    console.error(`고용24 ${name}: 수집 실패, 기존 자료 유지`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
