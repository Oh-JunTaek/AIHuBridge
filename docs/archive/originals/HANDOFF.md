# HANDOFF.md — AI HuBridge 인수인계 문서

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | AI HuBridge (AI 허브릿지) |
| **저장소 경로** | `C:\Users\wns53\Documents\GitHub\AIHuBridge` |
| **원격 저장소** | `https://github.com/Oh-JunTaek/AIHuBridge.git` |
| **브랜치** | `master` |
| **배포 URL** | `https://oh-juntaek.github.io/AIHuBridge/` |
| **기술 스택** | React 19, TypeScript, Vite, Tailwind CSS, React Router DOM, Zustand |
| **개발 서버** | `npm run dev` → `http://localhost:5173` |
| **빌드** | `npm run build` (tsc + vite build) → `./dist` |
| **배포** | GitHub Actions `deploy.yml` (push to master 시 자동 실행) |

---

## 2. 현재 구현 상태

### 메뉴 구성 (src/routes/Root.tsx)
| 메뉴 | 경로 | 아이콘 |
|------|------|--------|
| 홈 | `/updates` | LogoIcon |
| AI 소식 | `/updates` | (동일) |
| 학습 경로 | `/path` | LogoIcon |
| 교육·인증 | `/certs` | BadgeIcon |
| AI 캘린더 | `/calendar` | CalendarIcon |
| 설정 | `/settings` | SettingsIcon |

**삭제됨:** OpenRouter Skills (`/openrouter-skills`) 메뉴, 라우트, 페이지, 유틸리티, i18n 키 모두 제거 완료.

### 페이지 목록 (src/pages/)
| 파일 | 경로 | 본문 너비 클래스 |
|------|------|------------------|
| Home.tsx | `/updates` | `max-w-4xl` |
| Certs.tsx | `/certs` | `max-w-4xl` |
| Dev.tsx | `/dev` | `max-w-4xl` |
| Calendar.tsx | `/calendar` | `max-w-4xl` |
| Settings.tsx | `/settings` | `max-w-3xl` |
| Privacy.tsx | `/privacy` | `max-w-3xl` |
| Terms.tsx | `/terms` | `max-w-3xl` |

### 상단 헤더 (Root.tsx)
| 조건 | 너비 클래스 |
|------|-------------|
| `/calendar` 페이지 | `max-w-6xl` (문서화 필요) |
| 그 외 모든 페이지 | `max-w-4xl` |

---

## 3. 확정된 주요 설계 결정

1. **한국어 전용**: `src/lib/i18n.ts`에서 `Lang = 'ko'` 고정, 영어 지원 제거됨.
2. **개인화 없음**: 로그인/회원가입/개인 학습 기록 기능 없음. 테마만 localStorage에 저장.
3. **캘린더 기본 설정**: 국내·온라인 행사 기본 표시, 해외 오프라인·방식 미확인은 제외.
4. **뉴스 수집**: RSS만 사용, 외부 API 키 금지. `src/lib/news-sources.mjs`에서 출처 관리.
5. **헤더 로고**: `public/icon/hubridge-transparent.png` 사용 (투명 로고, 다크모드 반전 처리).
6. **커밋 메시지 convention**: `feat:`, `data:`, `fix:`, `docs:` (한국어 주 변경사항 기재).
7. **배포**: master 푸시 시 GitHub Actions로 자동 배포. workflow_run (News Refresh) → deploy 연결 유지.

---

## 4. 완료된 작업

| # | 작업 | 커밋 | 상태 |
|---|------|------|------|
| 1 | OpenRouter Skills 페이지 완전 제거 (메뉴, 라우트, 페이지, 유틸, i18n 키) | `f26f075` | ✅ 완료, 푸시됨 |
| 2 | AI 캘린더 페이지 본문 너비 조정 (`max-w-6xl` → `max-w-4xl`) | `1b6016e` | ✅ 완료, 푸시됨 |

Git 상태: **clean** (작업 트리 정리됨, 모든 커밋 원격 반영 완료)

---

## 5. 미완료 작업 (다음 에이전트가 처리해야 할 사항)

### 🔴 최우선: 상단 헤더 너비 불일치 수정

**문제**: `src/routes/Root.tsx` L19에서 캘린더 페이지 헤더가 여전히 `max-w-6xl`을 사용 중입니다. 하지만 캘린더 본문(`src/pages/Calendar.tsx` L52)은 `max-w-4xl`로 수정되어 **헤더가 본문보다 넓게 표시**됩니다.

**수정 위치**: `src/routes/Root.tsx` L19

```typescript
// 수정 전
const headerWidth = pathname.replace(/\/+$/, '') === '/calendar' ? 'max-w-6xl' : 'max-w-4xl';

// 수정 후 (권장)
const headerWidth = 'max-w-4xl';
```

