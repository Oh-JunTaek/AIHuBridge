# 인증기관 교육·탐색 접근성 개선 결과

> 이 문서는 과거 기록이며 현재 지시가 아니다. 현행 기준은 [AGENTS](../../AGENTS.md)·[PLAN](../../PLAN.md)·[문서 우선순위](../standards/DOCUMENTATION.md)를 따른다. 완료·미완료·수치·Git 상태는 작성 당시 기준이다.

기준: 2026-10-26. 작업 이력 문서다. 현재 지시는 AGENTS.md → PLAN.md → AUTOMATION.md를 따른다.

## 구현 범위

- 개인화 없이 예정 항목인 교육 비용 모델·근거 재검토·언어/비용/검색 탐색과 모바일 메뉴·키보드 접근성을 개선했다.
- 사용자 요청에 따라 주요 메뉴의 개발자 탭과 뉴스의 진단 링크를 제거했다. /dev 직접 주소는 운영 진단용으로 유지하며 메뉴에서는 노출하지 않는다. 터미널 selfcheck와 Actions 수집 상태 검사는 계속 유지한다.
- 기존 16개 자료를 전수 재검토했다. 공식 근거를 확인하지 못한 NVIDIA AI Healthcare 무료 학생 시험 항목은 제외해 15개를 제공한다. 학습 경로 3단계·11개 참조는 유지했다.
- 사용자 확인에 따라 운영 주체 표기는 eunmastudio로 남겼다. **공개 문의 주소는 추후 작성해야 한다.** 임의 이메일·문의 폼은 만들지 않았다.

## 비용 모델과 화면

기존 costUSD·freePrep 대신 learningFee(학습·준비), credentialFee(응시·수료증·평가)를 구분한다. 각 비용은 free / paid / conditional / unknown과 설명을 갖는다. 금액을 확인한 경우에만 통화·금액을 제공한다. 미확인을 0원으로 대체하지 않으며 고정 환율 환산을 제거했다.

필수 참여 조건, 공식 근거 URL, 검토일을 카드에서 볼 수 있다. verifiedAt은 자료를 재검토한 날짜이며 모든 비용을 확정했다는 뜻이 아니다. 미확인 필드와 조건부 혜택은 그대로 표시한다. 무료 청강과 무료 수료증 필터는 별개이며 선호·체크·기록은 저장하지 않는다.

