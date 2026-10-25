import Parser from 'rss-parser';

const parser = new Parser({ customFields: { item: [['category', 'feedCategories', { keepArray: true }]] } });
// HTTP 요청과 본문 읽기에 같은 제한 시간을 적용하고, RSS 파서는 XML 해석만 맡긴다.
export async function readPublicText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'ai-hub-bridge/0.1', accept: 'application/json, application/rss+xml, application/atom+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`공개 자료 요청 실패: HTTP ${response.status}`);
  }
  const limit = 4 * 1024 * 1024;
  if (Number(response.headers.get('content-length')) > limit) {
    await response.body?.cancel();
    throw new Error('RSS 본문 크기 제한 초과');
  }
  if (!response.body) throw new Error('RSS 본문이 없습니다');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error('RSS 본문 크기 제한 초과');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function readRss(url) {
  return parser.parseString(await readPublicText(url));
}
