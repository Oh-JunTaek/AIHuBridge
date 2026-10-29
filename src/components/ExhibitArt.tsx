import { WayfindingIcon } from './WayfindingIcon';
type ExhibitKind = 'news' | 'calendar' | 'learning' | 'certs';

export function ExhibitArt({ kind }: { kind: ExhibitKind }) {
  if (kind === 'news') return <div className="art-news" aria-hidden="true">
    <span className="news-chip chip-a">OpenAI</span><span className="news-chip chip-b">Google</span><span className="news-chip chip-c">Meta</span><span className="news-chip chip-d">Mistral</span><span className="news-chip chip-e">NVIDIA</span><span className="news-chip chip-f">논문</span>
    <span className="news-tray"><span>AI 소식</span><WayfindingIcon direction="external" /></span>
  </div>;
  if (kind === 'calendar') return <div className="art-calendar calendar-scene" aria-hidden="true">
    <div className="mini-calendar"><div className="mini-calendar-heading"><strong>AI 일정</strong><span>‹ &nbsp; ›</span></div><div className="mini-calendar-grid">{['일', '월', '화', '수', '목', '금', '토'].map(day => <b key={day}>{day}</b>)}{Array.from({ length: 28 }, (_, i) => <span key={i} className={[8, 15, 23].includes(i) ? 'marked' : ''}>{i + 1}</span>)}</div></div>
    <div className="mini-agenda"><div className="mini-agenda-tabs"><i /><i /><i /></div>{[0, 1, 2].map(item => <div className="mini-event" key={item}><span className="mini-date">{['09', '16', '24'][item]}</span><span className="mini-event-lines"><i /><i /><i /></span><b /></div>)}</div>
    <span className="art-calendar-spark">✦</span>
  </div>;
  if (kind === 'learning') return <div className="art-learning" aria-hidden="true"><div className="learning-board"><span>AI</span><i /><i /><i /></div><div className="learning-person"><span className="learning-head" /><span className="learning-body" /><span className="learning-arm" /></div><div className="learning-desk" /><div className="learning-book" /></div>;
  return <div className="art-certs" aria-hidden="true"><div className="cert-paper"><span className="cert-seal">✦</span><i /><i /><i /></div><div className="cert-ribbon"><span>✓</span></div><span className="cert-spark">✧</span></div>;
}
