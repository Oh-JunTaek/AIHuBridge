# AIHuBridge Cline SDK Plugin

**AIHuBridge 프로젝트 개발을 위한 Cline SDK 플러그인**

## 개요

이 플러그인은 Cline 내에서 AIHuBridge 개발 워크플로를 가속화하는 세 가지 주요 도구를 제공합니다:

1. **`fetch_ai_news`** - RSS 피드를 통해 최신 AI 뉴스 및 학습 자료를 수집하고 `public/data/news.json`을 업데이트합니다
2. **`generate_calendar_event`** - AI 뉴스를 바탕으로 무료 AI 학습 활동(CalendarEvent)을 생성합니다
3. **`validate_calendar_data`** - 캘린더 데이터의 무결성과 품질을 검증합니다

## 설치 방법

이 플러그인은 `.cline/plugins/` 디렉토리 또는 `cline plugin install` 명령어를 통해 설치할 수 있습니다:

```bash
cd /path/to/your/project
 Cline SDK 플러그인 사용법:
  • Cline에 질문을 입력하고, 플러그인에서 제공하는 도구 사용 가능
  • 직접 도구 사용 방법:
     - `fetch_ai_news` - 뉴스 수집
     - `generate_calendar_event` - 캘린더 이벤트 생성
     - `validate_calendar_data` - 데이터 검증
```

## 사용 예시

### 1. 최신 AI 뉴스 수집

```
사용자: "오늘의 최신 AI 뉴스를 가져와서 news.json에 업데이트해줘"

Cline 응답:
[fetch_ai_news 도구 실행]
✅ 최신 AI 뉴스를 성공적으로 수집했습니다 (47개 항목)
```

### 2. 뉴스로부터 캘린더 이벤트 생성

```
사용자: "OpenAI의 최신 GPT-4 학습 활동에 대한 캘린더 이벤트를 생성해줘"

Cline 응답:
[generate_calendar_event 도구 실행]
✅ 뉴스 "OpenAI의 최신 GPT-4 학습 활동"로부터 "GPT-4 무료 워크숍" 캘린더 이벤트 생성 완료
```

### 3. 캘린더 데이터 검증

```
사용자: "현재 calendar.json 파일의 유효성을 검사하고 문제점을 알려줘"

Cline 응답:
[validate_calendar_data 도구 실행]
✅ 품질 검증 완료: 28개 통과, 3개 문제 있음

문제점:
- "AI 모델링 기초"의 필수 필드 누락: title
- "머신러닝 워크숍"의 신청 마감일이 과거임
```

## 도구 세부 정보

### `fetch_ai_news`

**설명**: RSS 피드를 통해 최신 AI 뉴스 및 학습 자료를 수집합니다. `public/data/news.json`을 업데이트합니다.

**매개변수**:
- `forceRefresh` (boolean, 선택): true이면 캐시 무시하고 강제로 수집 실행 (기본값: false)
- `limit` (number, 선택): 선택적 필터링 적용 전 뉴스 항목 수 제한 (기본값: 50)

**반환값**:
```json
{
  "success": true,
  "message": "최신 AI 뉴스를 성공적으로 수집했습니다 (47개 항목)",
  "data": {
    "status": "success",
    "items": [...], // NewsItem 배열
    "fetchedAt": "2026-10-26T10:00:00.000Z",
    "stale": false,
    "warning": null,
    "error": null
  },
  "timestamp": "2026-10-26 오전 10:00:00"
}
```

### `generate_calendar_event`

**설명**: AI 뉴스를 바탕으로 무료 AI 학습 활동(CalendarEvent)을 생성합니다. OpenRouter API와 연동됩니다.

**매개변수**:
- `newsItem` (객체, 필수): 학습 활동으로 변환할 뉴스 항목
  - `title` (문자열): 뉴스 제목
  - `url` (문자열): 뉴스 원본 URL
  - `source` (문자열): 뉴스 출처
  - `excerpt` (문자열, 선택): 뉴스 요약
- `useOpenRouter` (boolean, 선택): true이면 OpenRouter API를 통해 학습 활동 콘텐츠 생성 (기본값: true)
- `customEventType` (문자열, 선택): 사용자가 지정한 이벤트 유형

**반환값**:
```json
{
  "success": true,
  "message": "뉴스 'OpenAI의 최신 GPT-4 학습 활동'로부터 'GPT-4 무료 워크숍' 캘린더 이벤트 생성 완료",
  "data": {
    "title": "GPT-4 무료 워크숍",
    "host": "OpenAI Korea",
    "type": "workshop",
    "url": "https://news-url.com",
    "status": "announced",
    "isOnline": true,
    "feeType": "free",
    "feeAmount": null,
    "region": null,
    "territory": "domestic",
    "topics": ["AI 모델", "무료 학습"],
    "verification": "manual",
    "category": "ai-core",
    // ... 기타 필드
  },
  "timestamp": "2026-10-26 오전 10:00:00"
}
```

### `validate_calendar_data`

**설명**: 캘린더 데이터의 무결성과 품질을 검증합니다. 필수 필드, 형식, 날짜 타당성 등을 검사합니다.

**매개변수**:
- `calendarData` (배열, 필수): 검증할 캘린더 이벤트 배열
- `strictMode` (boolean, 선택): true이면 필수 필드만 검사, false이면 품질 검사도 수행 (기본값: false)

**반환값**:
```json
{
  "success": true,
  "message": "품질 검증 완료: 28개 통과, 3개 문제 있음",
  "data": {
    "total": 30,
    "valid": 28,
    "invalid": 3,
    "issues": ["'AI 모델링 기초'의 필수 필드 누락: title", "'머신러닝 워크숍'의 신청 마감일이 과거임"],
    "passed": [...], // 유효한 이벤트 배열
    "failed": [...] // 무효한 이벤트 배열
  },
  "timestamp": "2026-10-26 오전 10:00:00"
}
```

## 기술적 세부 사항

### 의존성

- `@cline/sdk` - Cline SDK를 통해 도구 생성 및 등록에 사용

### 통합

- **OpenRouter API**: `generate_calendar_event` 도구는 실제 `src/lib/openrouter.ts`와 통합되어 AI 모델 생성 및 학습 활동 제안 가능
- **실시간 피드**로 뉴스 수집 및 캘린더 업데이트
- **자동 검증**을 통해 데이터 품질 보장

### 보안 및 제한 사항

- 이 플러그인은 프로젝트 접근 권한이 있는 경우에만 데이터 읽기/쓰기 가능
- 검증 도구에는 민감한 개인 정보가 포함되지 않음
- 매일 1회 이상 강제 수집만 허용 (캐시 적용)

## 문제 해결

### 일반적인 문제 및 해결책

1. **"OPENROUTER_API_KEY가 설정되지 않았습니다" 오류**
   - 해결책: AIHuBridge 프로젝트의 `.env` 파일에 `OPENROUTER_API_KEY=sk-or-your-key` 추가

2. **뉴스 수집 실패**
   - 해결책: 인터넷 연결 확인 및 RSS 피드 주소 확인

3 **캘린더 이벤트 생성 실패**
   - 해결책: `useOpenRouter=false` 매개변수 사용하거나 직접 데이터 제공

## 기여

이 프로젝트는 AIHuBridge 팀이 Cline SDK 에코시스템을 강화하기 위해 기여했습니다. 새로운 도구 추가, 버그 수정, 또는 개선 사항이 있다면 언제든지 참여해 주세요.

## 라이선스

MIT 라이선스. 세부 내용은 LICENSE 파일을 참조하세요.