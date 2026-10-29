import { WayfindingIcon } from '../components/WayfindingIcon';
import { Link } from 'react-router-dom';
import { ExhibitArt } from '../components/ExhibitArt';
import { BookIcon, BadgeIcon, ClockIcon, CompassIcon } from '../components/icons';

const exhibits = [
  { to: '/updates', title: 'AI 소식', description: 'AI의 새로운 소식과 연구를 살펴보세요.', Icon: CompassIcon, style: 'news' },
  { to: '/calendar', title: 'AI 캘린더', description: '관심 있는 AI 행사와 일정을 찾아보세요.', Icon: ClockIcon, style: 'calendar' },
  { to: '/path', title: '추천 커리큘럼', description: '기초부터 이어지는 학습 경로를 만나보세요.', Icon: BookIcon, style: 'learning' },
  { to: '/certs', title: '교육·인증', description: '다양한 교육 과정과 인증 정보를 확인하세요.', Icon: BadgeIcon, style: 'certs' },
];

export default function Home() {
  return <div className="landing">
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-image" aria-hidden="true" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bridge-exhibition.webp)` }} />
      <div className="landing-hero-content">
        <h1 id="landing-title">AI의 세계로<br />이어지는 다리</h1>
        <p>소식부터 배움까지, 한곳에서 만나다.</p>
        <Link className="landing-button" to="/dashboard">대시보드 보기 <WayfindingIcon /></Link>
      </div>
    </section>
    <section className="exhibition" aria-labelledby="exhibition-title">
      <div className="exhibition-intro">
        <span>AI 허브릿지</span>
        <h2 id="exhibition-title">AI와 사람이 만나는<br />지식의 공간</h2>
        <p>AI의 흐름을 살펴보고,<br />나에게 필요한 배움을 찾아보세요.</p>
      </div>
      <div className="exhibition-grid">
        {exhibits.map(({ to, title, description, Icon, style }) => <Link className={`exhibit-card exhibit-${style}`} to={to} key={to}>
          <div className="exhibit-art"><ExhibitArt kind={style as 'news' | 'calendar' | 'learning' | 'certs'} /></div>
          <div className="exhibit-copy"><Icon className="exhibit-icon" aria-hidden="true" /><h3>{title}</h3><p>{description}</p><WayfindingIcon className="exhibit-arrow" /></div>
        </Link>)}
      </div>
    </section>
  </div>;
}
