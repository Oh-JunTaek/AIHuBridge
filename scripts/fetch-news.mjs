import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import Parser from 'rss-parser';
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'public/data');
mkdirSync(outDir, { recursive: true });
const parser = new Parser({ headers: { 'user-agent': 'ai-compass/0.1 (local rss reader)' }, timeout: 20_000 });
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
let tiers = { llm: 0, rule: 0, excerpt: 0 };
const USE_OLLAMA = process.env.AI_COMPASS_SUMMON === 'ollama';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';
async function ollamaSummarize(text) { try { const res = await fetch(OLLAMA_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: OLLAMA_MODEL, prompt: `비전공자도 이해할 수 있게 핵심만 2~3문장으로 요약해. 제품명·수치 꼭 언급해.\n---\n${text}`, stream: false, temperature: 0.3 }), signal: AbortSignal.timeout(15_000) }); if (!res.ok) return null; const data = await res.json(); return (data.response || '').trim() || null; } catch { return null; } }
function normalizeWs(t) { return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); }
function publike(s) { return /\.(com|co|kr|org|net|io|ai)/.test(s) || /^[가-힣\s]+$/u.test(s) || PUB.test(s); }
function isP(s) { if (!s) return false; const t = String(s).trim(); return t.length > 0 && t.length <= 30 && !/[.!?]$/.test(t) && publike(t); }
function ruleSummary(text) { const s = normalizeWs(text); if (!s) return ''; const two = s.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ').trim(); return (two || s.slice(0, 240)); }
function summarizeSync(excerpt) { if (USE_OLLAMA) return null; const r = ruleSummary(excerpt); if (r) { tiers.rule++; return r; } tiers.excerpt++; return String(excerpt || '').slice(0, 200) + '…'; }
async function summarize(item) { const promptText = `${item.title}. ${item.excerpt}`; if (USE_OLLAMA) { const s = await ollamaSummarize(promptText); if (s) { tiers.llm++; return s; } } const r = ruleSummary(item.excerpt || item.title); if (r) { tiers.rule++; return r; } tiers.excerpt++; return String(item.excerpt || item.title).slice(0, 200) + '…'; }
function tagFromTitle(title) { return KEYWORDS.filter((k) => (title || '').toLowerCase().includes(k.toLowerCase())).slice(0, 3); }
function cleanTitle(raw) { if (!raw) return '(제목 없음)'; let p = normalizeWs(raw).split(/\s*(?:—|–|－)\s*|\s+-\s+|\s*\|\s*|\s*｜\s*/); while (p.length > 1 && isP(p[p.length - 1])) p.pop(); return p.join(' ').replace(/\s+/g, ' ').trim() || '(제목 없음)'; }
function cleanExcerpt(raw, title) { if (!raw) return ''; let t = normalizeWs(raw); if (title && t.startsWith(title)) t = t.slice(title.length); t = t.replace(/^\s*[—–－\-｜·]\s*/, '').trim(); if (!t || t.length < 15 || isP(t) || (t.length <= 50 && publike(t))) return title || ''; return t; }
function makeId(src, link) { return createHash('sha256').update(src.id + ':' + (link || '')).digest('hex').slice(0, 12); }
function readMins(excerpt, title) { const c = (excerpt?.length ?? 0) + (title?.length ?? 0); return Math.max(1, Math.round(c / 220)); }
function toISO(pub) { try { return (pub ? new Date(pub) : new Date()).toISOString(); } catch { return new Date().toISOString(); } }
async function fetchOne(src) { try { const feed = await parser.parseURL(src.url); return feed.items.slice(0, 8).map((it) => { const title = cleanTitle(it.title); const excerpt = src.id === 'koreagnews' ? title : cleanExcerpt(it.contentSnippet || it.content || it.title || '', title); return { id: makeId(src, it.link || it.guid || ''), title, url: (it.link || '').trim(), source: src.name, publishedAt: toISO(it.pubDate), category: src.category, lang: src.lang, tags: tagFromTitle(it.title), excerpt, summary: null, readMinutes: readMins(excerpt, title) }; }); } catch (e) { console.warn(`[skip] ${src.name}: ${e.message || e}`); return []; } }
async function main() { const all = []; const counts = {}; for (const src of SOURCES) { const items = await fetchOne(src); counts[src.id] = items.length; all.push(...items); } all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()); all.splice(40); for (const it of all) it.summary = summarizeSync(it.excerpt); if (USE_OLLAMA) for (let i = 0; i < all.length; i++) { if (!all[i].summary) all[i].summary = await summarize(all[i]); } const meta = { fetchedAt: new Date().toISOString(), total: all.length, counts, summaryTiers: tiers }; writeFileSync(resolve(outDir, 'news.json'), JSON.stringify(all, null, 2), 'utf8'); writeFileSync(resolve(outDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8'); console.log(`✅ news.json: ${all.length}건 | tiers: LLM ${tiers.llm}, rule ${tiers.rule}, excerpt ${tiers.excerpt}`); console.table(counts); }
main().catch((e) => { console.error(e); process.exit(1); });
