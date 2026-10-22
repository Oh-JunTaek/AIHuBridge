# AI Compass 🌍

> **AI 최신 소식 + 무료 학습 경로 + 인증 뱃지**를 한 군데에서.
> 비전공자도 따라올 수 있는, **완전 로컬 저장** 개인 학습판.

![home mockup](https://dummyimage.com/720x400/eee/888&text=AI+Compass+데모)

## 특징
- 📰 **AI 브리핑** — OpenAI / HuggingFace / GitHub / TechCrunch / Google AI /
  구글뉴스 한국어 RSS 실시간 수집
- 📚 **4단계 학습 로드맵** — `알기 → 해보기 → 통과하기 → 전문가 되기`
- 🎖️ **인증 뱃지** — AWS / Google / Microsoft / NVIDIA / DeepLearning.AI /
  Hugging Face / Elements of AI 등 **무료 학습 가능한 인증** 정리
- 🧩 **용어 사전** — LLM, RAG, Agent, Temperature… 비전공자 설명 30선
- ✍️ **퀴즈** — 매일 새 문제 (날짜 시드) + 연습 모드
- 🤖 **요약은 켜고 끄기** — 로컬 LLM(옵션) → 규칙 → excerpt 세 단계 자동 fallback
- 💾 **완전 로컬** — `localStorage` 전체 저장. 계정/Gmail/푸시 없음.

## 시작 (개발자 기준, 2분)
```bash
npm install
npm run refresh      # 뉴스 수집
npm run dev          # → http://localhost:5173
npm run selfcheck    # 자료 검증
```

## 로컬 LLM 요약 켜기 (선택)
```bash
# 터미널 1: Ollama + gemma3 4bit
ollama run gemma3:1b
# 터미널 2: 수집 시 LLM 요약 시도
AI_COMPASS_SUMMON=ollama npm run refresh
# 브라우저 DevTools > localStorage 에서
#   aiCompassSummon = "ollama"   (프론트 요약 on)
```
없어도 완벽하게 동작합니다 — 규칙 요약으로 대체됩니다.

## 배포
정적 호스팅(GitHub Pages 등)으로 `npm run build` 결과만 복사.
(현재는 로컬 개발 모드이므로 배포 단계는 미정)
