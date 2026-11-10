// RSS의 관리용 머리말만 제거한다. 요약·번역하거나 원문의 수식을 해석하지 않는다.
export function paperExcerpt(item, limit = 240) {
  const raw = (item.excerpt || item.summary || '').trim().replace(/\s+/g, ' ');
  const text = raw.replace(/^arxiv:\S+\s+announce\s+type:\s*\S+\s+abstract:\s*/i, '').trim();
  if (!text) return '';
  if (text.length <= limit) return text;
  const prefix = text.slice(0, limit);
  const sentences = [...prefix.matchAll(/[.!?](?=\s|$)/g)];
  const last = sentences.at(-1);
  if (last && last.index >= 60) return prefix.slice(0, last.index + 1);
  const boundary = prefix.lastIndexOf(' ');
  return `${prefix.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}
