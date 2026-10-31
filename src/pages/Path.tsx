import { Link, useParams, useSearchParams } from 'react-router-dom';
import { journeys, purposes, topics } from '../data/journeys';
import type { Journey, Purpose, Topic } from '../data/journeys';
import { learningResources } from '../data/learning-resources';
import { certifications } from '../data/certifications';
import { qualifications } from '../data/qualifications';
import { isEducationAvailable, selectCertifications } from '../lib/cert-rules.mjs';
import { selectJourneyResources } from '../lib/journey-rules.mjs';
import { FundedTraining } from '../components/FundedTraining';
import { WayfindingIcon } from '../components/WayfindingIcon';
import { PassageMark } from '../components/PassageMark';

function JourneyView({ journey, purpose }: { journey: Journey; purpose: Purpose | null }) {
  const hasCompletion = Boolean(journey.certQuery && selectCertifications(certifications.filter((course) => course.completionCertificateVerified), { type:'course', query:journey.certQuery }).length);
  return <article className="journey-path" aria-labelledby="journey-title">
    <div className="journey-path-head"><div><span>{topics.find((item) => item.id === journey.topic)?.title} · {journey.startingPoint}</span><h1 id="journey-title">{journey.title}</h1><p>{journey.description}</p><p>이 여정에서 해볼 것: {journey.outcome}</p></div>{journey.careerId && <Link to={`/careers/${journey.careerId}`}>관련 직무 살펴보기 <WayfindingIcon /></Link>}</div>
    <div className="journey-steps">{journey.steps.map((step, index) => {
      const resources = selectJourneyResources(step.resources, (id) => learningResources.find((item) => item.id === id), (item) => { const course = certifications.find((entry) => entry.id === item.id); return !course || isEducationAvailable(course); });
      return <section className="journey-step" key={step.title}><div className="journey-number">{String(index + 1).padStart(2, '0')}</div><div className="journey-step-content"><h2>{step.title}</h2><p>{step.objective}</p>
        {step.activity && <div className="journey-activity"><strong>직접 해보기</strong><p>{step.activity}</p></div>}
        {resources.length > 0 && <div className="journey-resources">{resources.map(({ ref, item }) => <Link key={item.id} to={`/resources?query=${encodeURIComponent(item.name)}`}><span><strong>{item.name}</strong><small>{item.provider} · {item.language} · {item.checked} 확인</small><small>{ref.reason}</small><small>비용·조건: {item.cost}</small></span><WayfindingIcon /></Link>)}</div>}
        {step.resources.length > 0 && resources.length === 0 && <p className="journey-empty">현재 연결된 자료가 없습니다. <Link to="/resources">학습 자료실에서 찾아보기</Link></p>}
      </div></section>;
    })}</div>
    {(hasCompletion || journey.qualificationIds.length > 0) && <div className="journey-next"><h2>{purpose === 'career' ? '직무를 향한 다음 선택' : '관심이 이어진다면'}</h2><p>수료 강의와 자격증은 필요에 따라 선택할 수 있습니다. 비용과 시험 조건은 공식 페이지에서 확인하세요.</p><div className="journey-next-links">{hasCompletion && <Link to={`/certs?query=${encodeURIComponent(journey.certQuery!)}`}>관련 수료 강의 <WayfindingIcon /></Link>}{journey.qualificationIds.map((id) => { const qualification = qualifications.find((item) => item.id === id); return qualification && <Link key={id} to={`/qualifications?exam=${encodeURIComponent(id)}`}>{qualification.name} <WayfindingIcon /></Link>; })}</div></div>}
    {purpose === 'career' && journey.careerId && <FundedTraining careerId={journey.careerId} />}
  </article>;
}

