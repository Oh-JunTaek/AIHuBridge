import test from 'node:test';
import assert from 'node:assert/strict';
import { collectSocialMedia, parseYouTubeFeed, youtubeChannels } from './lib/social-collector.mjs';

const now = Date.parse('2026-11-24T12:00:00Z');

const mockChannel = {
  id: 'test-yt',
  company: 'OpenAI',
  name: 'OpenAI 공식',
  channelId: 'UC_TEST',
  channel: '기업 공식',
  products: ['ChatGPT'],
};

const mockEntry = (id = 'vid1', title = '새로운 AI 데모', published = '2026-11-23T10:00:00Z') => `
  <entry>
    <yt:videoId>${id}</yt:videoId>
    <yt:channelId>UC_TEST</yt:channelId>
    <title>${title}</title>
    <link rel="alternate" href="https://www.youtube.com/watch?v=${id}"/>
    <published>${published}</published>
    <media:group>
      <media:description>영상에 대한 상세 설명입니다.</media:description>
      <media:thumbnail url="https://i.ytimg.com/vi/${id}/hqdefault.jpg"/>
    </media:group>
  </entry>
`;

const mockFeed = (entries) => `
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <title>Mock Channel</title>
  ${entries}
</feed>
`;

test('유튜브 공식 XML에서 최근 7일 내의 영상만 정확히 파싱한다', () => {
  const xml = mockFeed(
    mockEntry('vid1', '어제 영상', '2026-11-23T10:00:00Z') +
    mockEntry('vid2', '오래된 영상', '2026-11-10T10:00:00Z') + // 7일 초과
    mockEntry('vid3', '미래 영상', '2026-11-30T10:00:00Z') // 미래 시각 제외
  );

  const posts = parseYouTubeFeed(xml, mockChannel, now);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].id, 'yt-vid1');
  assert.equal(posts[0].company, 'OpenAI');
  assert.equal(posts[0].platform, 'YouTube');
  assert.equal(posts[0].mediaType, 'video');
  assert.equal(posts[0].thumbnail, 'https://i.ytimg.com/vi/vid1/hqdefault.jpg');
  assert.ok(posts[0].text.includes('어제 영상'));
});

test('유튜브 피드 수집 시 정상 수집 및 실패 시 기존 데이터 보존을 확인한다', async () => {
  const mockRead = async (url) => {
    return mockFeed(mockEntry('vid1', '최신 발표 영상', '2026-11-23T12:00:00Z'));
  };

  const result = await collectSocialMedia([], now, mockRead);
  assert.ok(result.posts.length > 0);
  assert.equal(result.sources.every((s) => s.status === 'success'), true);

  // 장애 발생 시 이전 데이터 보존
  const failingRead = async () => { throw new Error('네트워크 타임아웃'); };
  const fallback = await collectSocialMedia(result.posts, now, failingRead);
  assert.equal(fallback.posts.length, result.posts.length);
  assert.equal(fallback.sources.every((s) => s.status === 'error'), true);
});
