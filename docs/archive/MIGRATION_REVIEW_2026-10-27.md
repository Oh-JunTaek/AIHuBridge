# 문서 개편 검토 기록 — 2026-10-27

> 이 문서는 과거 기록이며 현재 지시가 아니다. 현행 기준은 [AGENTS](../../AGENTS.md)·[PLAN](../../PLAN.md)·[문서 우선순위](../standards/DOCUMENTATION.md)를 따른다. 완료·미완료·수치·Git 상태는 작성 당시 기준이다.

## 사용자 확정 정책

1. 수정 후 로컬 Git 커밋 자동; 원격 push·배포는 사용자 명시 승인 후만.
2. AI 캘린더 헤더와 본문 모두 `max-w-4xl`로 정렬.
3. 스킬, MCP, Cline 플러그인은 별도 체계로 관리하며 검증된 것만 활성화.
4. 날짜별 작업 보고서는 현행 기준에 필요한 내용을 정본에 반영한 뒤 archive에 원본 보존.

## 문서 변경

- `AGENTS(4).md` → `AGENTS.md`: 기능별 구현·소스·운영 수치 제거하고 영구 규칙·읽기 순서·로컬 커밋/원격 승인 정책만 작성.
- `PLAN.md` → `PLAN.md`: 기능 상태 단일화. 옛 CHECKLIST의 검수 체크를 우선순위/과거 검증으로 흡수. 2026-10-27 헤더 규칙의 **코드 미검증** 항목 추가.
- `README(4).md` → `README.md`: 방문자용 기능 소개 중심 재작성. 프로젝트 내부 상세 이력/시점별 수치를 제거.
- `AUTOMATION.md` → `docs/operations/AUTOMATION.md` (운영 계약 본문 유지).
- `SOURCE_REGISTRY.md` / `TERMINOLOGY.md` → `docs/standards/` (본문 유지).
- 새 `docs/operations/TOOLING.md`: 확장 도구 분리 및 로딩/편집기 오류 분리 진단.
- `HANDOFF.md`, `CHECKLIST(2).md`, 날짜별 9개 보고서 → `docs/archive/`. `originals/`에 원본 17개 별도 보존.

## 충돌 해결 기록

| 쟁점 | 현행 정본 | 처리 |
| --- | --- | --- |
| 커밋·배포 | `AGENTS.md` | 로컬 커밋 자동·push/deploy 승인 필요 |
| 캘린더 헤더 6xl vs 본문 4xl | `PLAN.md` | 둘 다 4xl 목표, 실제 소스 검증 전 미완료 체크 |
| 플러그인 = 스킬 규격/경로 혼동 | `AGENTS.md`, `TOOLING.md` | 유형별 구분·지원 규격 확인·검증된 것만 활성화 |
| 홈 `/` vs `/updates` | `TERMINOLOGY.md`, `PLAN.md` | 홈 `/`, AI 소식 `/updates` 정본; HANDOFF의 둘 다 `/updates`는 역사적 스냅샷이며 코드 미검증 |
| 오래된 기능(용어 사전·퀴즈·개인 진도) | `PLAN.md` | 현재 제외 유지. 과거 보고서로 재도입 금지 |
| 예전 검증 건수·데이터 개수 | `PLAN.md` 및 archive | 당시 결과로만 간주. 현행값은 재검증 필요 |

## 반드시 실제 저장소에서 확인할 사항

- [ ] `git status`, `git log`, `origin/master` 등 실제 현재 상태. 자동 봇 데이터 커밋이 있는지 확인.
- [ ] `src/routes/Root.tsx`와 `src/pages/Calendar.tsx`의 너비가 최종 `max-w-4xl`인지 확인 및 필요한 코드 수정.
- [ ] 홈 라우팅 `/`와 `/updates` 구현, `/research` 리디렉션과 메뉴 링크 확인.
- [ ] `package.json`의 스크립트·실제 라이선스 파일·Node 버전 확인.
- [ ] `aihubridge-tools` 플러그인 및 MCP 서버 구성, Cline SDK 호환성 확인.
- [ ] 문서 링크, `npm test`, `npm run lint`, `npm run selfcheck`, `npm run build`, 화면·실기기 확인.
- [ ] 원래 저장소에 이미 `docs/` 폴더나 동일 이름 파일이 있는지 확인하고 충돌 시 무작정 덮어쓰지 않기.

## 적용 범위와 한계

이번 결과는 **사용자가 첨부한 Markdown 파일을 기반으로 작성한 제안 파일 묶음**이다. 사용자 PC 저장소의 코드를 열거나 변경하지 않았다. Git 커밋/푸시/배포를 실행하지 않았다. 원본 내용을 원격 저장소와 대조하지 않았으며, 이 기록이 운영 현행성을 보증하지 않는다.
