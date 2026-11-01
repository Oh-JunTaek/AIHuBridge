// 공개 프로필 DID를 고정해 계정 사칭이나 핸들 변경의 영향을 줄인다.
export const socialSources = [
  { id: 'anthropic', company: 'Anthropic', actor: 'did:plc:7xblllgnpqtiotu62pic747n', handle: 'anthropic.com', channel: '기업 공식', products: ['Claude'] },
  { id: 'huggingface', company: 'Hugging Face', actor: 'did:plc:qcm5pejjqltepp6kztn6pzib', handle: 'hf.co', channel: '기업 공식', products: ['Hugging Face'] },
  { id: 'thomas-wolf', company: 'Hugging Face', actor: 'did:plc:gntu4wsyt6gtzle3t2kinr6o', handle: 'thomwolf.bsky.social', channel: '관계자 개인', products: ['Hugging Face'] },
];
// 요청에 의해 제외해야 하는 글의 AT URI를 여기에 기록한다. 원문 삭제는 다음 조회에 반영된다.
export const suppressedPostUris = [];

// 게시 시각 기준 7일까지만 메모리에 유지한다. 미래 시각은 표시하지 않는다.
export function recentSocialPosts(posts, now = Date.now()) {
  const cutoff = now - 7 * 86400000;
  return posts.filter((post) => { const time = Date.parse(post.date); return Number.isFinite(time) && time >= cutoff && time <= now; });
}

export const mastodonSources = [
  { id:'mozilla-ai', company:'Mozilla.ai', accountId:'111910184138509793', actor:'MozillaAI', handle:'MozillaAI@mastodon.social', channel:'기업 공식', products:['Mozilla.ai'], origin:'https://mastodon.social', profile:'https://mastodon.social/@MozillaAI' },
];

export function parseMastodonFeed(payload, source, toText) {
  if (!Array.isArray(payload)) throw new Error('게시물 응답 형식 오류');
  return payload.flatMap((post) => {
    if (post?.visibility !== 'public' || post?.sensitive || post?.spoiler_text || post?.reblog || post?.in_reply_to_id || String(post?.account?.id) !== source.accountId) return [];
    const date = Date.parse(post.created_at);
    let url;
    try { url = new URL(post.url); } catch { return []; }
    if (!Number.isFinite(date) || url.origin !== source.origin || !/^\/@MozillaAI\/\d+$/.test(url.pathname) || typeof post.content !== 'string') return [];
    const text = toText(post.content).trim();
    if (!text || suppressedPostUris.includes(post.url)) return [];
    return [{ id:post.url, company:source.company, channel:source.channel, products:source.products, author:post.account.display_name || source.actor, handle:source.handle, repost:false, text, date:new Date(date).toISOString(), url:url.href, platform:'Mastodon' }];
  });
}

export function parseSocialFeed(payload, source) {
  if (!payload || !Array.isArray(payload.feed)) throw new Error('게시물 응답 형식 오류');
  return payload.feed.flatMap((entry) => {
    const post = entry?.post;
    const record = post?.record;
    const match = typeof post?.uri === 'string' && post.uri.match(/^at:\/\/(did:[a-z0-9:]+)\/app\.bsky\.feed\.post\/([a-zA-Z0-9._~-]+)$/);
    const created = typeof record?.createdAt === 'string' ? Date.parse(record.createdAt) : NaN;
    if (!match || !Number.isFinite(created) || typeof record?.text !== 'string' || suppressedPostUris.includes(post.uri)) return [];
    if (post?.author?.did !== match[1]) return [];
    const labels = [...(post.labels || []), ...(post.author.labels || [])];
    if (labels.some((label) => ['!hide', '!warn', 'porn', 'sexual', 'nudity', 'graphic-media', 'gore'].includes(label.val) && !label.neg)) return [];
    return [{ id: post.uri, company: source.company, channel: source.channel, products: source.products, author: post.author.displayName || post.author.handle || '작성자', handle: post.author.handle || '', repost: Boolean(entry.reason), text: record.text, date: new Date(created).toISOString(), url: `https://bsky.app/profile/${encodeURIComponent(match[1])}/post/${encodeURIComponent(match[2])}`, platform:'Bluesky' }];
  });
}
