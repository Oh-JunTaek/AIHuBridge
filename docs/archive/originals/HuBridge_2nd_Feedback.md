# HuBridge 2차 피드백 및 긴급 복구 지침

> **이력 문서 · 현재 작업 지시가 아닙니다.** 당시 분석·검증 결과를 보존합니다. 현재 범위는 [AGENTS.md](./AGENTS.md)·[PLAN.md](./PLAN.md), 현재 자동화는 [AUTOMATION.md](./AUTOMATION.md)를 따릅니다. 과거 기능·데이터·배포 구성을 이 문서만 보고 복구하지 마세요.

- 작성 기준: 2026-10-25
- 대상 저장소: `Oh-JunTaek/AIHuBridge`
- 배포 URL: https://oh-juntaek.github.io/AIHuBridge/
- 작업 목표: 현재 배포의 뉴스 0건 문제 복구, UI 버전 불일치 원인 분석, 회귀 방지
- 상태: **문제 분석 및 수정 지시 문서**. 저장소 파일은 수정하거나 푸시하지 않았음.

## 1. 확인된 사실

| 항목 | 확인 내용 | 판정 |
|---|---|---|
| 배포 | `Deploy HuBridge to GitHub Pages` 워크플로의 빌드/배포가 성공함 | 배포 인프라 정상 |
| 최신 소스 | `master` 최신 확인 커밋 `060fdeb9` | 출발점 |
| 수집 데이터 | `public/data/news.json`에 실제 뉴스 항목이 존재하며 `meta.json`은 총 40건 기록 | 수집 데이터 부재가 아님 |
| 데이터 요청 | `src/lib/news.ts`에서 `fetch('/data/news.json?ts=...')` 사용 | **정적 배포 경로 오류 확인** |
| 프로젝트 URL | `https://oh-juntaek.github.io/AIHuBridge/` | base 경로 `/AIHuBridge/` 필요 |
| 빌드 설정 | `vite.config.ts`의 `base: '/AIHuBridge/'` 및 `src/main.tsx`의 `basename: import.meta.env.BASE_URL` 존재 | 해당 두 설정은 이미 정상 |
| 현재 UI 소스 | `src/routes/Root.tsx`의 가로 메뉴/CompassIcon/amber 선택색, `src/pages/Home.tsx`의 amber/stone 디자인 | **사용자가 전에 보여준 화면과 불일치 확인** |
| 실제 Pages JSON 응답 | 공개 URL을 외부 조회 도구에서 직접 가져오지 못함 | 브라우저 Network로 추가 확인 필요 |

## 2. P0 — 뉴스 0건 긴급 수정

### 직접 원인

현재 코드:

```ts
const res = await fetch(`/data/news.json?ts=${Date.now()}`);
```

브라우저는 이를 `https://oh-juntaek.github.io/data/news.json`으로 요청한다. 그러나 GitHub Pages 프로젝트 사이트는 `/AIHuBridge/` 하위 경로이므로 `/AIHuBridge/data/news.json`에 접근해야 한다. 요청 실패 시 `catch { return []; }`가 오류를 숨겨 0건으로 표시한다.

### 권장 수정

`src/lib/news.ts`의 `loadNews()`를 기존 타입을 보존하여 최소 수정:

```ts
export async function loadNews(): Promise<NewsItem[]> {
  const url = `${import.meta.env.BASE_URL}data/news.json`;
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`뉴스 데이터 로딩 실패: HTTP ${res.status} (${url})`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error('뉴스 데이터 형식 오류: 배열이 아님');
    return data as NewsItem[];
  } catch (error) {
    console.error('[HuBridge] 뉴스 데이터 로딩 실패', error);
    return [];
  }
}
```

**추가 권장:** 내부 UI에서는 `뉴스가 실제로 0건`인 경우와 `요청 실패`를 서로 다른 상태로 표시하도록 로딩 결과 타입을 개선한다. 위 코드는 장애 원인 노출을 위한 최소 패치이며 장기적으로 상세 오류 상태를 반환해야 한다.

### 필수 검증

- 브라우저에서 `https://oh-juntaek.github.io/AIHuBridge/data/news.json` 직접 열어 배열 응답 확인.
- F12 → Network → `news.json` 요청 URL이 `/AIHuBridge/data/news.json`으로 시작하고 HTTP 200인지 확인.
- 뉴스 목록/대시보드에 실제 항목 표시.
- 로컬 개발 서버(`/`)에서도 정상 표시.
- 데이터가 비어 있거나 깨진 경우 오류 화면과 마지막 갱신 시각 제공.
- 프로젝트 내 `fetch('/data/`, 절대 `/assets/`, `href='/` 등 다른 루트 경로도 전수 검색.

## 3. P0 — UI 버전 불일치 분석

스크린샷에 있던 좌측 사이드바, 대시보드 통계 카드, 분야별 커리큘럼, 인증기관 교육 UI와 현재 배포된 가로 탭 UI가 다르다.

현재 `master`의 `src/routes/Root.tsx`에 `CompassIcon`, `max-w-4xl`, 가로형 `nav`, `amber` 스타일이 들어 있고 `Home.tsx`도 예전 우드톤 UI를 사용한다. 따라서 현재 배포 엔진이 최신 화면을 누락시키는 것이 아니라 **현재 소스 자체가 사용자 기대 버전과 다르다**.

### 에이전트 수행 과제

