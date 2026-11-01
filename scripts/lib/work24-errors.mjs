// 요청 URL, 응답 본문, 키와 외부 오류 메시지를 기록하지 않는다.
const reasons = Object.freeze({
  missing_key: '인증키가 설정되지 않음',
  http_error: 'HTTP 오류 응답',
  network_error: '네트워크 또는 시간 초과',
  invalid_response: 'JSON 또는 XML 해석 실패',
  unsafe_response: '응답 크기 또는 XML 형식 제한',
  schema_error: '예상과 다른 응답 구조',
  missing_rows: '검색 건수에 비해 목록 누락',
  missing_fields: '필수 항목 또는 공식 링크 확인 실패',
  page_limit: '페이지 조회 한도 초과',
});
const visibleKeys = ['HRDNet', 'hrdNet', 'jobsList', 'empEventList', 'response', 'Response', 'result', 'RESULT', 'error', 'Error', 'errorCode', 'resultCode', 'message', 'scn_cnt', 'total'];

export function safeResponseShape(payload, expectedRoot, countField) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '응답=객체 아님';
  const root = payload[expectedRoot];
  const keys = visibleKeys.filter((key) => Object.hasOwn(payload, key));
  const count = root && typeof root === 'object' ? root[countField] : undefined;
  const countType = count === undefined ? '없음' : /^\d+$/.test(String(count)) ? '숫자' : '비숫자';
  return `최상위=${keys.join(',') || '기타'}, 기대항목=${root ? '있음' : '없음'}, 건수=${countType}`;
}

export class Work24Error extends Error {
  constructor(code, status, shape) {
    super(reasons[code] ?? '확인되지 않은 오류');
    this.name = 'Work24Error';
    this.code = Object.hasOwn(reasons, code) ? code : 'unknown';
    this.status = Number.isInteger(status) && status >= 100 && status <= 599 ? status : undefined;
    this.shape = typeof shape === 'string' && /^최상위=(?:[A-Za-z_,]+|기타), 기대항목=(?:있음|없음), 건수=(?:없음|숫자|비숫자)$|^응답=객체 아님$/.test(shape) ? shape : undefined;
  }
}

export function safeWork24Error(error) {
  if (!(error instanceof Work24Error)) return '확인되지 않은 오류';
  return `${reasons[error.code] ?? '확인되지 않은 오류'}${error.status ? ` (HTTP ${error.status})` : ''}${error.shape ? ` [${error.shape}]` : ''}`;
}
