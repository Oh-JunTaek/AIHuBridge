import { Link, useParams } from 'react-router-dom';
import { careers } from '../data/careers';
import { WayfindingIcon } from '../components/WayfindingIcon';
import { FundedTraining } from '../components/FundedTraining';
import { journeys } from '../data/journeys';
import { Work24Events, Work24Occupation } from '../components/Work24Career';

export default function Careers() {
  const { careerId } = useParams();
  const career = careers.find((item) => item.id === careerId);
  return <div className="space-page space-plaza career-page mx-auto max-w-6xl px-4 py-6">
    <header className="space-header"><div><p className="space-label">정보관 · 새로운 기회를 만나는 곳</p><h1>채용관</h1><p className="space-caption">관심 있는 직무와 채용행사, 필요한 훈련을 함께 살펴보세요.</p></div></header>
    {careerId && !career ? <section className="career-detail"><h2>직무를 찾을 수 없습니다</h2><Link to="/careers">직무 목록으로 돌아가기 <WayfindingIcon /></Link></section> : career ? <section className="career-detail" aria-labelledby="career-title">
      <Link className="career-back" to="/careers">← 직무 목록</Link>
      <div className="career-detail-head"><span>{career.area}</span><h2 id="career-title">{career.title}</h2><p>{career.summary}</p></div>
      <div className="career-detail-grid"><div><section><h3>어떤 일을 할까요?</h3><ul>{career.tasks.map((task) => <li key={task}>{task}</li>)}</ul></section><section><h3>이런 역량을 살펴보세요</h3><div className="career-skills">{career.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section><section className="career-try"><span>작게 시작하기</span><p>{career.tryIt}</p></section></div>
      <aside className="career-related"><h3>관련 커리큘럼</h3><p>목적에 맞는 배움의 흐름을 살펴보세요.</p>{journeys.filter((item) => item.careerId === career.id && item.purposes.includes('career')).map((item) => <Link key={item.id} to={`/path?purpose=career&journey=${encodeURIComponent(item.id)}`}>{item.title}<WayfindingIcon /></Link>)}<h3>배움으로 이어가기</h3><p>관심 있는 자료부터 살펴보세요.</p>{career.resources.map((item) => <Link key={item.url} to={item.url}>{item.label}<WayfindingIcon /></Link>)}<h3>관련 자격증</h3><p>자격증은 선택 사항이며 채용 요건은 회사마다 다릅니다.</p>{career.qualifications.map((item) => <Link key={item.id} to={`/qualifications?exam=${item.id}`}>{item.label}<WayfindingIcon /></Link>)}</aside></div>
      <p className="career-source">직무 내용은 업무의 한 예이며 회사와 직무에 따라 달라질 수 있습니다. <a href={career.source} target="_blank" rel="noopener noreferrer">{career.sourceLabel} 보기 <WayfindingIcon direction="external" /></a></p>
      <Work24Occupation careerId={career.id} />
      <FundedTraining careerId={career.id} />
    </section> : <>
      <section className="career-intro"><div><span>나의 관심에서 시작하기</span><h2>어떤 일을 해보고 싶나요?</h2></div><p>하는 일과 필요한 역량을 알아보고<br />연결된 학습 자료도 만나보세요.</p></section>
      <section className="career-grid" aria-label="직무 목록">{careers.map((item, index) => <Link className="career-card" to={`/careers/${item.id}`} key={item.id}><span className="career-number">0{index + 1} / {item.area}</span><h3>{item.title}</h3><p>{item.summary}</p><div className="career-skills">{item.skills.slice(0,3).map((skill) => <span key={skill}>{skill}</span>)}</div><span className="career-action">직무 살펴보기 <WayfindingIcon /></span></Link>)}</section>
      <FundedTraining />
      <Work24Events />
    </>}
  </div>;
}
