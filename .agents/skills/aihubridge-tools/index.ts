import { createTool } from '@cline/sdk';

const process = typeof globalThis !== 'undefined' ? globalThis.process : undefined;

// ===================================================
// AIHuBridge Cline SDK Plugin - Enhanced Development Workflow
// ===================================================

// ===================================================
// Tool 1: Fetch AI News & Process RSS Feed
// ===================================================

const fetchAiNewsTool = createTool({
  name: 'fetch_ai_news',
  description: 'RSS 피드를 통해 최신 AI 뉴스 및 학습 자료를 수집합니다. public/data/news.json을 업데이트합니다.',
  parameters: {
    type: 'object',
    properties: {
      forceRefresh: {
        type: 'boolean',
        description: 'true이면 캐시 무시하고 강제로 수집 실행',
        default: false,
      },
      limit: {
        type: 'number',
        description: '선택적 필터링 적용 전 뉴스 항목 수 제한',
        default: 50,
      },
    },
    required: [],
  },
  async handler(args) {
    try {
      // 실제 수집기 실행
      const scriptPath = `${process?.cwd() || ''}/scripts/fetch-news.mjs`;
      const { requestNews } = await import(scriptPath);
      
      const result = await requestNews('/api/v1/fetch-news', fetch, Date.now());
      
      const newsResult = {
        status: result.status || 'success',
        items: result.items || [],
        fetchedAt: result.fetchedAt || new Date().toISOString(),
        stale: result.stale || false,
        warning: result.warning || null,
        error: result.error || null,
      };
      
      return {
        success: true,
        message: `최신 AI 뉴스를 성공적으로 수집했습니다 (${newsResult.items.length}개 항목)`,
        data: newsResult,
        timestamp: new Date().toLocaleString('ko-KR'),
      };
    } catch (error) {
      return {
        success: false,
        error: `뉴스 수집 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        timestamp: new Date().toLocaleString('ko-KR'),
      };
    }
  },
});

// ===================================================
// Tool 2: Generate Calendar Event from News Item
// ===================================================

const generateCalendarEventTool = createTool({
  name: 'generate_calendar_event',
  description: 'AI 뉴스를 바탕으로 무료 AI 학습 활동(CalendarEvent)을 생성합니다. OpenRouter API와 연동됩니다.',
  parameters: {
    type: 'object',
    properties: {
      newsItem: {
        type: 'object',
        description: '학습 활동으로 변환할 뉴스 항목',
        properties: {
          title: { type: 'string', description: '뉴스 제목' },
          url: { type: 'string', description: '뉴스 원본 URL' },
          source: { type: 'string', description: '뉴스 출처' },
          excerpt: { type: 'string', description: '뉴스 요약' },
        },
        required: ['title', 'url', 'source'],
      },
      useOpenRouter: {
        type: 'boolean',
        description: 'true이면 OpenRouter API를 통해 학습 활동 콘텐츠 생성',
        default: true,
      },
      customEventType: {
        type: 'string',
        description: '사용자가 지정한 이벤트 유형 (seminar, webinar, workshop, bootcamp, hackathon, competition, training, conference, meetup, other)',
      },
    },
    required: ['newsItem'],
  },
  async handler(args) {
    try {
      const { newsItem, useOpenRouter = true, customEventType } = args;
      
      let eventData;
      
      if (useOpenRouter) {
        // 실제 OpenRouter 통합 사용
        const { generateLearningPathFromNewsItem } = await import('../Document/GitHub/AIHuBridge/src/lib/openrouter');
        
        const mappedNewsItem = {
          title: newsItem.title,
          excerpt: newsItem.excerpt || '',
          source: newsItem.source,
          url: newsItem.url,
        };
        
        eventData = await generateLearningPathFromNewsItem(mappedNewsItem);
      } else {
        // 수동 입력/간단한 생성
        eventData = {
          title: `${newsItem.title} - 무료 AI 학습 활동`,
          host: newsItem.source,
          type: customEventType || 'seminar',
          url: newsItem.url,
          status: 'announced',
          isOnline: true,
          feeType: 'free',
          feeAmount: null,
          region: null,
          territory: 'domestic',
          topics: ['AI 모델', '무료 학습'],
          verification: 'manual',
          category: 'ai-core',
          applicationStart: null,
          applicationEnd: null,
          eventStart: null,
          eventEnd: null,
          timezone: 'Asia/Seoul',
          fetchedAt: new Date().toISOString(),
        };
      }
      
      return {
        success: true,
        message: `뉴스 '${newsItem.title}'로부터 '${eventData.title}' 캘린더 이벤트 생성 완료`,
        data: eventData,
        timestamp: new Date().toLocaleString('ko-KR'),
      };
    } catch (error) {
      return {
        success: false,
        error: `캘린더 이벤트 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        timestamp: new Date().toLocaleString('ko-KR'),
      };
    }
  },
});

