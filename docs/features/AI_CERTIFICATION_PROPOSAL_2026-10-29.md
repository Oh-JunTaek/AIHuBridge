# AI 자격시험 탐색 — 조사 및 설계 제안

상태: **2026-10-30 사용자 진행 요청에 따라 로컬 구현.** 실제 구현·검증 범위는 [작업 결과](../archive/AI_QUALIFICATIONS_MOBILE_2026-10-30.md)를 따른다. 조사 기준일: 2026-10-29. 일정·가격·시험 언어·운영은 수시로 바뀔 수 있으므로 실제 등록 직전에 공식 근거를 다시 확인한다. 후보가 모두 등재된 것은 아니다.

## 목표와 명칭

학습관에서 한국 거주자가 국내 시험장 또는 국내에서 허용되는 온라인 감독 방식으로 도전할 수 있는 AI·관련 데이터 자격시험을 찾고 준비 자료와 공식 시험 일정 링크를 살필 수 있게 한다. 메뉴명은 **AI 자격증**을 제안한다. 실체는 시험 기반의 국가기술자격·국가공인 민간자격·등록민간자격·해외 기업 인증이며 성격을 명시한다. 한 자격 취득만으로 AI 전문가가 보장된다고 표현하지 않는다.

현재 `/certs`의 `course`·`exam`·`micro` 혼합 목록과 역할이 겹친다. 제안: `/certs`는 학습 과정과 별도 역량 배지를 유지하고, 시험 자격 정보의 기준 데이터는 새 자격 페이지 한 곳으로 모은다. 기존 시험 탭·커리큘럼의 시험 링크는 새 페이지로 연결하며 상세 링크 호환을 확인한다. 수료증·교육 이수만으로 발급되는 증명은 새 목록에 넣지 않는다. Microsoft Applied Skills 등 개별 실습 평가 배지는 독립 시험 자격과 섞지 않고 기존 교육·인증에서 별도 분류한다. 자격 취득을 필수로 요구하는 교육/회원 가입, 가격, 개인 정보는 자격 설명과 분리한다.

## 후보와 검증 단계

