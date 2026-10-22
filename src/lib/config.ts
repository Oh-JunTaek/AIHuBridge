// ── AI Compass 루트 설정 ─────────────────────────────────
// ※ open/ 폴더 안에서만 동작. 외부 저장소 참조 없음.

export const config = {
  siteName: 'AI Compass',
  tagline: '뉴스, 학습, 인증 — 너만의 AI 데스크탑',
  newsSources: [
    {
      id: 'openai',
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/rss.xml',
      category: '업계/제품',
      lang: 'en',
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      url: 'https://huggingface.co/blog/feed.xml',
      category: '오픈소스',
      lang: 'en',
    },
    {
      id: 'github',
      name: 'GitHub Blog (AI)',
      url: 'https://github.blog/ai-and-ml/feed/',
      category: '오픈소스',
      lang: 'en',
    },
    {
      id: 'techcrunch',
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      category: '언론',
      lang: 'en',
    },
    {
      id: 'google-ai',
      name: 'Google AI Blog RSS',
      url: 'https://ai.googleblog.com/feeds/posts/default',
      category: '연구/논문',
      lang: 'en',
    },
    {
      id: 'korea-ai',
      name: 'Google 뉴스 AI (한국)',
      url: 'https://news.google.com/rss/search?q=AI&hl=ko&gl=KR&ceid=KR:ko',
      category: '언론',
      lang: 'ko',
    },
  ] as const,

  /** 카테고리별 컬러 (Tailwind 기본) */
  categoryColor: {
    '업계/제품': 'bg-amber-100 text-amber-800',
    '연구/논문': 'bg-indigo-100 text-indigo-800',
    '정책/규제': 'bg-emerald-100 text-emerald-800',
    '오픈소스': 'bg-cyan-100 text-cyan-800',
    '언론': 'bg-rose-100 text-rose-800',
    '블로그/개인': 'bg-purple-100 text-purple-800',
  },

  /** 로컬 저장 키 */
  storageKey: 'ai-compass/user',
} as const;

export type NewsSource = (typeof config.newsSources)[number];

export const nav = config;
