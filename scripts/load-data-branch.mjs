import { restoreDataBranch } from './lib/data-branch.mjs';

try { restoreDataBranch(); }
catch { console.error('데이터 브랜치를 읽거나 검증하지 못해 작업을 중단합니다.'); process.exitCode = 1; }
