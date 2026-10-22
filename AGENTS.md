# AGENTS.md — AI Compass 개발 가이드

> **규칙 (절대 위반 금지)**
> 1. `c:\Users\wns53\Documents\GitHub\open` 폴더 **안에서만** 작업. 형제 저장소(EU/ondiai/Private) 절대 건드리지 말 것.
> 2. **배포/푸시 금지 단 사용자 요청이 있을 경우 진행.** `npm run dev` + `npm run selfcheck` 로 검증.
> 3. 외부 서비스 계정·키 금지. 뉴스 수집은 RSS, 요약은 로컬 LLM(opt-in) 또는 규칙 기반.
> 4. 한국어로 코딩: 파일명은 영어, **문자열·UI·주석은 한국어**.

## 시작하기
```bash
npm install
npm run dev          # http://localhost:5173
npm run refresh      # RSS → public/data/news.json
npm run selfcheck    # 데이터/링크 검증
```

## 구조
```
open/
├── public/data/{news.json, meta.json}   # 자동 생성 (수집 결과)
├── scripts/{fetch-news, selfcheck}.mjs  # 빌드/검증 스크립트
├── src/
│   ├── pages/        Home Research Path Certs Quiz Dev NotFound
│   ├── components/     재사용 UI
│   ├── lib/          config · news · summary · user · quiz · certs
│   └── data/         glossary.ts · certifications.ts · path.ts
├── AGENTS.md · README.md · CHECKLIST.md
```

## 커밋 메시지
- `feat:` 새 페이지/컴포넌트
- `data:` 인증/용어/뉴스 데이터 갱신
- `fix:` 버그
- `docs:` 문서
