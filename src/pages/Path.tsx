import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
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
import { MobileFilter } from '../components/MobileFilter';
import { useAnimatedDialog } from '../components/useAnimatedDialog';

function JourneyView({ journey, purpose }: { journey: Journey; purpose: Purpose | null }) {
  const hasCompletion = Boolean(journey.certQuery && selectCertifications(certifications.filter((course) => course.completionCertificateVerified), { type:'course', query:journey.certQuery }).length);
  return <article className="journey-path" aria-labelledby="journey-title">
    <div className="journey-path-head"><div><span>{topics.find((item) => item.id === journey.topic)?.title} · {journey.startingPoint}</span><h2 id="journey-title">{journey.title}</h2><p>{journey.description}</p><p>목표: {journey.outcome}</p></div>{journey.careerId && <Link to={`/careers/${journey.careerId}`}>관련 직무 살펴보기 <WayfindingIcon /></Link>}</div>
    <div className="journey-steps">{journey.steps.map((step, index) => {
      const resources = selectJourneyResources(step.resources, (id) => learningResources.find((item) => item.id === id), (item) => { const course = certifications.find((entry) => entry.id === item.id); return !course || isEducationAvailable(course); });
      return <section className="journey-step" key={step.title}><div className="journey-number">{String(index + 1).padStart(2, '0')}</div><div className="journey-step-content"><h3>{step.title}</h3><p>{step.objective}</p>
        {step.activity && <div className="journey-activity"><strong>직접 해보기</strong><p>{step.activity}</p></div>}
        {resources.length > 0 && <div className="journey-resources">{resources.map(({ ref, item }) => <Link key={item.id} to={`/resources?query=${encodeURIComponent(item.name)}`}><span><strong>{item.name}</strong><small>{item.provider} · {item.language} · {item.checked} 확인</small><small>{ref.reason}</small><small>비용·조건: {item.cost}</small></span><WayfindingIcon /></Link>)}</div>}
        {step.resources.length > 0 && resources.length === 0 && <p className="journey-empty">현재 연결된 자료가 없습니다. <Link to="/resources">학습 자료실에서 찾아보기</Link></p>}
      </div></section>;
    })}</div>
    {(hasCompletion || journey.qualificationIds.length > 0) && <div className="journey-next"><h3>{purpose === 'career' ? '직무를 향한 다음 선택' : '관심이 이어진다면'}</h3><p>수료 강의와 자격증은 필요에 따라 선택할 수 있습니다. 비용과 시험 조건은 공식 페이지에서 확인하세요.</p><div className="journey-next-links">{hasCompletion && <Link to={`/certs?query=${encodeURIComponent(journey.certQuery!)}`}>관련 수료 강의 <WayfindingIcon /></Link>}{journey.qualificationIds.map((id) => { const qualification = qualifications.find((item) => item.id === id); return qualification && <Link key={id} to={`/qualifications?exam=${encodeURIComponent(id)}`}>{qualification.name} <WayfindingIcon /></Link>; })}</div></div>}
    {purpose === 'career' && journey.careerId && <FundedTraining careerId={journey.careerId} />}
  </article>;
}

