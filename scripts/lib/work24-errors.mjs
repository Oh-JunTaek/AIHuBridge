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
const visibleKeys = ['HRDNet', 'hrdNet', 'jobsList', 'jobList', 'empEventList', 'empEvent', 'empEventInfo', 'empEventRoot', 'eventList', 'response', 'Response', 'result', 'RESULT', 'error', 'Error', 'OpenAPI_ServiceResponse', 'ServiceResult', 'header', 'body', 'errorCode', 'resultCode', 'message', 'scn_cnt', 'total'];

export function safeResponseShape(payload, expectedRoot, countField) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '응답=객체 아님';
  const root = payload[expectedRoot];
  const keys = visibleKeys.filter((key) => Object.hasOwn(payload, key));
  const count = root && typeof root === 'object' ? root[countField] : undefined;
  const countType = count === undefined ? '없음' : /^\d+$/.test(String(count)) ? '숫자' : '비숫자';
  const nested = root && typeof root === 'object' ? visibleKeys.filter((key) => Object.hasOwn(root, key)) : [];
  const kind = Array.isArray(root) ? '배열' : root === '' ? '빈값' : root && typeof root === 'object' ? '객체' : '기타';
  return `최상위=${keys.join(',') || '기타'}, 기대항목=${root ? '있음' : '없음'}, 건수=${countType}, 유형=${kind}, 내부=${nested.join(',') || '기타'}`;
}

// 오류 문구는 기록하지 않고 정해진 신호의 유무만 확인한다.
export function safeResponseCategory(payload) {
  const messages = [];
  function visit(value, depth) {
    if (!value || typeof value !== 'object' || depth > 4) return;
    for (const [key, child] of Object.entries(value).slice(0, 100)) {
      if (typeof child === 'string' && /^(message|msg|error|errormsg|errmsg|resultmsg|returnauthmsg)$/i.test(key)) messages.push(child);
      else if (typeof child === 'object') visit(child, depth + 1);
    }
  }
  visit(payload, 0);
  if (!messages.length) return '메시지 없음';
  const value = messages.join(' ');
  if (/인증|auth|api.?key|인증키/i.test(value)) return '인증 관련';
  if (/권한|승인|permission|접근.*제한/i.test(value)) return '권한 관련';
  if (/결과.{0,15}없|검색.{0,15}없|자료.{0,15}없|데이터.{0,15}없|no\s+(data|result)/i.test(value)) return '결과 없음';
  if (/parameter|파라미터|필수|입력/i.test(value)) return '요청 조건 관련';
  return '기타 메시지';
}

export class Work24Error extends Error {
  constructor(code, status, shape, category) {
    super(reasons[code] ?? '확인되지 않은 오류');
    this.name = 'Work24Error';
    this.code = Object.hasOwn(reasons, code) ? code : 'unknown';
    this.status = Number.isInteger(status) && status >= 100 && status <= 599 ? status : undefined;
    this.shape = typeof shape === 'string' && /^최상위=(?:[A-Za-z_,]+|기타), 기대항목=(?:있음|없음), 건수=(?:없음|숫자|비숫자), 유형=(?:배열|빈값|객체|기타), 내부=(?:[A-Za-z_,]+|기타)$|^응답=객체 아님$/.test(shape) ? shape : undefined;
    this.category = ['메시지 없음', '인증 관련', '권한 관련', '결과 없음', '요청 조건 관련', '기타 메시지'].includes(category) ? category : undefined;
  }
}

export function safeWork24Error(error) {
  if (!(error instanceof Work24Error)) return '확인되지 않은 오류';
  return `${reasons[error.code] ?? '확인되지 않은 오류'}${error.status ? ` (HTTP ${error.status})` : ''}${error.shape ? ` [${error.shape}]` : ''}${error.category ? ` [${error.category}]` : ''}`;
}
