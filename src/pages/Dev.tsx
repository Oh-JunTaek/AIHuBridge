import { useEffect, useState } from 'react';
import { loadNews } from '../lib/news';
import { useUser } from '../lib/user';

type Meta = { fetchedAt: string; total: number; counts: Record<string, number>; summaryTiers: Record<string, number> };

export default function Dev() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const { state } = useUser();

  useEffect(() => {
    loadNews().then((n) => setNewsCount(n.length));
    fetch('/data/meta.json?ts=' + Date.now())
      .then((r) => (r.ok ? r.json() : null))
      .then(setMeta)
      .catch(() => setMeta(null));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">🧪 자기진단</h1>
      <p className="mb-6 text-sm text-slate-500">
        (개발자 전용) 사이트 자가 점검. 배포용 아님, 로컬 저장 기준.
      </p>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">마지막 RSS 수집 시각</dt>
          <dd className="font-medium text-slate-800">
            {meta?.fetchedAt
              ? new Date(meta.fetchedAt).toLocaleString('ko-KR')
              : '미수집 (npm run refresh)'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">저장된 뉴스 건수</dt>
          <dd className="font-medium text-slate-800">
            {newsCount ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">요약 티어</dt>
          <dd className="font-medium text-slate-800">
            {meta?.summaryTiers
              ? `LLM ${meta.summaryTiers.llm ?? 0} · 규칙 ${meta.summaryTiers.rule ?? 0} · excerpt ${meta.summaryTiers.excerpt ?? 0}`
              : '규칙 요약 사용 중 (LLM 미연결)'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">소스별 건수</dt>
          <dd className="font-medium text-slate-800">
            {meta?.counts
              ? Object.entries(meta.counts).map(([k, v]) => `${k}:${v}`).join(', ')
              : '—'}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-slate-500">사용자 상태 (localStorage)</dt>
          <dd className="font-mono text-xs text-slate-700 break-all">
            streak={state.streak}, level={state.level}, xp={state.xp},
            courses={state.completedCourseIds.length},
            certs={state.earnedCertChecks.length}, quiz={state.quizHistory.length}
          </dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">도움말</h2>
        <ul className="grid gap-1 text-sm text-slate-600 list-disc list-inside">
          <li>LLM 요약 켜기: DevTools ≥ Application ≥ localStorage 에서 <code>aiCompassSummon</code> = <code>ollama</code> 설정 → <code>npm run refresh</code></li>
          <li>데이터 초기화: 같은 화면서 <code>ai-compass/user</code> 키 삭제</li>
          <li>전체 자동 검증: 터미널에서 <code>npm run selfcheck</code></li>
        </ul>
      </section>
    </div>
  );
}
