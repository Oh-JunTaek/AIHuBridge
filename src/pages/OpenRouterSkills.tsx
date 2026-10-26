import { useEffect, useState } from 'react';
import { useT } from '../lib/i18n';
import { listModels, generateLearningPathFromNewsItem } from '../lib/openrouter';
import { loadNews } from '../lib/news';
import type { NewsItem } from '../types';
import { CalendarEventCard } from '../components/CalendarEventCard';

type Model = any;

export default function OpenRouterSkills() {
  const t = useT();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [generatedEvents, setGeneratedEvents] = useState<Partial<import('../types').CalendarEvent>[]>([]);
  const [generating, setGenerating] = useState(false);

  // OpenRouter 모델 목록 불러오기
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listModels();
        if (!cancelled) setModels(data || []);
      } catch (e) {
        if (!cancelled) setError('OpenRouter 모델 목록을 불러오지 못했습니다.');
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // 뉴스 항목 불러오기
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setNewsLoading(true);
      setNewsError(null);
      try {
        const items = await loadNews();
        if (!cancelled) setNews(items.slice(0, 3));
      } catch (e) {
        if (!cancelled) setNewsError('AI 뉴스를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // OpenRouter를 사용해 뉴스 기사로부터 학습 활동(스킬) 생성
  const handleGenerateLearningPath = async () => {
    if (!news.length) return;
    setGenerating(true);
    const results: Partial<import('../types').CalendarEvent>[] = [];
    for (const item of news) {
      try {
        const ev = await generateLearningPathFromNewsItem(item);
        results.push(ev);
      } catch (e) {
        console.error('LearningPath 생성 실패:', item.id, e);
      }
    }
    setGeneratedEvents(results);
    setGenerating(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-stone-700 dark:text-stone-200">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">{t('openrouterSkills.title')}</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">{t('openrouterSkills.sub')}</p>

      {/* 모델 목록 */}
      <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">사용 가능한 OpenRouter 모델</h2>
        {loading && <p className="text-sm text-stone-500">모델 목록을 불러오는 중…</p>}
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {models.length > 0 && (
          <ul className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <li key={m.id} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-stone-800 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200">
                <span className="font-medium">{m.id}</span>
                {m.owned_by && <span className="ml-2 text-xs text-stone-500">({m.owned_by})</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* AI 뉴스 기사 */}
      <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">AI 뉴스(학습의 원천)</h2>
        {newsLoading && <p className="text-sm text-stone-500">뉴스를 불러오는 중…</p>}
        {newsError && <p className="text-sm text-rose-600">{newsError}</p>}
        {news.length > 0 && (
          <ul className="space-y-3 text-sm">
            {news.map((n) => (
              <li key={n.id}>
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">{n.title}</a>
                <p className="mt-0.5 text-stone-600 dark:text-stone-400">출처: {n.source} · {n.excerpt?.slice(0, 80)}…</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 학습 경로 생성 버튼 */}
      <section className="mb-8">
        <button
          onClick={handleGenerateLearningPath}
          disabled={generating || !news.length}
          className="rounded-xl border border-amber-500 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
        >
          {generating ? '학습 활동 생성 중…' : '선택한 뉴스 기사에 대한 무료 AI 학습 활동 생성'}
        </button>
      </section>

      {/* 생성된 학습 활동 */}
      {generatedEvents.length > 0 && (
        <section id="generated-calendar-events" className="scroll-mt-20">
          <header className="mb-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">생성된 AI 캘린더 항목</h2>
            <p className="text-xs text-stone-500">({generatedEvents.length}건)</p>
          </header>
          <div className="grid gap-4 lg:grid-cols-2">
            {generatedEvents.map((event, idx) => (
              <CalendarEventCard key={idx} event={event as import('../types').CalendarEvent} now={Date.now()} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}