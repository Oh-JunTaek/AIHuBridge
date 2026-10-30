import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSocialFeed, socialSources, suppressedPostUris } from '../src/lib/social-feed.mjs';

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
