const fs = require('fs');

// PowerShell here-string로 안전하게 .cjs 생성 → node로 실행
const cjsContent = `
const fs = require('fs');
let c = fs.readFileSync('scripts/fetch-calendar.mjs', 'utf8');

const oldSourcesPattern = /const SOURCES = \\[([\\s\\S]*?)\\];/;
const newSources = \`const CATEGORY_SOURCES = {
  government: [
    { id: 'ai-edu-center', name: 'AI 교육진흥센터', url: 'https://aiedu.go.kr/rss.do', type: 'training', category: 'ai-core', lang: 'ko', region: '전국' },
  ],
  corporate: [
    { id: 'naver-ai', name: '네이버 AI', url: 'https://news.blog.naver.com/NaverPostList.naver', type: 'seminar', category: 'ai-applied', lang: 'ko', region: '경기' },
    { id: 'kakao-ai', name: '카카오 AI', url: 'https://tech.kakao.com/blog/feed/', type: 'workshop', category: 'ai-applied', lang: 'ko', region: '서울' },
  ],
  bootcamp: [
    { id: 'fastcampus', name: '패스트캠퍼스', url: 'https://www.fastcampus.co.kr/feed', type: 'bootcamp', category: 'ai-applied', lang: 'ko', region: '전국' },
  ],
  webinar: [
    { id: 'aws-ai', name: 'AWS Genius', url: 'https://aws.amazon.com/blogs/ai/feed/', type: 'webinar', category: 'ai-applied', lang: 'en', region: '전국' },
  ],
  hackathon: [
    { id: 'devpost-ai', name: 'Devpost AI', url: 'https://devpost.com/hackathons.json', type: 'hackathon', category: 'general', lang: 'en', region: '전국' },
  ],
  competition: [
    { id: 'ai-challenge', name: 'AI 충전소', url: 'https://aichallenge.or.kr/feed', type: 'competition', category: 'ai-core', lang: 'ko', region: '전국' },
  ],
  community: [
    { id: 'ai-society', name: 'AI학회', url: 'https://aidea.or.kr/feed', type: 'seminar', category: 'ai-core', lang: 'ko', region: '서울' },
  ],
};
\`;

if (oldSourcesPattern.test(c)) {
  c = c.replace(oldSourcesPattern, newSources);
  console.log('✅ CATEGORY_SOURCES 교체 완료');
} else {
  console.log('⚠️ 패턴 매치 안 됨');
  // 직접 삽입
  c = newSources + '\\n' + c;
}

// 2. main()에서 SOURCES 참조 → CATEGORY_SOURCES로 변경
c = c.replace(/SOURCES\.map/g, "Object.keys(CATEGORY_SOURCES).map");
c = c.replace(/for \\(const src of SOURCES\\)/, "for (const [category, sources] of Object.entries(CATEGORY_SOURCES))");

fs.writeFileSync('scripts/fetch-calendar.mjs', c, 'utf8');
console.log('CATEGORY_SOURCES 포함:', c.includes('CATEGORY_SOURCES'));
console.log('Object.entries 포함:', c.includes('Object.entries(CATEGORY_SOURCES)'));
`;

fs.writeFileSync('tmp-fix.cjs', cjsContent, 'utf8');
console.log('✅ tmp-fix.cjs 작성');