export default function Path() {
  const { journeyId } = useParams();
  const [params, setParams] = useSearchParams();
  const purpose = purposes.find((item) => item.id === params.get('purpose'))?.id ?? null;
  const selected = purposes.find((item) => item.id === purpose);
  const selectedTopic = params.getAll('topic').find((value): value is Topic => topics.some((topic) => topic.id === value));
  const selectedJourney = journeys.find((item) => item.id === params.get('journey'));
  const { ref: dialog, requestClose } = useAnimatedDialog(Boolean(selectedJourney));
  const setPurpose = (id: Purpose) => { const next = new URLSearchParams(params); next.set('purpose', id); setParams(next); };
  const setTopic = (value: Topic | null) => { const next = new URLSearchParams(params); next.delete('topic'); if (value) next.set('topic', value); setParams(next); };
  const openJourney = (id: string) => { const next = new URLSearchParams(params); next.set('journey', id); setParams(next); };
  const closeJourney = () => { if (!params.has('journey')) return; const next = new URLSearchParams(params); next.delete('journey'); setParams(next, { replace:true }); };

  if (journeyId) { const next = new URLSearchParams(params); next.set('journey', journeyId); return <Navigate to={`/path?${next}`} replace />; }

  const shown = purpose ? journeys.filter((item) => (purpose === 'explore' || item.purposes.includes(purpose)) && (!selectedTopic || selectedTopic === item.topic)) : [];
  return <div className="space-page space-library space-path mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>추천 커리큘럼</h1><p className="space-caption">지금의 목적에 맞춰 나만의 배움 여정을 찾아보세요.</p></div></header>
    <div className={`journey-layout${selected ? ' is-selected' : ''}`}>
    {!selected ? <section className="journey-selector" aria-labelledby="purpose-heading"><span className="journey-eyebrow">YOUR LEARNING JOURNEY</span><h2 id="purpose-heading">어떤 배움을 시작하고 싶나요?</h2><p>지금의 목적을 선택해 주세요. 언제든 다시 바꿀 수 있어요.</p><div className="journey-purpose-grid">{purposes.map((item, index) => <button type="button" className="journey-purpose" aria-pressed={false} key={item.id} onClick={() => setPurpose(item.id)}><span className="journey-purpose-index">0{index + 1}</span><strong>{item.title}</strong><span>{item.description}</span></button>)}</div></section> : <>
    <aside className="reading-sidebar journey-sidebar" aria-label="커리큘럼 탐색"><MobileFilter summary={`${selected.title} · ${topics.find((item) => item.id === selectedTopic)?.title ?? '전체 분야'}`}><div className="journey-filter-group"><h2>학습 목적</h2><div className="journey-filter-purposes">{purposes.map((item) => <button type="button" key={item.id} aria-pressed={purpose === item.id} onClick={() => setPurpose(item.id)}>{item.title}</button>)}</div></div><div className="journey-filter-group"><h2>관심 분야</h2><p>원하는 분야를 선택해 보세요.</p><div className="journey-filter-topics" role="group" aria-label="관심 분야 선택"><button type="button" aria-pressed={!selectedTopic} onClick={() => setTopic(null)}>전체</button>{topics.map((item) => <button type="button" aria-pressed={selectedTopic === item.id} key={item.id} onClick={() => setTopic(selectedTopic === item.id ? null : item.id)}>{item.title}</button>)}</div></div></MobileFilter></aside>
    <section className="journey-results" aria-label="선택한 학습 여정"><div className="journey-results-head"><span>{selected.title} · {topics.find((item) => item.id === selectedTopic)?.title ?? '전체 분야'}</span><h2>나에게 맞는 배움 찾아보기</h2><p>관심 있는 여정을 선택하면 단계별 자료와 실습을 살펴볼 수 있어요.</p></div><div key={`${purpose}-${selectedTopic ?? 'all'}`} className="journey-catalog journey-catalog-transition">{shown.map((item) => <button type="button" className="journey-catalog-card" key={item.id} onClick={() => openJourney(item.id)}><span className="journey-catalog-copy"><strong>{item.beginner && <span className="journey-sprout" role="img" aria-label="처음 시작하는 분을 위한 여정"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20v-7m0 2C8 15 5.2 12.7 5 8.5c4.1-.2 7 1.7 7 5.8m0-2.3c0-3.9 2.6-6.5 7-6.5.1 4-2.2 6.5-7 6.5" /></svg></span>}{item.title}</strong><span>{item.description}</span><span className="journey-start">{item.startingPoint}</span><small>목표 · {item.outcome}</small></span><span className="journey-card-tag">{topics.find((topic) => topic.id === item.topic)?.title}</span><PassageMark /></button>)}</div>{shown.length === 0 && <p className="journey-catalog-empty">선택한 목적과 분야에 준비된 여정이 아직 없습니다. 다른 분야를 선택해 보세요.</p>}</section>
    </>}
    </div>{params.has('journey') && !selectedJourney && <section className="journey-not-found" role="status"><h2>학습 여정을 찾을 수 없습니다</h2><button type="button" onClick={closeJourney}>목록으로 돌아가기</button></section>}<dialog ref={dialog} className="qualification-dialog journey-dialog" aria-labelledby="journey-title" onClose={closeJourney} onCancel={(event) => { event.preventDefault(); requestClose(); }} onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}><div className="journey-dialog-content"><button type="button" className="qualification-close journey-dialog-close" aria-label="커리큘럼 상세 닫기" onClick={requestClose}>×</button>{selectedJourney && <JourneyView journey={selectedJourney} purpose={purpose} />}</div></dialog>
  </div>;
}
