import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileFilter } from '../components/MobileFilter';
import { WayfindingIcon } from '../components/WayfindingIcon';
import { learningResources } from '../data/learning-resources';
import type { ResourceKind } from '../data/learning-resources';

const kinds: ResourceKind[] = ['강의', '실습', '프로젝트', '학습 플랫폼', '역량 평가'];
export default function Resources() {
  const [kind, setKind] = useState<ResourceKind | ''>('');
  const [query, setQuery] = useState('');
  const shown = useMemo(() => learningResources.filter((item) => (!kind || item.kinds.includes(kind)) && query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean).every((word) => `${item.name} ${item.provider} ${item.description}`.toLocaleLowerCase().includes(word))), [kind, query]);
  return <div className="space-page space-library resources-page mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>학습 자료실</h1><p className="space-caption">강의부터 직접 해보는 실습과 프로젝트까지, 배움의 자료를 찾아보세요.</p></div><Link to="/certs" className="text-xs">수료증 취득 강의 보기 <WayfindingIcon /></Link></header>
    <div className="reading-layout"><a className="results-skip" href="#resources-results">결과 바로 보기</a>
      <aside className="reading-sidebar" aria-label="학습 자료 탐색"><p className="reading-label">배움의 방식 찾기</p>
        <MobileFilter summary={`${kind || '모든 자료'} · ${query ? '검색 중' : '전체 검색'}`}>
          <div className="resource-type-list" role="group" aria-label="자료 유형">
            <button type="button" aria-pressed={!kind} onClick={() => setKind('')}>전체</button>
            {kinds.map((value) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)}>{value}</button>)}
          </div>
          <label className="resource-search">자료·기관 검색<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름 또는 주제" /></label>
          <p className="resource-help">한 자료가 강의와 실습처럼 여러 유형에 함께 나타날 수 있습니다. 수료 여부와 이용 조건은 제공처에서 확인하세요.</p>
        </MobileFilter>
      </aside>
      <section id="resources-results" className="reading-results" aria-label="학습 자료 목록"><div className="results-heading"><div><span>학습관의 자료실</span><h2>배우고, 직접 해보고</h2></div><p role="status">{shown.length}개의 자료</p></div>
        <div className="resource-grid">{shown.map((item) => <article className="resource-card space-card" key={item.id}><div className="resource-badges">{item.kinds.map((value) => <span key={value}>{value}</span>)}</div><h3>{item.name}</h3><p className="resource-provider">{item.provider}</p><p className="resource-description">{item.description}</p><div className="resource-meta"><span>{item.language}</span><span>{item.cost}</span><span>확인일 {item.checked}</span></div><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} 공식 페이지 (새 탭)`}>공식 자료 보기 <WayfindingIcon direction="external" /></a></article>)}</div>
        {shown.length === 0 && <p className="qualification-empty">조건에 맞는 자료가 없습니다. 검색어나 유형을 바꿔보세요.</p>}
      </section>
    </div>
  </div>;
}
