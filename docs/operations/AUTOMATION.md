# AI 정보 자동 갱신 운영 기준

기준일: 2026-10-28. 이 문서는 현재 자동화의 기준이며 과거 분석·작업 보고서보다 우선한다.

## 주기와 대상

| 대상 | 갱신 방식 |
|---|---|
| AI 소식 | 매일 한국시간 07:00 예약, RSS 수집·논문 공식 Atom 보완 |
| AI 캘린더 | 같은 예약에서 카카오 RSS·Google 공개 커뮤니티 일정 수집 |
| 교육·인증·가격·수료 조건 | 정적 자료, 공식 출처를 별도로 재검증한 후 코드 변경 |
| 학습 경로 | 정적 안내, 공식 교육·인증 링크를 별도로 검토하여 변경 |
| 기업 SNS | 브라우저에서 Bluesky 공개 API 직접 조회. 서버 저장·예약 수집 대상 아님 |

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
- 일부 출처 실패 시에도 보관 기한 내 기존 자료를 보존한다. 소식은 원문 게시일 기준 일반 30일·모델 90일·논문 180일, 일정은 지난 행사·공고 30일이다. 정상 RSS에서 빠진 자료도 기한 안에서 누적 보관한다. 전체 실패는 파일을 교체하지 않는다. 자세한 경계·예외는 [자료 수명 기준](../standards/CONTENT_LIFECYCLE.md)을 따른다.
- arXiv 통합 RSS가 비거나 유효 날짜가 없거나 요청에 실패하면 3초 후 공식 Atom 최근 제출 40건을 보완 조회한다. 한 연결·3초 간격을 유지하고 원문 게시일 기준 180일 이내에서 원문 분야별 회당 최대 24건을 선택하고 이전 자료를 누적한다. RSS와 Atom 모두 실패하면 기존 출처별 실패 보존을 적용한다. 수집일을 발행일로 만들지 않는다.
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
- 루트 AGENTS·PLAN 다음 이 문서를 읽는다. 출처를 바꿀 때만 SOURCE_REGISTRY를 추가로 확인한다. 날짜가 붙은 보고서는 이력이다.
- 유지할 핵심 연결: `News Refresh` 이름, 한국시간 하루 1회 예약, 성공 조건, 같은 저장소/master 제한, 배포 체크아웃 `master`, JSON 4종, 검증 단계.
- 실행 검사: `npm test`, `npm run lint`, `npm run selfcheck`, `npm run build`, `npm run dev`.
- 워크플로 수정 시 YAML 문법과 예약→수집→봇 커밋→후속 배포→공개 메타 갱신까지 검사한다. 실행 ID·결과를 아래에 기록한다.
- 푸시·배포는 사용자의 기존 승인 범위를 확인한다. 일반적인 로컬 수정 요청만으로 원격 실행까지 승인된 것으로 보지 않는다.

## 최근 확인 근거 (2026-10-28)

- 미사용 아이콘 import로 배포·수집 검증이 중단되었고 복구 커밋 4cb6dc3으로 해결했다.
- 수집 40681005178 → 봇 커밋 051a70a → workflow_run 배포 40681085959가 성공했고 공개 JSON 수집 시각·건수·상태가 일치했다.
- 최종 결과 문서 커밋의 배포 40681291243도 성공했다. 상세는 [배포 복구 이력](../archive/DEPLOY_RECOVERY_2026-10-28.md)을 따른다.
- 검증 당시 소식 136건·일정 450건이며 고정 사양이 아니다. 다음 예약 시각의 실행을 기다린 검증과 수동으로 같은 작업을 실행한 검증을 구분한다.
- 2026-10-25 수동 종단간 검증과 당시 37건 검사는 [보존 원본](../archive/originals/AUTOMATION.md)의 과거 이력이다. 현재 검사 결과는 PLAN과 해당 작업 보고서에서 확인한다.

## 공식 동작 근거

- [GitHub 워크플로 트리거](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow): 봇 토큰 push의 후속 실행 제한.
- [GitHub 이벤트와 schedule/workflow_run](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows): 예약 지연 및 완료 이벤트에 따른 실행.

관련 기준: [AGENTS](../../AGENTS.md)·[PLAN](../../PLAN.md)·[문서 우선순위](../standards/DOCUMENTATION.md)·[용어](../standards/TERMINOLOGY.md). 원격 실행은 해당 작업의 사용자 승인 범위를 확인한다.

## 일일 갱신·누적 보관 운영 반영 (2026-10-28)

2026-10-28 사용자 결정: 매일 한국시간 오전 7시 1회(`0 22 * * *`), 최근 7일 기본 탐색, 소식 30·90·180일 및 지난 행사·공고 30일 누적 보관. [정본](../standards/CONTENT_LIFECYCLE.md)을 따른다. News Refresh 이름·권한·성공 조건·workflow_run·JSON 4종은 유지했다.

사용자 승인으로 구현 커밋 5f9ad18을 푸시했고 [일반 배포 40687753730](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40687753730)가 성공했다. 활성 원격 워크플로의 일일 cron과 이전 하루 2회 설정 제거를 확인했다. [수동 수집 40687763130](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40687763130) → 봇 커밋 98557bb → [workflow_run 배포 40687843707](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40687843707)가 모두 성공했다. 공개 JSON 4종이 봇 커밋과 일치했고 소식 128건·일정 511건, 두 메타 모두 success였다. 수집 시각은 각각 2026-10-28T12:26:15.184Z·12:26:26.170Z다.

이번 확인은 새 설정의 같은 수집 작업을 수동 실행한 종단간 검증이다. 다음 한국시간 오전 7시 예약 실행 자체를 관찰한 것은 아니다. 상세는 [작업 결과](../archive/CONTENT_LIFECYCLE_2026-10-28.md)를 따른다.