export default function Path() {
  const { journeyId } = useParams();
  const [params, setParams] = useSearchParams();
  const purpose = purposes.find((item) => item.id === params.get('purpose'))?.id ?? null;
  const selected = purposes.find((item) => item.id === purpose);
  const selectedTopics = params.getAll('topic').filter((value): value is Topic => topics.some((topic) => topic.id === value));
  const selectedJourney = journeys.find((item) => item.id === journeyId);
  const query = params.toString();
  const listLink = `/path${query ? `?${query}` : ''}`;
  const setPurpose = (id: Purpose) => { const next = new URLSearchParams(params); next.set('purpose', id); setParams(next); };
  const setTopics = (values: Topic[]) => { const next = new URLSearchParams(params); next.delete('topic'); values.forEach((value) => next.append('topic', value)); setParams(next); };

  if (journeyId) return <div className="space-page space-library space-path mx-auto max-w-6xl px-4 py-6"><div className="journey-layout journey-detail"><Link className="journey-back" to={listLink}>← 커리큘럼 목록으로</Link>{selectedJourney ? <JourneyView journey={selectedJourney} purpose={purpose} /> : <section className="journey-not-found"><h1>학습 여정을 찾을 수 없습니다</h1><p>목록에서 다른 커리큘럼을 살펴보세요.</p></section>}</div></div>;

  const shown = purpose ? journeys.filter((item) => item.purposes.includes(purpose) && (!selectedTopics.length || selectedTopics.includes(item.topic))) : [];
  return <div className="space-page space-library space-path mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>추천 커리큘럼</h1><p className="space-caption">지금의 목적에 맞춰 나만의 배움 여정을 찾아보세요.</p></div></header>
    <div className="journey-layout"><section className="journey-selector" aria-labelledby="purpose-heading"><span className="journey-eyebrow">YOUR LEARNING JOURNEY</span><h2 id="purpose-heading">어떤 배움을 시작하고 싶나요?</h2><p>지금의 목적을 선택해 주세요. 언제든 다시 바꿀 수 있어요.</p><div className="journey-purpose-grid">{purposes.map((item, index) => <button type="button" className="journey-purpose" aria-pressed={purpose === item.id} key={item.id} onClick={() => setPurpose(item.id)}><span className="journey-purpose-index">0{index + 1}</span><strong>{item.title}</strong><span>{item.description}</span></button>)}</div></section>
    {selected && <section className="journey-topic" aria-labelledby="topic-heading"><div><span className="journey-eyebrow">한 걸음 더</span><h2 id="topic-heading">관심 있는 분야가 있나요?</h2><p>여러 분야를 고를 수 있어요. 선택하지 않아도 준비된 여정을 모두 볼 수 있습니다.</p></div><div className="journey-topic-options" role="group" aria-label="관심 분야 선택"><button type="button" aria-pressed={selectedTopics.length === 0} onClick={() => setTopics([])}>전체 보기</button>{topics.map((item) => <button type="button" aria-pressed={selectedTopics.includes(item.id)} key={item.id} onClick={() => setTopics(selectedTopics.includes(item.id) ? selectedTopics.filter((value) => value !== item.id) : [...selectedTopics, item.id])}>{item.title}</button>)}</div></section>}
    {selected && <section className="journey-results" aria-label="선택한 학습 여정"><div className="journey-results-head"><span>{selected.title} · {selectedTopics.length ? topics.filter((item) => selectedTopics.includes(item.id)).map((item) => item.title).join(' · ') : '전체 분야'}</span><h2>나에게 맞는 배움 찾아보기</h2><p>관심 있는 여정을 선택하면 단계별 자료와 실습을 살펴볼 수 있어요.</p></div><div className="journey-catalog">{shown.map((item) => <Link className="journey-catalog-card" key={item.id} to={`/path/${item.id}${query ? `?${query}` : ''}`}><span className="journey-catalog-copy"><span className="journey-catalog-label">{topics.find((topic) => topic.id === item.topic)?.title} <i/> {item.startingPoint}</span><strong>{item.title}</strong><span>{item.description}</span><small>이 여정에서: {item.outcome}</small></span><PassageMark /></Link>)}</div>{shown.length === 0 && <p className="journey-catalog-empty">선택한 목적과 분야에 준비된 여정이 아직 없습니다. 다른 분야를 선택해 보세요.</p>}</section>}
    </div>
  </div>;
}
