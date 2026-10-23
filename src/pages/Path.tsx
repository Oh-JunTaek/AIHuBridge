import { useState } from 'react';
import { Link } from 'react-router-dom';
import { stages, levelOrder, categoryOrder } from '../data/path';
import type { Level, PCategory, PathFilter } from '../data/path';
import { StageCard } from '../components/StageCard';
import { useUser } from '../lib/user';
import { useT } from '../lib/i18n';

export default function Path() {
  const { state } = useUser();
  const t = useT();
  const [filter, setFilter] = useState<PathFilter>({ level: null, category: null });

  const applyLevel = (l: Level | null) => setFilter((f) => ({ ...f, level: l }));
  const applyCategory = (c: PCategory | null) =>
    setFilter((f) => ({ ...f, category: c }));

  // 전체 진도는 항상 all item 기준으로 유지(필터는 뷰만 좁힘)
  const total = stages.reduce((s, st) => s + st.items.length, 0);
  const done = stages.reduce(
    (s, st) => s + st.items.filter((it) => state.completedCourseIds.includes(it.id)).length,
    0,
  );
  const pct = Math.round((done / total) * 100);

  // 필터에 맞는 항목이 하나라도 있는 스테이지만 노출
  const visibleStages = stages.filter((s) =>
    s.items.some(
      (it) =>
        (!filter.level || it.level === filter.level) &&
        (!filter.category || it.category === filter.category),
    ),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('path.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('path.sub')}
          </p>
        </div>
        <Link to="/certs" className="text-xs font-medium text-slate-500 hover:text-blue-600">
          {t('path.toCerts')} →
        </Link>
      </header>

      <div className="mb-6 h-3 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mb-6 text-sm text-slate-600">
        {t('path.progress', done, total, pct)}
      </p>

      {/* ── 분류 필터: 난이도 / 분야 ── */}
      <div className="mb-5 flex flex-wrap items-center gap-4 gap-y-2 border-b border-slate-200 pb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">{t('path.filterLevel')}</span>
          <button
            onClick={() => applyLevel(null)}
            className={`rounded px-2 py-0.5 ${
              filter.level ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'
            }`}
          >
            {t('path.filterAll')}
          </button>
          {levelOrder.map((lv) => (
            <button
              key={lv}
              onClick={() => applyLevel(lv)}
              className={`rounded px-2 py-0.5 ${
                filter.level === lv ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t('level.' + lv)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">{t('path.filterCategory')}</span>
          <button
            onClick={() => applyCategory(null)}
            className={`rounded px-2 py-0.5 ${
              filter.category ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'
            }`}
          >
            {t('path.filterAll')}
          </button>
          {categoryOrder.map((c) => (
            <button
              key={c}
              onClick={() => applyCategory(c)}
              className={`rounded px-2 py-0.5 ${
                filter.category === c ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t('pathCategory.' + c)}
            </button>
          ))}
        </div>
        {filter.level || filter.category ? (
          <button
            onClick={() => setFilter({ level: null, category: null })}
            className="rounded px-2 py-0.5 text-slate-500 underline"
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
