import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { loadNews, filterNews } from '../lib/news';
import { ClockIcon, TrendIcon } from '../components/icons';
import { useUser } from '../lib/user';
import { useT } from '../lib/i18n';
import { Badge } from '../components/Badge';
import { computeBadges } from '../lib/certs';
import { TodayBrief } from '../components/TodayBrief';
import { TodayConcept } from '../components/ConceptCard';
import { NewsCard } from '../components/NewsCard';
import { nextSteps } from '../data/path';

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useUser();
  const t = useT();

  useEffect(() => {
    loadNews().then((all) => setItems(filterNews(all, { limit: 6 })));
    setLoading(false);
  }, []);

  // Lv.{n} 다음 레벨업: 미완료 항목 중 난이도 ≤ 현재+1티어
  const nextUp = nextSteps({
    level: state.level,
    completedCourseIds: state.completedCourseIds,
  });

  const handleRead = (_id?: string) => {
    // lastActive 갱신용 (추후 읽음 기록으로 확장)
  };

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">{t('home.loading')}</p>;
  }

  if (!items.length) {
    return (
      <div className="p-6">
        <p className="text-slate-600">{t('home.noNews')}</p>
        <Link to="/dev" className="mt-2 inline-block text-sm text-blue-600 underline">
          {t('nav.dev')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* 오늘의 브리핑 헤더 */}
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {t('home.heading')}{' '}
            <span className="text-slate-400 font-normal">
              ({new Date().toLocaleDateString(state.lang === 'en' ? 'en-US' : 'ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t('home.sub')}</p>
        </div>
        <Link
          to="/research"
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          {t('home.allResearch')}
        </Link>
      </header>

      {/* 오늘의 AI 한 줄 브리핑 (휴식/스몰 브리핑 공간) */}
      <TodayBrief items={items} />

      {/* 오늘의 개념 1개 + 스트릭 */}
      <section className="mb-8 flex items-center gap-4">
        <span className="text-2xl">
          <TrendIcon className="h-5 w-5" />
        </span>
        <span className="text-sm text-slate-600">
          {t('home.streak', state.streak, state.level, state.xp)}
        </span>
      </section>

      {/* 다음 레벨업 추천 (입문자 성장 동기 유도) */}
      {nextUp.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-5 shadow-xs">
          <header className="mb-2 flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('home.nextUp', state.level)}
            </h3>
          </header>
          <ul className="grid gap-2">
            {nextUp.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">{it.label}</span>
                  <span className="text-xs text-slate-500">
                    {t('pathCategory.' + it.category)} · {it.estMin}{t('ui.min')}
                  </span>
                </div>
                <Link
                  to="/path"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t('home.study')}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <TodayConcept />

      {/* 상위 뉴스 4 + 나머지 */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-600">{t('home.pick')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(0, 4).map((it) => (
            <NewsCard key={it.id} item={it} onRead={handleRead} />
          ))}
        </div>
      </section>

      {/* 최근 2건 더보기 */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-600">{t('home.recent')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.slice(4, 6).map((it) => (
            <div key={it.id} className="flex gap-2">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <Link
                to={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-2 text-sm text-slate-700 hover:text-blue-600 hover:underline"
                onClick={() => handleRead(it.id)}
              >
                [{it.source}] {it.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 내 뱃지 */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-slate-600">{t('home.badges')}</h2>
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
    </div>
  );
}
