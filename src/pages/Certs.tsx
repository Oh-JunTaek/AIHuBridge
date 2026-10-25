import { useEffect, useState } from 'react';
import { certifications } from '../data/certifications';
import { selectCertifications } from '../lib/cert-rules.mjs';
import { CertCard } from '../components/CertCard';
import { useT } from '../lib/i18n';
import type { CertType } from '../types';
import { Link } from 'react-router-dom';

export default function Certs() {
  const t = useT();
  const [tab, setTab] = useState<CertType>('course');
  const [language, setLanguage] = useState('');
  const [cost, setCost] = useState('');
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const shown = selectCertifications(certifications, { type: tab, language, cost, query }, now);

  const tabs: { id: CertType; label: string; emoji: string }[] = [
    { id: 'course', label: '학습 과정', emoji: '📚' },
    { id: 'exam', label: '수험 인증', emoji: '🎯' },
    { id: 'micro', label: '스킬 배지', emoji: '🎖️' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('certs.title')}</h1>
        <Link to="/path" className="text-xs underline">
          {t('certs.back')}
        </Link>
      </header>

      <nav aria-label="교육·인증 유형" className="mb-4 flex flex-wrap gap-2 text-sm">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            aria-pressed={tab === tb.id}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium ${
              tab === tb.id
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            <span>{tb.emoji} {t('certs.tab.' + tb.id)}</span>
          </button>
        ))}
      </nav>

      <p className="mb-4 text-xs text-stone-500 dark:text-stone-400">{t('certs.note')}</p>

      <section aria-label="교육 탐색 조건" className="mb-5 rounded-xl border border-stone-200 p-4 dark:border-stone-700">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">교육·기관 검색<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름·기관·시험 코드" className="min-w-0 rounded-lg border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-600" /></label>
          <label className="grid gap-1 text-sm">제공 언어<select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900"><option value="">전체 언어</option><option value="ko">한국어 포함</option><option value="en">영어 포함</option><option value="unknown">미확인</option></select></label>
          <label className="grid gap-1 text-sm">비용 조건<select value={cost} onChange={(event) => setCost(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900"><option value="">전체 비용</option><option value="learning-free">학습·준비 무료</option><option value="credential-free">수료증·평가 무료</option><option value="unknown">비용 미확인 포함</option></select></label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm"><p role="status">조건에 맞는 항목 {shown.length}개</p><button type="button" className="rounded-lg px-3 py-2 text-amber-700 dark:text-amber-300" onClick={() => { setLanguage(''); setCost(''); setQuery(''); }}>조건 초기화</button></div>
      </section>
      {!shown.length && <p className="py-6 text-sm">조건에 맞는 교육이 없습니다. 다른 유형을 선택하거나 조건을 초기화해 보세요.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((c) => (
          <CertCard
            key={c.id}
            c={c}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">{t('certs.footer')}</p>
    </div>
  );
}
