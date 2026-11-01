const endpoint = 'https://www.work24.go.kr/cm/openApi/call/hr/callOpenApiSvcInfo310L01.do';
const searches = [
  ['데이터', 'data-analyst'], ['인공지능', 'ai-engineer'],
  ['소프트웨어 테스트', 'qa'], ['정보보안', 'security'],
];

function date(value) {
  const raw = String(value ?? '').replace(/[^0-9]/g, '');
  if (!/^\d{8}$/.test(raw)) return null;
  const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6)}`;
  return new Date(`${formatted}T00:00:00Z`).toISOString?.().startsWith(formatted) ? formatted : null;
}

function officialUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || !['www.work24.go.kr', 'm.work24.go.kr'].includes(url.hostname)) return null;
    url.hash = '';
    // 인증정보나 예기치 않은 추적값이 공개 파일에 들어가지 않도록 상세 식별자만 남긴다.
    for (const key of [...url.searchParams.keys()]) {
      if (!['crseTracseSe', 'tracseId', 'tracseTme', 'trainstCstmrId'].includes(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch { return null; }
}

export function parseTrainingResponse(payload, career, checked) {
  const root = payload?.HRDNet ?? payload?.hrdNet;
  if (!root || !/^\d+$/.test(String(root.scn_cnt ?? ''))) throw new Error('고용24 응답 형식 또는 조회 결과를 확인할 수 없습니다');
  const raw = root.srchList?.scn_list;
  const rows = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  if (Number(root.scn_cnt) > 0 && rows.length === 0) throw new Error('고용24 응답에 과정 목록이 없습니다');
  return rows.flatMap((row) => {
    let start, end;
    try { start = date(row.traStartDate); end = date(row.traEndDate); } catch { return []; }
    const url = officialUrl(row.titleLink);
    const id = String(row.trprId ?? '').trim();
    const round = String(row.trprDegr ?? '').trim();
    const title = String(row.title ?? '').trim();
    const provider = String(row.subTitle ?? '').trim();
    if (!id || !round || !title || !provider || !start || !end || end < start || !url) return [];
    return [{ id: `${id}-${round}`, title, provider, category: '국민내일배움카드 훈련', start, end, checked, careers: [career], url }];
  });
}

export async function collectTraining(key, today, fetcher = fetch) {
  if (!key) throw new Error('고용24 인증키가 설정되지 않았습니다');
  const end = new Date(`${today}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 90);
  const through = end.toISOString().slice(0, 10).replaceAll('-', '');
  const courses = new Map();
  for (const [term, career] of searches) {
    const url = new URL(endpoint);
    const params = { authKey: key, returnType: 'JSON', outType: '1', pageNum: '1', pageSize: '100', srchTraStDt: today.replaceAll('-', ''), srchTraEndDt: through, srchTraProcessNm: term, sort: 'ASC', sortCol: '2' };
    url.search = new URLSearchParams(params).toString();
    let response, payload;
    try {
      response = await fetcher(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error();
      payload = await response.json();
    } catch { throw new Error('고용24 훈련과정 요청 실패'); }
    const rows = parseTrainingResponse(payload, career, today);
    if (Number((payload.HRDNet ?? payload.hrdNet).scn_cnt) > 0 && rows.length === 0) throw new Error('고용24 과정 상세 링크 또는 필드를 확인할 수 없습니다');
    for (const course of rows) {
      const existing = courses.get(course.id);
      if (existing && !existing.careers.includes(career)) existing.careers.push(career);
      else if (!existing) courses.set(course.id, course);
    }
  }
  return [...courses.values()].sort((a, b) => a.start.localeCompare(b.start));
}
