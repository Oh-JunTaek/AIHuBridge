import test from 'node:test';
import assert from 'node:assert/strict';
import { feeLabel, isCertification, selectCertifications } from '../src/lib/cert-rules.mjs';
import { loadStaticData } from './lib/static-data.mjs';

const { certifications } = await loadStaticData(new URL('../src/data/certifications.ts', import.meta.url));
const { stages } = await loadStaticData(new URL('../src/data/path.ts', import.meta.url));

test('실제 인증 자료의 비용·조건·공식 근거·검토일 무결성', () => {
  assert.ok(certifications.length > 0);
  assert.ok(certifications.every(isCertification));
  assert.equal(new Set(certifications.map((item) => item.id)).size, certifications.length);
  assert.equal(certifications.some((item) => item.id === 'nvidia-ai-ls'), false);
});
test('미확인·누락된 비용을 무료나 고정 환율 금액으로 표시하지 않음', () => {
  assert.equal(feeLabel(), '미확인');
  assert.equal(feeLabel({ status: 'unknown' }), '미확인');
  assert.equal(feeLabel({ status: 'paid', note: '지역별 가격' }), '유료 · 금액은 원문 확인');
  assert.equal(feeLabel({ status: 'paid', amount: 99, currency: 'USD' }), 'USD $99');
});
test('무료·미확인에 모순되는 금액과 근거 누락을 차단', () => {
  const item = certifications[0];
  for (const patch of [
    { credentialFee: { status: 'unknown', amount: 0, currency: 'USD', note: '모름' } },
    { credentialFee: { status: 'free', amount: 150, currency: 'USD', note: '모순' } },
    { credentialFee: { status: 'paid', amount: 0, currency: 'USD', note: '모순' } },
    { evidenceUrls: [] }, { evidenceUrls: ['javascript:alert(1)'] },
  ]) assert.equal(isCertification({ ...item, ...patch }), false);
});
test('무료 영상 청강과 무료 수료증 필터를 구분', () => {
  const learning = selectCertifications(certifications, { type: 'course', cost: 'learning-free' });
  const credentials = selectCertifications(certifications, { type: 'course', cost: 'credential-free' });
  assert.ok(learning.some((item) => item.id === 'dlai-prompting'));
  assert.equal(credentials.some((item) => item.id === 'dlai-prompting'), false);
  assert.ok(credentials.some((item) => item.id === 'hf-agents'));
  assert.equal(learning.some((item) => item.id === 'google-ai-essentials'), false);
});
test('한국어 포함·미확인 비용·검색 조합과 빈 결과 처리', () => {
  assert.ok(selectCertifications(certifications, { language: 'ko', query: 'Microsoft AI-901' }).length > 0);
  assert.equal(selectCertifications(certifications, { query: '없는교육123' }).length, 0);
  assert.ok(selectCertifications(certifications, { cost: 'unknown' }).every((item) => item.learningFee.status === 'unknown' || item.credentialFee.status === 'unknown'));
});
test('학습 경로의 모든 참조 유지와 종료된 AI-900 안내 교체', () => {
  const ids = new Set(certifications.map((item) => item.id));
  assert.ok(stages.every((stage) => stage.items.every((item) => ids.has(item.refId))));
  const ai = certifications.find((item) => item.id === 'msft-ai-900');
  assert.equal(ai.examCode, 'AI-901');
  assert.equal(ai.url.endsWith('/ai-901/'), true);
  assert.ok(stages.flatMap((stage) => stage.items).some((item) => item.label.includes('AI-901')));
});
