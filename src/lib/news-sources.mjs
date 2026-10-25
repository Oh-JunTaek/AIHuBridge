// 수집기와 화면이 함께 사용하는 유일한 뉴스 출처 목록이다.
export const newsSources = [
  { id: 'openai', name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: '업계/제품', lang: 'en' },
  { id: 'huggingface', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: '오픈소스', lang: 'en' },
  { id: 'github', name: 'GitHub Blog (AI)', url: 'https://github.blog/ai-and-ml/feed/', category: '오픈소스', lang: 'en' },
  { id: 'techcrunch', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: '언론', lang: 'en' },
  { id: 'arxiv', name: 'arXiv cs.AI', url: 'https://export.arxiv.org/rss/cs.AI', category: '연구/논문', lang: 'en' },
  { id: 'koreagnews', name: 'Google 뉴스 AI (한국)', url: 'https://news.google.com/rss/search?q=AI&hl=ko&gl=KR&ceid=KR:ko', category: '언론', lang: 'ko' },
];
