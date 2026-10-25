import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { loadNews, filterNews } from '../lib/news';
import { ClockIcon } from '../components/icons';
import { useT } from '../lib/i18n';
import { TodayBrief } from '../components/TodayBrief';
import { TodayConcept } from '../components/ConceptCard';
import { NewsCard } from '../components/NewsCard';

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => {
    loadNews().then((all) => setItems(filterNews(all, { limit: 6 })));
    setLoading(false);
  }, []);

  // 진척도/개인화 기능 일시 비활성화 (개인화 미제공 → 재활성화 시 state + nextSteps 재연결)

  const handleRead = (_id?: string) => {
    // lastActive 갱신용 (추후 읽음 기록으로 확장)
  };

  if (loading) {
    return <p className="p-6 text-sm text-stone-500">{t('home.loading')}</p>;
  }

  if (!items.length) {
    return (
      <div className="p-6">
        <p className="text-stone-600">{t('home.noNews')}</p>
        <Link to="/dev" className="mt-2 inline-block text-sm text-amber-600 underline">
          {t('nav.dev')}
        </Link>
      </div>
    );
  }

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
            to="/research"
            className="rounded-xl bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 dark:shadow-amber-900/30"
          >
            {t('home.allResearch')}
          </Link>
        </div>
      </section>

      {/* 오늘의 AI 한 줄 브리핑 (휴식/스몰 브리핑 공간) */}
      <TodayBrief items={items} />

      {/* 오늘의 개념 1개 — 진척도 표시 일시 비활성화 (개인화 미제공) */}

      {/* 다음 레벨업 추천 — 개인화 미제공 시 비활성화
      {nextUp.length > 0 && (
        <section className="mt-6 rounded-xl border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 p-5 shadow-xs">
          <header className="mb-2 flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              {t('home.nextUp', state.level)}
            </h3>
          </header>
          <ul className="grid gap-2">
            {nextUp.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-stone-800">{it.label}</span>
                  <span className="text-xs text-stone-500">
                    {t('pathCategory.' + it.category)} · {it.estMin}{t('ui.min')}
                  </span>
                </div>
                <Link
                  to="/path"
                  className="text-xs text-amber-600 hover:underline"
                >
                  {t('home.study')}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      */}

      <TodayConcept />

      {/* 상위 뉴스 4 + 나머지 */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-stone-600">{t('home.pick')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(0, 4).map((it) => (
            <NewsCard key={it.id} item={it} onRead={handleRead} />
          ))}
        </div>
      </section>

      {/* 최근 2건 더보기 */}
      <section className="mt-6">
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
                onClick={() => handleRead(it.id)}
              >
                [{it.source}] {it.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 내 뱃지 — 개인화 미제공 시 비활성화
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-stone-600">{t('home.badges')}</h2>
        <div className="flex flex-wrap gap-3">
          {computeBadges({
            completedCourseIds: state.completedCourseIds,
            earnedCertChecks: state.earnedCertChecks,
            quizHistory: state.quizHistory,
            streak: state.streak,
          }).map((b) => (
            <Badge key={b.id} badge={b} />
          ))}
        </div>
      </section>
      */}
    </div>
  );
}
