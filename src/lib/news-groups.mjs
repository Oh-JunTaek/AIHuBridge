import { newsSource } from './news-facets.mjs';

// 근거가 뚜렷한 모델 이름·버전과 발표 성격만 묶는다. 원문 자료는 변경하지 않는다.
function storyKey(item) {
  if (item.category === '연구/논문') return null;
  const title = item.title.toLowerCase().normalize('NFKC');
  let model;
  const exaone = title.match(/(?:k[\s-]*)?(?:엑사원|exaone)\s*[- ]?\s*(\d+(?:\.\d+)+)/i);
  const kanana = title.match(/(?:카나나|kanana)[\s-]*(\d+(?:\.\d+)?)[\s-]*v[\s-]*(?:디사이드|decide)/i);
  const known = title.match(/\b(gpt|claude|gemini|qwen|llama|gemma)[\s-]*(\d+(?:\.\d+)+)\b/i);
  if (exaone) model = `exaone-${exaone[1]}`;
  else if (kanana) model = `kanana-${kanana[1]}-v-decide`;
  else if (known) model = `${known[1]}-${known[2]}`;
  if (!model) return null;
  if (/출시일|발표일|출시\s*(?:예정|전망)|release\s+date|rumou?r|전망|예고|비교|후기|취소|연기/i.test(title)) return null;
  const action = /\bapi\b/i.test(title) && /무료|개방|공개|출시|free|release|launch|open/i.test(title) ? 'api'
    : /모델|model|카나나|kanana|엑사원|exaone/i.test(title) && /공개|출시|발표|선보|선봬|introduc|launch|release|unveil/i.test(title) ? 'release' : null;
  return action ? `${model}:${action}` : null;
}

export function groupNews(items) {
  const groups = [];
  for (const item of items) {
    const key = storyKey(item);
    const time = Date.parse(item.publishedAt);
    const group = key && groups.find((entry) => entry.key === key && Math.abs(time - entry.anchor) <= 3 * 86400000);
    if (group) group.items.push(item);
    else groups.push({ key, anchor: time, items: [item] });
  }
  return groups.map(({ items: articles }) => {
    const official = articles.findIndex((item) => newsSource(item)?.kind === 'developer');
    const primary = articles[official >= 0 ? official : 0];
    return { primary, related: articles.filter((item) => item !== primary) };
  });
}
