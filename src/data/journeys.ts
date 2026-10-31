export type Purpose = 'career' | 'create' | 'apply' | 'explore';
export type Topic = 'data' | 'qa' | 'ai' | 'security' | 'coding';
export type Step = { title: string; objective: string; resources: { id: string; slot?: string; reason: string }[]; activity?: string };
export type Journey = { id: string; topic: Topic; title: string; description: string; startingPoint: string; outcome: string; purposes: Purpose[]; careerId?: string; certQuery?: string; qualificationIds: string[]; steps: Step[] };

export const topics: { id: Topic; title: string }[] = [
  { id:'ai', title:'AI' }, { id:'data', title:'데이터' }, { id:'qa', title:'QA' }, { id:'security', title:'보안' }, { id:'coding', title:'프로그래밍' },
];
export const purposes: { id: Purpose; title: string; description: string }[] = [
  { id:'career', title:'새로운 직무에 도전', description:'일을 이해하고 필요한 역량과 결과물을 준비해요.' },
  { id:'create', title:'직접 만들고 활용', description:'작게 시작해 나만의 결과물을 만들어 봐요.' },
  { id:'apply', title:'일상과 업무에 활용', description:'지금 하는 일에 필요한 방법을 익혀요.' },
  { id:'explore', title:'아직 잘 모르겠어요', description:'가볍게 살펴보며 관심을 찾아봐요.' },
];

