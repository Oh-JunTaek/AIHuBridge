declare const process: any;
import OpenAI from 'openai';
import type { CalendarEvent, EventType } from '../types';

const BASE_URL = 'https://openrouter.ai/api/v1';
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.warn('OPENROUTER_API_KEY가 설정되지 않았습니다. OpenRouter 기능이 비활성화됩니다.');
}

export const openrouter = API_KEY ? new OpenAI({ baseURL: BASE_URL, apiKey: API_KEY }) : null;

/**
 * OpenRouter를 통해 사용 가능한 모든 모델을 반환합니다.
 */
export async function listModels() {
  if (!openrouter) return [];
  const resp = await openrouter.models.list();
  return resp.data || [];
}

/**
 * 뉴스 항목(NewsItem)을 받아 OpenRouter를 통해 새로운 무료 AI 학습 활동(CalendarEvent)으로 변환합니다.
 * 뉴스 제목, 요약 등을 프롬프트로 사용합니다.
 */
export async function callOpenRouter<T = unknown>(options: any): Promise<T> {
  if (!openrouter) throw new Error('OPENROUTER_API_KEY가 설정되지 않았습니다.');
  const { model = '~openai/gpt-4o-mini', prompt, temperature, max_tokens, tools, tool_choice } = options;

  const completion = await openrouter.chat.completions.create(
    {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens,
      tools,
      tool_choice,
    } as any,
    {
      extraHeaders: {
        'HTTP-Referer': 'https://openrouter.ai',
        'X-OpenRouter-Title': 'AIHuBridge',
      },
    } as any,
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) return null as T;
  try {
    return JSON.parse(content) as T;
  } catch {
    return content as unknown as T;
  }
}

export async function generateLearningPathFromNewsItem(newsItem: any): Promise<Partial<CalendarEvent>> {
  const prompt = `
당신은 AIHuBridge라는 플랫폼의 AI 교육 캘린더 관리 전문가입니다.
다음 뉴스 기사를 읽고, 이에 해당하는 무료 AI 학습 활동(예: 무료 강의, 부트캠프, 웨비나, 해커톤, 공모전 등)을 생성하세요.
뉴스는 일반적으로 새로운 AI 모델, 프레임워크, 논문 등을 다룹니다.

가능한 활동 유형:
- seminar: 대면 또는 온라인 세미나
- webinar: 무료 온라인 세미나
- workshop: 무료 실습 워크숍
- bootcamp: 무료 AI 부트캠프(단기)
- hackathon: 무료 해커톤(상금 포함일 수 있음)
- competition: 무료 AI 모델 경연대회/공모전
- training: 무료 온라인 학습 과정(예: Coursera, edX 무료 항목)
- conference: 무료 컨퍼런스 세션(온라인)
- meetup: 무료 AI 사용자 그룹 모임
- other: 기타 무료 활동

반환 JSON은 CalendarEvent의 하위 집합이어야 합니다(필수 필드: title, host, type, url, status, applicationStart, applicationEnd, isOnline, feeType, feeAmount, region, territory, topics, verification).

뉴스 콘텐츠:
제목: ${newsItem.title}
요약: ${newsItem.excerpt}
출처: ${newsItem.source}
URL: ${newsItem.url}

현재 날짜: ${new Date().toISOString()}

출력 형식(JSON만, 설명 없이):
{
  "title": "생성된 활동 제목",
  "host": "주최자 또는 기관",
  "type": "선택된 활동 유형(위에서 선택)",
  "url": "신청 또는 참여 링크(필요 시 뉴스 URL 사용)",
  "status": "announced",
  "applicationStart": null,
  "applicationEnd": null,
  "isOnline": true,
  "feeType": "free",
  "feeAmount": null,
  "region": "국내/해외(알 수 없으면 null)",
  "territory": "domestic",
  "topics": ["AI 모델", "무료 학습"],
  "verification": "manual",
  "category": "ai-core"
}
`;

  try {
    const result = await callOpenRouter<{ title?: string; host?: string; type?: EventType; url?: string; }>({
      model: '~openai/gpt-4o-mini',
      prompt,
      temperature: 0.7,
      max_tokens: 800,
    });

    if (!result || typeof result !== 'object') {
      throw new Error('OpenRouter가 유효한 학습 활동 제안을 반환하지 않았습니다.');
    }

    // CalendarEvent의 유효한 부분으로 매핑
    const event: Partial<CalendarEvent> = {
      title: result.title || `${newsItem.title} - 무료 학습 활동`,
      host: result.host || newsItem.source,
      type: result.type || 'seminar',
      url: result.url || newsItem.url,
      status: 'announced' as const,
      applicationStart: null,
      applicationEnd: null,
      isOnline: true,
      feeType: 'free',
      feeAmount: null,
      region: null,
      territory: 'domestic',
      topics: ['AI 모델', '무료 학습'],
      verification: 'manual',
      category: 'ai-core',
    };
    return event;
  } catch (error) {
    console.error('OpenRouter를 사용한 학습 경로 생성 실패:', error);
    throw error;
  }
}