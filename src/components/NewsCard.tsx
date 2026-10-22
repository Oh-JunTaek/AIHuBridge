import type { NewsItem } from '../types';
import { config } from '../lib/config';
import { readMinutes } from '../lib/news';
import { ClockIcon } from './icons';

export function NewsCard({
  item,
  onRead,
}: {
  item: NewsItem;
  onRead?: (id: string) => void;
}) {
  const mins = readMinutes(item.excerpt, item.title);
  const badge = config.categoryColor[item.category] || 'bg-slate-100 text-slate-800';
  const summaryText = item.summary || item.excerpt;

  return (
    <article className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-md">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onRead?.(item.id)}
        className="textLeft text-slate-800"
      >
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
          {item.category}
        </span>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-800 group-hover:text-blue-700">
          {item.title}
        </h3>
      </a>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{summaryText}</p>
      <footer className="mt-2 flex items-center gap-3 text-xs text-slate-500">
        <span className="font-medium text-slate-600">{item.source}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" /> {mins}분
        </span>
        {item.tags.slice(0, 2).map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </footer>
    </article>
  );
}
