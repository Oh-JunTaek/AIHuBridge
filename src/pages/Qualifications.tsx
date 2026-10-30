import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { qualifications } from '../data/qualifications';
import { groupOf, groupResults } from '../lib/qualification-groups.mjs';
import { MobileFilter } from '../components/MobileFilter';
import { WayfindingIcon } from '../components/WayfindingIcon';
import kdataSymbol from '../assets/kdata-symbol.png';
import kpcSymbol from '../assets/kpc-symbol.png';
import korchamSymbol from '../assets/korcham-symbol.png';
import hrdkSymbol from '../assets/hrdk-symbol.svg';
import aiceSymbol from '../assets/aice-symbol.png';

const providerSymbols: Record<string, string> = {
  '한국데이터산업진흥원': kdataSymbol,
  '한국생산성본부': kpcSymbol,
  '대한상공회의소': korchamSymbol,
  '한국산업인력공단': hrdkSymbol,
  'KT · 한국경제신문': aiceSymbol,
};

const passRates: Record<string, { year: number; practical: number; written: number; url: string }> = { 'information-processing-engineer': { year: 2025, practical: 22.1, written: 65, url: 'https://www.q-net.or.kr/crf005.do?gId=&gSite=Q&id=crf00503s01&jmCd=1320&jmInfoDivCcd=B0&jmNm=' } };
const currentRate = (id: string) => { const rate = passRates[id]; return rate?.year === new Date().getFullYear() - 1 ? rate : undefined; };
const rateClass = (id: string) => { const rate = currentRate(id); return !rate ? 'unknown' : rate.practical <= 25 ? 'low' : rate.practical <= 50 ? 'mid' : 'high'; };
const tags = ['AI', '데이터', '클라우드', '보안', '컴퓨터 활용', '개발'];
const categoryOf = (item: (typeof qualifications)[number]) => tags.filter((tag) => tag === 'AI' ? item.tags.some((value) => value !== 'AI 관련 기반' && /AI|ML|LLM|프롬프트/.test(value)) : tag === '개발' ? item.tags.includes('소프트웨어 개발') : item.tags.includes(tag));
const displayClass = (value: string) => value === '등록민간자격 · 국가공인 아님' ? '민간자격' : value;
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
      && (!tag || categoryOf(item).includes(tag)) && (!classification || item.classification === classification)
      && (!language || item.language.includes(language));
  }).sort((a, b) => a.name.localeCompare(b.name, 'ko', { numeric: true })), [query, tag, classification, language]);
  const visibleResults = groupResults(results);
  const selectedGroup = selected ? groupOf(selected.id) : undefined;

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!selected && dialog.current?.open) dialog.current.close();
  }, [selected]);
  const close = () => { const next = new URLSearchParams(params); next.delete('exam'); setParams(next, { replace: true }); };
  const open = (id: string) => { const next = new URLSearchParams(params); next.set('exam', id); setParams(next, { replace: true }); };

  return <div className="space-page space-library qualifications-page mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>자격증 도전</h1><p className="space-caption">컴퓨터 활용부터 AI까지, 나에게 맞는 자격시험을 찾아보세요.</p></div></header>
    <div className="reading-layout qualification-layout"><aside className="reading-sidebar qualification-filters" aria-label="자격증 검색과 필터"><MobileFilter summary={`${tag || '전체 분야'} · ${classification || '전체 자격'}`}>
      <div className="qualification-filter-grid">
        <div className="qualification-category"><span>분야</span><div>{tags.map((value, index) => <button type="button" key={value} aria-pressed={tag === value} onClick={() => setTag(tag === value ? '' : value)}><span aria-hidden="true">{['✦', '▤', '☁', '◇', '▣', '⌘'][index]}</span> {value}</button>)}</div></div>
        <label>자격 종류<select value={classification} onChange={(e) => setClassification(e.target.value)}><option value="">전체 종류</option>{classes.map((value) => <option key={value} value={value}>{displayClass(value)}</option>)}</select></label>
        <label>시험 언어<select value={language} onChange={(e) => setLanguage(e.target.value)}><option value="">전체 언어</option><option>한국어</option><option>영어</option><option>일본어</option></select></label>
      </div>
      <div className="qualification-filter-footer"><p role="status">조건에 맞는 자격증 {visibleResults.length}개</p><button type="button" onClick={() => { setQuery(''); setTag(''); setClassification(''); setLanguage(''); }}>조건 초기화</button></div>
    </MobileFilter></aside>
    <section className="qualification-results" aria-label="자격증 목록">
      <div className="results-heading"><div><span>학습관의 자격 안내</span><h2>자격증</h2></div></div>
      <label className="qualification-search"><span className="sr-only">자격증·주관사 검색</span><input type="search" placeholder="자격증 이름 또는 주관사 검색" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      {results.length === 0 && <p className="qualification-empty">조건에 맞는 자격증이 없습니다. 검색어나 필터를 변경해 보세요.</p>}
      <div className="qualification-list">{visibleResults.map((item) => <button type="button" className={`qualification-card rate-${rateClass(item.id)}${providerSymbols[item.provider] ? ' has-provider-symbol' : ''}`} key={item.id} onClick={() => open(item.id)}>
        <span className="qualification-card-top"><strong>{groupOf(item.id)?.name ?? item.name}</strong><span className="qualification-tags">{categoryOf(item).map((value) => <span key={value}>{value}</span>)}</span></span>
        <span className="qualification-card-middle"><span className="qualification-description">{item.id.startsWith('computer-skills-') ? '스프레드시트와 데이터베이스 등 컴퓨터 활용 능력을 평가합니다.' : item.intro}</span>{providerSymbols[item.provider] && <img className="qualification-provider-symbol" src={providerSymbols[item.provider]} alt="" aria-hidden="true" />}</span>
        <span className="qualification-meta"><span>{item.provider}</span><span>{[...new Set((groupOf(item.id)?.ids.map((id) => qualifications.find((entry) => entry.id === id)).filter((entry) => entry && results.includes(entry)).map((entry) => displayClass(entry!.classification)) ?? [displayClass(item.classification)]))].join(' · ')}</span><span>{item.language.join(' · ')}</span>{currentRate(item.id) && <span>{currentRate(item.id)?.year}년 실기 합격률 {currentRate(item.id)?.practical}%</span>}{item.examFree === true && <span>시험 무료</span>}</span>
        <span className="qualification-arrow" aria-hidden="true"><WayfindingIcon /></span>
      </button>)}</div>
    </section></div>
    <dialog ref={dialog} className="qualification-dialog" aria-labelledby="qualification-dialog-title" onClose={close}>
      {selected && <div className="qualification-dialog-inner">
        <div className="qualification-dialog-heading"><div><span>자격증 상세 안내</span><h2 id="qualification-dialog-title">{selected.name}</h2><p>{selected.provider} · {displayClass(selected.classification)}</p></div><button type="button" className="qualification-close" aria-label="상세 안내 닫기" onClick={() => dialog.current?.close()}>×</button></div>
        {selectedGroup && <div className="qualification-levels" role="group" aria-label="급수 선택">{selectedGroup.ids.map((id) => { const level = qualifications.find((item) => item.id === id); return level && <button key={id} type="button" aria-pressed={selected.id === id} onClick={() => open(id)}>{level.name.replace(selectedGroup.name, '').trim()}</button>; })}</div>}<p className="qualification-dialog-intro">{selected.intro}</p>
        <dl className="qualification-details">
          <div><dt>시험 언어</dt><dd>{selected.language.join(' · ')}</dd></div>
          <div><dt>응시 방식</dt><dd>{selected.delivery}</dd></div>
          <div><dt>시험 응시료</dt><dd>{selected.fee}</dd></div>
          <div><dt>응시 조건</dt><dd>{selected.prerequisites}</dd></div>
          <div><dt>유효기간·갱신</dt><dd>{selected.validity}</dd></div>
        </dl>
        {currentRate(selected.id) && <div className="qualification-rate-detail"><strong>{currentRate(selected.id)?.year}년 합격률</strong><p>필기 {currentRate(selected.id)?.written}% · 실기 {currentRate(selected.id)?.practical}%</p><p>각 단계 응시자 기준이며 최종 취득률이나 개인의 난이도를 뜻하지 않습니다.</p><a href={currentRate(selected.id)?.url} target="_blank" rel="noopener noreferrer">공식 통계 보기 <WayfindingIcon direction="external" /></a></div>}
        <p className="qualification-evidence">정보 확인일 {selected.verifiedAt} · 시험 조건과 한국 내 예약 가능 여부는 공식 페이지에서 확인하세요.</p>
        <a className="qualification-official" href={selected.url} target="_blank" rel="noopener noreferrer">공식홈페이지 방문 <WayfindingIcon direction="external" /></a>
        {scheduleLink(selected.provider) && <a className="qualification-schedule" href={scheduleLink(selected.provider)!} target="_blank" rel="noopener noreferrer">공식 일정·접수 확인 <WayfindingIcon direction="external" /></a>}
        <section className="qualification-prep"><h3>시험을 준비하는 자료</h3>{selected.preparation.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"><span><strong>{item.label}</strong><small>{item.note}</small></span><WayfindingIcon direction="external" /></a>)}</section>
      </div>}
    </dialog>
  </div>;
}