| 자격 후보 | 주관·분야 | 현재 근거와 한계 | 공식 근거 |
|---|---|---|---|
| AICE Associate | KT·한국경제신문 / Python 기반 데이터·AI | 국가공인 민간자격. 온라인·일부 오프라인 회차 근거 존재. 다른 등급의 공인 여부는 각각 별도 확인 | [운영 FAQ](https://aice.study/board/faq/list), [운영 공지](https://aice.study/board/notice/detail/14715), [KT 설명](https://www.youtube.com/watch?v=7zUXboiTFNY) |
| AICE Basic·Generative | KT·한국경제신문 / 기초·생성형 AI | 개별 시험임은 확인. 공인 종류·국내 응시 방식·개별 비용은 등재 전 재검증 | [공식 일정](https://aice.study/certi/examSchedule), [FAQ](https://aice.study/board/faq/list) |
| AI-POT 1·2급 | 한국생산성본부 / 프롬프트 | 등록민간자격, 국가공인 아님. 1급 실습 포함, 2급 객관식·단답형 | [공식 시험 안내](https://license.kpc.or.kr/nasec/qlfint/qlfint/selectAipot.do?pageKind=announcement) |
| AIBT 1·2급 | 한국생산성본부 / AI 비즈니스 | 등록민간자격, 국가공인 아님. 1급 실습 포함. 회차별 시험장 확인 | [공식 시험 안내](https://license.kpc.or.kr/nasec/qlfint/qlfint/selectAibt.do?pageKind=announcement) |
| GTQ-AI | 한국생산성본부 / 생성형 이미지·디자인 | 등록민간자격. AI 모델 개발 자격이 아니라 직무 활용 분야로 구분. 시험장·준비 환경 확인 | [공식 시험 안내](https://license.kpc.or.kr/nasec/qlfint/qlfint/selectGtqai.do) |
| AWS Certified AI Practitioner | AWS / AI 기초·AWS | 한국어 시험, 온라인 감독 또는 Pearson VUE 시험장. 한국에서 해당 예약 가능 여부는 예약 시 재확인 | [공식 인증·시험 준비](https://aws.amazon.com/ko/certification/certified-ai-practitioner/) |
| Microsoft Azure AI Fundamentals AI-901 | Microsoft / AI 기초·Azure | 공식 시험에 한국어 표기. Microsoft는 일반적으로 온라인 감독·지역 시험장을 제공하나 AI-901의 한국별 예약 가능 여부는 사전 확인 | [시험](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/), [예약 안내](https://learn.microsoft.com/ko-kr/credentials/certifications/register-schedule-exam) |
| Google Cloud Generative AI Leader | Google Cloud / 생성형 AI 비즈니스 | 영어·일본어 등, 한국어 미제공. 온라인 감독 가능이라고 안내하나 한국에서 개별 예약 가능 여부 재확인 | [공식 시험·준비](https://cloud.google.com/learn/certification/generative-ai-leader?hl=ko) |
| AWS ML Engineer Associate | AWS / ML 엔지니어링·운영 | 시험 버전 교체 및 언어별 일정이 달라 재확인 필수. 한국어 지원을 단정하지 않음 | [공식 안내](https://aws.amazon.com/ko/certification/certified-machine-learning-engineer-associate/) |
| Google Cloud Professional ML Engineer | Google Cloud / ML 엔지니어링 | 영어·일본어, 온라인 감독 안내. 업계 경력 권장은 필수 응시 자격과 분리 | [공식 시험·준비](https://cloud.google.com/learn/certification/machine-learning-engineer?hl=ko) |
| NVIDIA NCA Generative AI LLMs | NVIDIA / 생성형 AI·LLM | 사용자 선택 후보. 온라인 감독·영어·응시료 $125·유효기간 2년 후 재시험 안내. 한국에서 실제 예약 가능 여부는 확인 전 별도 표기 | [공식 안내](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) |
| 빅데이터분석기사·ADsP | 한국데이터산업진흥원 / 데이터 분석 | AI 직접 자격이 아닌 기반 역량. 별도 ‘AI 관련 데이터’ 범주로 제안. 빅데이터분석기사는 응시자격·서류 심사 확인 | [데이터 자격 소개](https://www.dataq.or.kr/www/dataq_brochure_2022.pdf), [응시자격 서류 안내](https://new.dataq.or.kr/www/pages/form/%5BK-DATA%5D%EB%B9%85%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B6%84%EC%84%9D%EA%B8%B0%EC%82%AC%20%EC%9D%91%EC%8B%9C%EC%9E%90%EA%B2%A9%20%EC%8B%AC%EC%82%AC%EB%A5%BC%20%EC%9C%84%ED%95%9C%20%EC%84%9C%EB%A5%98%EC%A0%9C%EC%B6%9C%20%EC%95%88%EB%82%B4%28%EC%83%81%EC%8B%9C%EA%B3%B5%EC%A7%80%29_v2.pdf) |

해외 오프라인만 가능한 자격과 한국 내 온라인 응시가 불가능한 자격은 제외한다. 사용자가 선택한 온라인 감독 시험은 후보에 포함하되 한국에서의 실제 예약 가능 여부가 확인되지 않았다면 확인된 사실처럼 표시하지 않고 공식 예약처에서 확인하도록 안내한다. 개인 대상 시험임이 불명확하면 검증 전 보류한다. 국내 CBT는 컴퓨터 시험이란 뜻이지 집에서 응시 가능하다는 뜻이 아니다. ‘온라인 접수’도 온라인 시험과 구분한다.

## 화면 구성

1. 기존 학습관 색상·배너를 유지한 상단: `AI 자격증` / `나에게 맞는 시험을 찾아 준비해 보세요`.
2. 목적별 빠른 탐색: AI 기초, AI 개발·ML, 생성형 AI 활용, AI 비즈니스, 관련 데이터. 난이도는 공식 등급이 아니라 서비스 분류라면 근거와 기준 표시.
3. 상단 검색·필터: 명칭·주관사 검색, 분야, 국가공인 여부 및 자격 종류, 시험 언어, 국내 시험장/온라인 감독, 기관. 모바일은 접을 수 있는 탐색 패널로 제공한다. 영어·한국어 외 공식 언어도 가능한 그대로 표시하고 한국어 미확인과 한국어 미제공을 구분한다.
4. 목록 카드: 큰 자격명 → 분야를 나타내는 색상 태그(예: `AI 기초`, `클라우드`, `데이터`) → 짧은 공식 소개 인용 → 주관사·자격 종류·시험 언어. 무료 시험임이 확인된 경우에만 `무료`를 추가하고, 유료 금액은 상세에 표시한다. 시험 비용 미확인을 무료로 표기하지 않는다. 등록민간자격과 국가공인 민간자격, 국가기술자격, 해외 기업 인증은 서로 구분하며 해외 자격을 일괄 ‘비공인’으로 단정하지 않는다. 색상뿐 아니라 글자로 의미를 표시한다.
5. 카드 선택 시 상세 팝업: 평가 역량·시험 언어 및 방식, 공식 필수 조건과 권장 경험, 유효기간과 갱신 방법, 시험 응시료와 통화·추가 비용 여부, 공식 출처와 최종 확인일. 시험 비용은 수강료·자격증 발급료와 혼합하지 않는다. 응시 장소와 시험 언어, 감독 지원 언어는 별도 필드다. 미확인 정보는 미확인으로 표시한다.
6. 상세 팝업 하단: 공식 시험 안내·공식 일정/예약·준비 학습·실습/모의시험 링크. 팝업은 닫기·Escape·초점 이동과 복귀를 지원하고 모바일 화면에서도 내용 전체를 스크롤할 수 있게 한다. 목록은 키보드 탐색을 지원한다.

### 카드와 팝업의 예시

- `NVIDIA-Certified Associate: Generative AI LLMs` — `생성형 AI` `LLM`
- 공식 안내의 짧은 소개를 출처와 함께 표시
- `NVIDIA · 해외 기업 인증 · 영어`

클릭하면 예시 상세: `온라인 감독` · `응시료 USD 125` · `유효기간 2년` · `갱신: 시험 재응시` · 공식 페이지와 시험 준비 자료. 해당 금액·언어·갱신 조건은 제공처 변경 시 함께 갱신한다. 한국에서 온라인 예약이 가능한지는 별도 확인한다.

소개문은 공식 문구를 짧게 인용할 수 있는 조건과 길이를 확인하고 출처를 연결한다. 조건이 불명확하거나 제공처가 재사용을 제한하면 문구를 복제하지 않고 최소한의 사실 설명과 공식 원문 링크를 사용한다. 번역이나 축약은 원문과 명확히 구분한다.

SQLD는 데이터 관련 후보이며 사용자 예시의 보수교육 후 영구 전환은 [K-DATA의 과거 안내](https://www.dataq.or.kr/www/guide_brochure_2020.pdf)에 존재한다. 교육을 언제 받아야 하는지와 현재 규정은 오래된 문서만으로 확정하지 않고 최신 공식 안내를 확인한 뒤 상세에 넣는다.

## 교육·실습 연결

공식 시험 가이드와 샘플 문제를 가장 먼저 제공한다. 공식 추천 교육은 ‘공식 시험 대비’, 범위가 일부 겹치는 기존 과정은 ‘기초 보완’이라고 구분하며 합격 보장이나 수강 필수로 표시하지 않는다. 예: AWS AI Practitioner의 [공식 시험 가이드·준비](https://aws.amazon.com/ko/certification/certified-ai-practitioner/), Google Generative AI Leader의 [공식 안내·샘플](https://cloud.google.com/learn/certification/generative-ai-leader?hl=ko), AI-POT·AIBT의 [KPC 공식 시험 환경 체험](https://license.kpc.or.kr/html/aiexam/). 기존 `boost-python-everybody`, `boost-data-science`, `boost-ml-python` 등은 관련 분야 보완 학습으로 검토한다. 모든 연결은 항목별 이유, 비용·계정 필요 여부·언어·마지막 확인일을 표시하고, 기업 전용 강의 등 개인이 들을 수 없는 자료는 구분한다.

## 시험 일정과 데이터

- 사용자의 변경 요청으로 AI 캘린더 연동과 시험 일정 수집·달력 표시를 제외한다. 자격별로 공식 일정·예약 링크를 제공해 주관처에서 최신 회차를 확인하게 한다. 정기 회차형과 개인 예약형은 설명으로 구분하며 접수 중 여부나 시험 날짜를 추정하지 않는다.
- 자격 정보와 준비 자료는 검증된 공식 링크 및 수동 확인한 구조화 데이터로 관리한다. 각 필드의 근거와 확인일을 기록하고 운영 중단·시험 버전·가격 등 변경 가능성이 높은 항목의 재검토 주기와 오래된 정보 안내를 정한다. 외부 계정·키·자동 수집을 추가하지 않는다.

## 구현 단계와 검증 (승인 후)

1. 범위·용어 확정, 자격/학습 자료 데이터 모델 및 원문 출처 등록. 자격별 한국 응시 가능성·국가공인 여부·언어·비용·상태를 검증하고 미확인은 보류.
2. 학습관 메뉴와 새 페이지, 목록·검색·상세·준비 자료 연결. 기존 교육·인증과 커리큘럼 링크, 중복 데이터 및 기존 주소 호환 처리.
3. 320px·데스크톱, 키보드, 필터·빈 결과·오래된 자료·외부 링크, 자료 중복, 비용과 출처 근거 검증. `npm test`, `npm run lint`, `npm run selfcheck`, `npm run build` 및 로컬 브라우저 검증. 실제 모바일·스크린리더·공식 예약 가능 여부는 별도 검증으로 표시.
4. PLAN과 관련 출처 기준 갱신, 로컬 커밋. 원격 배포는 별도 승인.

**확정된 구현:** 메뉴명 `AI 자격증`, AI 관련 데이터 자격 별도 분류, 등록민간자격 표시, 기존 자격시험 탭을 신규 페이지로 연결한다. 실제 적용 범위와 남은 검증은 작업 결과를 따른다.
