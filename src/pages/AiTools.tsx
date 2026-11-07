import { useMemo, useState } from 'react';
import { aiTools, type ToolKind } from '../data/ai-tools';

const kinds: ToolKind[] = ['학습·자료', '논문·검색', '번역·글쓰기', '디자인', '코딩'];

export default function AiTools() {
  const [kind, setKind] = useState<ToolKind | ''>('');
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return aiTools.filter((item) => (!kind || item.kinds.includes(kind)) && words.every((word) => `${item.name} ${item.provider} ${item.description} ${item.example} ${item.kinds.join(' ')}`.toLocaleLowerCase().includes(word)));
  }, [kind, query]);
  return <div className="space-page space-library mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>AI 도구함</h1><p className="space-caption">공부와 작업에 활용할 수 있는 AI 도구를 찾아보세요.</p></div></header>
    <div className="reading-layout"><a href="#tools-results" className="results-skip">결과 바로 보기</a>
      <aside className="reading-sidebar" aria-label="도구 탐색"><p className="reading-label">어떤 도움이 필요하세요?</p>
        <div className="resource-type-list" role="group" aria-label="활용 분야"><button type="button" aria-pressed={!kind} onClick={() => setKind('')}>전체</button>{kinds.map((value) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)}>{value}</button>)}</div>
        <label className="resource-search">도구·용도 검색<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 논문, 번역, 코딩" /></label>
        <button type="button" className="mt-3 text-sm underline" onClick={() => { setKind(''); setQuery(''); }}>조건 초기화</button>
        <p className="resource-help">무료 이용 범위와 한도는 변경될 수 있습니다. 개인정보나 민감한 자료를 입력하기 전 제공처의 정책을 확인하세요.</p>
      </aside>
      <section id="tools-results" className="reading-results" aria-label="AI 도구 목록"><div className="results-heading"><div><span>가볍게 시작하는 AI</span><h2>필요할 때 꺼내 쓰는 도구</h2></div><p role="status">{shown.length}개의 도구</p></div>
        <div className="grid gap-4 md:grid-cols-2">{shown.map((tool) => <article key={tool.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-semibold text-blue-700">{tool.provider}</p><h3 className="mt-1 text-lg font-bold text-stone-900">{tool.name}</h3></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{tool.free}</span></div>
          <p className="mt-3 text-sm leading-6 text-stone-700">{tool.description}</p><p className="mt-2 text-sm text-stone-600"><strong>이렇게 활용해요</strong> · {tool.example}</p>
          <p className="mt-3 text-xs leading-5 text-stone-600">{tool.limits} {tool.account}</p><p className="mt-2 text-xs text-stone-500">{tool.kinds.join(' · ')} · 조건 확인 {tool.checked}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm"><a className="font-semibold text-blue-800 underline" href={tool.url} target="_blank" rel="noopener noreferrer">도구 열기 (새 탭)</a><a className="text-stone-600 underline" href={tool.evidence} target="_blank" rel="noopener noreferrer">무료 조건 확인 (새 탭)</a></div>
        </article>)}</div>
        {!shown.length && <p className="qualification-empty">조건에 맞는 도구가 없습니다. 검색어나 분야를 바꿔보세요.</p>}
      </section>
    </div>
  </div>;
}
