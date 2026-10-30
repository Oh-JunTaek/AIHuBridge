import { MobileFilter } from '../components/MobileFilter';
import { useEffect, useState } from 'react';
import { certifications } from '../data/certifications';
import { selectCertifications } from '../lib/cert-rules.mjs';
import { CertCard } from '../components/CertCard';
import { useT } from '../lib/i18n';
import { Link } from 'react-router-dom';

// 공식 과정별 수료증 발급을 확인한 항목만 수료증 취득 강의에 노출한다.
const completionCourseIds = new Set(['dlai-prompting', 'hf-agents', 'google-ai-essentials', 'coursera-ai-for-everyone']);

export default function Certs() {
  const t = useT();
  const [language, setLanguage] = useState('');
  const [cost, setCost] = useState('');
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const shown = selectCertifications(certifications.filter((course) => completionCourseIds.has(course.id)), { type: 'course', language, cost, query }, now);

  return (
    <div className="space-page space-library space-certs mx-auto max-w-6xl px-4 py-6">
      <header className="space-header mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div><p className="space-label">학습관</p><h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('certs.title')}</h1><p className="space-caption">수료증을 받을 수 있는 교육과정을 살펴보세요.</p></div>
        <Link to="/path" className="text-xs underline">
          {t('certs.back')}
        </Link>
      </header>

      <div className="reading-layout">
      <a className="results-skip" href="#reading-results">결과 바로 보기</a>
      <aside className="reading-sidebar" aria-label="수료 과정 탐색">
      <p className="reading-label">배움의 자료 살펴보기</p>
      <MobileFilter summary={`수료 과정 · ${[language, cost, query].filter(Boolean).length ? `추가 조건 ${[language, cost, query].filter(Boolean).length}개` : '전체 조건'}`}>

      <Link to="/qualifications" className="qualification-catalog-link">자격시험은 자격증 도전에서 살펴보기 →</Link>

      <p className="mb-4 text-xs text-stone-500 dark:text-stone-400">{t('certs.note')}</p>

      <section aria-label="교육 탐색 조건" className="mb-5 rounded-xl border border-stone-200 p-4 dark:border-stone-700">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm">교육·기관 검색<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름·기관·시험 코드" className="min-w-0 rounded-lg border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-600" /></label>
          <label className="grid gap-1 text-sm">제공 언어<select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900"><option value="">전체 언어</option><option value="ko">한국어 포함</option><option value="en">영어 포함</option><option value="unknown">미확인</option></select></label>
          <label className="grid gap-1 text-sm">비용 조건<select value={cost} onChange={(event) => setCost(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900"><option value="">전체 비용</option><option value="learning-free">학습·준비 무료</option><option value="credential-free">수료증·평가 무료</option><option value="unknown">비용 미확인 포함</option></select></label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm"><p role="status">조건에 맞는 항목 {shown.length}개</p><button type="button" className="rounded-lg px-3 py-2 text-amber-700 dark:text-amber-300" onClick={() => { setLanguage(''); setCost(''); setQuery(''); }}>조건 초기화</button></div>
      </section>
      </MobileFilter>
      </aside>
      <section id="reading-results" className="reading-results" aria-label="수료 과정 목록">
      <div className="results-heading"><div><span>학습관의 자료실</span><h2>나에게 필요한 배움</h2></div><p>비용과 조건은 공식 페이지에서 확인하세요</p></div>
      {!shown.length && <p className="py-6 text-sm">조건에 맞는 수료 과정이 없습니다. 검색어나 조건을 변경해 보세요.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((c) => (
          <CertCard
            key={c.id}
            c={c}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">{t('certs.footer')}</p>
      </section>
      </div>
    </div>
  );
}
