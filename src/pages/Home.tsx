import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { loadNews, filterNews } from '../lib/news';
import { config } from '../lib/config';
import { ClockIcon, TrendIcon } from '../components/icons';
import { useUser } from '../lib/user';
import { Badge } from '../components/Badge';
import { computeBadges } from '../lib/certs';
import { TodayConcept } from '../components/ConceptCard';
import { NewsCard } from '../components/NewsCard';

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useUser();

  useEffect(() => {
    loadNews().then((all) => setItems(filterNews(all, { limit: 6 })));
    setLoading(false);
  }, []);

  const handleRead = (_id?: string) => {
    // lastActive 갱신용 (추후 읽음 기록으로 확장)
  };

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">뉴스를 불러오는 중…</p>;
  }

  if (!items.length) {
    return (
      <div className="p-6">
        <p className="text-slate-600">
          뉴스가 없어요. 터미널에서{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run refresh</code>
          를 실행해 보세요. →{' '}
          <Link to="/dev" className="underline">
            자기진단
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* 오늘의 브리핑 헤더 */}
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            오늘의 AI 브리핑{' '}
            <span className="text-slate-400 font-normal">
              ({new Date().toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">{config.tagline}</p>
        </div>
        <Link
          to="/research"
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          전체 리서치
        </Link>
      </header>

      {/* 오늘의 개념 1개 + 스트릭 */}
      <section className="mb-8 flex items-center gap-4">
        <span className="text-2xl">
          <TrendIcon className="h-5 w-5" />
        </span>
        <span className="text-sm text-slate-600">
          🔥 {state.streak}일 연속 학습 · Lv.{state.level} (XP {state.xp})
        </span>
      </section>

      <TodayConcept />

      {/* 상위 뉴스 4 + 나머지 */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-600">
          오늘's Pick 4
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(0, 4).map((it) => (
            <NewsCard key={it.id} item={it} onRead={handleRead} />
          ))}
        </div>
      </section>

      {/* 최근 2건 더보기 */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-600">요즘 본 기사</h2>
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
        <h2 className="mb-3 text-sm font-semibold text-slate-600">나의 뱃지</h2>
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
