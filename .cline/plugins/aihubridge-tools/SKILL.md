---
name: AIHuBridge 개발 도구 모음
language: ko
description: AIHuBridge 프로젝트 개발을 위한 Cline SDK 플러그인으로, 뉴스 수집, 캘린더 이벤트 생성, 데이터 검증 기능을 제공합니다.
capability: tools
version: 1.0.0
---

# AIHuBridge 개발 도구 모음

## 개요

이 스킬은 Cline 내에서 AIHuBridge 프로젝트 개발을 가속화하는 세 가지 핵심 도구(뉴스 수집, 캘린더 이벤트 생성, 데이터 검증)를 제공합니다.

## 명령어

### `aihubridge:fetch-news`
**RSS 피드를 통해 최신 AI 뉴스 및 학습 자료를 수집합니다.**

```
사용법: aihubridge:fetch-news [옵션]

옵션:
  --force, -f   캐시 무시하고 강제로 수집
  --limit N     수집할 뉴스 항목 수 제한
```

### `aihubridge:generate-event`
**AI 뉴스를 바탕으로 무료 AI 학습 활동(CalendarEvent)을 생성합니다.**

```
사용법: aihubridge:generate-event <뉴스_제목> [옵션]

옵션:
  --use-openrouter     OpenRouter API를 통해 콘텐츠 생성 (기본값)
  --custom-type TYPE   사용자 정의 이벤트 유형 지정
  --no-openrouter      OpenRouter 사용하지 않고 간단한 이벤트 생성
```

### `aihubridge:validate-calendar`
**캘린더 데이터의 무결성과 품질을 검증합니다.**

```
사용법: aihubridge:validate-calendar [옵션]

옵션:
  --strict           필수 필드만 검사 (품질 검사 비활성화)
  --input FILE       검증할 캘린더 JSON 파일 지정
```

## 빠른 시작

### 1. 스킬 설치

`.cline/plugins/` 디렉토리에 `aihubridge-tools` 플러그인을 설치합니다:

```bash
cp -r /path/to/aihubridge-tools/.cline/plugins/aihubridge-tools
```

또는 Cline 내에서:

```
 Cline에서: /skill aihubridge-tools
```

### 2. 설정

`.env` 파일에 필요한 환경 변수를 설정합니다:

```env
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key
```

### 3. 사용

이제 Cline에서 다음 명령어를 사용할 수 있습니다:

```
최신 AI 뉴스를 가져와서 news.json을 업데이트해줘
```

또는 직접 명령어를 사용할 수 있습니다:

```
/aihubridge:fetch-news --force
```

## 상세 기능

### 뉴스 수집

`aihubridge:fetch-news` 명령어는 다음 작업을 수행합니다:

1. **RSS 수집기 실행**: `scripts/fetch-news.mjs` 실행
2. **데이터 처리**: 수집된 뉴스 파싱 및 검증
3. **업데이트**: `public/data/news.json`에 저장
4. **결과**: 구조화된 뉴스 결과와 함께 성공/실패 메시지 반환

**매개변수**:
- `--force` / `-f`: 캐시 무시하고 강제로 수집
- `--limit N`: 수집할 뉴스 항목 수 제한

**반환값**:
- 성공 시: 수집된 뉴스 항목 수와 타임스탬프
- 실패 시: 오류 메시지와 타임스탬프

### 캘린더 이벤트 생성

`aihubridge:generate-event` 명령어는 뉴스 기사를 바탕으로 무료 AI 학습 활동(CalendarEvent)을 생성합니다.

**방법**:
- **OpenRouter와 함께**: 최신 OpenRouter API를 통해 제목, 호스트, 유형, URL 등을 포함한 완전한 이벤트 생성
- **수동으로**: 뉴스 정보를 바탕으로 간단하고 빠른 이벤트 생성

**매개변수**:
- `--use-openrouter`: OpenRouter API를 통해 콘텐츠 생성 (기본값)
- `--custom-type TYPE`: 사용자 정의 이벤트 유형 지정
- `--no-openrouter`: OpenRouter 사용하지 않고 간단한 이벤트 생성

**반환값**:
- 성공 시: 생성된 캘린더 이벤트와 타임스탬프
- 실패 시: 오류 메시지와 타임스탬프

### 캘린더 데이터 검증

`aihubridge:validate-calendar` 명령어는 캘린더 데이터의 품질을 검증합니다.

**검사 항목**:
- **필수 필드**: title, host, type, url, status, isOnline, feeType
- **날짜 타당성**: 신청 시작일/마감일이 과거가 아닌지 확인
- **형식 유효성**: 날짜 형식, boolean 값, enum 값

**매개변수**:
- `--strict`: 필수 필드만 검사 (품질 검사 비활성화)
- `--input FILE`: 검증할 캘린더 JSON 파일 지정

