// 수집기와 화면이 함께 사용하는 유일한 뉴스 출처 목록이다.
export const newsSources = [
  { id: 'openai', name: 'OpenAI 공식 발표', url: 'https://openai.com/blog/rss.xml', category: '업계/제품', lang: 'en', origin: 'overseas', kind: 'developer', limit: 16 },
  { id: 'huggingface', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: '오픈소스', lang: 'en', origin: 'overseas', kind: 'community', limit: 16 },
  { id: 'deepmind', name: 'Google DeepMind 공식 발표', url: 'https://deepmind.google/blog/rss.xml', category: '업계/제품', lang: 'en', origin: 'overseas', kind: 'developer', limit: 16 },
  { id: 'mistral', name: 'Mistral 공식 발표', url: 'https://mistral.ai/news/rss', category: '업계/제품', lang: 'en', origin: 'overseas', kind: 'developer', limit: 16 },
  { id: 'github', name: 'GitHub Blog (AI)', url: 'https://github.blog/ai-and-ml/feed/', category: '오픈소스', lang: 'en', origin: 'overseas', kind: 'developer' },
  { id: 'techcrunch', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: '언론', lang: 'en', origin: 'overseas', kind: 'media' },
  { id: 'arxiv', name: 'arXiv AI 논문', url: 'https://rss.arxiv.org/rss/cs.AI+cs.CL+cs.CV+cs.LG+cs.SD', category: '연구/논문', lang: 'en', origin: 'overseas', kind: 'paper', limit: 24 },
  { id: 'koreagnews', name: 'Google 뉴스 AI (한국)', url: 'https://news.google.com/rss/search?q=AI&hl=ko&gl=KR&ceid=KR:ko', category: '언론', lang: 'ko', origin: 'domestic', kind: 'media' },
  { id: 'geeknews', name: '긱뉴스', url: 'https://news.hada.io/rss/news', category: '언론', lang: 'ko', origin: 'domestic', kind: 'community', aiOnly: true, titleOnly: true, limit: 12 },
  { id: 'aitimes', name: 'AI타임스', url: 'https://cdn.aitimes.com/rss/gn_rss_allArticle.xml', category: '언론', lang: 'ko', origin: 'domestic', kind: 'media', titleOnly: true, limit: 12 },
];