1. `git status`, `git branch -avv`, `git log --oneline --all --decorate -30`, `git reflog`로 로컬 및 원격 버전 비교.
2. 최근 merge/푸시에서 `src/routes/Root.tsx`, `src/pages/Home.tsx`, `src/pages/Research.tsx`, `src/pages/Certs.tsx`, `src/pages/Path.tsx`, `src/lib/news.ts`, `src/index.css`, `src/components/`가 언제 바뀌었는지 `git log --follow -p -- <file>`로 확인.
3. 사용자가 제공한 이전 정상 스크린샷과 최근 디자인 변경 작업의 로컬 브랜치/커밋/미커밋 파일을 대조.
4. 복구 대상 커밋을 찾더라도 **전체 저장소를 과거 시점으로 강제 리셋하거나 force push하지 말 것.** 확인된 UI 파일만 선택적으로 복원하고 데이터/배포 워크플로는 유지.
5. 과거 화면의 소스가 저장소 어느 커밋에도 없다면 개발 환경 작업 폴더/로컬 브랜치에서 확인하고, 재현 불가 요소는 사용자에게 정확히 보고.

### 조사 우선 참조 커밋

- `060fdeb9` — 현재 배포 워크플로 추가
- `ed7a3b5e` — 직전 로컬 푸시
- `3366ab5e` — 배포 수정
- `638f0ad0` — 배포
- `7701e38d` — master 병합
- `9f23a646`, `c7421272` — 우드톤 디자인 변경

**주의:** 이 커밋 목록만으로 사용자에게 보였던 최신 대시보드가 어느 커밋에 있는지는 확정할 수 없다.

## 4. P1 — UI/브랜드 복구 및 개선

- 서비스 이름을 `AI 허브릿지` / `HuBridge`로 통일.
- 확정된 파랑·보라 브리지 로고 자산을 사용하고 임시 CompassIcon/잘못 줄바꿈된 브랜드 텍스트 제거.
- 기존 캡처의 사이드바/대시보드/인증기관 교육/분야별 커리큘럼 레이아웃을 복구 대상으로 검토.
- `amber`/`stone` 위주 디자인은 확정된 파랑·보라 브랜드 가이드로 교체하되 사용자의 기존 최신 UI를 먼저 확인하고 재디자인 범위 결정.
- 모바일 내비게이션과 데스크톱 화면을 함께 점검.
- 뉴스 데이터 오류 시 대시보드 전체를 비워 버리지 않도록 뉴스 영역만 오류/빈 상태로 처리.
- 인증기관 교육 카드의 공식 링크, 무료 수강과 인증서 발급 조건 분리.
- `자기진단`과 개발자 전용 링크의 공개 노출 정책 확인.

## 5. P1 — 재발 방지와 배포 운영

- GitHub Actions `npm ci` → `npm run lint` → `npm run selfcheck` → `npm run build` → `dist` 배포는 유지.
- `refresh.yml`의 뉴스 데이터 커밋이 `master`에 반영되더라도 페이지가 다시 배포되는지 실제 로그로 검증. 단, `GITHUB_TOKEN`으로 발생시킨 push는 다른 `push` 워크플로를 일반적으로 트리거하지 않을 수 있으므로 별도의 `workflow_run` 또는 재배포 방식 검토가 필요하다.
- `refresh.yml` 뉴스 0건 실패 시 이전 정상 JSON을 유지하고 경고를 남기는 정책.
- 배포 전 확인 항목: `dist/index.html`의 번들 경로, `dist/data/news.json` 존재, 데이터 항목 수, URL 200, 주요 페이지 스모크 테스트.
- 배포 후 확인 항목: 뉴스 1건 이상, HTML만 로드되지 않고 JS 마운트 성공, 직접 진입 및 새로고침 정상, 인증기관 교육/커리큘럼 정상.
- 수정 작업은 별도 브랜치 + PR 형태 권장. 기존 배포 URL에 즉시 반영하려면 검증된 변경만 `master`에 병합.

## 6. 에이전트 실행 순서

1. **조사:** 현재 코드를 정확하게 읽고 원인별로 증거 확보.
2. **긴급 복구:** `news.ts` 상대 base 경로 수정 및 로딩 오류 가시화.
3. **로컬 QA:** 빌드·selfcheck·프로덕션 프리뷰·JSON 요청 테스트.
4. **UI 버전 추적:** Git 이력과 로컬 미푸시 작업 확인; 정상 UI 복구 방안 보고.
5. **안전한 복원:** 사용자가 승인한 UI만 선택 복구; 새로운 디자인으로 무단 대체 금지.
6. **회귀 검증:** 모든 페이지·모바일·데이터 갱신 확인.
7. **결과 보고:** 원인, 수정 파일, 검사 결과, 남은 불확실성, 배포 상태 기록.

## 7. 에이전트 금지 사항

- 과거 커밋으로 저장소 전체 hard reset/force push 금지.
- 최신 UI 코드가 있는 위치를 확인하지 않고 임의 구현으로 덮어쓰기 금지.
- `public/data/news.json`이 있다는 이유만으로 브라우저에서 정상 로드된다고 가정 금지.
- `selfcheck` 통과만으로 운영 사이트 정상 판정 금지.
- `GITHUB_TOKEN` 커밋이 자동으로 재배포까지 트리거된다고 검증 없이 단언 금지.
- 사용자 승인 없이 원격 푸시/배포 실행 금지.

## 8. 최종 인수 기준

- [ ] 운영 사이트 뉴스 목록에 실제 기사 표시
- [ ] Network `news.json` 요청 200과 base 경로 일치
- [ ] 홈 화면에서 뉴스 실패 시 다른 영역 정상 렌더
- [ ] 수정 전후 UI 차이를 설명하고 요청한 디자인으로 복구
- [ ] 모바일/PC 주요 화면 회귀 테스트 완료
- [ ] 갱신→배포 자동 연결을 별도 검증
- [ ] 변경 사항과 테스트 증빙 문서화
