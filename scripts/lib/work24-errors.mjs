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

export class Work24Error extends Error {
  constructor(code, status) {
    super(reasons[code] ?? '확인되지 않은 오류');
    this.name = 'Work24Error';
    this.code = Object.hasOwn(reasons, code) ? code : 'unknown';
    this.status = Number.isInteger(status) && status >= 100 && status <= 599 ? status : undefined;
  }
}

export function safeWork24Error(error) {
  if (!(error instanceof Work24Error)) return '확인되지 않은 오류';
  return `${reasons[error.code] ?? '확인되지 않은 오류'}${error.status ? ` (HTTP ${error.status})` : ''}`;
}
