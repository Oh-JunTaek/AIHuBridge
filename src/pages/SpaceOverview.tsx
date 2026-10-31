import { Link } from 'react-router-dom';
import { ExhibitArt } from '../components/ExhibitArt';
import { WayfindingIcon } from '../components/WayfindingIcon';

const spaces = {
  learning: {
    label: '배움을 이어가는 공간',
    title: '학습관',
    description: '처음 만나는 개념부터 실습과 자격증까지, 나에게 맞는 배움을 찾아보세요.',
    heading: '어디서부터 시작해 볼까요?',
    items: [
      { to: '/careers', title: '직무 둘러보기', description: '관심 있는 일과 그에 필요한 배움을 만나보세요.', kind: 'career' },
      { to: '/path', title: '추천 커리큘럼', description: '기초부터 차근차근 이어지는 학습 경로를 만나보세요.', kind: 'learning' },
      { to: '/resources', title: '학습 자료실', description: '강의와 실습, 프로젝트 등 다양한 배움의 자료를 찾아보세요.', kind: 'resources' },
      { to: '/certs', title: '수료증 취득 강의', description: '배움을 마친 뒤 수료증을 받을 수 있는 강의를 살펴보세요.', kind: 'completion' },
      { to: '/qualifications', title: '자격증 도전', description: '컴퓨터 활용부터 AI까지, 자격시험과 준비 자료를 알아보세요.', kind: 'qualifications' },
    ],
  },
  information: {
    label: '새로운 흐름을 만나는 공간',
    title: '정보관',
    description: 'AI 소식부터 행사와 기업의 이야기까지, 변화하는 흐름을 살펴보세요.',
    heading: '관심 있는 소식을 찾아보세요',
    items: [
      { to: '/updates', title: 'AI 소식', description: 'AI 관련 보도와 공식 발표, 연구 논문을 살펴보세요.', kind: 'news' },
      { to: '/calendar', title: 'AI 캘린더', description: '관심 있는 교육과 행사 일정을 찾아보세요.', kind: 'calendar' },
      { to: '/social', title: '기업 SNS', description: 'AI 기업과 관계자가 전하는 이야기를 원문으로 만나보세요.', kind: 'social' },
    ],
  },
} as const;

export default function SpaceOverview({ kind }: { kind: keyof typeof spaces }) {
  const space = spaces[kind];
  return <div className={`space-page ${kind === 'learning' ? 'space-library' : 'space-plaza'} mx-auto max-w-6xl px-4 py-6`}>
    <header className="space-header mb-6"><div><p className="space-label">{space.label}</p><h1>{space.title}</h1><p className="space-caption">{space.description}</p></div></header>
    <section className="space-overview" aria-labelledby="space-overview-heading">
      <div className="space-overview-heading"><span>AI 허브릿지의 {space.title}</span><h2 id="space-overview-heading">{space.heading}</h2></div>
      <div className="space-overview-grid">{space.items.map((item, index) => <Link className={`space-overview-card exhibit-card exhibit-${item.kind}`} to={item.to} key={item.to}>
        <div className="space-overview-art exhibit-art"><ExhibitArt kind={item.kind} /></div>
        <div className="space-overview-copy"><span className="space-overview-number">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.description}</p><span className="space-overview-link">살펴보기 <WayfindingIcon /></span></div>
      </Link>)}</div>
    </section>
  </div>;
}
