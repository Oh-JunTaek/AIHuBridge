const statuses = ['free', 'paid', 'conditional', 'unknown', 'not-offered'];
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
function webUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol); } catch { return false; }
}
function isFee(fee) {
  return fee && statuses.includes(fee.status) && nonempty(fee.note)
    && (fee.amount === undefined || (Number.isFinite(fee.amount) && fee.amount >= 0 && ['USD', 'KRW'].includes(fee.currency)))
    && (fee.status !== 'free' || fee.amount === undefined || fee.amount === 0)
    && (!['unknown', 'not-offered'].includes(fee.status) || fee.amount === undefined)
    && (fee.status !== 'paid' || fee.amount !== 0);
}
function dateOnly(value) {
  const time = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? Date.parse(value + 'T00:00:00Z') : NaN;
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

export function isEducationAvailable(item, now = Date.now()) {
  return item.availableUntil === undefined || (dateOnly(item.availableUntil)
    && Date.parse(item.availableUntil + 'T23:59:59.999+09:00') >= now);
}
export function isCertification(item) {
  return !!item && ['id', 'name', 'provider', 'requirements'].every((key) => nonempty(item[key]))
    && ['exam', 'course', 'micro'].includes(item.type) && ['초급', '중급', '고급'].includes(item.difficulty)
    && ['ko', 'en', 'both', 'unknown'].includes(item.language) && webUrl(item.url)
    && /^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt) && Number.isFinite(Date.parse(item.verifiedAt))
    && isFee(item.learningFee) && isFee(item.credentialFee)
    && item.learningFee.status !== 'not-offered'
    && (item.availableUntil === undefined || dateOnly(item.availableUntil))
    && Array.isArray(item.evidenceUrls) && item.evidenceUrls.length > 0 && item.evidenceUrls.every(webUrl);
}

export function feeLabel(fee) {
  if (!fee || fee.status === 'unknown') return '미확인';
  if (fee.status === 'not-offered') return '미발급';
  if (fee.status === 'free') return '무료';
  if (fee.status === 'conditional') return '조건부·일부 유료';
  if (fee.amount === undefined) return '유료 · 금액은 원문 확인';
  return `${fee.currency === 'KRW' ? '₩' : 'USD $'}${fee.amount.toLocaleString('ko-KR')}`;
}

export function selectCertifications(items, { type, language = '', cost = '', query = '' } = {}, now = Date.now()) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((item) => isEducationAvailable(item, now) && (!type || item.type === type)
    && (!language || item.language === language || (language !== 'unknown' && item.language === 'both'))
    && (!cost || (cost === 'learning-free' ? item.learningFee.status === 'free'
      : cost === 'credential-free' ? item.credentialFee.status === 'free'
      : item.learningFee.status === 'unknown' || item.credentialFee.status === 'unknown'))
    && words.every((word) => `${item.name} ${item.provider} ${item.examCode ?? ''}`.toLocaleLowerCase().includes(word)));
}
