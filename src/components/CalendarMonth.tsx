import type { CalendarEvent } from '../types';
import { calendarEntries, entriesOnDay, groupDayEntries, monthDays, shiftMonth } from '../lib/calendar-view.mjs';
import { eventTypeLabels } from './CalendarEventCard';

interface Props {
  events: CalendarEvent[];
  month: string;
  today: string;
  selectedDay: string | null;
  onMonthChange: (month: string) => void;
  onDayChange: (day: string | null) => void;
}
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const entryLabels = { application: '신청 시작', deadline: '신청 마감', event: '행사 시작', end: '행사 종료' };
const badgeColors = {
  seminar: 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-200',
  webinar: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-200',
  workshop: 'bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-200',
  bootcamp: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200',
  hackathon: 'bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-200',
  competition: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
  training: 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200',
  conference: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-200',
  meetup: 'bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200',
  other: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200',
};

export function CalendarMonth({ events, month, today, selectedDay, onMonthChange, onDayChange }: Props) {
  const entries = calendarEntries(events);
  const [year, number] = month.split('-').map(Number);
  const moveMonth = (next: string) => { onMonthChange(next); onDayChange(null); };
  return (
    <section aria-label="월간 AI 일정" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 px-4 py-4 dark:border-stone-800 dark:from-slate-900 dark:via-stone-900 dark:to-violet-950/40 sm:px-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">{number}</span>
          <div><h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">{year}년 {number}월</h2><p className="text-xs text-stone-500">신청·행사의 시작일과 마지막 날만 표시합니다</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveMonth(today.slice(0, 7))} className="rounded-lg border border-stone-200 px-3 py-2 text-xs dark:border-stone-700">이번 달</button>
          <button type="button" aria-label="이전 달" disabled={month <= '2000-01'} onClick={() => moveMonth(shiftMonth(month, -1))} className="h-9 w-9 rounded-lg border border-stone-200 text-lg disabled:opacity-30 dark:border-stone-700">‹</button>
          <button type="button" aria-label="다음 달" disabled={month >= '2100-12'} onClick={() => moveMonth(shiftMonth(month, 1))} className="h-9 w-9 rounded-lg border border-stone-200 text-lg disabled:opacity-30 dark:border-stone-700">›</button>
        </div>
      </header>
      <div className="grid grid-cols-7 border-b border-stone-100 dark:border-stone-800" aria-hidden="true">{weekdays.map((day, index) => <span key={day} className={`py-2 text-center text-xs font-semibold ${index === 0 ? 'text-rose-500' : index === 6 ? 'text-blue-500' : 'text-stone-500'}`}>{day}</span>)}</div>
      <div className="grid grid-cols-7" role="group" aria-label={`${year}년 ${number}월 날짜 선택`}>
        {monthDays(month).map(({ date, day, inMonth }, index) => {
          const dayEntries = entriesOnDay(entries, date);
          const eventCount = new Set(dayEntries.map((entry) => entry.event.id)).size;
          const groups = groupDayEntries(dayEntries);
          const selected = date === selectedDay;
          return (
            <button type="button" key={date} aria-label={`${date} ${weekdays[index % 7]}요일, 일정 ${eventCount}건`} aria-pressed={selected} aria-current={date === today ? 'date' : undefined}
              onClick={() => { if (!inMonth) onMonthChange(date.slice(0, 7)); onDayChange(selected ? null : date); }}
              className={`flex min-w-0 flex-col items-stretch justify-start border-b border-r border-stone-100 p-1.5 text-left transition focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-stone-800 sm:p-2 ${selected ? 'bg-blue-50 ring-2 ring-inset ring-blue-500 dark:bg-blue-950/50' : inMonth ? 'bg-white hover:bg-sky-50 dark:bg-stone-900 dark:hover:bg-stone-800' : 'bg-stone-50 text-stone-400 dark:bg-stone-950'} min-h-20 sm:min-h-24`}>
              <span className="mb-1 flex items-center justify-between gap-1">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${date === today ? 'bg-blue-600 text-white' : !inMonth ? 'text-stone-400' : index % 7 === 0 ? 'text-rose-500' : index % 7 === 6 ? 'text-blue-600' : 'text-stone-700 dark:text-stone-200'}`}>{day}</span>
                {eventCount > 0 && <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-300">{eventCount}<span className="sr-only">건</span></span>}
              </span>
              <span className="flex flex-col gap-1">
                {groups.map((group) => <span key={group.type} aria-label={`${eventTypeLabels[group.type]} ${group.count}건`} className={`flex min-w-0 items-center justify-between gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium leading-4 sm:text-xs ${badgeColors[group.type]}`} title={group.events.map((event) => `${event.status === 'cancelled' ? '취소 · ' : event.status === 'postponed' ? '연기 · ' : ''}${event.scheduleUnknown ? '변경 전 참고 · ' : ''}${event.title} · ${dayEntries.filter((entry) => entry.event.id === event.id).map((entry) => entryLabels[entry.kind]).join('·')}`).join('\n')}>
                  <span className="truncate"><span className="sm:hidden">{eventTypeLabels[group.type].slice(0, 1)}</span><span className="hidden sm:inline">{group.type === 'other' ? '기타' : eventTypeLabels[group.type]}</span></span>
                  {group.count > 1 && <span className="shrink-0 font-bold tabular-nums">+{group.count - 1}</span>}
                  {group.events.some((event) => ['cancelled', 'postponed'].includes(event.status)) && <span aria-label="취소·연기 포함" className="shrink-0">!</span>}
                </span>)}
              </span>
            </button>
          );
        })}
      </div>
      <footer className="space-y-2 border-t border-stone-100 px-4 py-3 text-xs text-stone-500 dark:border-stone-800"><div className="flex flex-wrap gap-x-3 gap-y-2">{Object.entries(eventTypeLabels).map(([type, label]) => <span key={type}><span aria-hidden="true" className={`mr-1 inline-block rounded px-1 font-semibold ${badgeColors[type as keyof typeof badgeColors]}`}>{label.slice(0, 1)}</span>{label}</span>)}</div><p>같은 유형은 뱃지 하나로 묶고 추가 건수를 +숫자로 표시합니다. !는 취소·연기 포함입니다. 날짜를 선택해 상세 일정을 확인하세요.</p></footer>
    </section>
  );
}
