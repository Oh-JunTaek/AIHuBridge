# AI Compass — 완료 점검 체크리스트 (MVP 1.0)

## S0 스캐폴드
- [x] `git init`, README, AGENTS.md
- [x] Vite + React 19 + TS6 + Tailwind v4
- [x] 라우팅: 6페이지 + 404

## S1 코어
- [x] 타입 정의 (`src/types.ts`)
- [x] 설정/config (RSS 소스 6개 실측)
- [x] 사용자 상태 (localStorage)
- [x] 용어 사전 35개 (중복 없음)
- [x] 인증 DB 16곳 (검증일 2026-10-21)
- [x] 학습 경로 4단계 18항목

## S2 데이터 파이프라인
- [x] `npm run refresh` → `public/data/news.json` (6개 피드 실제 파싱, 40건)
- [x] `public/data/meta.json` 메타 기록 (fetchedAt/total/counts/summaryTiers)
- [x] `data/` 시드 JSON 없음 — `public/data` 실시간 수집으로 UI 동작 확인 (fallback summary 포함)

## S3 UI
- [ ] Home: 브리핑 + 오늘개념 + Pick4 + 뱃지
- [ ] Research: 카테고리 필터 + 무한 스크롤
- [ ] Path: 4단계 + 진도 바 + 체크
- [ ] Certs: 탭 전환 + 완료 체크
- [ ] Quiz: 오늘문제 + 연습 8문제
- [ ] Dev: 자기진단 메트릭

## S4 검증
- [x] `npm run dev` 정상 렌더 (Vite v8.3.5 ready, http://localhost:5173 200)
- [x] `npm run build` 정적 빌드 (tsc + vite, CSS 21.8KB / JS 354KB)
- [x] `npm run selfcheck` 통과 (news 40건·id 중복 0·cert 16·glossary 35·path OK, exit 0)

## S5 로컬 LLM (옵션)
- [x] Ollama 없으면 규칙 요약 (기본 동작) — summaryTiers.rule=40
- [x] `AI_COMPASS_SUMMON=ollama` 시 LLM 요약 시도 + fallback (summarizeSync tier 카운터 정상 동작)

## 완료 판정 (사용자 직접 체크)
- [ ] 첫 화면 브리핑 1분 내에 이해됨
- [ ] "무료 인증 3곳" 찾는 데 5초
- [ ] 퀴즘 1문제 풀고 뱃지 확인
- [ ] Dev 탭에서 "마지막 수집 시각" 보임
