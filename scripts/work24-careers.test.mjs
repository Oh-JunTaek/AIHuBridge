import test from 'node:test';
import assert from 'node:assert/strict';
import { parseJobs, parseDuties, parseCodes, parseEvents, collectEvents, collectJobs } from './lib/work24-careers.mjs';

test('직업명·공통코드는 명세의 필드만 보존한다', () => {
  assert.deepEqual(parseJobs({ jobsList: { total:'1', jobList:{ jobCd:'123', jobNm:'데이터 분석가', extra:'비공개' } } }), [{ code:'123', name:'데이터 분석가' }]);
  assert.deepEqual(parseCodes({ HRDNet: { scn_cnt:'2', srchList:{ scn_list:[{ rsltCode:'20', rsltName:'정보통신', useYn:'Y' }, { rsltCode:'30', rsltName:'삭제', useYn:'N' }] } } }), [{ code:'20', name:'정보통신' }]);
  assert.throws(() => parseJobs({ error:'인증 실패' }));
  assert.throws(() => parseCodes({ HRDNet:{ scn_cnt:'1' } }));
});

test('직무정보는 NCS 검색 결과로만 취급한다', () => {
  assert.deepEqual(parseDuties({ result: { x:{ job_sdvn:'데이터 분석', job_scfn:'정보기술', ablt_def:'사용하지 않는 내용' } } }), [{ name:'데이터 분석', category:'정보기술' }]);
  assert.throws(() => parseDuties({ message_cd:'error' }));
});

test('채용행사는 확인된 날짜만 쓰고 종료 행사는 제외한다', () => {
  const response = { empEventList:{ total:'3', empEvent:[
    { eventNo:'1', eventNm:'취업 박람회', area:'서울', eventTerm:'2026.11.03 ~ 2026.11.04' },
    { eventNo:'2', eventNm:'지난 행사', eventTerm:'2026.10.01 ~ 2026.10.02' },
    { eventNo:'3', eventNm:'일자 미확인', eventTerm:'추후 안내' },
  ] } };
  assert.deepEqual(parseEvents(response, '2026-11-01'), [{ id:'1', name:'취업 박람회', area:'서울', start:'2026-11-03', end:'2026-11-04' }]);
  assert.throws(() => parseEvents({ error:'오류' }, '2026-11-01'));
});

test('API 요청은 인증 오류를 성공한 빈 결과로 처리하지 않는다', async () => {
  const bad = async () => ({ ok:true, text:async () => '<error>거절</error>' });
  await assert.rejects(collectEvents('secret', '2026-11-01', bad));
  await assert.rejects(collectJobs('secret', bad));
  const network = async () => { throw new Error('secret'); };
  await assert.rejects(collectJobs('secret', network), (error) => !error.message.includes('secret'));
});
