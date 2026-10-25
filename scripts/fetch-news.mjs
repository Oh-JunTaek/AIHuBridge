import { mkdirSync } from 'node:fs';
import { writeJson } from './lib/data-files.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readRss } from './lib/rss.mjs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'public/data');
mkdirSync(outDir, { recursive: true });
const SOURCES = [
  { id: 'openai', name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: '업계/제품', lang: 'en' },
  { id: 'huggingface', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: '오픈소스', lang: 'en' },
  { id: 'github', name: 'GitHub Blog (AI)', url: 'https://github.blog/ai-and-ml/feed/', category: '오픈소스', lang: 'en' },
  { id: 'techcrunch', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: '언론', lang: 'en' },
  { id: 'arxiv', name: 'arXiv cs.AI', url: 'https://export.arxiv.org/rss/cs.AI', category: '연구/논문', lang: 'en' },
  { id: 'koreagnews', name: 'Google 뉴스 AI (한국)', url: 'https://news.google.com/rss/search?q=AI&hl=ko&gl=KR&ceid=KR:ko', category: '언론', lang: 'ko' },
];
const KEYWORDS = ['GPT', 'Gemini', 'Claude', 'Llama', 'Open Source', '오픈소스', 'NVIDIA', 'Microsoft', 'Google', 'AWS', 'Meta', 'DeepLearning', 'Hugging Face', '연구', '정책', '규제', '안전'];
const PUB = /뉴스|신문|매일|매거진|방송|한국|타임|Tech|News|Weekly|Geek|Post|Blog/;
let tiers = { rule: 0, excerpt: 0 };
function normalizeWs(t) { return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); }
function publike(s) { return /\.(com|co|kr|org|net|io|ai)/.test(s) || /^[가-힣\s]+$/u.test(s) || PUB.test(s); }
function isP(s) { if (!s) return false; const t = String(s).trim(); return t.length > 0 && t.length <= 30 && !/[.!?]$/.test(t) && publike(t); }
function ruleSummary(text) { const s = normalizeWs(text); if (!s) return ''; const two = s.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ').trim(); return (two || s.slice(0, 240)); }
function summarizeSync(excerpt) { const result = ruleSummary(excerpt); if (result) { tiers.rule++; return result; } tiers.excerpt++; return ''; }
function tagFromTitle(title) { return KEYWORDS.filter((k) => (title || '').toLowerCase().includes(k.toLowerCase())).slice(0, 3); }
function cleanTitle(raw) { if (!raw) return '(제목 없음)'; let p = normalizeWs(raw).split(/\s*(?:—|–|－)\s*|\s+-\s+|\s*\|\s*|\s*｜\s*/); while (p.length > 1 && isP(p[p.length - 1])) p.pop(); return p.join(' ').replace(/\s+/g, ' ').trim() || '(제목 없음)'; }
function cleanExcerpt(raw, title) { if (!raw) return ''; let t = normalizeWs(raw); if (title && t.startsWith(title)) t = t.slice(title.length); t = t.replace(/^\s*[—–－\-｜·]\s*/, '').trim(); if (!t || t.length < 15 || isP(t) || (t.length <= 50 && publike(t))) return title || ''; return t; }
function makeId(src, link) { return createHash('sha256').update(src.id + ':' + (link || '')).digest('hex').slice(0, 12); }
function readMins(excerpt, title) { const c = (excerpt?.length ?? 0) + (title?.length ?? 0); return Math.max(1, Math.round(c / 220)); }
function toISO(pub) { try { return (pub ? new Date(pub) : new Date()).toISOString(); } catch { return new Date().toISOString(); } }
async function fetchOne(src) { try { const feed = await readRss(src.url); return feed.items.slice(0, 8).map((it) => { const title = cleanTitle(it.title); const excerpt = src.id === 'koreagnews' ? title : cleanExcerpt(it.contentSnippet || it.content || it.title || '', title); return { id: makeId(src, it.link || it.guid || ''), title, url: (it.link || '').trim(), source: src.name, publishedAt: toISO(it.pubDate), category: src.category, lang: src.lang, tags: tagFromTitle(it.title), excerpt, summary: null, readMinutes: readMins(excerpt, title) }; }); } catch (e) { console.warn(`[skip] ${src.name}: ${e.message || e}`); return []; } }
async function main() {
  const all = [], counts = {}, failures = [];
  for (const source of SOURCES) {
    const items = await fetchOne(source);
    counts[source.id] = items.length;
    if (!items.length) failures.push(source.id);
    all.push(...items);
  }
  const unique = [...new Map(all.filter((item) => /^https?:\/\//.test(item.url)).map((item) => [item.url, item])).values()];
  unique.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  unique.splice(40);
  if (!unique.length) throw new Error('뉴스 수집 결과가 0건이므로 이전 정상 데이터를 유지합니다');
  for (const item of unique) item.summary = summarizeSync(item.excerpt);
  const meta = { fetchedAt: new Date().toISOString(), total: unique.length, counts, unavailableSources: failures, summaryTiers: tiers, summaryMethod: 'rss-extract' };
  writeJson(resolve(outDir, 'news.json'), unique);
  writeJson(resolve(outDir, 'meta.json'), meta);
  console.log('뉴스 수집: ' + unique.length + '건 (RSS 설명문 발췌)');
  console.table(counts);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