// 등록된 원본 ID와 편집자가 확인한 연결 이유만 사용한다. 자료가 바뀌어도 단계의 목표는 유지한다.
export const journeys: Journey[] = [
  { id:'data-first', topic:'data', title:'데이터 분석 첫걸음', description:'데이터를 읽고 질문에 맞는 분석을 시작합니다.', startingPoint:'처음부터', outcome:'표를 살펴보고 분석 질문 정하기', purposes:['career','create','apply','explore'], careerId:'data-analyst', certQuery:'데이터', qualificationIds:['adsp','sqld'], steps:[
    { title:'데이터 관찰하기', objective:'표를 보고 질문을 정하고 데이터의 의미를 살펴봅니다.', resources:[], activity:'관심 있는 표에서 질문 하나를 정하고 비교할 항목을 골라보세요.' },
    { title:'파이썬 익히기', objective:'데이터 도구에 필요한 프로그래밍 기초를 배웁니다.', resources:[{ id:'boost-python-everybody', reason:'데이터 분석을 배우기 전에 파이썬의 기초를 살펴볼 수 있습니다.' }] },
    { title:'데이터 분석 시작하기', objective:'파이썬으로 데이터를 다루고 분석하는 흐름을 배웁니다.', resources:[{ id:'boost-data-science', reason:'파이썬 데이터 분석과 시각화의 기초를 다룹니다.' }] },
    { title:'결과 설명하기', objective:'관찰한 내용을 다른 사람이 이해할 수 있게 정리합니다.', resources:[], activity:'질문과 관찰 내용을 간단한 표나 그래프와 함께 정리해 보세요.' },
  ] },
  { id:'data-project', topic:'data', title:'데이터로 작은 보고서 만들기', description:'데이터 정리부터 그래프와 설명까지 연결해 봅니다.', startingPoint:'파이썬 기초를 안다면', outcome:'질문과 그래프가 담긴 보고서', purposes:['career','create','apply'], careerId:'data-analyst', certQuery:'데이터', qualificationIds:['adsp'], steps:[
    { title:'질문과 데이터 정하기', objective:'답해 보고 싶은 질문과 이용 가능한 데이터를 고릅니다.', resources:[], activity:'공개 데이터의 출처와 이용 조건을 확인하고 질문 하나를 적어보세요.' },
    { title:'데이터 정리 연습하기', objective:'파이썬으로 데이터를 읽고 정리하는 방법을 연습합니다.', resources:[{ id:'kaggle-pandas', reason:'Pandas로 데이터를 읽고 정리하는 실습을 살펴볼 수 있습니다.' }] },
    { title:'분석 결과 만들기', objective:'기초 분석과 시각화 흐름을 복습합니다.', resources:[{ id:'boost-data-science', reason:'데이터 분석과 시각화 학습을 보완할 수 있습니다.' }] },
    { title:'보고서 완성하기', objective:'분석 과정과 결과의 한계를 설명합니다.', resources:[], activity:'그래프와 함께 질문·자료 출처·관찰 결과를 한 장으로 정리해 보세요.' },
  ] },
  { id:'qa-first', topic:'qa', title:'소프트웨어 QA 첫걸음', description:'서비스를 관찰하고 테스트를 설계하는 기초를 배웁니다.', startingPoint:'처음부터', outcome:'테스트 조건과 결과 정리', purposes:['career','apply','explore'], careerId:'qa', certQuery:'QA', qualificationIds:['istqb-ctfl'], steps:[
    { title:'서비스 관찰하기', objective:'사용자가 겪을 수 있는 정상·오류 상황을 생각합니다.', resources:[], activity:'로그인 화면의 정상 입력과 오류 상황을 나누어 적어보세요.' },
    { title:'테스트 기초 알아보기', objective:'테스트 개념과 설계 범위를 살펴봅니다.', resources:[{ id:'kstqb-qa-foundation', reason:'테스트 기초의 공식 실러버스와 예시 문제를 살펴볼 수 있습니다.' }] },
    { title:'문제 설명하기', objective:'다른 사람이 문제를 재현할 수 있도록 정리합니다.', resources:[], activity:'테스트 조건, 기대 결과와 실제 결과를 짧은 보고서로 작성해 보세요.' },
  ] },
  { id:'qa-automation', topic:'qa', title:'웹 테스트 자동화 시작하기', description:'웹 테스트 작성의 기초를 실습합니다.', startingPoint:'자바스크립트 기초가 있다면', outcome:'간단한 웹 테스트 작성', purposes:['career','create'], careerId:'qa', certQuery:'QA', qualificationIds:['istqb-ctfl'], steps:[
    { title:'테스트 관점 정하기', objective:'확인할 사용자 동작과 기대 결과를 구분합니다.', resources:[{ id:'kstqb-qa-foundation', reason:'테스트 기초 개념을 살펴보는 참고 자료입니다.' }] },
    { title:'테스트 작성하기', objective:'웹 테스트의 구성과 실행 방법을 익힙니다.', resources:[{ id:'playwright-qa', reason:'Playwright 공식 안내로 웹 테스트 작성 방법을 살펴봅니다.' }] },
    { title:'결과 기록하기', objective:'정상 동작과 오류 상황을 확인하고 결과를 정리합니다.', resources:[], activity:'연습용 웹사이트의 한 가지 동작을 테스트하고 실행 결과를 기록해 보세요.' },
  ] },
  { id:'qa-ai-testing', topic:'qa', title:'AI 시스템 테스트 이해하기', description:'AI 시스템을 검증할 때 고려할 점을 살펴봅니다.', startingPoint:'소프트웨어 테스트와 AI 기초가 있다면', outcome:'AI 시스템의 테스트 관점 정리', purposes:['career','create'], careerId:'qa', qualificationIds:['istqb-ct-ai'], steps:[
    { title:'테스트 기초 복습하기', objective:'기본적인 테스트 개념과 설계 관점을 되짚습니다.', resources:[{ id:'kstqb-qa-foundation', reason:'소프트웨어 테스팅의 기초 실러버스를 살펴볼 수 있습니다.' }] },
    { title:'AI 시스템의 특성 이해하기', objective:'AI의 기본 개념과 활용을 살펴봅니다.', resources:[{ id:'boost-ai-basics', reason:'AI 시스템의 배경을 이해하기 위한 기초 강의입니다.' }] },
    { title:'AI 테스트 관점 살펴보기', objective:'AI 시스템 테스트의 특성과 기법을 살펴봅니다.', resources:[{ id:'kstqb-ai-testing', reason:'AI 기반 시스템 테스트에 관한 공식 시험 범위와 학습 자료를 안내합니다.' }], activity:'AI의 출력이 달라질 수 있는 상황과 확인할 조건을 적어보세요.' },
  ] },
  { id:'ai-first', topic:'ai', title:'AI 개념부터 알아보기', description:'인공지능의 기본 개념과 쓰임을 차근차근 살펴봅니다.', startingPoint:'처음부터', outcome:'AI가 할 수 있는 일과 한계 설명하기', purposes:['career','create','apply','explore'], careerId:'ai-engineer', certQuery:'AI', qualificationIds:['aice-associate'], steps:[
    { title:'AI가 쓰이는 곳 찾기', objective:'생활과 업무에서 만나는 AI의 사례를 살펴봅니다.', resources:[], activity:'자주 사용하는 서비스에서 AI가 도움을 주는 부분을 찾아보세요.' },
    { title:'AI 기초 배우기', objective:'인공지능의 개념과 활용을 이해합니다.', resources:[{ id:'boost-ai-basics', reason:'인공지능 개념을 살펴보는 기초 강의입니다.' }] },
    { title:'활용과 한계 생각하기', objective:'AI의 답을 검토하고 적절한 활용 방식을 생각합니다.', resources:[{ id:'openai-academy', reason:'AI 활용을 소개하는 공식 학습 공간에서 관련 자료를 더 살펴볼 수 있습니다.' }], activity:'AI가 제안한 내용과 확인이 필요한 내용을 구분해 보세요.' },
  ] },
  { id:'ai-workflow', topic:'ai', title:'생성형 AI를 일에 활용하기', description:'요청을 구체화하고 결과를 검토하는 연습을 합니다.', startingPoint:'AI를 처음 사용한다면', outcome:'검토 가능한 작업 요청과 결과 정리', purposes:['apply','create','explore'], certQuery:'AI', qualificationIds:[], steps:[
    { title:'도움받을 작업 고르기', objective:'AI가 도울 수 있는 작업과 사람이 확인할 부분을 구분합니다.', resources:[{ id:'openai-academy', reason:'업무에서 AI를 활용하는 학습 자료를 찾아볼 수 있습니다.' }] },
    { title:'요청을 구체화하기', objective:'목적과 맥락, 원하는 결과를 분명하게 전달합니다.', resources:[{ id:'dlai-prompting', reason:'AI에 요청하는 방법을 배우는 강의입니다. 언어와 이용 조건을 확인하세요.' }] },
    { title:'결과 검토하기', objective:'출처와 정확성을 확인하고 결과를 수정합니다.', resources:[], activity:'민감한 정보 대신 공개 예시를 사용해 요청을 작성하고 결과를 직접 검토해 보세요.' },
  ] },
  { id:'python-first', topic:'coding', title:'파이썬으로 코딩 시작하기', description:'코드의 기본을 익히고 작은 문제를 풀어봅니다.', startingPoint:'처음부터', outcome:'간단한 파이썬 코드 읽고 바꾸기', purposes:['career','create','apply','explore'], careerId:'ai-engineer', qualificationIds:[], steps:[
    { title:'프로그래밍 살펴보기', objective:'문제를 순서대로 나누어 표현하는 방법을 생각합니다.', resources:[], activity:'반복하는 작업 하나를 골라 필요한 순서를 적어보세요.' },
    { title:'파이썬 기초 배우기', objective:'파이썬의 기본 개념을 차근차근 학습합니다.', resources:[{ id:'boost-python-everybody', reason:'프로그래밍과 파이썬의 기초를 다루는 과정입니다.' }] },
    { title:'작게 응용하기', objective:'배운 문법을 이용해 짧은 코드를 만들어 봅니다.', resources:[], activity:'간단한 입력을 받아 결과를 출력하는 프로그램을 작성해 보세요.' },
  ] },
  { id:'ml-first', topic:'ai', title:'머신러닝 기초 실습', description:'데이터를 활용하는 머신러닝의 기본을 살펴봅니다.', startingPoint:'파이썬과 데이터 기초가 있다면', outcome:'실습에서 입력과 결과 비교하기', purposes:['career','create'], careerId:'ai-engineer', qualificationIds:['aice-associate'], steps:[
    { title:'데이터와 파이썬 복습', objective:'머신러닝을 위한 파이썬 기초를 살펴봅니다.', resources:[{ id:'boost-ml-python', reason:'머신러닝 학습에 필요한 파이썬을 보완할 수 있습니다.' }] },
    { title:'머신러닝 실습', objective:'머신러닝의 주요 개념을 예제와 실습으로 살펴봅니다.', resources:[{ id:'google-ml-practice', reason:'머신러닝 개념과 연습 문제를 제공하는 공식 자료입니다.' }] },
    { title:'결과 비교하기', objective:'입력과 조건이 바뀔 때 결과가 어떻게 달라지는지 살펴봅니다.', resources:[], activity:'실습에서 사용한 조건과 결과를 적고 차이를 설명해 보세요.' },
  ] },
  { id:'llm-first', topic:'ai', title:'언어 모델의 원리 살펴보기', description:'자연어 처리와 언어 모델의 기본 개념을 배웁니다.', startingPoint:'파이썬과 딥러닝 기초가 있다면', outcome:'언어 모델의 역할과 한계 정리', purposes:['career','create'], careerId:'ai-engineer', qualificationIds:[], steps:[
    { title:'기초 복습하기', objective:'머신러닝 학습에 필요한 파이썬 기초를 점검합니다.', resources:[{ id:'boost-ml-python', reason:'머신러닝을 위한 파이썬을 복습할 수 있습니다.' }] },
    { title:'언어 모델 배우기', objective:'자연어 처리와 언어 모델의 개념 및 사용 방법을 살펴봅니다.', resources:[{ id:'hf-llm-course', reason:'언어 모델과 자연어 처리를 소개하는 공식 학습 과정입니다.' }] },
    { title:'배운 내용 정리하기', objective:'언어 모델의 기능과 한계를 자신의 말로 설명합니다.', resources:[], activity:'학습 자료를 참고해 언어 모델이 할 수 있는 일과 검토가 필요한 한계를 정리해 보세요.' },
  ] },
  { id:'agents-first', topic:'ai', title:'AI 에이전트 살펴보기', description:'AI 에이전트의 구성과 실습 과정을 살펴봅니다.', startingPoint:'파이썬과 언어 모델 기초가 있다면', outcome:'에이전트의 목표·도구·검토 과정 정리', purposes:['career','create'], careerId:'ai-engineer', certQuery:'Agents', qualificationIds:[], steps:[
    { title:'언어 모델 복습하기', objective:'에이전트 학습에 필요한 언어 모델 기초를 살펴봅니다.', resources:[{ id:'hf-llm-course', reason:'언어 모델의 개념을 복습할 수 있는 공식 과정입니다.' }] },
    { title:'에이전트 개념 배우기', objective:'에이전트와 도구 사용을 다루는 강의와 실습을 살펴봅니다.', resources:[{ id:'hf-agents', reason:'에이전트의 개념·실습·과제를 안내하는 공식 과정입니다. 계정과 실행 조건을 확인하세요.' }] },
    { title:'작은 작업 설계하기', objective:'에이전트가 수행할 작업과 사람이 확인할 부분을 구분합니다.', resources:[], activity:'가상의 작업 하나에 필요한 입력·도구·검토 단계를 적어보세요.' },
  ] },
  { id:'security-first', topic:'security', title:'정보보안의 기초', description:'계정과 데이터를 지키는 기본 원리를 살펴봅니다.', startingPoint:'처음부터', outcome:'계정 보안 점검 항목 만들기', purposes:['career','apply','explore'], careerId:'security', qualificationIds:['isc2-cc','sc-900'], steps:[
    { title:'보호할 것 생각하기', objective:'계정과 데이터에 생길 수 있는 위험을 생각합니다.', resources:[], activity:'사용 중인 서비스의 다중 인증과 계정 복구 방법을 점검해 보세요.' },
    { title:'보안 원리 살펴보기', objective:'보안과 접근 권한의 기초 학습 자료를 찾아봅니다.', resources:[{ id:'ms-cybersecurity', reason:'보안·규정 준수·ID를 다루는 공식 학습 자료 모음입니다.' }] },
    { title:'안전한 습관 정리하기', objective:'일상에서 적용할 수 있는 점검 항목을 정리합니다.', resources:[], activity:'비밀번호 관리와 계정 복구를 포함한 점검 목록을 작성해 보세요.' },
  ] },
  { id:'ai-security', topic:'security', title:'AI 시스템의 보안 이해하기', description:'AI 시스템의 위협과 보안 제어를 살펴봅니다.', startingPoint:'AI와 보안 기초가 있다면', outcome:'AI 시스템의 보안 고려 사항 정리', purposes:['career','create','apply'], careerId:'security', qualificationIds:['isc2-cc','sc-900'], steps:[
    { title:'AI 기초 복습하기', objective:'AI의 개념과 기본적인 활용을 살펴봅니다.', resources:[{ id:'boost-ai-basics', reason:'AI 기본 개념을 복습하는 기초 강의입니다.' }] },
    { title:'AI 보안 살펴보기', objective:'AI 시스템의 위협과 보안 제어·테스트를 이해합니다.', resources:[{ id:'ms-ai-security', reason:'AI와 보안 기초를 전제로 AI 시스템의 보안 제어와 테스트를 다룹니다.' }] },
    { title:'안전하게 적용하기', objective:'AI 사용 시 보호할 정보와 확인할 위험을 정리합니다.', resources:[], activity:'가상의 AI 기능을 정하고 입력 데이터와 접근 권한에서 확인할 점을 정리해 보세요.' },
  ] },
];
