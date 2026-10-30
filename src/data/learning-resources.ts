import { certifications } from './certifications';
import { isEducationAvailable } from '../lib/cert-rules.mjs';

export type ResourceKind = '강의' | '실습' | '프로젝트' | '학습 플랫폼' | '역량 평가';
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
  { id:'openai-academy', name:'OpenAI Academy', provider:'OpenAI', kinds:['학습 플랫폼'], description:'AI 기초부터 실무 활용과 개발까지 살펴볼 수 있는 공식 학습 공간입니다.', language:'한국어 지원 여부 확인 필요', cost:'과정 무료 · 수강 및 진도 저장에 ChatGPT 계정 필요', url:'https://academy.openai.com/', checked:'2026-10-30' },
  { id:'claude-academy', name:'Claude Academy', provider:'Anthropic', kinds:['학습 플랫폼'], description:'AI 활용과 Claude, 개발 도구를 배우는 공식 과정과 튜토리얼을 제공합니다.', language:'한국어 지원 여부 확인 필요', cost:'과정 무료 · 진도 저장 및 배지에 Claude 계정 필요', url:'https://academy.claude.com/', checked:'2026-10-30' },
  { id:'kaggle-pandas', name:'Pandas', provider:'Kaggle', kinds:['강의', '실습'], description:'짧은 실습 문제를 풀며 데이터 읽기와 정리, 분류를 익힙니다.', language:'영어 · 한국어 지원 확인 필요', cost:'무료 · 실습 환경과 가입 조건은 제공처 확인', url:'https://www.kaggle.com/learn/pandas', checked:'2026-10-30' },
  { id:'google-ml-practice', name:'Machine Learning Crash Course 실습', provider:'Google for Developers', kinds:['강의', '실습'], description:'머신러닝의 기초를 시각화와 브라우저 실습으로 살펴봅니다.', language:'한국어 지원 여부 확인 필요', cost:'공식 제공 조건과 실습 환경 확인', url:'https://developers.google.com/machine-learning/crash-course/exercises', checked:'2026-10-30' },
  ...existing,
];
