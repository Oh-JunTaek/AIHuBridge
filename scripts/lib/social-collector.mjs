import { createHash } from 'node:crypto';
import { readPublicText } from './rss.mjs';

export const youtubeChannels = [
  { id: 'openai-yt', company: 'OpenAI', name: 'OpenAI 공식', channelId: 'UCXZCJLdBC09xxGZ6gcdrc6A', channel: '기업 공식', platform: 'YouTube', products: ['ChatGPT', 'GPT', 'Sora'] },
  { id: 'anthropic-yt', company: 'Anthropic', name: 'Anthropic 공식', channelId: 'UCrDwWp7EBBv4NwvScIpBDOA', channel: '기업 공식', platform: 'YouTube', products: ['Claude'] },
  { id: 'google-deepmind-yt', company: 'Google', name: 'Google DeepMind', channelId: 'UCP7jMXSY2xbc3KCAE0MHQ-A', channel: '기업 공식', platform: 'YouTube', products: ['Gemini', 'AlphaFold', 'Genie'] },
  { id: 'google-dev-yt', company: 'Google', name: 'Google for Developers', channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', channel: '기업 공식', platform: 'YouTube', products: ['Gemini', 'Antigravity', 'Android'] },
  { id: 'nvidia-yt', company: 'NVIDIA', name: 'NVIDIA 공식', channelId: 'UCHuiy8bXnmK5nisYHUd1J5g', channel: '기업 공식', platform: 'YouTube', products: ['Blackwell', 'GeForce', 'CUDA'] },
  { id: 'nvidia-dev-yt', company: 'NVIDIA', name: 'NVIDIA Developer', channelId: 'UCBHcMCGaiJhv-ESTcWGJPcw', channel: '기업 공식', platform: 'YouTube', products: ['NIM', 'Omniverse', 'NeMo'] },
];

export function parseYouTubeFeed(xmlText, channelConfig, now = Date.now()) {
  if (typeof xmlText !== 'string' || !xmlText.includes('<feed')) {
    throw new Error('유튜브 XML 응답 형식 오류');
  }

  const cutoff = now - 7 * 86400000;
  const entries = [...xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  const posts = [];

  for (const [, entry] of entries) {
    const videoId = entry.match(/<yt:videoId>(.+?)<\/yt:videoId>/)?.[1];
    const rawTitle = entry.match(/<title>(.+?)<\/title>/)?.[1];
    const link = entry.match(/<link rel="alternate" href="(.+?)"/)?.[1];
    const published = entry.match(/<published>(.+?)<\/published>/)?.[1];
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || '';
    const thumbnail = entry.match(/<media:thumbnail url="(.+?)"/)?.[1];

    if (!videoId || !rawTitle || !link || !published) continue;
    const time = Date.parse(published);
    if (!Number.isFinite(time) || time < cutoff || time > now + 300000) continue;

    const title = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
    const cleanDesc = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    posts.push({
      id: `yt-${videoId}`,
      company: channelConfig.company,
      channel: channelConfig.channel,
      products: channelConfig.products,
      author: channelConfig.name,
      handle: channelConfig.company,
      repost: false,
      text: title + (cleanDesc ? ` — ${cleanDesc.slice(0, 150)}` : ''),
      date: new Date(time).toISOString(),
      url: link,
      platform: 'YouTube',
      mediaType: 'video',
      thumbnail: thumbnail || null,
    });
  }

  return posts;
}

export async function collectSocialMedia(previous = [], now = Date.now(), read = readPublicText) {
  const sources = [];
  const allPosts = [];

  for (const ch of youtubeChannels) {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`;
    try {
      const xml = await read(feedUrl);
      const posts = parseYouTubeFeed(xml, ch, now);
      allPosts.push(...posts);
      sources.push({ id: ch.id, status: 'success', received: posts.length, company: ch.company });
    } catch (error) {
      const retained = previous.filter((p) => p.author === ch.name && Date.parse(p.date) >= now - 7 * 86400000);
      allPosts.push(...retained);
      sources.push({ id: ch.id, status: 'error', retained: retained.length, error: String(error.message || error) });
    }
  }

  // 중복 ID 제거 및 최신순 정렬
  const seen = new Set();
  const deduped = [];
  for (const post of allPosts.sort((a, b) => b.date.localeCompare(a.date))) {
    if (!seen.has(post.id)) {
      seen.add(post.id);
      deduped.push(post);
    }
  }

  return { posts: deduped, sources };
}
