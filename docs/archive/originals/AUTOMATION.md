# AI 정보 자동 갱신 운영 기준

기준일: 2026-10-26. 이 문서는 현재 자동화의 기준이며 과거 분석·작업 보고서보다 우선한다.

## 주기와 대상

| 대상 | 갱신 방식 |
|---|---|
| AI 소식 | 매일 한국시간 07:00 / 19:00 예약, RSS 수집·논문 공식 Atom 보완 |
| AI 캘린더 | 같은 예약에서 카카오 RSS·Google 공개 커뮤니티 일정 수집 |
| 교육·인증·가격·수료 조건 | 정적 자료, 공식 출처를 별도로 재검증한 후 코드 변경 |
| 학습 경로 | 정적 안내, 공식 교육·인증 링크를 별도로 검토하여 변경 |

GitHub Actions의 서버에서 실행하므로 개인 PC를 켜 둘 필요가 없다. 정확한 분 단위 실행 시각은 보장되지 않으며 GitHub 대기열 때문에 지연될 수 있다. 추가 외부 계정·키·로컬 모델·개인용 자동화는 사용하지 않는다.

## 수집부터 공개 반영까지

1. `.github/workflows/refresh.yml`의 `News Refresh`가 기본 브랜치 `master`에서 실행된다.
2. `npm ci` → `npm run refresh` → `npm test` → 타입·selfcheck·build 검증을 수행한다.
3. 검증된 뉴스·일정 JSON과 메타 4개만 기존 봇 권한으로 커밋·푸시한다.
4. 이 수집 실행이 **성공한 경우에만** `.github/workflows/deploy.yml`의 `workflow_run`이 후속 배포를 시작한다.
5. 배포는 최신 `master`를 다시 체크아웃하여 검증·빌드한 뒤 GitHub Pages에 게시한다.
6. 운영 JSON의 `fetchedAt`과 실제 화면의 마지막 수집 시각으로 공개 반영을 확인한다.

`GITHUB_TOKEN`으로 만든 데이터 커밋의 push는 별도 push 워크플로를 실행하지 않는다. 따라서 4번 연결이 필수다. 수집 워크플로 이름과 `deploy.yml`의 `workflow_run.workflows`를 한쪽만 변경하면 자동 반영이 끊긴다.

일반 코드·문서의 `master` push와 배포 수동 실행은 기존처럼 배포를 시작한다. 이 경로 자체는 RSS를 새로 수집하지 않으며 저장된 최신 JSON을 배포한다. 수집을 즉시 실행하려면 `News Refresh`의 수동 실행을 사용한다.

## 보안·실패·동시 실행 규칙

- 배포의 `contents` 권한은 기존 `read`를 유지한다. 데이터 저장은 기존 수집 작업의 `contents: write` 범위에서만 수행한다. 추가 PAT·앱 키를 만들지 않는다.
- 후속 배포는 성공한 같은 저장소의 `master` 수집 실행만 허용한다. 실패·취소·다른 브랜치 실행은 배포하지 않는다.
- 수집과 배포의 concurrency 그룹은 서로 다르며 각각 중복 실행을 직렬화한다. `cancel-in-progress: false`를 유지한다.
- 수집·빌드는 15분, Pages 배포는 10분 제한이다. 개별 자료 요청은 15초·4 MiB 제한이다.
- 전체 수집 실패·잘못된 데이터·테스트/빌드 실패 시 커밋과 후속 배포를 진행하지 않는다. 마지막 공개 정상 버전은 유지된다.
- 일부 출처 실패 시 일정은 해당 출처의 검증된 향후 일정만 보존한다. 뉴스는 해당 출처의 유효한 기존 기사 중 발행 후 7일 이내 자료만 출처별 한도까지 보존한다. 기본 8건, 모델·플랫폼 피드 16건, 신규 국내 12건, 논문 24건이며 news-sources.mjs가 기준이다. 전체 출처 실패 또는 뉴스 전체 0건은 파일 교체를 막는다. 뉴스 메타의 status·sourceResults·unavailableSources와 화면 경고로 부분 실패를 확인한다. fetchedAt은 전체 실행 시각이며 개별 출처의 마지막 성공을 뜻하지 않는다.
- arXiv 통합 RSS가 비거나 유효 날짜가 없거나 요청에 실패하면 3초 후 공식 Atom 최근 제출 40건을 보완 조회한다. 한 연결·3초 간격을 유지하고 발행 후 7일 이내에서 원문 분야별 최대 24건을 선택한다. RSS와 Atom 모두 실패하면 기존 출처별 실패 보존을 적용한다. 수집일을 발행일로 만들지 않는다.
- AI 일정 0건은 정상일 수 있다. 샘플을 넣지 않는다. 뉴스 전체 0건은 실패로 처리한다.
- 동시 변경으로 봇 push가 거절되면 실패로 종료한다. 강제 푸시하지 말고 최신 `master`에서 다시 수집한다.
- 일정 건수는 매번 달라질 수 있다. 과거 보고서의 405건을 상수나 최소 건수로 강제하지 않는다.

