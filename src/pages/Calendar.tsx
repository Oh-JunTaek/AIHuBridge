import { MobileFilter } from '../components/MobileFilter';
import { AutoLoadMore } from '../components/AutoLoadMore';
import { useEffect, useState } from 'react';
import { useCalendarStore } from '../lib/calendar';
import { visibleEvents, registrationMatches } from '../lib/calendar-rules.mjs';
import { koreaDate, periodEvents } from '../lib/calendar-view.mjs';
import { matchesCalendarRegion } from '../lib/calendar-audience.mjs';
import { CalendarMonth } from '../components/CalendarMonth';
import { CalendarEventCard, eventTypeLabels } from '../components/CalendarEventCard';
import { useAnimatedDialog } from '../components/useAnimatedDialog';
import { eventStatusLabel } from '../lib/calendar-rules.mjs';
import type { CalendarEvent } from '../types';

const control = 'mt-1 block w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100';
const format = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

export default function Calendar() {
  const { events, meta, status, loadEvents } = useCalendarStore();
  const [now, setNow] = useState(Date.now);
  const [type, setType] = useState('all');
  const [mode, setMode] = useState('all');
  const [registration, setRegistration] = useState('all');
  const [includePast, setIncludePast] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dayPreview, setDayPreview] = useState(false);
  const { ref: dialog, requestClose } = useAnimatedDialog(!!selectedEvent || dayPreview);
  const [month, setMonth] = useState(() => koreaDate().slice(0, 7));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [scope, setScope] = useState<'month' | 'all'>('month');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [visibleCount, setVisibleCount] = useState(24);
  useEffect(() => setVisibleCount(24), [type, mode, registration, search, region, month, selectedDay, scope, includePast]);
  useEffect(() => {
    void loadEvents();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [loadEvents]);

  const available = visibleEvents(events, now, includePast);
  const audienceEvents = available;
  const filtered = audienceEvents.filter((event) => (type === 'all' || event.type === type)
    && (mode === 'all' || (mode === 'online' ? event.isOnline === true : mode === 'offline' ? event.isOnline === false : event.isOnline === null))
    && registrationMatches(event, registration, now)
    && (event.title + ' ' + event.host + ' ' + (event.topics ?? []).join(' ')).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
    && matchesCalendarRegion(event, region));
  const monthEvents = periodEvents(filtered, month);
  const shown = periodEvents(filtered, month, selectedDay, scope === 'all');
  const stale = !meta || now - Date.parse(meta.fetchedAt) > 36 * 3600000;
  const changeMonth = (value: string) => {
    if (!/^\d{4}-\d{2}$/.test(value)) return;
    setMonth(value); setSelectedDay(null); setScope('month');
  };
  const reset = () => { setType('all'); setMode('all'); setRegistration('all'); setIncludePast(false); setSearch(''); setRegion('all'); setSelectedDay(null); };

  return (
    <div className="space-page space-plaza space-calendar mx-auto max-w-6xl px-4 py-6 text-stone-700 dark:text-stone-200">
      <header className="space-header mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="space-label">정보관</p><h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">AI 캘린더</h1><p className="mt-2 max-w-2xl text-sm text-stone-500 dark:text-stone-400">교육부터 세미나·웨비나·워크숍·해커톤·공모전·컨퍼런스·밋업까지, 필요한 AI 일정을 찾아보세요.</p></div>
        <div className="flex gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-800" aria-label="일정 보기 방식">
          {(['calendar', 'list'] as const).map((option) => <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)} className={view === option ? 'rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:bg-stone-700 dark:text-blue-200' : 'rounded-lg px-4 py-2 text-sm text-stone-500'}>{option === 'calendar' ? '달력 보기' : '목록 보기'}</button>)}
        </div>
      </header>

      <div className="calendar-board">
      <div className="calendar-board-heading"><div><span>정보관의 일정</span><h2>{view === 'calendar' ? '달력에서 만나는 AI' : '목록으로 보는 AI 일정'}</h2></div><p>{view === 'calendar' ? '날짜를 선택해 일정을 찾아보세요' : '아래 조건을 선택해 일정을 찾아보세요'}</p></div>
      <div className="calendar-type-filter" role="group" aria-label="행사 유형 선택">
        {[['all', '전체'], ...Object.entries(eventTypeLabels)].map(([key, label]) => <button key={key} type="button" aria-pressed={type === key} onClick={() => setType(key)}>{label}</button>)}
      </div>
      {view === 'calendar' && <CalendarMonth events={filtered} month={month} today={koreaDate(now)} selectedDay={selectedDay} onMonthChange={changeMonth} onDayChange={(day) => { setSelectedDay(day); setScope('month'); if (day) setDayPreview(true); }} />}
      <div className="calendar-quick-links"><a href="#calendar-results">{selectedDay ? `${selectedDay} 일정 보기` : '선택 월 일정 보기'}</a><a href="#calendar-controls">일정 조건 보기</a></div>
      </div>
      <div id="calendar-controls" className="calendar-controls">
      <MobileFilter summary={`국내 현장·온라인 · ${[type !== 'all', mode !== 'all', registration !== 'all', includePast, !!search, region !== 'all'].filter(Boolean).length ? `추가 조건 ${[type !== 'all', mode !== 'all', registration !== 'all', includePast, !!search, region !== 'all'].filter(Boolean).length}개` : '전체 조건'}`}>
      <section aria-label="일정 범위" className="mb-5">
        <p className="text-sm font-semibold text-stone-700">국내 현장·온라인 일정</p>
        <p className="mt-2 text-xs text-stone-500">국내 개최 장소와 현장 참여가 명시됐거나 온라인 참여가 명시된 행사만 보여줍니다. 해외 온라인 행사의 국가별 접속·참가 자격과 신청 상태는 원문에서 확인하세요.</p>
        {status === 'idle' && audienceEvents.length > 0 && !audienceEvents.some((event) => event.applicationEnd) && <p className="mt-2 text-xs text-stone-600">확인된 신청 마감일이 없습니다. 행사 일정과 신청 가능 여부는 원문에서 확인하세요.</p>}
      </section>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[{ label: '국내·온라인 일정', value: audienceEvents.length, color: 'text-blue-600 dark:text-blue-300' }, { label: '온라인 일정', value: audienceEvents.filter((event) => event.isOnline === true).length, color: 'text-violet-600 dark:text-violet-300' }, { label: '선택 월 검색 결과', value: monthEvents.length, color: 'text-sky-600 dark:text-sky-300' }].map((stat) => <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white px-3 py-4 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:px-5"><p className="text-xs text-stone-500">{stat.label}</p><p className={'mt-1 text-2xl font-bold ' + stat.color}>{stat.value}<span className="ml-1 text-xs font-normal text-stone-400">건</span></p></div>)}
      </div>

      <section aria-label="일정 필터" className="mb-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900/50 sm:p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <label className="text-xs text-stone-500">진행 방식<select value={mode} onChange={(event) => { setMode(event.target.value); if (event.target.value === 'offline' && region === 'online') setRegion('all'); }} className={control}><option value="all">전체 방식</option><option value="online">온라인</option><option value="offline">국내 현장</option></select></label>
          <label className="text-xs text-stone-500">신청·행사 상태<select value={registration} onChange={(event) => setRegistration(event.target.value)} className={control}><option value="all">전체 상태</option><option value="open">신청 마감 전 · 마감일 확인</option><option value="closed">신청 마감</option><option value="cancelled">취소</option><option value="postponed">연기</option><option value="known">신청 마감일 확인됨</option><option value="unknown">신청 마감일 미확인</option></select></label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs text-stone-500">행사·기관·주제 검색<input type="search" placeholder="예: Gemini, 해커톤" value={search} onChange={(event) => setSearch(event.target.value)} className={control} /></label>
          <label className="text-xs text-stone-500">지역<select aria-label="지역" value={region} onChange={(event) => { setRegion(event.target.value); if (event.target.value === 'online') setMode('all'); }} className={control}><option value="all">전체 지역</option><option value="online">온라인</option><option value="seoul">서울특별시</option><option value="gyeonggi">경기도</option><option value="busan">부산광역시</option><option value="incheon">인천광역시</option><option value="daegu">대구광역시</option><option value="daejeon">대전광역시</option><option value="gwangju">광주광역시</option><option value="ulsan">울산광역시</option><option value="sejong">세종특별자치시</option></select></label>
          <label className="text-xs text-stone-500">조회 월<input type="month" min="2000-01" max="2100-12" value={month} onChange={(event) => changeMonth(event.target.value)} className={control} /></label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={includePast} onChange={(event) => { setIncludePast(event.target.checked); setSelectedDay(null); }} />지난 행사·공고 포함 (30일 보관)</label>
        <p className="mt-2 text-xs text-stone-500">신청 마감 후에도 개최 전 행사는 유지합니다. 취소·연기는 기본 달력에도 표시하며 참가 가능 여부는 원문을 확인하세요. 지난 자료는 조회 월 또는 전체 기간을 바꿔 찾을 수 있습니다.</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-stone-500">참여 방식 확인 {available.length}건 · 조건에 맞는 일정 {filtered.length}건</p><button type="button" onClick={reset} className="text-xs font-semibold text-blue-600 underline dark:text-blue-300">조건 초기화</button></div>
      </section>

      </MobileFilter>
      </div>
      {meta && <p className="mb-3 text-xs text-stone-500">마지막 수집: {format(meta.fetchedAt)} (한국시간)</p>}
      {status === 'loading' && <p role="status" className="mb-4 text-sm">AI 일정을 불러오는 중입니다…</p>}
      {status === 'error' && <div role="alert" className="mb-4 text-sm text-rose-600">AI 일정을 갱신하지 못했습니다. <button type="button" className="underline" onClick={() => void loadEvents()}>다시 시도</button></div>}
      {status !== 'loading' && (stale || meta?.status === 'partial' || meta?.status === 'cleaned') && <p role="status" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">수집 정보가 오래되었거나 일부 출처를 확인하지 못했습니다. 신청 전 원문을 확인하세요.</p>}


      <section id="calendar-results" className="mt-7 scroll-mt-20" aria-label="조건에 맞는 AI 일정">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{selectedDay ? selectedDay + ' 일정' : scope === 'all' ? '전체 기간 일정' : month.replace('-', '년 ') + '월 일정'}</h2><p role="status" className="mt-1 text-xs text-stone-500">{shown.length}건 · {scope === 'all' && !selectedDay ? '보관 중인 전체 일정' : '신청 시작·마감, 행사 시작·종료일 기준'}</p></div>
          <div className="flex flex-wrap gap-2 text-xs">{selectedDay && <button type="button" onClick={() => setSelectedDay(null)} className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600">날짜 선택 해제</button>}<button type="button" aria-pressed={scope === 'month' && !selectedDay} onClick={() => { setScope('month'); setSelectedDay(null); }} className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600">선택 월 전체</button><button type="button" aria-pressed={scope === 'all' && !selectedDay} onClick={() => { setScope('all'); setSelectedDay(null); }} className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600">전체 기간</button></div>
        </header>
        {!shown.length && status === 'idle' && <div className="rounded-2xl border border-dashed border-stone-300 px-5 py-10 text-center text-sm text-stone-500 dark:border-stone-700">이 날짜와 조건에 맞는 AI 일정이 없습니다. 다른 달을 선택하거나 필터를 초기화해 보세요.</div>}
        <div className="calendar-event-list">{shown.slice(0, visibleCount).map((event) => <article key={event.id} className="calendar-event-row"><button type="button" onClick={() => setSelectedEvent(event)}><span className="calendar-event-type">{eventTypeLabels[event.type]}</span><span className="calendar-event-main"><span className="calendar-event-title">{event.title}</span><span className="calendar-event-meta">{event.host} · {event.eventStart ? format(event.eventStart) + ' (한국시간)' : event.eventDate ?? (event.applicationEnd ? '신청 마감 ' + format(event.applicationEnd) + ' (한국시간)' : '일정 미확인')} · {event.attendanceMode === 'hybrid' ? '온라인·현장 병행' : event.isOnline ? '온라인' : event.location ?? '장소 미확인'}</span></span><span className="calendar-event-status">{eventStatusLabel(event, now)} <span aria-hidden="true">↗</span></span></button></article>)}</div>
      <AutoLoadMore visible={visibleCount} total={shown.length} label="일정" onLoad={() => setVisibleCount((count) => count + 24)} />
      </section>
      <p className="mt-6 text-xs leading-relaxed text-stone-500">온라인 행사에서 날짜만 제공되면 원문의 현지 날짜로 표시하며 시각·시간대를 추정하지 않습니다. 신청 마감 미확인은 모집 중을 뜻하지 않습니다. 원문에서 참가 조건과 변경 사항을 확인하세요.</p>
      <dialog ref={dialog} className="qualification-dialog calendar-detail-dialog" aria-label={selectedEvent ? '행사 상세 정보' : '선택 날짜 일정'} onClose={() => { setSelectedEvent(null); setDayPreview(false); }} onCancel={(event) => { event.preventDefault(); requestClose(); }} onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
        <div className="calendar-dialog-inner"><div className="calendar-dialog-top"><span>{selectedEvent ? 'AI 일정 상세' : '선택한 날짜의 AI 일정'}</span><button type="button" className="qualification-close" aria-label={selectedEvent ? '행사 상세 닫기' : '날짜 일정 닫기'} onClick={requestClose}>×</button></div>
          {selectedEvent ? <>{dayPreview && <button type="button" className="calendar-preview-back" onClick={() => setSelectedEvent(null)}>← 날짜 일정으로 돌아가기</button>}<CalendarEventCard event={selectedEvent} now={now} /></> : dayPreview && <section className="calendar-day-preview"><h2>{selectedDay} 일정</h2><p role="status">{shown.length}건 · 선택한 행사 유형과 조건을 반영합니다</p>{shown.length ? <div className="calendar-day-list">{shown.map((event) => <button type="button" key={event.id} onClick={() => setSelectedEvent(event)}><span>{eventTypeLabels[event.type]}</span><strong>{event.title}</strong><small>{event.host} · {eventStatusLabel(event, now)}</small><span aria-hidden="true">→</span></button>)}</div> : <p className="calendar-day-empty">이 날짜와 조건에 맞는 일정이 없습니다.</p>}</section>}
        </div>
      </dialog>
    </div>
  );
}
