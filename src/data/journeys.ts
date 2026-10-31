export type Purpose = 'career' | 'create' | 'apply' | 'explore';
export type Topic = 'data' | 'qa';
export type Step = { title: string; objective: string; resources: { id: string; slot?: string; reason: string }[]; activity?: string };
export type Journey = { topic: Topic; title: string; description: string; careerId: string; qualificationIds: string[]; steps: Step[] };

// 자료는 등록된 원본의 ID만 참조한다. 각 단계의 선정 이유는 편집자가 작성한다.
export const journeys: Journey[] = [
  { topic: 'data', title: '데이터 분석', description: '데이터를 정리하고 질문에 대한 답을 찾아봅니다.', careerId: 'data-analyst', qualificationIds: ['adsp', 'sqld'], steps: [
    { title: '데이터를 살펴보기', objective: '표를 보고 질문을 정하고, 데이터가 무엇을 의미하는지 살펴봅니다.', resources: [], activity: '관심 있는 표에서 질문 하나를 정하고, 비교할 항목을 골라보세요.' },
    { title: '기초를 익히기', objective: '파이썬의 기초를 살펴보고 데이터 분석의 흐름을 익힙니다.', resources: [{ id:'boost-python-everybody', reason:'데이터 분석 도구를 배우기 전에 파이썬의 기초를 살펴볼 수 있습니다.' }, { id:'boost-data-science', reason:'파이썬으로 데이터를 분석하고 시각화하는 기초를 다룹니다.' }] },
    { title: '직접 정리하고 분석하기', objective: '데이터를 읽고 정리하는 방법을 연습합니다.', resources: [{ id:'kaggle-pandas', reason:'데이터 읽기와 정리 과정을 실습할 수 있습니다. 영어 자료입니다.' }] },
    { title: '결과를 설명하기', objective: '질문과 분석 결과를 표나 그래프로 설명합니다.', resources: [], activity: '관심 있는 공개 데이터를 골라 그래프와 짧은 설명이 담긴 보고서를 만들어 보세요.' },
  ] },
  { topic: 'qa', title: '소프트웨어 QA', description: '서비스의 품질을 살피고 문제를 설명하는 방법을 배웁니다.', careerId: 'qa', qualificationIds: ['istqb-ctfl', 'istqb-ct-ai'], steps: [
    { title: '서비스를 관찰하기', objective: '사용자가 겪을 수 있는 정상·오류 상황을 생각합니다.', resources: [], activity: '로그인 화면의 정상 입력과 오류 상황을 나누어 적어보세요.' },
    { title: '테스트 기초 알아보기', objective: '테스트의 기본 개념과 테스트 설계의 범위를 살펴봅니다.', resources: [{ id:'kstqb-qa-foundation', reason:'테스트 기초의 공식 실러버스와 예시 문제를 살펴볼 수 있습니다.' }] },
    { title: '테스트를 직접 해보기', objective: '테스트를 설계하고 자동화 기초를 살펴봅니다.', resources: [{ id:'playwright-qa', reason:'웹 테스트를 작성하는 공식 실습 안내입니다. 개발 환경과 영어 문서 확인이 필요합니다.' }] },
    { title: '발견한 문제 설명하기', objective: '테스트 조건과 결과를 다른 사람이 이해할 수 있게 정리합니다.', resources: [], activity: '테스트한 조건, 기대 결과, 실제 결과와 재현 순서를 짧은 보고서로 작성해 보세요.' },
  ] },
];

export const purposes: { id: Purpose; title: string; description: string }[] = [
  { id:'career', title:'새로운 직무에 도전', description:'일을 이해하고 필요한 역량과 결과물을 준비해요.' },
  { id:'create', title:'직접 만들고 활용', description:'작게 시작해 나만의 결과물을 만들어 봐요.' },
  { id:'apply', title:'일상과 업무에 활용', description:'지금 하는 일에 필요한 방법을 익혀요.' },
  { id:'explore', title:'아직 잘 모르겠어요', description:'가볍게 살펴보며 관심을 찾아봐요.' },
];
