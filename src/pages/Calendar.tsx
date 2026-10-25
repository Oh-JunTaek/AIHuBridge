import { useEffect, useState } from 'react';
import { useCalendarStore } from '../lib/calendar';
import { visibleEvents } from '../lib/calendar-rules.mjs';
import { koreaDate, periodEvents } from '../lib/calendar-view.mjs';
import { matchesAudience } from '../lib/calendar-audience.mjs';
import { CalendarMonth } from '../components/CalendarMonth';
import { CalendarEventCard, eventTypeLabels } from '../components/CalendarEventCard';

const control = 'mt-1 block w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100';
const format = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

export default function Calendar() {
  const { events, meta, status, loadEvents } = useCalendarStore();
  const [now, setNow] = useState(Date.now);
  const [type, setType] = useState('all');
  const [audience, setAudience] = useState('domestic');
  const [mode, setMode] = useState('all');
  const [fee, setFee] = useState('all');
  const [registration, setRegistration] = useState('all');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [month, setMonth] = useState(() => koreaDate().slice(0, 7));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [scope, setScope] = useState<'month' | 'all'>('month');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [visibleCount, setVisibleCount] = useState(24);
  useEffect(() => setVisibleCount(24), [audience, type, mode, fee, registration, search, region, month, selectedDay, scope]);
  useEffect(() => {
    void loadEvents();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [loadEvents]);

  const available = visibleEvents(events, now);
  const audienceEvents = available.filter((event) => matchesAudience(event, audience));
  const filtered = audienceEvents.filter((event) => (type === 'all' || event.type === type)
    && (mode === 'all' || (mode === 'online' ? event.isOnline === true : mode === 'offline' ? event.isOnline === false : event.isOnline === null))
    && (fee === 'all' || event.feeType === fee)
    && (registration === 'all' || (registration === 'known' ? event.applicationEnd !== null : event.applicationEnd === null))
    && (event.title + ' ' + event.host + ' ' + (event.topics ?? []).join(' ')).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
    && (event.host + ' ' + (event.location ?? '') + ' ' + (event.region ?? '')).toLocaleLowerCase().includes(region.trim().toLocaleLowerCase()));
  const monthEvents = periodEvents(filtered, month);
  const shown = periodEvents(filtered, month, selectedDay, scope === 'all');
  const stale = !meta || now - Date.parse(meta.fetchedAt) > 36 * 3600000;
  const changeMonth = (value: string) => {
    if (!/^\d{4}-\d{2}$/.test(value)) return;
    setMonth(value); setSelectedDay(null); setScope('month');
  };
  const reset = () => { setAudience('domestic'); setType('all'); setMode('all'); setFee('all'); setRegistration('all'); setSearch(''); setRegion(''); setSelectedDay(null); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-stone-700 dark:text-stone-200">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-1 text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-300">배우고, 만나고, 만들어보세요</p><h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">AI 캘린더</h1><p className="mt-2 max-w-2xl text-sm text-stone-500 dark:text-stone-400">교육부터 세미나·웨비나·워크숍·해커톤·공모전·컨퍼런스·밋업까지, 필요한 AI 일정을 찾아보세요.</p></div>
        <div className="flex gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-800" aria-label="일정 보기 방식">
          {(['calendar', 'list'] as const).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)} className={view === option ? 'rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:bg-stone-700 dark:text-blue-200' : 'rounded-lg px-4 py-2 text-sm text-stone-500'}>{option === 'calendar' ? '달력 보기' : '목록 보기'}</button>)}
        </div>
      </header>

      <section aria-label="행사 대분류" className="mb-5">
        <div className="flex flex-wrap gap-2">{[{id:'domestic',label:'국내'}, {id:'overseas',label:'해외'}, {id:'unknown',label:'지역 미확인'}, {id:'all',label:'전체'}].map((option) => <button key={option.id} type="button" aria-pressed={audience === option.id} onClick={() => { setAudience(option.id); setSelectedDay(null); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${audience === option.id ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'}`}>{option.label}</button>)}</div>
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">국내 화면은 국내 행사와 전 세계 온라인 행사를 함께 보여줍니다. 해외 오프라인·미확인 방식은 기본 화면에서 제외합니다. 지역은 공개 개최 도시·주최 커뮤니티 위치 기준이며 실제 장소·접속 조건은 원문을 확인하세요.</p>
      </section>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[{ label: '선택 대분류 일정', value: audienceEvents.length, color: 'text-blue-600 dark:text-blue-300' }, { label: '온라인 일정', value: audienceEvents.filter((event) => event.isOnline === true).length, color: 'text-violet-600 dark:text-violet-300' }, { label: '이달의 검색 결과', value: monthEvents.length, color: 'text-sky-600 dark:text-sky-300' }].map((stat) => <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white px-3 py-4 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:px-5"><p className="text-xs text-stone-500">{stat.label}</p><p className={'mt-1 text-2xl font-bold ' + stat.color}>{stat.value}<span className="ml-1 text-xs font-normal text-stone-400">건</span></p></div>)}
      </div>

      <section aria-label="일정 필터" className="mb-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900/50 sm:p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <label className="text-xs text-stone-500">행사 유형<select value={type} onChange={(event) => setType(event.target.value)} className={control}><option value="all">전체 유형</option>{Object.entries(eventTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-xs text-stone-500">진행 방식<select value={mode} onChange={(event) => setMode(event.target.value)} className={control}><option value="all">전체 방식</option><option value="online">온라인</option><option value="offline">오프라인</option><option value="unknown">미확인·혼합</option></select></label>
          <label className="text-xs text-stone-500">참가 비용<select value={fee} onChange={(event) => setFee(event.target.value)} className={control}><option value="all">모든 비용</option><option value="free">무료로 확인됨</option><option value="paid">유료로 확인됨</option><option value="unknown">비용 미확인</option></select></label>
          <label className="text-xs text-stone-500">신청 일정<select value={registration} onChange={(event) => setRegistration(event.target.value)} className={control}><option value="all">전체 일정</option><option value="known">신청 마감 확인됨</option><option value="unknown">개최일만 확인됨</option></select></label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs text-stone-500">행사·기관·주제 검색<input type="search" placeholder="예: Gemini, 해커톤" value={search} onChange={(event) => setSearch(event.target.value)} className={control} /></label>
          <label className="text-xs text-stone-500">지역 검색<input type="search" placeholder="예: Seoul, 서울, London" value={region} onChange={(event) => setRegion(event.target.value)} className={control} /></label>
          <label className="text-xs text-stone-500">조회 월<input type="month" min="2000-01" max="2100-12" value={month} onChange={(event) => changeMonth(event.target.value)} className={control} /></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-stone-500">공개 목록 {available.length}건 · 조건에 맞는 일정 {filtered.length}건</p><button type="button" onClick={reset} className="text-xs font-semibold text-blue-600 underline dark:text-blue-300">필터 초기화</button></div>
      </section>

      {meta && <p className="mb-3 text-xs text-stone-500">마지막 수집: {format(meta.fetchedAt)} (한국시간)</p>}
      {status === 'loading' && <p role="status" className="mb-4 text-sm">AI 일정을 불러오는 중입니다…</p>}
      {status === 'error' && <div role="alert" className="mb-4 text-sm text-rose-600">AI 일정을 갱신하지 못했습니다. <button type="button" className="underline" onClick={() => void loadEvents()}>다시 시도</button></div>}
      {status !== 'loading' && (stale || meta?.status === 'partial' || meta?.status === 'cleaned') && <p role="status" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">수집 정보가 오래되었거나 일부 출처를 확인하지 못했습니다. 신청 전 원문을 확인하세요.</p>}
      {view === 'calendar' && <CalendarMonth events={filtered} month={month} today={koreaDate(now)} selectedDay={selectedDay} onMonthChange={changeMonth} onDayChange={(day) => { setSelectedDay(day); setScope('month'); }} />}

      <section id="calendar-results" className="mt-7 scroll-mt-20" aria-label="조건에 맞는 AI 일정">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{selectedDay ? selectedDay + ' 일정' : scope === 'all' ? '전체 기간 일정' : month.replace('-', '년 ') + '월 일정'}</h2><p role="status" className="mt-1 text-xs text-stone-500">{shown.length}건 · 개최일 또는 신청 마감일 기준</p></div>
          <div className="flex flex-wrap gap-2 text-xs">{selectedDay && <button type="button" onClick={() => setSelectedDay(null)} className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600">날짜 선택 해제</button>}<button type="button" aria-pressed={scope === 'month' && !selectedDay} onClick={() => { setScope('month'); setSelectedDay(null); }} className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600">선택 월 전체</button><button type="button" aria-pressed={scope === 'all' && !selectedDay} onClick={() => { setScope('all'); setSelectedDay(null); }} className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600">전체 기간</button></div>
        </header>
        {!shown.length && status === 'idle' && <div className="rounded-2xl border border-dashed border-stone-300 px-5 py-10 text-center text-sm text-stone-500 dark:border-stone-700">이 날짜와 조건에 맞는 AI 일정이 없습니다. 다른 달을 선택하거나 필터를 초기화해 보세요.</div>}
        <div className="grid gap-4 lg:grid-cols-2">{shown.slice(0, visibleCount).map((event) => <CalendarEventCard key={event.id} event={event} now={now} />)}</div>
        {shown.length > visibleCount && <button type="button" className="mt-5 rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold dark:border-stone-600" onClick={() => setVisibleCount((count) => count + 24)}>다음 일정 더 보기 ({shown.length - visibleCount}건 남음)</button>}
      </section>
      <p className="mt-6 text-xs leading-relaxed text-stone-500">해외 행사에서 날짜만 제공되면 현지 날짜로 표시하며 시각·시간대를 추정하지 않습니다. 신청 마감 미확인은 모집 중을 뜻하지 않습니다. 원문에서 참가 조건과 변경 사항을 확인하세요.</p>
    </div>
  );
}
