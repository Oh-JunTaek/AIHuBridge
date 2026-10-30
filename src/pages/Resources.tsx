import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileFilter } from '../components/MobileFilter';
import { WayfindingIcon } from '../components/WayfindingIcon';
import { learningResources } from '../data/learning-resources';
import type { ResourceKind, LearningResource } from '../data/learning-resources';
import { LearningVisual } from '../components/LearningVisual';
import { LearningDialog } from '../components/LearningDialog';

const kinds: ResourceKind[] = ['강의', '실습', '프로젝트', '학습 플랫폼', '역량 평가'];
export default function Resources() {
  const [kind, setKind] = useState<ResourceKind | ''>('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LearningResource | null>(null);
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
        <div className="learning-list">{shown.map((item) => <button type="button" className="learning-list-card" key={item.id} onClick={() => setSelected(item)}><span className="learning-list-main"><span className="learning-list-heading"><strong>{item.name}</strong><span className="learning-list-tags">{item.kinds.map((value) => <span className="learning-list-tag" key={value}>{value}</span>)}</span></span><span className="learning-list-description">{item.description}</span><span className="learning-list-meta">{item.provider} · {item.language}</span></span><LearningVisual kind={item.kinds.includes('프로젝트') ? 'project' : item.kinds.includes('실습') ? 'practice' : item.kinds.includes('학습 플랫폼') ? 'platform' : item.kinds.includes('역량 평가') ? 'assessment' : 'course'} /><span className="learning-list-arrow" aria-hidden="true"><WayfindingIcon /></span></button>)}</div>
        {shown.length === 0 && <p className="qualification-empty">조건에 맞는 자료가 없습니다. 검색어나 유형을 바꿔보세요.</p>}
      </section>
    </div>
    <LearningDialog title={selected?.name ?? ''} open={!!selected} onClose={() => setSelected(null)}>{selected && <><p className="qualification-dialog-intro">{selected.description}</p><dl className="qualification-details"><div><dt>제공 기관</dt><dd>{selected.provider}</dd></div><div><dt>자료 유형</dt><dd>{selected.kinds.join(' · ')}</dd></div><div><dt>언어</dt><dd>{selected.language}</dd></div><div><dt>비용·이용 조건</dt><dd>{selected.cost}</dd></div></dl><p className="qualification-evidence">확인일 {selected.checked} · 최신 조건은 제공처에서 확인하세요.</p><a href={selected.url} target="_blank" rel="noopener noreferrer" className="qualification-official" aria-label={`${selected.name} 공식 페이지 (새 탭)`}>공식 자료 보기 <WayfindingIcon direction="external" /></a></>}</LearningDialog>
  </div>;
}
