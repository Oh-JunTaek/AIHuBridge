import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { loadNews, filterNews } from '../lib/news';
import { NewsCard } from '../components/NewsCard';
import { useT } from '../lib/i18n';

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
  const t = useT();

  const shown = useMemo(() => {
    if (active === '전체') return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">{t('research.title')}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {t('research.sub', items.length)}
        </p>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2 text-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-3 py-1 font-medium ${
              active === c
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {c === '전체' ? t('path.filterAll') : t('category.' + c)}
          </button>
        ))}
      </nav>

      {loading && <p className="text-sm text-stone-500">{t('home.loading')}</p>}
      {!loading && shown.length === 0 && (
        <p className="text-sm text-stone-500">{t('research.empty')}</p>
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
          {t('research.devLink')}
        </Link>
      </div>
    </div>
  );
}
