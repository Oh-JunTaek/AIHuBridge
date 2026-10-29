type ExhibitKind = 'news' | 'calendar' | 'learning' | 'certs';

export function ExhibitArt({ kind }: { kind: ExhibitKind }) {
  if (kind === 'news') return <div className="art-news" aria-hidden="true">
    <span className="news-chip chip-a">OpenAI</span><span className="news-chip chip-b">Google</span><span className="news-chip chip-c">Meta</span><span className="news-chip chip-d">Mistral</span><span className="news-chip chip-e">NVIDIA</span><span className="news-chip chip-f">논문</span>
    <span className="news-tray"><span>AI 소식</span><span>↗</span></span>
  </div>;
  if (kind === 'calendar') return <div className="art-calendar" aria-hidden="true"><div className="calendar-sheet"><div className="calendar-rings"><i /><i /></div><div className="calendar-sheet-head">AI 일정</div><div className="calendar-dots">{Array.from({ length: 21 }, (_, i) => <span key={i} className={[3, 9, 15, 18].includes(i) ? 'marked' : ''} />)}</div></div><span className="art-calendar-spark">✦</span><span className="art-calendar-orbit" /></div>;
  if (kind === 'learning') return <div className="art-learning" aria-hidden="true"><div className="learning-board"><span>AI</span><i /><i /><i /></div><div className="learning-person"><span className="learning-head" /><span className="learning-body" /><span className="learning-arm" /></div><div className="learning-desk" /><div className="learning-book" /></div>;
  return <div className="art-certs" aria-hidden="true"><div className="cert-paper"><span className="cert-seal">✦</span><i /><i /><i /></div><div className="cert-ribbon"><span>✓</span></div><span className="cert-spark">✧</span></div>;
}
