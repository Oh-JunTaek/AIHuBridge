import { useEffect, useState } from 'react';
import { glossary } from '../data/glossary';
import { randomEntry } from '../lib/quiz';
import { SparkleIcon } from './icons';
import { useT } from '../lib/i18n';
import type { GlossaryEntry } from '../types';

/** 매일 새로운 용어 1개 → "오늘의 개념" 카드 */
export function TodayConcept() {
  const t = useT();
  const [entry, setEntry] = useState<GlossaryEntry | null>(null);

  useEffect(() => {
    // 날짜 시드로 고정된 오늘의 용어 (복사/공유에 유리)
    const d = new Date().toISOString().slice(0, 10);
    const seed = Array.from(d).reduce((a, c) => a + c.charCodeAt(0), 0);
    const idx = ((seed * 7) % glossary.length + glossary.length) % glossary.length;
    setEntry({ ...glossary[idx], example: glossary[idx].example, related: glossary[idx].related });
  }, []);

  if (!entry) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-5 shadow-xs">
      <header className="mb-2 flex items-center gap-2">
        <SparkleIcon className="h-5 w-5 text-amber-400" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t('home.concept')}</h2>
      </header>
      <p className="text-xl font-bold text-slate-900">{entry.term}</p>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{entry.definition}</p>
      {entry.example && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('ui.example')} {entry.example}</p>
      )}
      {entry.related && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {t('ui.related')} {entry.related.join(', ')}
        </p>
      )}
      <button
        className="mt-3 text-xs underline"
        onClick={() => {
          const next = randomEntry();
          setEntry(next);
        }}
      >
        {t('ui.more')}
      </button>
    </section>
  );
}
