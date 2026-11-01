import test from 'node:test';
import assert from 'node:assert/strict';
import { mastodonSources, parseMastodonFeed, parseSocialFeed, recentSocialPosts, socialSources, suppressedPostUris } from '../src/lib/social-feed.mjs';

const source = socialSources[0];
const post = (overrides = {}) => ({ uri:'at://did:plc:abc123/app.bsky.feed.post/abc123', author:{ did:'did:plc:abc123', handle:'a.test', displayName:'작성자' }, record:{ text:'신제품 발표', createdAt:'2026-10-29T00:00:00Z' }, ...overrides });
test('정상 글과 재게시의 실제 작성자와 원문을 보존한다', () => {
  const result = parseSocialFeed({ feed:[{ post:post(), reason:{ $type:'app.bsky.feed.defs#reasonRepost' } }] }, source);
  assert.equal(result.length, 1); assert.equal(result[0].repost, true); assert.equal(result[0].author, '작성자');
  assert.equal(result[0].url, 'https://bsky.app/profile/did%3Aplc%3Aabc123/post/abc123');
});
test('잘못된 응답, 작성자 불일치, 유해 라벨과 삭제 요청 게시물을 표시하지 않는다', () => {
  assert.throws(() => parseSocialFeed({}, source));
  const blocked = post(); suppressedPostUris.push(blocked.uri);
  try { assert.equal(parseSocialFeed({ feed:[{post:blocked}] }, source).length, 0); } finally { suppressedPostUris.pop(); }
  assert.equal(parseSocialFeed({ feed:[{post:post({author:{did:'did:plc:other'}})}, {post:post({labels:[{val:'!hide'}]})}, {post:post({uri:'https://bad.example/'})}] }, source).length, 0);
});

test('게시물은 7일 이내만 남기고 미래 날짜와 오래된 글은 제외한다', () => {
  const now = Date.parse('2026-11-01T12:00:00Z');
  const values = [now, now - 7 * 86400000, now - 7 * 86400000 - 1, now + 1].map((time) => ({ date:new Date(time).toISOString() }));
  assert.deepEqual(recentSocialPosts(values, now), values.slice(0, 2));
});

test('Mastodon은 공식 계정의 공개 원문만 안전한 주소와 텍스트로 표시한다', () => {
  const source = mastodonSources[0];
  const post = { url:'https://mastodon.social/@MozillaAI/12345', visibility:'public', sensitive:false, created_at:'2026-10-31T00:00:00Z', content:'<p>AI 소식</p>', account:{ id:source.accountId, display_name:'Mozilla.ai' } };
  const convert = (html) => html.replace(/<[^>]+>/g, '');
  const result = parseMastodonFeed([post], source, convert);
  assert.equal(result[0].text, 'AI 소식'); assert.equal(result[0].platform, 'Mastodon');
  assert.equal(parseMastodonFeed([{ ...post, sensitive:true }, { ...post, spoiler_text:'경고' }, { ...post, account:{ id:'wrong' } }, { ...post, url:'https://evil.example/@MozillaAI/12345' }, { ...post, visibility:'private' }], source, convert).length, 0);
});