| 대상 | 변경 및 공식 근거 |
|---|---|
| AWS AI Business Strategist | [공식 안내](https://aws.amazon.com/certification/certified-ai-business-strategist/): 베타 $50, 정식 예정 $100을 구분. 기존 $150 제거. |
| AWS ML Engineer Associate | [공식 안내](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/): 잘못된 과정명·주소 교정. 기존 버전 $150과 차기 베타 $75, 언어별 제공·종료 조건을 설명. 유효기간 3년. |
| Google Generative AI Leader | [공식 안내](https://cloud.google.com/learn/certification/generative-ai-leader): $99 및 세금, 유효기간 3년. |
| Google ML Engineer | [공식 안내](https://cloud.google.com/learn/certification/machine-learning-engineer): $200 및 세금·권장 실무 요건. 확인하지 못한 유효기간 단정 제거. |
| Microsoft AI Fundamentals | [AI-900 종료 안내](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-900/)와 [AI-901](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/): AI-901로 안내 교체. 응시료는 지역별로 달라 고정 $99 제거. 내부 ID msft-ai-900은 학습 참조 호환용. |
| DeepLearning.AI 세 과정 | [Pro 범위 안내](https://info.deeplearning.ai/knowledge-base/what-do-i-get-with-the-deeplearning.ai-pro-membership-that-i-dont-get-for-free): 동영상 무료, 평가·실습·수료증 Pro 필요. 과정 페이지의 직접 요청은 일부 403으로 공식 검색 색인과 지원 문서로 교차 확인했다. |
| Hugging Face LLM | [소개](https://huggingface.co/learn/llm-course/en/chapter1/1): 무료 학습 확인. 전체 수료증 비용·조건은 미확인으로 표시. |
| Hugging Face Agents | [소개·수료 조건](https://huggingface.co/learn/agents-course/en/unit0/introduction): 학습·인증 무료, 과제·Python·LLM·외부 계정 요건 안내. |
| Elements of AI | [공식 FAQ](https://community.elementsofai.com/c/elements-faq/i-have-passed-an-elements-of-ai-course-where-is-my-certificate): Introduction 무료 수료증과 별도 Building AI 유료 수료증을 구분. |
| Google AI Essentials | [한국 소개](https://grow.google/intl/ko_kr/ai-essentials/), [비용 안내](https://grow.google/ai-essentials/): 유료 등록, 한국 가격은 등록 화면 확인. 미국 가격을 한국 가격으로 표시하지 않음. |
| Coursera AI For Everyone | [과정 FAQ](https://www.coursera.org/learn/ai-for-everyone): 수료증 경로 구매, 계정별 체험·청강·재정지원 조건 안내. 30일 무료 단정 제거. |
| Google 학습 배지 | [공식 개발자 센터](https://cloud.google.com/developers): GEAR 월 35 크레딧은 조건부 혜택이며 전체 실습 무제한 무료가 아님. |
| Microsoft Applied Skills | [준비 안내](https://learn.microsoft.com/en-us/credentials/support/prepare-assessment-lab): 무료 자기주도 학습. 단일 시험이 아닌 카탈로그이므로 개별 평가 비용·언어는 미확인으로 표시. |
| NVIDIA 이전 항목 | 기존 연결 주소가 404이고 [공식 자격 카탈로그](https://www.nvidia.com/en-us/learn/credentials/)에서 해당 명칭·무료 학생 시험 근거를 찾지 못해 제외. 다른 자격으로 임의 교체하지 않음. |

## 반응형·접근성

- 좁은 화면에서 메뉴가 여러 줄로 배치돼 모든 항목을 볼 수 있게 했다. 1024px 이상에서 가로 헤더를 사용한다.
- 본문 건너뛰기와 main 포커스, 현재 필터·테마의 aria-pressed, 아이콘 링크별 접근 가능한 이름, 전역 키보드 포커스 윤곽을 추가했다.
- 학습 분야 필터 줄바꿈, 카드 세로 배치·링크 터치 영역, 다크모드 제목·비용·입력 컨트롤, 명시적 color-scheme을 정리했다.
- 움직임 줄이기 설정에서 전환·애니메이션과 부드러운 스크롤을 줄인다.
- 브라우저에서 320px 주요 페이지와 390/768/1024px의 홈·뉴스·학습·교육·캘린더·설정 총 18개 조합을 확인했다. 가로 넘침·헤더 밖 메뉴 배치 없음.
- 무료 수료증 필터 2개 → 없는 검색 0개 → 초기화 8개를 확인했다. 본문 건너뛰기 Enter로 main-content에 실제 포커스 이동. 브라우저 오류 로그 없음.
- 실기기·스크린리더 전수 시험 및 WCAG 적합성 인증을 수행했다는 뜻은 아니다.

## 남은 작업

- 국내 공식 모집 출처 확대는 계속 검토 대상이다. NAVER D2 공식 Atom(https://d2.naver.com/d2.atom)은 20개 항목을 읽었으나 접근 정책 확인이 완료되지 않았다(robots.txt 요청 406). 정책을 확인하기 전 자동 수집에 넣지 않았다. 기존 K-Startup·기업마당 제외 조건도 유지한다.
- 문의 주소는 사용자 결정에 따라 추후 작성. eunmastudio 표기만 유지한다.
- 원문 정책·가격·시험 종료/대체 일정은 변경될 수 있으므로 정적 교육 자료를 주기적으로 재검토한다.

## 검사

npm test 54건, npm run lint, npm run selfcheck, npm run build 통과. npm run dev 및 실제 브라우저 확인. 기존 Tailwind sourcemap 경고만 남는다. 검사 스크립트는 TypeScript 정적 자료를 실제로 불러와 비용 스키마·근거·참조를 검사한다. 자동 수집 워크플로의 예약·권한·연결은 변경하지 않았다.

시각 증거: artifacts/education-cost-preview.png, artifacts/education-mobile-preview.png.
