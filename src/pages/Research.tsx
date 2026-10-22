import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { loadNews, filterNews } from '../lib/news';
import { NewsCard } from '../components/NewsCard';

export default function Research() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews().then((all) => {
      setItems(filterNews(all));
      setLoading(false);
    });
  }, []);

  const categories = ['전체', '업계/제품', '연구/논문', '정책/규제', '오픈소스', '언론', '블로그/개인'];
  const [active, setActive] = useState('전체');

  const shown = useMemo(() => {
    if (active === '전체') return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">리서치</h1>
        <p className="mt-1 text-sm text-slate-500">
          AI 최신 소식 {items.length}건 · 카테고리로 걸러보기
        </p>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2 text-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-3 py-1 font-medium ${
              active === c
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </nav>

      {loading && <p className="text-sm text-slate-500">로드 중…</p>}
      {!loading && shown.length === 0 && (
        <p className="text-sm text-slate-500">
          이 카테고리엔 아직 기사가 없어요. <code className="underline">npm run refresh</code>
          로 최신을 받아오세요.
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {shown.map((it) => (
          <NewsCard key={it.id} item={it} />
        ))}
      </div>

      <div className="mt-6 text-center text-sm">
        <Link
          to="/dev"
          className="underline decoration-dotted"
        >
          개발용 자기진단 → 마지막 수집 시각 확인
        </Link>
      </div>
    </div>
  );
}
