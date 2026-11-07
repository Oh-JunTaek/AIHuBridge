// 수집기와 화면이 함께 사용하는 유일한 뉴스 출처 목록이다.
export const newsSources = [
  { id: 'openai', name: 'OpenAI 공식 발표', url: 'https://openai.com/blog/rss.xml', category: '업계/제품', lang: 'en', origin: 'overseas', kind: 'developer', limit: 16 },
  { id: 'huggingface', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: '오픈소스', lang: 'en', origin: 'overseas', kind: 'community', limit: 16 },
  { id: 'deepmind', name: 'Google DeepMind 공식 발표', url: 'https://deepmind.google/blog/rss.xml', category: '업계/제품', lang: 'en', origin: 'overseas', kind: 'developer', limit: 16 },
  { id: 'mistral', name: 'Mistral 공식 발표', url: 'https://mistral.ai/news/rss', category: '업계/제품', lang: 'en', origin: 'overseas', kind: 'developer', limit: 16 },
  { id: 'github', name: 'GitHub Blog (AI)', url: 'https://github.blog/ai-and-ml/feed/', category: '오픈소스', lang: 'en', origin: 'overseas', kind: 'developer' },
  { id: 'techcrunch', name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: '언론', lang: 'en', origin: 'overseas', kind: 'media' },
  { id: 'arxiv', name: 'arXiv AI 논문', url: 'https://rss.arxiv.org/rss/cs.AI+cs.CL+cs.CV+cs.LG+cs.SD', category: '연구/논문', lang: 'en', origin: 'overseas', kind: 'paper', limit: 24 },
  { id: 'koreagnews', name: 'Google 뉴스 AI (한국)', url: 'https://news.google.com/rss/search?q=AI&hl=ko&gl=KR&ceid=KR:ko', category: '언론', lang: 'ko', origin: 'domestic', kind: 'media', limit: 20 },
  { id: 'model-release-ko', name: 'Google 뉴스 모델 출시 (한국어)', url: 'https://news.google.com/rss/search?q=%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5%20%EB%AA%A8%EB%8D%B8%20%EC%B6%9C%EC%8B%9C%20OR%20%EA%B3%B5%EA%B0%9C%20OR%20%EB%B0%9C%ED%91%9C&hl=ko&gl=KR&ceid=KR:ko', category: '언론', lang: 'ko', origin: 'domestic', kind: 'media', limit: 20, titleOnly: true, modelReleaseOnly: true },
  { id: 'model-release-en', name: 'Google 뉴스 모델 출시 (영어)', url: 'https://news.google.com/rss/search?q=AI%20model%20launch%20OR%20release%20OR%20introduces&hl=en-US&gl=US&ceid=US:en', category: '언론', lang: 'en', origin: 'overseas', kind: 'media', limit: 20, titleOnly: true, modelReleaseOnly: true },
  { id: 'koreagnews-local', name: 'Google 뉴스 한국 AI 검색', url: 'https://news.google.com/rss/search?q=%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5%20(%EA%B5%AD%EB%82%B4%20OR%20%ED%95%9C%EA%B5%AD%20OR%20%EB%84%A4%EC%9D%B4%EB%B2%84%20OR%20%EC%B9%B4%EC%B9%B4%EC%98%A4%20OR%20%EC%82%BC%EC%84%B1%20OR%20%EC%97%85%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%80)&hl=ko&gl=KR&ceid=KR:ko', category: '언론', lang: 'ko', origin: 'domestic', kind: 'media', titleOnly: true, aiTitleOnly: true, titleKeywords: ['국내', '한국', '대한민국', '네이버', '카카오', '삼성', '업스테이지'], limit: 20 },
  { id: 'geeknews', name: '긱뉴스', url: 'https://news.hada.io/rss/news', category: '언론', lang: 'ko', origin: 'domestic', kind: 'community', aiOnly: true, titleOnly: true, limit: 20 },
  { id: 'aitimes', name: 'AI타임스', url: 'https://cdn.aitimes.com/rss/gn_rss_allArticle.xml', category: '언론', lang: 'ko', origin: 'domestic', kind: 'media', titleOnly: true, limit: 20 },
  { id: 'kakao-tech', name: '카카오 기술 블로그', url: 'https://tech.kakao.com/blog/feed/', category: '업계/제품', lang: 'ko', origin: 'domestic', kind: 'developer', aiOnly: true, titleOnly: true, limit: 20 },
  { id: 'msit', name: '과학기술정보통신부 보도자료', url: 'https://www.msit.go.kr/user/rss/rss.do?bbsSeqNo=94', category: '정책/규제', lang: 'ko', origin: 'domestic', kind: 'government', aiOnly: true, titleOnly: true, limit: 20 },
];
