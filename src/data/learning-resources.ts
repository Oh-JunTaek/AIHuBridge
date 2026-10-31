import { certifications } from './certifications';
import { isEducationAvailable } from '../lib/cert-rules.mjs';

export type ResourceKind = '강의' | '학습 자료' | '실습' | '프로젝트' | '학습 플랫폼' | '역량 평가';
export type LearningResource = { id: string; name: string; provider: string; kinds: ResourceKind[]; description: string; language: string; cost: string; url: string; checked: string };

// 기존 교육 데이터는 중복 저장하지 않고 원본의 검토일과 비용을 유지한다.
const existing: LearningResource[] = certifications.filter((item) => isEducationAvailable(item)).map((item) => ({
  id: item.id, name: item.name, provider: item.provider,
  kinds: item.type === 'micro' ? ['역량 평가'] : item.id === 'hf-agents' ? ['강의', '실습', '프로젝트'] : item.id === 'boost-ml-coders' ? ['강의', '실습'] : ['강의'],
  description: item.note || item.requirements,
  language: item.language === 'ko' ? '한국어' : item.language === 'both' ? '한국어·영어' : item.language === 'en' ? '영어' : '언어 미확인',
  cost: item.learningFee.note, url: item.url, checked: item.verifiedAt,
}));

export const learningResources: LearningResource[] = [
  { id:'kstqb-qa-foundation', name:'CTFL 공식 실러버스와 샘플 문제', provider:'KSTQB · ISTQB', kinds:['학습 자료'], description:'QA와 소프트웨어 테스팅 기초, 공식 출제 범위와 샘플 문제를 살펴봅니다.', language:'한국어·영어 · 자료별 확인', cost:'공식 학습 자료 무료 · 자격시험 응시료 별도', url:'https://www.kstqb.org/sw/sw3.asp', checked:'2026-10-31' },
  { id:'playwright-qa', name:'Playwright 테스트 작성', provider:'Playwright', kinds:['실습'], description:'QA 웹 자동화 테스트를 작성하고 실행하는 공식 실습 안내입니다.', language:'영어 · 한국어 지원 여부 확인 필요', cost:'공식 문서 무료 · 실습용 개발 환경 필요', url:'https://playwright.dev/docs/writing-tests', checked:'2026-10-31' },
  { id:'kstqb-ai-testing', name:'AI Testing 공식 시험 범위와 샘플 문제', provider:'KSTQB · ISTQB', kinds:['학습 자료'], description:'AI 기반 시스템의 QA 및 테스트 기법을 공식 실러버스로 살펴봅니다.', language:'한국어·영어 · 자료별 확인', cost:'공식 학습 자료 무료 · 자격시험 응시료 별도', url:'https://www.kstqb.org/sw/sw3_6.asp', checked:'2026-10-31' },
  { id:'openai-academy', name:'OpenAI Academy', provider:'OpenAI', kinds:['학습 플랫폼'], description:'AI 기초부터 실무 활용과 개발까지 살펴볼 수 있는 공식 학습 공간입니다.', language:'한국어 지원 여부 확인 필요', cost:'과정 무료 · 수강 및 진도 저장에 ChatGPT 계정 필요', url:'https://academy.openai.com/', checked:'2026-10-30' },
  { id:'claude-academy', name:'Claude Academy', provider:'Anthropic', kinds:['학습 플랫폼'], description:'AI 활용과 Claude, 개발 도구를 배우는 공식 과정과 튜토리얼을 제공합니다.', language:'한국어 지원 여부 확인 필요', cost:'과정 무료 · 진도 저장 및 배지에 Claude 계정 필요', url:'https://academy.claude.com/', checked:'2026-10-30' },
  { id:'kaggle-pandas', name:'Pandas', provider:'Kaggle', kinds:['강의', '실습'], description:'짧은 실습 문제를 풀며 데이터 읽기와 정리, 분류를 익힙니다.', language:'영어 · 한국어 지원 확인 필요', cost:'무료 · 실습 환경과 가입 조건은 제공처 확인', url:'https://www.kaggle.com/learn/pandas', checked:'2026-10-30' },
  { id:'google-ml-practice', name:'Machine Learning Crash Course 실습', provider:'Google for Developers', kinds:['강의', '실습'], description:'머신러닝의 기초를 시각화와 브라우저 실습으로 살펴봅니다.', language:'한국어 지원 여부 확인 필요', cost:'공식 제공 조건과 실습 환경 확인', url:'https://developers.google.com/machine-learning/crash-course/exercises', checked:'2026-10-30' },
  { id:'ms-ai-security', name:'AI 보안 기본 사항', provider:'Microsoft Learn', kinds:['강의'], description:'AI 시스템의 보안 위협, 보안 제어와 보안 테스트의 기초를 배웁니다.', language:'한국어', cost:'학습 및 Azure 사용 조건은 제공처 확인', url:'https://learn.microsoft.com/ko-kr/training/paths/ai-security-fundamentals/', checked:'2026-10-30' },
  { id:'ms-cybersecurity', name:'보안, 규정 준수 및 ID 학습', provider:'Microsoft Learn', kinds:['학습 플랫폼'], description:'사이버 보안 기초와 보안 학습 경로를 둘러봅니다.', language:'한국어', cost:'과정 및 실습별 이용 조건 확인', url:'https://learn.microsoft.com/ko-kr/training/topics/sci', checked:'2026-10-30' },
  ...existing,
];
