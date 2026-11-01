import { useEffect, useState } from 'react';
import { WayfindingIcon } from './WayfindingIcon';

type Match = { name: string; code?: string; category?: string };
type Results = Record<string, { query: string; items: Match[] }>;
type Snapshot<T> = { fetchedAt: string | null; data: T };
type Event = { id: string; name: string; area: string; start: string; end: string };
const eventList = 'https://www.work24.go.kr/wk/a/f/1100/retrieveEmpEventList.do?currentPageNo=1&recordCountPerPage=10';

function useSnapshot<T>(name: string) {
  const [snapshot, setSnapshot] = useState<Snapshot<T> | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/work24-${name}.json`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data: Snapshot<T> | null) => { if (data?.fetchedAt) setSnapshot(data); })
      .catch(() => { /* 공식 링크와 기존 화면을 유지한다. */ });
    return () => controller.abort();
  }, [name]);
  return snapshot;
}

export function Work24Occupation({ careerId }: { careerId: string }) {
  const jobs = useSnapshot<Results>('jobs');
  const duties = useSnapshot<Results>('duties');
  const job = jobs?.data[careerId];
  const duty = duties?.data[careerId];
  if (!job?.items?.length && !duty?.items?.length) return null;
  return <section className="work24-career-reference" aria-label="고용24 관련 직업 및 역량">
    <h3>고용24에서 함께 살펴볼 키워드</h3>
    <p>검색어에 따른 참고 결과입니다. 직무와 정확히 일치하는지는 공식 안내에서 확인해 주세요.</p>
    {Boolean(job?.items?.length) && <p>관련 직업명 · {job!.items.map((item) => item.name).join(' · ')}</p>}
    {Boolean(duty?.items?.length) && <p>NCS 관련 분야 · {duty!.items.map((item) => item.name).join(' · ')}</p>}
    <a href="https://www.work24.go.kr/" target="_blank" rel="noopener noreferrer">고용24에서 직업정보 확인 <WayfindingIcon direction="external" /></a>
  </section>;
}

export function Work24Events() {
  const snapshot = useSnapshot<Event[]>('events');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
  const events = Array.isArray(snapshot?.data) ? snapshot.data.filter((item) => item.end >= today).slice(0, 5) : [];
  const date = snapshot?.fetchedAt ? new Intl.DateTimeFormat('ko-KR', { timeZone:'Asia/Seoul', dateStyle:'medium' }).format(new Date(snapshot.fetchedAt)) : null;
  return <section className="career-events"><div><span>새로운 기회 만나기</span><h2>채용행사와 박람회</h2><p>직접 사람들을 만나고 직무 이야기를 들어보세요. 행사 정보와 참여 조건은 공식 안내에서 확인할 수 있습니다.</p></div><div>
    {events.length ? <><ul className="work24-event-list">{events.map((event) => <li key={event.id}><strong>{event.name}</strong><span>{event.start}{event.start !== event.end ? ` ~ ${event.end}` : ''}{event.area ? ` · ${event.area}` : ''}</span></li>)}</ul><small>고용24 제공 · {date} 수집. 신청과 행사 변경 여부는 고용24에서 확인하세요.</small></> : <p>현재 소개할 개별 행사는 확인 중입니다.</p>}
    <a href={eventList} target="_blank" rel="noopener noreferrer">고용24 채용행사 찾아보기 <WayfindingIcon direction="external" /></a>
  </div></section>;
}
