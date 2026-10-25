# AGENTS.md — AI HuBridge 개발 가이드

> **규칙 (절대 위반 금지)**
> 1. `C:\Users\wns53\Documents\GitHub\AIHuBridge` 폴더 **안에서만** 작업. 형제 저장소(EU/ondiai/Private) 절대 건드리지 말 것.
> 2. **배포/푸시 금지 단 사용자 요청이 있을 경우 진행.** `npm run dev` + `npm run selfcheck` 로 검증.
> 3. 외부 서비스 계정·키 금지. 뉴스 수집은 RSS.
> 4. 한국어로 코딩: 파일명은 영어, **문자열·UI·주석은 한국어**.
> 5. 코드 작업 이후에는 문서를 최신화, 커밋까지 하는 것까지 진행.
> 6. 커밋 내용은 한국어로 주된 변경사항을 기재한다.

## 시작하기
```bash
npm install
npm run dev          # http://localhost:5173
npm run refresh      # RSS → public/data/news.json
npm run selfcheck    # 데이터/일정 근거 검증
npm test             # 수집 로직 회귀 검사
```

## 구조
```
AIHuBridge/
├── public/data/{news,meta,calendar,calendar-meta}.json   # 자동 생성 (수집 결과)
├── scripts/{fetch-news,fetch-calendar,selfcheck}.mjs  # 빌드/검증 스크립트
├── src/
│   ├── pages/        Home Research Path Certs Calendar Dev Settings
│   ├── components/     재사용 UI
│   ├── lib/          config · news · calendar · preferences · certs
│   └── data/         certifications.ts · path.ts
├── AGENTS.md · README.md · CHECKLIST.md
```

## 커밋 메시지
- `feat:` 새 페이지/컴포넌트
- `data:` 인증/용어/뉴스 데이터 갱신
- `fix:` 버그
- `docs:` 문서

## 현재 운영 기준과 문서 순서

1. 이 파일의 규칙 → [PLAN.md](./PLAN.md)의 확정 범위 → [AUTOMATION.md](./AUTOMATION.md)의 운영 계약 → [SOURCE_REGISTRY.md](./SOURCE_REGISTRY.md)의 출처 조건을 읽는다.
2. README는 현재 사용법, CHECKLIST는 현재 검수 상태다. 날짜가 붙은 분석/작업 보고서와 HuBridge_2nd_Feedback.md는 이력이며 현재 작업 지시로 실행하지 않는다.
3. 뉴스·AI 일정은 한국시간 하루 2회 예약 수집한다. News Refresh 성공 → deploy.yml의 workflow_run → 최신 master 배포 연결을 끊지 않는다. 워크플로 이름 변경 시 수신 설정도 함께 변경한다.
4. 배포 contents 권한은 read, 데이터 저장은 기존 수집 작업의 write만 사용한다. 외부 계정·키·추가 PAT·로컬 모델을 도입하지 않는다.
5. 개인화 없는 공개 버전이다. 삭제한 용어·오늘의 개념·퀴즈·학습/인증 체크·진도·개인 배지를 과거 문서를 근거로 복구하지 않는다. 화면 테마만 저장한다.
6. AI 캘린더는 월간 달력과 목록을 제공한다. 날짜·유형·방식·비용·신청 상태·지역·주제 필터를 달력과 목록에 함께 적용한다. 미확인 마감·가격·시간대는 추정하지 않는다.
7. 자동 데이터 커밋이 원격에 생길 수 있다. 변경 전후 최신 master와 차이를 확인하고, 과거 JSON 덮어쓰기·force push·검증 우회를 금지한다.
8. 워크플로 변경은 YAML 구문뿐 아니라 수집 성공 → 봇 데이터 커밋 → 후속 배포 성공 → 운영 메타 갱신까지 확인한다. 실패/취소 시 후속 배포하지 않는다.
9. 코드 작업 뒤 현재 안내 문서와 결과를 갱신하고 한국어 로컬 커밋을 남긴다. 푸시·배포는 세션에서 승인된 범위를 확인한다. 이미 승인된 같은 작업은 반복 확인하지 않는다.