## 점검과 복구

1. [수집 실행 목록](https://github.com/Oh-JunTaek/AIHuBridge/actions/workflows/refresh.yml)의 최근 성공·실패·취소를 확인한다.
2. [배포 실행 목록](https://github.com/Oh-JunTaek/AIHuBridge/actions/workflows/deploy.yml)에서 성공한 수집 이후 `workflow_run` 실행이 이어졌는지 확인한다.
3. [뉴스 메타](https://oh-juntaek.github.io/AIHuBridge/data/meta.json)와 [일정 메타](https://oh-juntaek.github.io/AIHuBridge/data/calendar-meta.json)의 시각·건수·상태를 확인한다.
4. 실패한 출처의 주소·응답 형식·제공 조건을 점검한다. 미확인 필드를 추정값으로 바꾸거나 검증을 우회하지 않는다.
5. 수정 후 테스트하고 `News Refresh`를 수동 재실행한다. 수집 성공만으로 완료 처리하지 말고 후속 배포와 공개 JSON까지 확인한다.

GitHub 자체 장애, 저장소/Actions 비활성화, 정책·권한 변경, 출처 형식 변경은 운영 점검이 필요하다. ‘사람의 관리가 영구히 전혀 필요 없다’고 보장하지 않는다. 정상 운영 중에는 사람이 매번 수집·배포할 필요가 없다.

## 에이전트 변경 전후 확인

- 먼저 최신 `master`를 확인한다. 자동 데이터 커밋이 생길 수 있으므로 오래된 JSON을 덮어쓰거나 force push하지 않는다.
- `AGENTS.md` → `PLAN.md` → 이 문서 → `SOURCE_REGISTRY.md` 순으로 현재 범위를 확인한다. 날짜가 붙은 보고서는 이력이다.
- 유지할 핵심 연결: `News Refresh` 이름, 한국시간 하루 2회 예약, 성공 조건, 같은 저장소/master 제한, 배포 체크아웃 `master`, JSON 4종, 검증 단계.
- 실행 검사: `npm test`, `npm run lint`, `npm run selfcheck`, `npm run build`, `npm run dev`.
- 워크플로 수정 시 YAML 문법과 예약→수집→봇 커밋→후속 배포→공개 메타 갱신까지 검사한다. 실행 ID·결과를 아래에 기록한다.
- 푸시·배포는 사용자의 기존 승인 범위를 확인한다. 일반적인 로컬 수정 요청만으로 원격 실행까지 승인된 것으로 보지 않는다.

## 자동화 연결 검증 이력 (2026-10-25)

- 구성·로컬 검사: YAML 구문 및 연결 조건 확인, 회귀 검사 37건·타입·selfcheck·build 통과.
- 실운영 경로 확인: 2026-10-25 한국시간 21:22 수집 결과 공개 반영.
- [수집 실행 40192785022](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40192785022): workflow_dispatch로 예약과 동일한 News Refresh 작업을 실행, success 확인.
- 봇 데이터 커밋: f15785a (뉴스·일정 JSON/메타 4개 변경).
- [후속 배포 40192815854](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40192815854): event가 workflow_run이며 success 확인. 별도 수동 배포 요청 없이 자동 연결됨.
- 운영 뉴스 40건, AI 일정 405건. 뉴스 수집 2026-10-25T12:22:13.541Z / 일정 수집 2026-10-25T12:22:16.350Z. 운영 JSON 4종의 내용이 봇 커밋과 일치함을 확인.
- 예약 설정 활성과 실제 cron은 확인했다. 새 설정의 다음 시각 도달에 의한 schedule 실행 자체는 미래 이벤트이며, 이번 종단간 검증은 동일 작업의 수동 시작으로 수행했다.

## 공식 동작 근거

2026-10-26 탐색·출처 확대 검증은 [최신 결과](./DISCOVERY_FILTERS_2026-10-26.md)를 따른다. 예약·권한·워크플로 연결은 변경하지 않았다. 위 37건은 당시 검사 수이며 현재 회귀 검사는 73건이다.

- [GitHub 워크플로 트리거](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow): 봇 토큰 push의 후속 실행 제한.
- [GitHub 이벤트와 schedule/workflow_run](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows): 예약 지연 및 완료 이벤트에 따른 실행.

용어·표기 기준: [TERMINOLOGY.md](./TERMINOLOGY.md). 최신 정비 결과: [TERMINOLOGY_REVIEW_2026-10-26.md](./TERMINOLOGY_REVIEW_2026-10-26.md). 현재 메뉴는 AI 소식(`/updates`)·학습 경로·교육·인증·AI 캘린더·설정이며 이전 `/research`는 새 주소로 이동한다. 날짜가 붙은 기존 보고서와 운영 식별자는 당시 명칭을 보존한다.
