import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { qualifications } from '../data/qualifications';
import { WayfindingIcon } from '../components/WayfindingIcon';

const tags = [...new Set(qualifications.flatMap((item) => item.tags))];
const classes = [...new Set(qualifications.map((item) => item.classification))];
const scheduleLink = (provider: string) => provider.includes('KT') ? 'https://aice.study/certi/examSchedule'
  : provider === '한국생산성본부' ? 'https://license.kpc.or.kr/nasec/rceptexmncnfirm/selectExprschdul.do'
  : provider === '한국데이터산업진흥원' ? 'https://www.dataq.or.kr/' : null;

export default function Qualifications() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [classification, setClassification] = useState('');
  const [language, setLanguage] = useState('');
  const [params, setParams] = useSearchParams();
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = qualifications.find((item) => item.id === params.get('exam'));
  const results = useMemo(() => qualifications.filter((item) => {
    const text = `${item.name} ${item.provider} ${item.tags.join(' ')}`.toLocaleLowerCase();
    return query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean).every((word) => text.includes(word))
      && (!tag || item.tags.includes(tag)) && (!classification || item.classification === classification)
      && (!language || item.language.includes(language));
  }), [query, tag, classification, language]);

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!selected && dialog.current?.open) dialog.current.close();
  }, [selected]);
  const close = () => { const next = new URLSearchParams(params); next.delete('exam'); setParams(next, { replace: true }); };
  const open = (id: string) => { const next = new URLSearchParams(params); next.set('exam', id); setParams(next, { replace: true }); };

  return <div className="space-page space-library qualifications-page mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>자격관</h1><p className="space-caption">컴퓨터 활용부터 AI까지, 나에게 맞는 자격시험을 찾아보세요.</p></div></header>
    <section className="qualification-filters" aria-label="자격증 검색과 필터">
      <div className="qualification-filter-heading"><div><span>자격 탐색</span><h2>나에게 맞는 자격 찾기</h2></div><p>시험 언어와 자격 종류를 비교해 보세요.</p></div>
      <div className="qualification-filter-grid">
        <label>자격증·주관사 검색<input type="search" placeholder="자격증 이름 또는 기관" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <label>분야<select value={tag} onChange={(e) => setTag(e.target.value)}><option value="">전체 분야</option>{tags.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>자격 종류<select value={classification} onChange={(e) => setClassification(e.target.value)}><option value="">전체 종류</option>{classes.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>시험 언어<select value={language} onChange={(e) => setLanguage(e.target.value)}><option value="">전체 언어</option><option>한국어</option><option>영어</option><option>일본어</option></select></label>
      </div>
      <div className="qualification-filter-footer"><p role="status">조건에 맞는 자격증 {results.length}개</p><button type="button" onClick={() => { setQuery(''); setTag(''); setClassification(''); setLanguage(''); }}>조건 초기화</button></div>
    </section>
    <section className="qualification-results" aria-label="자격증 목록">
      <div className="results-heading"><div><span>학습관의 자격 안내</span><h2>도전할 자격증 살펴보기</h2></div><p>시험 조건은 공식 페이지에서 다시 확인하세요</p></div>
      {results.length === 0 && <p className="qualification-empty">조건에 맞는 자격증이 없습니다. 검색어나 필터를 변경해 보세요.</p>}
      <div className="qualification-list">{results.map((item) => <button type="button" className="qualification-card" key={item.id} onClick={() => open(item.id)}>
        <span className="qualification-card-top"><strong>{item.name}</strong><span className="qualification-tags">{item.tags.map((value) => <span key={value}>{value}</span>)}</span></span>
        <span className="qualification-description">{item.officialExcerpt ? <>“{item.officialExcerpt}” <small>· 공식 소개 발췌</small></> : <>{item.intro} <small>· 공식 자료 기반 안내</small></>}</span>
        <span className="qualification-meta"><span>{item.provider}</span><span>{item.classification}</span><span>{item.language.join(' · ')}</span>{item.examFree === true && <span>시험 무료</span>}</span>
        <span className="qualification-arrow" aria-hidden="true"><WayfindingIcon /></span>
      </button>)}</div>
    </section>
    <dialog ref={dialog} className="qualification-dialog" aria-labelledby="qualification-dialog-title" onClose={close}>
      {selected && <div className="qualification-dialog-inner">
        <div className="qualification-dialog-heading"><div><span>자격증 상세 안내</span><h2 id="qualification-dialog-title">{selected.name}</h2><p>{selected.provider} · {selected.classification}</p></div><button type="button" className="qualification-close" aria-label="상세 안내 닫기" onClick={() => dialog.current?.close()}>×</button></div>
        <p className="qualification-dialog-intro">{selected.intro}</p>
        <dl className="qualification-details">
          <div><dt>시험 언어</dt><dd>{selected.language.join(' · ')}</dd></div>
          <div><dt>응시 방식</dt><dd>{selected.delivery}</dd></div>
          <div><dt>시험 응시료</dt><dd>{selected.fee}</dd></div>
          <div><dt>응시 조건</dt><dd>{selected.prerequisites}</dd></div>
          <div><dt>유효기간·갱신</dt><dd>{selected.validity}</dd></div>
        </dl>
        <section className="qualification-prep"><h3>시험을 준비하는 자료</h3>{selected.preparation.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"><span><strong>{item.label}</strong><small>{item.note}</small></span><WayfindingIcon direction="external" /></a>)}</section>
        <p className="qualification-evidence">정보 확인일 {selected.verifiedAt} · 시험 조건과 한국 내 예약 가능 여부는 공식 페이지에서 확인하세요.</p>
        <a className="qualification-official" href={selected.url} target="_blank" rel="noopener noreferrer">공식 시험 안내 보기 <WayfindingIcon direction="external" /></a>
        {scheduleLink(selected.provider) && <a className="qualification-schedule" href={scheduleLink(selected.provider)!} target="_blank" rel="noopener noreferrer">공식 일정·접수 확인 <WayfindingIcon direction="external" /></a>}
      </div>}
    </dialog>
  </div>;
}
