import { useEffect, useId, useState, type ReactNode } from 'react';

export function MobileFilter({ summary, children }: { summary: string; children: ReactNode }) {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <>
    <button type="button" className="mobile-filter-toggle" aria-expanded={!mobile || expanded} aria-controls={id} onClick={() => setExpanded((value) => !value)}>
      <span><strong>탐색 조건</strong><small>{summary}</small></span><span aria-hidden="true">{expanded ? '−' : '+'}</span>
    </button>
    <div id={id} className="mobile-filter-content" hidden={mobile && !expanded}>{children}</div>
  </>;
}