**반환값**:
- 성공 시: 검증 통계(유효, 무효, 문제점 목록)
- 실패 시: 오류 메시지와 타임스탬프

## 예시 시나리오

### 시나리오 1: 일일 뉴스 수집

```
사용자: "오늘의 최신 AI 뉴스를 가져와서 업데이트해줘"

실행:
  /aihubridge:fetch-news

예상 출력:
  ✅ 최신 AI 뉴스를 성공적으로 수집했습니다 (47개 항목)
  📁 public/data/news.json에 저장됨
```

### 시나리오 2: 뉴스로부터 학습 활동 생성

```
사용자: "OpenAI의 새로운 GPT-4 모델 발표에 대한 무료 워크숍 생성해줘"

실행:
  /aihubridge:generate-event "OpenAI의 새로운 GPT-4 모델 발표" --use-openrouter

예상 출력:
  ✅ 뉴스 "OpenAI의 새로운 GPT-4 모델 발표"로부터 "GPT-4 무료 워크숍" 캘린더 이벤트 생성 완료
  📅 2026-10-26T14:00:00Z에 예정
```

### 시나리오 3: 캘린더 데이터 검증

```
사용자: "현재 calendar.json 파일의 품질을 검사해줘"

실행:
  /aihubridge:validate-calendar

예상 출력:
  ✅ 품질 검증 완료: 28개 통과, 3개 문제 있음

  문제점:
    • "AI 모델링 기초"의 필수 필드 누락: title
    • "머신러닝 워크숍"의 신청 마감일이 과거임
    • "딥러닝 세미나"의 호스트 필드가 비어 있음
```

## 개발자 가이드

### 플러그인 구조

```
.aihubridge-tools/
├── index.ts           # Cline SDK 플러그인 메인 파일
├── package.json       # NPM 패키지 메타데이터
├── README.md          # 상세 문서
├── SKILL.md           # 이 파일
└── types/            # 타입 정의 (미래에 추가 가능)
```

### 플러그인 등록

플러그인은 Cline이 다음 위치에서 발견할 수 있습니다:

1. **`.cline/plugins/`** 디렉토리 (권장)
2. **`cline plugin install aihubridge-tools`** 명령어 (미래 기능)

### API 통합

플러그인은 AIHuBridge의 기존 모듈과 통합됩니다:

- **`src/lib/openrouter.ts`**: OpenRouter API 호출
- **`scripts/fetch-news.mjs`**: 실제 뉴스 수집
- **`src/lib/news.ts`**: 뉴스 데이터 처리 및 검증
- **`src/types.ts`**: CalendarEvent 및 NewsItem 타입 정의

## 문제 해결

### 자주 발생하는 문제

1. **"OPENROUTER_API_KEY가 설정되지 않았습니다"**
   - 해결책: `.env` 파일에 `OPENROUTER_API_KEY` 설정

2. **"scripts/fetch-news.mjs를 찾을 수 없습니다"**
   - 해결책: 플러그인을 AIHuBridge 루트 디렉토리에 상대적 경로로 위치시킴

3. **캘린더 데이터 검증에서 "title 누락"**
   - 해결책: 검증하려는 캘린더 이벤트에 title 필드 추가

4. **명령어 실행 후에도 뉴스 항목이 없는 경우**
   - 해결책: `--force` 플래그 사용으로 강제 재수집

### 디버깅 팁

- **도구 이름 확인**: Cline에서 도구를 등록할 때 이름 확인
- **네트워크 연결 확인**: 수집기는 인터넷 연결 필요
- **권한 확인**: 플러그인이 프로젝트 디렉토리에 접근 가능한지 확인
- **로그 출력**: 각 도구 실행 시 타임스탬프와 함께 상태 메시지 반환

## 제한 사항

- **일일 수집 제한**: 캐시 적용으로 불필요한 네트워크 부하 방지
- **형식 제한**: 검증기는 구조화된 데이터에만 작동, 비정형 텍스트에는 작동하지 않음
- **외부 API 의존성**: OpenRouter 통합을 위해 OpenRouter API 키 필요

## 미래 개선 사항

- **CLI 인터페이스**: 외부 CLI 도구(`aihubridge-cli`)로 확장
- **웹 대시보드**: 도구 상태를 확인할 수 있는 웹 UI
- **자동화된 수집 스케줄링**: 주기적 수집을 위한 크론 작업
- **고급 검증 규칙**: 일정, 위치, 호스트 신뢰성 검증

## 기여

이 스킬은 오픈 소스로 제공되며, 누구나 개선에 기여할 수 있습니다. 제안 사항, 버그 보고, 코드 기여는 언제든지 환영합니다.

```
기여자:
  - AIHuBridge 팀
  - Cline SDK 커뮤니티
라이선스: MIT
```

---
*마지막 업데이트: 2026-10-26*