import { useState } from 'react';
import { Link } from 'react-router-dom';
import { journeys, purposes } from '../data/journeys';
import type { Journey, Purpose, Topic } from '../data/journeys';
import { learningResources } from '../data/learning-resources';
import { certifications } from '../data/certifications';
import { qualifications } from '../data/qualifications';
import { isEducationAvailable } from '../lib/cert-rules.mjs';
import { selectJourneyResources } from '../lib/journey-rules.mjs';
import { FundedTraining } from '../components/FundedTraining';
import { WayfindingIcon } from '../components/WayfindingIcon';

const purposeIntro: Record<Purpose, string> = {
  career: '하는 일을 살펴보고, 필요한 역량과 결과물을 차근차근 준비해요.',
  create: '작은 실습에서 시작해 관심 있는 결과물을 직접 만들어 봐요.',
  apply: '기초를 익힌 뒤 일상이나 업무에 적용할 방법을 찾아봐요.',
  explore: '부담 없이 체험하며 나에게 맞는 관심사를 찾아봐요.',
};
const finalActivities: Record<Topic, Record<Purpose, string>> = {
  data: { career:'공개 데이터를 골라 질문, 분석 과정과 결과를 설명하는 보고서를 만들어 보세요.', create:'관심 있는 공개 데이터로 나만의 그래프와 짧은 설명을 만들어 보세요.', apply:'업무나 일상의 자료를 표와 그래프로 정리하고 핵심 내용을 적어보세요.', explore:'관심 있는 표에서 눈에 띄는 차이를 하나 찾아 간단한 그래프로 나타내 보세요.' },
  qa: { career:'테스트 조건, 기대 결과와 실제 결과를 담은 테스트 보고서를 작성해 보세요.', create:'직접 만든 페이지나 연습용 웹사이트의 동작을 테스트하고 개선점을 적어보세요.', apply:'자주 쓰는 업무 화면의 입력 조건과 예상 결과를 점검표로 만들어 보세요.', explore:'자주 쓰는 서비스에서 입력을 바꿨을 때 어떤 일이 생기는지 관찰해 보세요.' },
};

function JourneyView({ journey, purpose }: { journey: Journey; purpose: Purpose }) {
  return <article className="journey-path" aria-labelledby={`journey-${journey.topic}`}>
    <div className="journey-path-head"><div><span>나의 배움 여정</span><h2 id={`journey-${journey.topic}`}>{journey.title}</h2><p>{journey.description} {purposeIntro[purpose]}</p></div><Link to={`/careers/${journey.careerId}`}>관련 직무 살펴보기 <WayfindingIcon /></Link></div>
    <div className="journey-steps">{journey.steps.map((step, index) => {
      const resources = selectJourneyResources(step.resources, (id) => learningResources.find((item) => item.id === id), (item) => { const course = certifications.find((entry) => entry.id === item.id); return !course || isEducationAvailable(course); });
      return <section className="journey-step" key={step.title}><div className="journey-number">{String(index + 1).padStart(2, '0')}</div><div className="journey-step-content"><h3>{step.title}</h3><p>{step.objective}</p>
        {step.activity && <div className="journey-activity"><strong>{purpose === 'career' ? '직무와 연결해 보기' : purpose === 'apply' ? '일상이나 업무에 적용해 보기' : '직접 해보기'}</strong><p>{index === journey.steps.length - 1 ? finalActivities[journey.topic][purpose] : step.activity}</p></div>}
        {resources.length > 0 && <div className="journey-resources">{resources.map(({ ref, item }) => item && <Link key={item.id} to={`/resources?query=${encodeURIComponent(item.name)}`}><span><strong>{item.name}</strong><small>{item.provider} · {item.language} · {item.checked} 확인</small><small>{ref.reason}</small><small>비용·조건: {item.cost}</small></span><WayfindingIcon /></Link>)}</div>}
        {step.resources.length > 0 && resources.length === 0 && <p className="journey-empty">현재 연결된 자료가 없습니다. <Link to="/resources">학습 자료실에서 찾아보기</Link></p>}
      </div></section>;
    })}</div>
    <div className="journey-next"><h3>{purpose === 'career' ? '직무를 향한 다음 선택' : '관심이 이어진다면'}</h3><p>수료 강의와 자격증은 필요에 따라 선택할 수 있습니다. 비용과 시험 조건은 공식 페이지에서 확인하세요.</p><div className="journey-next-links"><Link to={`/certs?query=${encodeURIComponent(journey.topic === 'qa' ? 'QA' : '데이터')}`}>관련 수료 강의 <WayfindingIcon /></Link>{journey.qualificationIds.map((id) => { const qualification = qualifications.find((item) => item.id === id); return qualification && <Link key={id} to={`/qualifications?exam=${encodeURIComponent(id)}`}>{qualification.name} <WayfindingIcon /></Link>; })}</div></div>
    {purpose === 'career' && <FundedTraining careerId={journey.careerId} />}
  </article>;
}

export default function Path() {
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const selected = purposes.find((item) => item.id === purpose);
  return <div className="space-page space-library space-path mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">학습관</p><h1>추천 커리큘럼</h1><p className="space-caption">지금의 목적에 맞춰 나만의 배움 여정을 찾아보세요.</p></div></header>
    <div className="journey-layout"><section className="journey-selector" aria-labelledby="purpose-heading"><span className="journey-eyebrow">YOUR LEARNING JOURNEY</span><h2 id="purpose-heading">어떤 배움을 시작하고 싶나요?</h2><p>지금의 목적을 선택해 주세요. 언제든 다시 바꿀 수 있어요.</p><div className="journey-purpose-grid">{purposes.map((item, index) => <button type="button" className="journey-purpose" aria-pressed={purpose === item.id} key={item.id} onClick={() => setPurpose(item.id)}><span className="journey-purpose-index">0{index + 1}</span><strong>{item.title}</strong><span>{item.description}</span></button>)}</div></section>
    {selected && <section className="journey-topic" aria-labelledby="topic-heading"><div><span className="journey-eyebrow">한 걸음 더</span><h2 id="topic-heading">관심 있는 분야가 있나요?</h2><p>여러 분야를 고를 수 있어요. 선택하지 않아도 준비된 여정을 모두 볼 수 있습니다.</p></div><div className="journey-topic-options" role="group" aria-label="관심 분야 선택"><button type="button" aria-pressed={topics.length === 0} onClick={() => setTopics([])}>전체 보기</button>{journeys.map((item) => <button type="button" aria-pressed={topics.includes(item.topic)} key={item.topic} onClick={() => setTopics((current) => current.includes(item.topic) ? current.filter((value) => value !== item.topic) : [...current, item.topic])}>{item.title}</button>)}</div></section>}
    {selected && <section className="journey-results" aria-label="선택한 학습 여정"><div className="journey-results-head"><span>{selected.title} · {topics.length ? journeys.filter((item) => topics.includes(item.topic)).map((item) => item.title).join(' · ') : '전체 분야'}</span><h2>이렇게 시작해 보세요</h2><p>목적에 따라 살펴볼 선택지를 안내합니다. 분야별 여정은 계속 보강하고 있어요.</p></div>{journeys.filter((item) => !topics.length || topics.includes(item.topic)).map((item) => <JourneyView key={`${purpose}-${item.topic}`} journey={item} purpose={purpose!} />)}</section>}
    </div>
  </div>;
}
