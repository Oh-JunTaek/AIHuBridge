import type { NewsItem } from '../types';
import { Link } from 'react-router-dom';
import { config } from '../lib/config';
import { readMinutes } from '../lib/news';
import { ClockIcon } from '../components/icons';
import { useT } from '../lib/i18n';

/** 오늘의 AI 한 줄 브리핑 — 가장 최근 뉴스 1건을 한눈에 (휴식/스몰 브리핑용) */
export function TodayBrief({ items }: { items: NewsItem[] }) {
  const top = items[0];
  if (!top) return null;

  const t = useT();
  const mins = readMinutes(top.excerpt, top.title);
  const badge = config.categoryColor[top.category] || 'bg-slate-100 text-slate-800';
  const summaryText = top.summary || top.excerpt;

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-5 shadow-xs">
      <header className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-slate-500">{t('home.briefingLabel')}</span>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}
          title="분야"
        >
          {t('category.' + top.category)}
        </span>
      </header>
      <a href={top.url} target="_blank" rel="noopener noreferrer" className="block">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">
          {top.title}
        </h3>
      </a>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{summaryText}</p>
      <footer className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-600 dark:text-slate-300">{top.source}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" /> {mins}{t('ui.min')}
        </span>
        <Link
          to="/research"
          className="ml-auto text-xs text-slate-400 dark:text-slate-500 hover:text-blue-600"
        >
          {t('home.more')}
        </Link>
      </footer>
    </section>
  );
}
