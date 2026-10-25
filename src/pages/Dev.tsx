import { useEffect, useState } from 'react';
import { loadNews } from '../lib/news';
import { useUser } from '../lib/user';
import { useT } from '../lib/i18n';

type Meta = { fetchedAt: string; total: number; counts: Record<string, number>; summaryTiers: Record<string, number> };

export default function Dev() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const { state } = useUser();
  const t = useT();

  useEffect(() => {
    loadNews().then((n) => setNewsCount(n.length));
    fetch(import.meta.env.BASE_URL + 'data/meta.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMeta)
      .catch(() => setMeta(null));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">{t('dev.title')}</h1>
      <p className="mb-6 text-sm text-slate-500">{t('dev.sub')}</p>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">{t('dev.fetchedAt')}</dt>
          <dd className="font-medium text-slate-800">
            {meta?.fetchedAt
              ? new Date(meta.fetchedAt).toLocaleString('ko-KR')
              : t('dev.noFetch')}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('dev.count')}</dt>
          <dd className="font-medium text-slate-800">
            {newsCount ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('dev.tiers')}</dt>
          <dd className="font-medium text-slate-800">
            {meta?.summaryTiers
              ? t(
                  'dev.tiFormat',
                  meta.summaryTiers.rule ?? 0,
                  meta.summaryTiers.excerpt ?? 0,
                )
              : t('dev.ruleFallback')}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('dev.sourceCounts')}</dt>
          <dd className="font-medium text-slate-800">
            {meta?.counts
              ? Object.entries(meta.counts).map(([k, v]) => `${k}:${v}`).join(', ')
              : '—'}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-500">{t('dev.userState')}</dt>
          <dd className="font-mono text-xs text-slate-700 break-all">
            streak={state.streak}, level={state.level}, xp={state.xp},
            courses={state.completedCourseIds.length},
            certs={state.earnedCertChecks.length}, quiz={state.quizHistory.length}
          </dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">{t('dev.helpTitle')}</h2>
        <ul className="grid gap-1 text-sm text-slate-600 list-disc list-inside">
          <li>{t('dev.help1')}</li>
          <li>{t('dev.help2')}</li>
          <li>{t('dev.help3')}</li>
        </ul>
      </section>
    </div>
  );
}
