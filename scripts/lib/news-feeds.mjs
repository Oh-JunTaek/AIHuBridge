import { setTimeout as delay } from 'node:timers/promises';
import { readRss } from './rss.mjs';
import { newsSources } from '../../src/lib/news-sources.mjs';

export const arxivRecent = 'https://export.arxiv.org/api/query?search_query=cat%3Acs.AI%20OR%20cat%3Acs.CL%20OR%20cat%3Acs.CV%20OR%20cat%3Acs.LG%20OR%20cat%3Acs.SD&sortBy=submittedDate&sortOrder=descending&max_results=40';
export async function readNewsFeed(url, reader = readRss, wait = delay) {
  const source = newsSources.find((source) => source.url === url);
  let feed;
  try { feed = await reader(url); }
  catch (error) {
    if (source?.id !== 'arxiv') throw error;
    feed = { items: [] };
  }
  const datedItems = Array.isArray(feed.items) && feed.items.some((item) => Number.isFinite(Date.parse(item.isoDate || item.pubDate)));
  if (source?.id !== 'arxiv' || !Array.isArray(feed.items) || datedItems) return feed;
  // arXiv의 휴일 RSS는 정상적으로 비어 있을 수 있다. 공식 Atom 최근 제출 목록으로 보완한다.
  // 동일 기관 요청은 한 연결씩 최소 3초 간격을 둔다.
  await wait(3000);
  const recent = await reader(arxivRecent);
  return { ...recent, collectionMode: 'recent-atom' };
}
