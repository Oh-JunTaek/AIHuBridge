import { execFileSync } from 'node:child_process';
import { writeFileSync, renameSync } from 'node:fs';

export const dataFiles = ['news.json', 'meta.json', 'calendar.json', 'calendar-meta.json', 'funded-training.json', 'work24-jobs.json', 'work24-duties.json', 'work24-codes.json', 'work24-events.json'];

// 모든 JSON을 먼저 확인해 중간 실패 시 일부만 다른 세대로 바뀌지 않게 한다.
export function readDataSnapshot(readFile) {
  return dataFiles.map((name) => {
    const text = readFile(`public/data/${name}`);
    JSON.parse(text);
    return { name, text };
  });
}

export function restoreDataBranch() {
  let found;
  try { found = execFileSync('git', ['ls-remote', '--heads', 'origin', 'data-refresh'], { encoding:'utf8', stdio:['ignore', 'pipe', 'pipe'] }).trim(); }
  catch { throw new Error('데이터 브랜치 조회 실패'); }
  if (!found) {
    if (process.env.DATA_BRANCH_REQUIRED === '1') throw new Error('필수 데이터 브랜치가 없습니다');
    console.log('데이터 브랜치가 없어 기존 자료로 시작합니다.'); return;
  }
  execFileSync('git', ['fetch', '--no-tags', 'origin', '+refs/heads/data-refresh:refs/remotes/origin/data-refresh'], { stdio:'inherit' });
  const files = readDataSnapshot((path) => execFileSync('git', ['show', `refs/remotes/origin/data-refresh:${path}`], { encoding:'utf8', stdio:['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024 }));
  for (const { name, text } of files) {
    const path = `public/data/${name}`;
    writeFileSync(`${path}.tmp`, text);
    renameSync(`${path}.tmp`, path);
  }
  console.log('데이터 브랜치의 마지막 정상 자료를 불러왔습니다.');
}