// ===================================================
// Tool 3: Validate Calendar Data
// ===================================================

const validateCalendarDataTool = createTool({
  name: 'validate_calendar_data',
  description: '캘린더 데이터의 무결성과 품질을 검증합니다. 필수 필드, 형식, 날짜 타당성 등을 검사합니다.',
  parameters: {
    type: 'object',
    properties: {
      calendarData: {
        type: 'array',
        description: '검증할 캘린더 이벤트 배열',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            host: { type: 'string' },
            type: { type: 'string' },
            url: { type: 'string' },
            status: { type: 'string' },
            isOnline: { type: 'boolean' },
            feeType: { type: 'string' },
          },
        },
      },
      strictMode: {
        type: 'boolean',
        description: 'true이면 필수 필드만 검사, false이면 품질 검사도 수행',
        default: false,
      },
    },
    required: ['calendarData'],
  },
  async handler(args) {
    try {
      const { calendarData, strictMode = false } = args;
      
      const validationResults = {
        total: calendarData.length,
        valid: 0,
        invalid: 0,
        issues: [] as string[],
        passed: [] as any[],
        failed: [] as any[],
      };
      
      for (const event of calendarData) {
        const issues: string[] = [];
        
        // 필수 필드 검사
        if (!event.title) issues.push('필수 필드 누락: title');
        if (!event.host) issues.push('필수 필드 누락: host');
        if (!event.type) issues.push('필수 필드 누락: type');
        if (!event.url) issues.push('필수 필드 누락: url');
        if (!event.status) issues.push('필수 필드 누락: status');
        if (typeof event.isOnline !== 'boolean') issues.push('필수 필드 누락 또는 형식 오류: isOnline');
        if (!event.feeType) issues.push('필수 필드 누락: feeType');
        
        // 날짜 타당성 검사 (strictMode인 경우)
        if (!strictMode) {
          if (event.applicationStart && !isNaN(Date.parse(event.applicationStart))) {
            const start = new Date(event.applicationStart);
            if (start < new Date()) issues.push('신청 시작일이 과거임');
          }
          if (event.applicationEnd && !isNaN(Date.parse(event.applicationEnd))) {
            const end = new Date(event.applicationEnd);
            if (end < new Date()) issues.push('신청 마감일이 과거임');
          }
        }
        
        if (issues.length === 0) {
          validationResults.valid++;
          validationResults.passed.push(event);
        } else {
          validationResults.invalid++;
          validationResults.failed.push(event);
          validationResults.issues.push(`${event.title || '제목 없음'}의 검증 실패: ${issues.join(', ')}`);
        }
      }
      
      const result = {
        success: validationResults.invalid === 0,
        message: strictMode
          ? `검증 완료: ${validationResults.valid}개 유효, ${validationResults.invalid}개 무효`
          : `품질 검증 완료: ${validationResults.valid}개 통과, ${validationResults.invalid}개 문제 있음`,
        data: validationResults,
        timestamp: new Date().toLocaleString('ko-KR'),
      };
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: `캘린더 데이터 검증 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        timestamp: new Date().toLocaleString('ko-KR'),
      };
    }
  },
});

// ===================================================
// Plugin Export
// ===================================================

export default {
  name: 'aihubridge-development-tools',
  manifest: {
    capabilities: ['tools'],
    description: 'AIHuBridge 프로젝트 개발을 위한 Cline SDK 플러그인',
    version: '1.0.0',
  },
  setup(api, ctx) {
    // 개발 워크플로 도구 등록
    api.registerTool(fetchAiNewsTool);
    api.registerTool(generateCalendarEventTool);
    api.registerTool(validateCalendarDataTool);
  },
};