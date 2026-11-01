import { fileURLToPath } from 'node:url';
import { collectTraining } from './lib/work24-training.mjs';
import { writeJson } from './lib/data-files.mjs';

const key = process.env.WORK24_API_KEY;
if (!key) {
  console.log('고용24 인증키가 없어 기존 훈련과정 자료를 유지합니다.');
} else {
  try {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const courses = await collectTraining(key, today);
    writeJson(fileURLToPath(new URL('../public/data/funded-training.json', import.meta.url)), { fetchedAt: new Date().toISOString(), courses });
    console.log(`고용24 훈련과정 ${courses.length}건을 갱신했습니다.`);
  } catch {
    // 인증키가 포함될 수 있는 원본 URL·오류는 로그에 출력하지 않는다.
    console.error('고용24 수집 실패: 기존 훈련과정 자료를 유지합니다.');
    process.exitCode = 1;
  }
}
