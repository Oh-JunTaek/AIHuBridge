import test from 'node:test';
import assert from 'node:assert/strict';
import { feeLabel, isCertification, isEducationAvailable, selectCertifications } from '../src/lib/cert-rules.mjs';
import { loadStaticData } from './lib/static-data.mjs';

const { certifications } = await loadStaticData(new URL('../src/data/certifications.ts', import.meta.url));
const { journeys } = await loadStaticData(new URL('../src/data/journeys.ts', import.meta.url));
const { qualifications } = await loadStaticData(new URL('../src/data/qualifications.ts', import.meta.url));

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
test('수료증 발급 확인은 비용 확인과 별개이며 시험이나 미발급과 모순되지 않는다', () => {
  const verified = certifications.filter((item) => item.completionCertificateVerified === true);
  assert.deepEqual(verified.map((item) => item.id).sort(), ['coursera-ai-for-everyone', 'coursera-software-testing', 'dlai-prompting', 'google-ai-essentials', 'hf-agents']);
  assert.ok(verified.every(isCertification));
  assert.equal(isCertification({ ...verified[0], credentialFee: { status: 'unknown', note: '미확인' } }), true);
  assert.equal(isCertification({ ...verified[0], credentialFee: { status: 'not-offered', note: '미발급' } }), false);
  assert.equal(isCertification({ ...verified[0], type: 'exam' }), false);
});
test('한국어 포함·미확인 비용·검색 조합과 빈 결과 처리', () => {
  assert.ok(selectCertifications(certifications, { language: 'ko', query: '파이썬' }).length > 0);
  assert.equal(selectCertifications(certifications, { query: '없는교육123' }).length, 0);
  assert.ok(selectCertifications(certifications, { query: 'QA' }).some((item) => item.id === 'coursera-software-testing'));
  assert.ok(selectCertifications(certifications, { cost: 'unknown' }).every((item) => item.learningFee.status === 'unknown' || item.credentialFee.status === 'unknown'));
});
test('학습 여정의 자격 참조와 종료된 AI-900 안내 교체', () => {
  const ids = new Set(qualifications.map((item) => item.id));
  assert.ok(journeys.every((journey) => journey.qualificationIds.every((id) => ids.has(id))));
  const ai = qualifications.find((item) => item.id === 'msft-ai-900');
  assert.ok(ai.name.includes('AI-901'));
  assert.equal(ai.url.endsWith('/ai-901/'), true);
});
test('시험과 수강 자료는 분리하고 자격 종류·언어·공식 링크를 유지', () => {
  assert.ok(certifications.every((item) => item.type !== 'exam'));
  assert.equal(new Set(qualifications.map((item) => item.id)).size, qualifications.length);
  assert.ok(qualifications.every((item) => item.language.length && item.classification && item.fee && item.prerequisites && item.validity && /^https:\/\//.test(item.url)));
  const nvidia = qualifications.find((item) => item.id === 'nvidia-nca-genl');
  assert.deepEqual(nvidia.language, ['영어']);
  assert.ok(nvidia.delivery.includes('한국 예약 가능 여부 확인'));
  assert.ok(nvidia.fee.includes('125'));
  assert.ok(qualifications.filter((item) => item.id.startsWith('ai-pot')).every((item) => item.classification.includes('국가공인 아님')));
});

test('수료증 미발급을 무료 발급이나 미확인과 혼동하지 않음', () => {
  const item = certifications.find((item) => item.id === 'boost-ml-coders');
  assert.equal(feeLabel(item.credentialFee), '미발급');
  assert.equal(selectCertifications([item], { cost: 'credential-free' }).length, 0);
  assert.equal(selectCertifications([item], { cost: 'unknown' }).length, 0);
  assert.equal(isCertification({ ...item, credentialFee: { ...item.credentialFee, amount: 0, currency: 'USD' } }), false);
});

test('한국 기관의 종료일은 한국시간 당일 끝까지 표시하고 다음 순간 제외', () => {
  const item = certifications.find((item) => item.id === 'skku-ai-math-basics');
  const end = Date.parse('2026-12-26T23:59:59.999+09:00');
  assert.equal(isEducationAvailable(item, end), true);
  assert.equal(isEducationAvailable(item, end + 1), false);
  assert.equal(selectCertifications([item], {}, end).length, 1);
  assert.equal(selectCertifications([item], {}, end + 1).length, 0);
  assert.equal(isEducationAvailable({ ...item, availableUntil: undefined }, end + 1), true);
});

test('불가능한 종료일·비표준 날짜는 자료 검사와 공개 목록에서 거부', () => {
  const item = certifications[0];
  for (const availableUntil of ['2026-02-30', '2026-13-01', '2026-2-1', '날짜 미정']) {
    const invalid = { ...item, availableUntil };
    assert.equal(isCertification(invalid), false);
    assert.equal(isEducationAvailable(invalid), false);
  }
});
