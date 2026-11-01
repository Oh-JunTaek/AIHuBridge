import test from 'node:test';
import assert from 'node:assert/strict';
import { collectTraining, parseTrainingResponse } from './lib/work24-training.mjs';

const item = { title: '데이터 분석', subTitle: '훈련기관', trprId: 'AIG123', trprDegr: '1', ncsCd:'20010101', traStartDate: '20261120', traEndDate: '20261220', titleLink: 'https://www.work24.go.kr/hr/a/a/3100/selectTracseDetl.do?tracseId=AIG123&tracseTme=1&authKey=DO_NOT_PUBLISH' };
const response = { HRDNet: { scn_cnt: '1', srchList: { scn_list: [item] } } };

test('훈련 일자와 공식 링크를 보존하고 URL의 인증값을 제거한다', () => {
  const [course] = parseTrainingResponse(response, 'data-analyst', '2026-11-01');
  assert.equal(course.start, '2026-11-20');
  assert.equal(course.end, '2026-12-20');
  assert.equal(course.provider, '훈련기관');
  assert.equal(course.ncsCode, '20010101');
  assert.doesNotMatch(course.url, /authKey|DO_NOT_PUBLISH/);
});

test('고용24가 최상위에 훈련 목록을 반환하는 JSON도 처리한다', () => {
  assert.deepEqual(parseTrainingResponse(response.HRDNet, 'data-analyst', '2026-11-01'), parseTrainingResponse(response, 'data-analyst', '2026-11-01'));
  assert.deepEqual(parseTrainingResponse({ scn_cnt:'1', srchList:[item] }, 'data-analyst', '2026-11-01'), parseTrainingResponse(response, 'data-analyst', '2026-11-01'));
});

test('허용하지 않은 출처와 확인되지 않은 날짜는 제외한다', () => {
  assert.deepEqual(parseTrainingResponse({ HRDNet: { scn_cnt:'1', srchList: { scn_list: [{ ...item, titleLink:'https://example.com/' }] } } }, 'qa', '2026-11-01'), []);
  assert.deepEqual(parseTrainingResponse({ HRDNet: { scn_cnt:'1', srchList: { scn_list: [{ ...item, traStartDate:'불명' }] } } }, 'qa', '2026-11-01'), []);
});

test('직무별 검색 중복을 합치고 실패는 기존 자료 교체를 막는다', async () => {
  const fetcher = async () => ({ ok:true, json: async () => response });
  const courses = await collectTraining('secret', '2026-11-01', fetcher);
  assert.equal(courses.length, 1);
  assert.deepEqual(courses[0].careers, ['data-analyst', 'ai-engineer', 'qa', 'security']);
  await assert.rejects(collectTraining('secret', '2026-11-01', async () => { throw new Error('secret'); }), /네트워크 또는 시간 초과/);
  await assert.rejects(collectTraining('secret', '2026-11-01', async () => ({ ok:true, json:async () => ({ error:'bad' }) })), /예상과 다른 응답 구조/);
});
