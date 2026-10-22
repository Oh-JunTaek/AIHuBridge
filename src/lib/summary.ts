import type { NewsItem } from '../types';

/**
 * 요약 3단 전략 (c 옵션):
 *  1. 로컬 LLM (Ollama, opt-in)  →  2. 규칙 요약  →  3. excerpt
 * - 로컬 LLM은 `localStorage.aiCompassSummon = "ollama"` 일 때만 시도
 * - 실패/미설치 시 자동 fallback. 오프라인-first.
 */

const OLLAMA_DEFAULT = 'http://127.0.0.1:11434/api/generate';
const PROMPT = `다음 글을 비전공자도 이해할 수 있게 핵심만 **2~3문장**으로 요약해줘. 본문의 앞부분만 참고해도 좋고, 중요한 수치나 제품명은 꼭 언급해.`;

function isOllamaEnabled(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem('aiCompassSummon') === 'ollama';
}

function escape(s: string) {
  return s.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
}

export async function summarize(item: NewsItem): Promise<string> {
  // 1. 로컬 LLM (opt-in)
  if (isOllamaEnabled()) {
    try {
      const model = localStorage.getItem('aiCompassModel') ?? 'gemma3:1b';
      const endpoint =
        localStorage.getItem('aiCompassOllamaUrl') || OLLAMA_DEFAULT;
      const body = {
        model,
        prompt: `${PROMPT}\n---\n${escape(item.title)} ${escape(item.excerpt)}`,
        stream: false,
        temperature: 0.3,
      };
      const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) {
        const data: { response?: string } = await res.json();
        if (data.response?.trim()) return data.response.trim();
      }
    } catch {
      /* fallback below */
    }
  }

  // 2. 규칙 요약 (문장 경계 잘라내기)
  const rule = ruleSummary(item.excerpt);
  if (rule) return rule;

  // 3. fallback
  return (item.excerpt || '').slice(0, 200) + '…';
}

/** 핵심: 문장 경계에서 앞 2문장 추출 */
export function ruleSummary(text: string | undefined): string {
  if (!text) return '';
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  const two = sentences.slice(0, 2).join(' ');
  return two || text.slice(0, 240) + '…';
}
