// 공식 일정·접수 페이지에서 수동 확인한 자료다. 매일 원문을 다시 확인하는 수집기가 아니다.
const confirmedAt = '2026-11-09T11:21:00.000Z';
const shared = { type: 'conference', category: 'ai-applied', applicationStart: null, applicationEnd: null,
  eventStart: null, eventEnd: null, isOnline: false, feeType: 'unknown', feeAmount: null, region: '서울',
  territory: 'domestic', status: 'announced', confirmedAt, publishedAt: null, fetchedAt: confirmedAt,
  timezone: 'Asia/Seoul', verification: 'manual', lang: 'ko' };
export const curatedCalendarEvents = [
  { ...shared, id: 'manual-intel-ai-summit-seoul-2026', sourceId: 'manual-intel', title: 'Intel AI Summit Seoul 2026', host: '인텔코리아', eventStart: '2026-11-12T00:00:00.000Z', eventEnd: '2026-11-12T08:00:00.000Z', location: '서울 코엑스 그랜드볼룸·오디토리움', url: 'https://event-us.kr/intelseminar/event/131490', dateEvidence: '행사 공식 등록 페이지와 인텔코리아 행사 안내: 2026년 11월 12일 09:00~17:00 서울 코엑스. 신청 마감·잔여석 미확인.', topics: ['AI', 'AI 인프라', '피지컬 AI'] },
  { ...shared, id: 'manual-nvidia-ai-day-seoul-2026', sourceId: 'manual-nvidia', title: 'NVIDIA AI Day Seoul 2026', host: 'NVIDIA', eventDate: '2026-11-09', eventEndDate: '2026-11-10', location: '서울 코엑스', url: 'https://www.nvidia.com/ko-kr/ai-days/', dateEvidence: 'NVIDIA 공식 안내: 2026년 11월 9~10일 서울 코엑스. 세션별 참가 조건과 비용은 원문 확인.', topics: ['AI', '에이전틱 AI', '피지컬 AI'] },
  { ...shared, id: 'manual-deto-2026', sourceId: 'manual-deto', title: 'DEEP DIVE INTO 2026', host: 'DETO 운영사무국', eventDate: '2026-11-10', eventEndDate: '2026-11-12', location: '서울 그랜드 하얏트 서울', feeType: 'free', url: 'https://deepdiveinto.kr/', dateEvidence: '행사 공식 안내: 2026년 11월 10~12일 그랜드 하얏트 서울. 사전등록은 11월 9일 18시까지, 현장 등록은 수용 인원에 따라 제한될 수 있음.', topics: ['AI', '피지컬 AI', '멀티모달'] },
];
