import { Link } from 'react-router-dom';
import { useNews } from '../lib/use-news';
import { NewsStatus } from '../components/NewsStatus';
import { filterNews } from '../lib/news';
import { ClockIcon } from '../components/icons';
import { useT } from '../lib/i18n';
import { TodayBrief } from '../components/TodayBrief';
import { NewsCard } from '../components/NewsCard';

export default function Home() {
  const { result, loading, reload } = useNews();
  const items = filterNews(result?.items ?? [], { limit: 6 });
  const t = useT();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
            {/* Hero 배너 — 따뜻한 우드톤 그라데이션 */}
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-amber-50 via-stone-50 to-white p-6 shadow-sm dark:border-stone-700 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
        <div className="pointer-events-none absolute -top-10 -right-12 h-44 w-44 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-900/30" />
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
              {t('home.heading')}{' '}
              <span className="font-normal text-stone-500 dark:text-stone-400">
                ({new Date().toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })})
              </span>
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('home.sub')}</p>
          </div>
          <Link
            to="/updates"
            className="rounded-xl bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 dark:shadow-amber-900/30"
          >
            {t('home.allUpdates')}
          </Link>
        </div>
      </section>

      {/* 가장 최근 소식 미리 보기 */}
      <NewsStatus result={result} loading={loading} onRetry={reload} />
      {!loading && <TodayBrief items={items} />}

      {/* 최신 순 소식 4건과 나머지 */}
      {!loading && items.length > 0 && <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-stone-600">{t('home.pick')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(0, 4).map((it) => (
            <NewsCard key={it.id} item={it} />
          ))}
        </div>
      </section>}

      {/* 최근 2건 더보기 */}
      {!loading && items.length > 4 && <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-stone-600">{t('home.recent')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.slice(4, 6).map((it) => (
            <div key={it.id} className="flex gap-2">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
              <Link
                to={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 text-sm text-stone-700 hover:text-amber-600 hover:underline"
              >
                [{it.source}] {it.title}
              </Link>
            </div>
          ))}
        </div>
      </section>}
    </div>
  );
}
