# GitHub Pages 배포 장애 진단·복구

검토일: 2026-10-28. 사용자가 현재 프로젝트 재파악과 배포 장애 해결을 요청한 작업이다.

## 현재 상태 재확인

- React·TypeScript·Vite 기반 GitHub Pages 정적 웹 서비스다. AI 소식(`/updates`, `/research` 이전 주소 호환), 학습 경로, 교육·인증, AI 캘린더, 화면 테마를 제공한다.
- OpenRouter 페이지·메뉴는 제거된 상태지만 `Root.tsx`의 사용하지 않는 아이콘 import와 package.json의 OpenAI 의존성 선언은 남아 있었다. 의존성 정리는 이번 장애 원인이 아니므로 변경하지 않았다. 새 계정·키·외부 의존성을 추가하지 않았다.
- 로컬에는 AGENTS·PLAN·README 개편 및 문서의 docs 이동이 미커밋 상태였다. 이 사용자 변경을 되돌리거나 복구 커밋에 포함하지 않는다. 이번 파일과 코드 수정만 별도로 커밋한다.
- 캘린더 본문은 max-w-4xl, 헤더는 max-w-6xl이다. PLAN의 정렬 미완료 항목은 여전히 유효하며 이번 배포 장애와 별개다.
- 로컬 저장 자료는 소식 136건·교육 24항목·학습 참조 16항목이며 수집 시각은 2026-10-25T23:57:24.748Z다. 현재 수치·최종 수집 성공과 과거 보고서의 완료 체크를 구분한다.

## 직접 원인과 영향

실패한 배포 [40495310774](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40495310774)의 Build 작업과 예약 수집 [40612619357](https://github.com/Oh-JunTaek/AIHuBridge/actions/runs/40612619357)의 검증 작업에서 같은 오류를 확인했다.

```text
src/routes/Root.tsx(2,49): error TS6133: 'CompassIcon' is declared but its value is never read.
```

OpenRouter 메뉴 제거 뒤 남은 import를 TypeScript의 noUnusedLocals가 거부했다. npm ci는 성공했으며 Pages 업로드·권한 단계 이전에 실패했다. 예약 수집도 RSS 수집과 회귀 검사 73건은 통과했지만 타입 검사에서 종료되어 봇 데이터 커밋을 만들지 못했다. 실패한 수집의 후속 배포가 skipped인 것은 정상 안전 동작이다.

## 수정과 로컬 검증

- `src/routes/Root.tsx`의 사용하지 않는 `CompassIcon` import만 제거했다.
- 타입 검사·빌드 규칙·배포 권한·스케줄·성공 조건·수집 목록은 바꾸지 않았다. 검증을 우회하지 않는다.
- 회귀 검사 73건, npm run lint, npm run selfcheck, npm run build 통과. 기존 Tailwind sourcemap 경고는 남지만 빌드는 성공했다.
- import 제거는 화면 동작을 바꾸지 않는 수정이며 별도 구현 복제 테스트는 추가하지 않았다.

## 운영 확인

복구 커밋 push 후 배포와 최신 master를 체크아웃하는 수집 작업을 확인한다. 실행 결과는 작업 최종 보고에서 실제 실행 ID와 함께 제공한다. 수집 후 공개 JSON의 fetchedAt과 봇 커밋 값을 대조해야 데이터 자동 갱신까지 복구된 것으로 판단할 수 있다.

## 재발 방지

메뉴·페이지·기능 제거 후에는 관련 import를 정리하고 push 전 npm run lint와 npm run build를 실행한다. 수집 성공만으로 자동 갱신 완료로 판단하지 말고 검증·봇 커밋·후속 배포·공개 메타까지 확인한다. TypeScript 오류는 컴파일 설정을 느슨하게 바꿔 숨기지 않는다.
