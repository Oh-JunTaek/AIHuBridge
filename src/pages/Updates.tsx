import { AutoLoadMore } from '../components/AutoLoadMore';
import { useState, useMemo, useEffect } from 'react';
import { useNews } from '../lib/use-news';
import { NewsStatus } from '../components/NewsStatus';
import { filterNews } from '../lib/news';
import { NewsCard } from '../components/NewsCard';
import { useT } from '../lib/i18n';
import { topicGroups, opennessLabels, publicationLabels, paperKinds, companies } from '../lib/news-facets.mjs';
import { NEWS_DEFAULT_DAYS } from '../lib/content-retention.mjs';

export default function Updates() {
  const { result, loading, reload, now } = useNews();
  const items = useMemo(() => filterNews(result?.items ?? [], { now }), [result, now]);
  const [days, setDays] = useState(String(NEWS_DEFAULT_DAYS));

  const categories = ['전체', 'models', '업계/제품', '연구/논문', '정책/규제', '오픈소스', '언론'];
  const [active, setActive] = useState('전체');
  const [lang, setLang] = useState('');
  const [source, setSource] = useState('');
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState('');
  const [topic, setTopic] = useState('');
  const [openness, setOpenness] = useState('');
  const [publication, setPublication] = useState('');
  const [paperKind, setPaperKind] = useState('');
  const [company, setCompany] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const group = ({ models: 'models', '업계/제품': 'products', '연구/논문': 'papers', '정책/규제': 'policy', '오픈소스': 'software', '언론': 'media' } as Record<string, string>)[active];
  const sources = useMemo(() => [...new Set(items.map((item) => item.source))].sort(), [items]);
  const t = useT();

  const shown = useMemo(() => filterNews(items, { category: ['전체', 'models'].includes(active) ? undefined : active, modelsOnly: active === 'models', lang, source, query, origin, topicGroup: group, topic, openness, publication, paperKind, company, days: days === 'all' ? undefined : Number(days), now }),
    [items, active, lang, source, query, origin, group, topic, openness, publication, paperKind, company, days, now]);
  useEffect(() => setVisibleCount(24), [active, lang, source, query, origin, topic, openness, publication, paperKind, company, days]);
  const changeCategory = (category: string) => { setActive(category); setTopic(''); setOpenness(''); setPublication(''); setPaperKind(''); setCompany(''); };
  const clear = () => { changeCategory('전체'); setLang(''); setSource(''); setQuery(''); setOrigin(''); setCompany(''); setDays(String(NEWS_DEFAULT_DAYS)); };
  const selectStyle = 'min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900';

  return (
    <div className="space-page space-plaza space-news mx-auto max-w-6xl px-4 py-6">
      <header className="space-header mb-6">
        <p className="space-label">정보관</p>
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{t('updates.title')}</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {t('updates.sub', items.length)}
        </p>
      </header>

      <div className="reading-layout">
      <a className="results-skip" href="#reading-results">결과 바로 보기</a>
      <aside className="reading-sidebar" aria-label="소식 탐색">
      <p className="reading-label">관심 있는 소식 찾기</p>
      <nav aria-label="소식 분야" className="mb-5 flex flex-wrap gap-2 text-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            aria-pressed={active === c}
            className={`rounded-full px-3 py-1 font-medium ${
              active === c
                ? 'bg-blue-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            {c === '전체' ? t('path.filterAll') : c === 'models' ? '모델 소식' : t('category.' + c)}
          </button>
        ))}
      </nav>

      <div role="group" aria-label="출처 지역" className="mb-4 flex gap-2 text-sm">
        {[{value:'',label:'전체 출처'}, {value:'domestic',label:'국내 출처'}].map((option) => <button type="button" key={option.value} aria-pressed={origin === option.value} onClick={() => setOrigin(option.value)} className={`rounded-lg px-4 py-2 ${origin === option.value ? 'bg-blue-900 text-white' : 'bg-stone-100 dark:bg-stone-800'}`}>{option.label}</button>)}
      </div>

      <section aria-label="소식 탐색 조건" className="mb-5 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900">
        <p className="mb-3 text-xs text-stone-500 dark:text-stone-400">기본 최근 7일 · 일반 소식 30일, 모델 소식 90일, 논문 180일 보관. 기간을 바꾸면 이전 자료도 검색할 수 있습니다.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">게시 기간<select value={days} onChange={(event) => setDays(event.target.value)} className={selectStyle}><option value="7">최근 7일</option><option value="30">최근 30일</option><option value="90">최근 90일</option><option value="180">최근 180일</option><option value="all">보관 중인 전체 기간</option></select></label>
          <label className="grid gap-1 text-sm">검색어
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목·주제·출처 검색"
              className="min-w-0 rounded-lg border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-600" />
          </label>
          <label className="grid gap-1 text-sm">자료 언어
            <select value={lang} onChange={(event) => setLang(event.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900">
              <option value="">전체 언어</option><option value="ko">한국어</option><option value="en">영어</option><option value="unknown">미확인</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">제공처
            <select value={source} onChange={(event) => setSource(event.target.value)} className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-900">
              <option value="">전체 제공처</option>{sources.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>
        {group && <fieldset className="mt-4 border-t border-stone-200 pt-4 dark:border-stone-700">
          <legend className="px-1 text-sm font-semibold">{active === 'models' ? '모델 소식' : t('category.' + active)} 세부 필터</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">{active === 'models' ? '모델 유형' : '세부 주제'}<select value={topic} onChange={(event) => setTopic(event.target.value)} className={selectStyle}><option value="">{active === 'models' ? '전체 모델 유형' : '전체 주제'}</option>{Object.entries(topicGroups[group]).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
            <label className="grid gap-1 text-sm">기업 언급<select value={company} onChange={(event) => setCompany(event.target.value)} className={selectStyle}><option value="">전체 기업</option>{companies.map((name)=><option key={name} value={name}>{name}</option>)}</select></label>
            {['models', 'software'].includes(group) && <label className="grid gap-1 text-sm">공개 방식 언급<select value={openness} onChange={(event) => setOpenness(event.target.value)} className={selectStyle}><option value="">전체 공개 방식</option>{Object.entries(opennessLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>}
            <label className="grid gap-1 text-sm">출처 유형<select value={publication} onChange={(event) => setPublication(event.target.value)} className={selectStyle}><option value="">전체 출처 유형</option>{Object.entries(publicationLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
            {group === 'papers' && <label className="grid gap-1 text-sm">논문 유형<select value={paperKind} onChange={(event) => setPaperKind(event.target.value)} className={selectStyle}><option value="">전체 논문 유형</option>{Object.entries(paperKinds).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>}
          </div>
          {group === 'papers' && <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">최신 AI 논문의 제목·초록 키워드로 분야와 유형을 분류합니다. 출판 전 논문을 포함하며 중요도·성능·동료평가 여부를 보증하지 않습니다.</p>}
        </fieldset>}
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <p role="status">검색 결과 {shown.length}건 / 전체 {items.length}건</p>
          <button type="button" onClick={clear}
            className="rounded-lg px-3 py-2 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-stone-800">조건 초기화</button>
        </div>
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">국내 출처는 국내·한국어 편집 제공처 기준이며 자료가 다루는 국가나 자료 언어와는 다릅니다. 분야·세부 주제와 공개 방식은 원문 분류 코드·제목·설명문으로 분류하며 모델 라이선스를 검증한 결과가 아닙니다. 조건은 저장하지 않습니다.</p>
      </section>

      </aside>
      <section id="reading-results" className="reading-results" aria-label="AI 소식 목록">
      <div className="results-heading"><div><span>정보관의 소식</span><h2>지금 살펴볼 이야기</h2></div><p>원문을 직접 확인할 수 있습니다</p></div>
      <NewsStatus result={result} loading={loading} onRetry={reload} />
      {!loading && result?.status === 'success' && shown.length === 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{t('updates.empty')}</p>
      )}

      <div className="news-list mt-4 grid gap-4">
        {shown.slice(0, visibleCount).map((it) => (
          <NewsCard key={it.id} item={it} />
        ))}
      </div>
      <AutoLoadMore visible={visibleCount} total={shown.length} label="소식" onLoad={() => setVisibleCount((count) => count + 24)} />

      </section>
      </div>
    </div>
  );
}