또는 조건문을 제거하고 모든 페이지에 `max-w-4xl`을 통일하세요.

**관련 문서**: `AGENTS.md` L72에 "캘린더 헤더는 본문과 같은 max-w-6xl, 다른 페이지는 max-w-4xl을 사용한다"고 기록되어 있어, 이 규칙도 함께 업데이트해야 합니다.

---

## 6. 발견된 버그 및 해결되지 않은 문제

| # | 내용 | 심각도 | 비고 |
|---|------|--------|------|
| 1 | 캘린더 페이지 헤더 너비(`max-w-6xl`)가 본문 너비(`max-w-4xl`)와 다름 | 중 | Root.tsx L19 수정 필요 |
| 2 | AGENTS.md L72의 헤더 너비 규칙이 실제 코드와 불일치 | 낮 | 문서 동기화 필요 |
| 3 | Settings/Privacy/Terms 페이지가 `max-w-3xl`로 다른 페이지(`max-w-4xl`)보다 약간 좁음 | 낮 | 기존 설계로 보임, 의도적 차이인지 확인 필요 |

---

## 7. 주의해야 할 파일, 설정, 의존성

### 중요 파일
| 파일 | 역할 | 주의사항 |
|------|------|----------|
| `src/routes/Root.tsx` | 공통 레이아웃, 헤더, 메뉴 | 헤더 너비 조건문 L19, 메뉴 링크 목록 L7-13 |
| `src/pages/Calendar.tsx` | AI 캘린더 메인 페이지 | L52 너비 클래스, 캘린더 필터 로직 |
| `src/lib/i18n.ts` | 다국어 사전 (한국어 전용) | 키 추가 시 Dict 타입과 ko 객체 모두 수정 |
| `vite.config.ts` | Vite 설정 | `base: '/AIHuBridge/'` (GitHub Pages 경로) |
| `.github/workflows/deploy.yml` | 배포 파이프라인 | workflow_run (News Refresh) → deploy 연결 |
| `AGENTS.md` | 개발 가이드 | 코드 작업 후 문서 동기화 필수 |

### 의존성 및 버전
- Node.js: v22 (GitHub Actions)
- npm 스크립트: `dev`, `build`, `postbuild`, `lint`, `refresh`, `selfcheck`, `test`
- 주요 패키지: `tailwindcss ^4.3.3`, `react ^19.3.1`, `react-router-dom ^7.18.4`, `zustand ^4.5.7`

### AGENTS.md 핵심 규칙 (작업 시 준수)
1. `C:\Users\wns53\Documents\GitHub\AIHuBridge` 폴더 안에서만 작업
2. 배포/푸시는 사용자 요청 시에만 진행
3. 외부 서비스 계정·키 금지, 뉴스는 RSS만 사용
4. 코드 작업 후 문서 최신화 및 한국어 커밋 필수

---

## 8. 다음 에이전트가 우선 확인해야 할 사항

1. **즉시 확인**: `http://localhost:5173`에서 `npm run dev` 실행 후
   - 메뉴에서 "OpenRouter Skills" 항목이 사라진 것 확인
   - AI 캘린더 페이지(`/calendar`)에서 헤더와 본문 너비가 동일한지 확인 (현재 불일치)

2. **수정 작업**: `src/routes/Root.tsx` L19의 헤더 너비를 `max-w-4xl`로 통일하고 커밋

3. **문서 동기화**: `AGENTS.md` L72의 헤더 너비 규칙을 실제 코드에 맞게 업데이트

4. **배포 확인**: 커밋 푸시 후 GitHub Actions 배포 완료 여부 확인 (`https://oh-juntaek.github.io/AIHuBridge/`)

---

## 9. 최근 Git 커밋 이력

```
1b6016e (HEAD -> master, origin/master, origin/HEAD) docs: AI 캘린더 페이지 넓이 재조정 (max-w-4xl)
f26f075 OpenRouter Skills 페이지 및 다국어 키 제거
10af584 1
6ddf817 1
cfad7de OpenRouter 스킬 연결 병합
a9fc470 OpenRouter 스킬 연결: OpenRouter API 통합, 새 페이지 및 메뉴 추가
```

---

## 10. 연락처 및 운영 주체

- **운영 주체**: eunmastudio
- **공개 문의 주소**: 추후 추가 예정 (현재 미정)
- **이슈 보고**: GitHub Issues 또는 저장소 소유자에게 문의

---

> 이 문서는 인수인계를 위한 스냅샷입니다. 실제 코드 상태는 `git status`와 `git log`를 다시 확인하시기 바랍니다.

---

작성 완료되었습니다. 위 내용을 `HANDOFF.md`로 저장하신 후, 새 Cline 세션에서 `# 5. 미완료 작업`의 헤더 너비 수정부터 시작하시면 됩니다. 추가로 궁금한 점이 있으면 언제든 말씀해 주세요.