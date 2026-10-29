import { useState } from 'react';
import { Link } from 'react-router-dom';
import { stages, levelOrder, categoryOrder } from '../data/path';
import type { Level, PCategory, PathFilter } from '../data/path';
import { StageCard } from '../components/StageCard';
import { useT } from '../lib/i18n';

export default function Path() {
  const t = useT();
  const [filter, setFilter] = useState<PathFilter>({ level: null, category: null });

  const applyLevel = (l: Level | null) => setFilter((f) => ({ ...f, level: l }));
  const applyCategory = (c: PCategory | null) =>
    setFilter((f) => ({ ...f, category: c }));

  // 필터에 맞는 항목이 하나라도 있는 스테이지만 노출
  const visibleStages = stages.filter((s) =>
    s.items.some(
      (it) =>
        (!filter.level || it.level === filter.level) &&
        (!filter.category || it.category === filter.category),
    ),
  );

  return (
    <div className="space-page space-library mx-auto max-w-4xl px-4 py-6">
      <header className="space-header mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="space-label">학습관</p>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('path.title')}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {t('path.sub')}
          </p>
        </div>
        <Link to="/certs" className="text-xs font-medium text-stone-500 hover:text-amber-600">
          {t('path.toCerts')} →
        </Link>
      </header>

      {/* ── 분류 필터: 난이도 / 분야 ── */}
      <div className="mb-5 flex flex-wrap items-center gap-4 gap-y-2 border-b border-stone-200 pb-3 text-xs">
        <div role="group" aria-label="학습 난이도" className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-500 dark:text-stone-400">{t('path.filterLevel')}</span>
          <button
            onClick={() => applyLevel(null)}
            aria-pressed={!filter.level}
            className={`min-h-9 rounded px-2 py-1.5 ${
              filter.level ? 'bg-stone-100 text-stone-600' : 'bg-blue-900 text-white'
            }`}
          >
            {t('path.filterAll')}
          </button>
          {levelOrder.map((lv) => (
            <button
              key={lv}
              onClick={() => applyLevel(lv)}
              aria-pressed={filter.level === lv}
              className={`min-h-9 rounded px-2 py-1.5 ${
                filter.level === lv ? 'bg-blue-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {t('level.' + lv)}
            </button>
          ))}
        </div>
        <div role="group" aria-label="학습 분야" className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-500 dark:text-stone-400">{t('path.filterCategory')}</span>
          <button
            onClick={() => applyCategory(null)}
            aria-pressed={!filter.category}
            className={`min-h-9 rounded px-2 py-1.5 ${
              filter.category ? 'bg-stone-100 text-stone-600' : 'bg-blue-900 text-white'
            }`}
          >
            {t('path.filterAll')}
          </button>
          {categoryOrder.map((c) => (
            <button
              key={c}
              onClick={() => applyCategory(c)}
              aria-pressed={filter.category === c}
              className={`min-h-9 rounded px-2 py-1.5 ${
                filter.category === c ? 'bg-blue-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {t('pathCategory.' + c)}
            </button>
          ))}
        </div>
        {filter.level || filter.category ? (
          <button
            onClick={() => setFilter({ level: null, category: null })}
            className="min-h-9 rounded px-2 py-1.5 text-stone-500 underline"
          >
            {t('path.filterReset')}
          </button>
        ) : null}
      </div>

      <div className="grid gap-4">
        {visibleStages.map((s) => (
          <StageCard key={s.id} stage={s} filter={filter} />
        ))}
      </div>
    </div>
  );
}
