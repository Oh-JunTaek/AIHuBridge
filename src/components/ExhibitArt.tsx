import newsDesign from '../assets/exhibit-news-design.webp';
import learningDesign from '../assets/exhibit-learning-design.webp';
import dashboardDesign from '../assets/exhibit-dashboard.webp';
import resourcesDesign from '../assets/exhibit-resources.webp';
import completionDesign from '../assets/exhibit-completion.webp';
import qualificationsDesign from '../assets/exhibit-qualifications.webp';
import socialDesign from '../assets/exhibit-social.webp';
type ExhibitKind = 'news' | 'calendar' | 'learning' | 'dashboard' | 'resources' | 'completion' | 'qualifications' | 'social';

export function ExhibitArt({ kind }: { kind: ExhibitKind }) {
  if (kind !== 'calendar') {
    const design = { news: newsDesign, learning: learningDesign, dashboard: dashboardDesign, resources: resourcesDesign, completion: completionDesign, qualifications: qualificationsDesign, social: socialDesign }[kind];
    return <div className={`reference-art reference-art-${kind}`} aria-hidden="true"><div className="reference-art-motion"><img src={design} alt="" loading="lazy" decoding="async" /></div></div>;
  }
  if (kind === 'calendar') return <div className="art-calendar calendar-scene" aria-hidden="true">
    <div className="mini-calendar"><div className="mini-calendar-heading"><strong>AI 일정</strong><span>‹ &nbsp; ›</span></div><div className="mini-calendar-grid">{['일', '월', '화', '수', '목', '금', '토'].map(day => <b key={day}>{day}</b>)}{Array.from({ length: 28 }, (_, i) => <span key={i} className={[8, 15, 23].includes(i) ? 'marked' : ''}>{i + 1}</span>)}</div></div>
    <div className="mini-agenda"><div className="mini-agenda-tabs"><i /><i /><i /></div>{[0, 1, 2].map(item => <div className="mini-event" key={item}><span className="mini-date">{['09', '16', '24'][item]}</span><span className="mini-event-lines"><i /><i /><i /></span><b /></div>)}</div>
    <span className="art-calendar-spark">✦</span>
  </div>;
  return null;
}
