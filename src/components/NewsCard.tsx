import type { NewsItem } from '../types';
import { config } from '../lib/config';
import { readMinutes } from '../lib/news';
import { ClockIcon } from './icons';
import { useT } from '../lib/i18n';

export function NewsCard({
  item,
  onRead,
}: {
  item: NewsItem;
  onRead?: (id: string) => void;
}) {
  const mins = readMinutes(item.excerpt, item.title);
  const badge = config.categoryColor[item.category] || 'bg-stone-100 text-stone-800';
  const summaryText = item.summary || item.excerpt;
  const t = useT();

  return (
    <article className="group flex flex-col gap-2 rounded-xl border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 p-4 shadow-xs transition hover:shadow-md">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onRead?.(item.id)}
        className="textLeft text-stone-800 dark:text-stone-200"
      >
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
          {t('category.' + item.category)}
        </span>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-stone-800 group-hover:text-amber-700 dark:text-stone-200 dark:group-hover:text-amber-400">
          {item.title}
        </h3>
      </a>
      <p className="mt-1 line-clamp-2 text-sm text-stone-600 dark:text-stone-300">{summaryText}</p>
      <footer className="mt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
        <span className="font-medium text-stone-600 dark:text-stone-300">{item.source}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" /> {mins}{t('ui.min')}
        </span>
        {item.tags.slice(0, 2).map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </footer>
    </article>
  );
}
