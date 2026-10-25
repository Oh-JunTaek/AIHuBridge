import { useState, useMemo } from 'react';
import { useNews } from '../lib/use-news';
import { NewsStatus } from '../components/NewsStatus';
import { filterNews } from '../lib/news';
import { NewsCard } from '../components/NewsCard';
import { useT } from '../lib/i18n';

export default function Research() {
  const { result, loading, reload } = useNews();
  const items = useMemo(() => filterNews(result?.items ?? []), [result]);

  const categories = ['전체', '업계/제품', '연구/논문', '정책/규제', '오픈소스', '언론', '블로그/개인'];
  const [active, setActive] = useState('전체');
  const [lang, setLang] = useState('');
  const [source, setSource] = useState('');
  const [query, setQuery] = useState('');
  const sources = useMemo(() => [...new Set(items.map((item) => item.source))].sort(), [items]);
  const t = useT();

  const shown = useMemo(() => filterNews(items, { category: active === '전체' ? undefined : active, lang, source, query }),
    [items, active, lang, source, query]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('research.title')}</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {t('research.sub', items.length)}
        </p>
      </header>

      <nav aria-label="뉴스 분야" className="mb-5 flex flex-wrap gap-2 text-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className={`rounded-full px-3 py-1 font-medium ${
              active === c
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            {c === '전체' ? t('path.filterAll') : t('category.' + c)}
          </button>
        ))}
      </nav>

      <section aria-label="뉴스 탐색 조건" className="mb-5 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">검색어
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목·주제·출처 검색"
              className="min-w-0 rounded-lg border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-600" />
          </label>
          <label className="grid gap-1 text-sm">기사 언어
            <select value={lang} onChange={(event) => setLang(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900">
              <option value="">전체 언어</option><option value="ko">한국어</option><option value="en">영어</option><option value="unknown">미확인</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">출처
            <select value={source} onChange={(event) => setSource(event.target.value)} className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900">
              <option value="">전체 출처</option>{sources.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <p role="status">검색 결과 {shown.length}건 / 전체 {items.length}건</p>
          <button type="button" onClick={() => { setActive('전체'); setLang(''); setSource(''); setQuery(''); }}
            className="rounded-lg px-3 py-2 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-stone-800">조건 초기화</button>
        </div>
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">원문 언어 기준이며 번역은 제공하지 않습니다. 선택한 탐색 조건은 저장하지 않습니다.</p>
      </section>

      <NewsStatus result={result} loading={loading} onRetry={reload} />
      {!loading && result?.status === 'success' && shown.length === 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{t('research.empty')}</p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {shown.map((it) => (
          <NewsCard key={it.id} item={it} />
        ))}
      </div>

    </div>
  );
}
