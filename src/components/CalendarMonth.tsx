import type { CalendarEvent } from '../types';
import { calendarEntries, entriesOnDay, monthDays, shiftMonth } from '../lib/calendar-view.mjs';

interface Props {
  events: CalendarEvent[];
  month: string;
  today: string;
  selectedDay: string | null;
  onMonthChange: (month: string) => void;
  onDayChange: (day: string | null) => void;
}
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarMonth({ events, month, today, selectedDay, onMonthChange, onDayChange }: Props) {
  const entries = calendarEntries(events);
  const [year, number] = month.split('-').map(Number);
  const moveMonth = (next: string) => { onMonthChange(next); onDayChange(null); };
  return (
    <section aria-label="월간 AI 일정" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 px-4 py-4 dark:border-stone-800 dark:from-slate-900 dark:via-stone-900 dark:to-violet-950/40 sm:px-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">{number}</span>
          <div><h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">{year}년 {number}월</h2><p className="text-xs text-stone-500">날짜를 선택하면 아래 일정이 모입니다</p></div>
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
                {dayEntries.slice(0, 2).map((entry) => <span key={`${entry.event.id}-${entry.kind}`} className={`block truncate rounded px-1 py-0.5 text-[10px] leading-4 sm:text-xs ${entry.kind === 'deadline' ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200' : entry.event.type === 'hackathon' ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200' : 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-200'}`} title={`${entry.kind === 'deadline' ? '신청 마감' : '개최 일정'} · ${entry.event.title}`}>
                  <span className="sm:hidden">{entry.kind === 'deadline' ? '마감' : '일정'}</span><span className="hidden sm:inline">{entry.kind === 'deadline' ? '마감 · ' : ''}{entry.event.title}</span>
                </span>)}
                {dayEntries.length > 2 && <span className="text-[10px] text-stone-500">+{dayEntries.length - 2}개</span>}
              </span>
            </button>
          );
        })}
      </div>
      <footer className="flex flex-wrap items-center gap-3 px-4 py-3 text-xs text-stone-500"><span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-500" />개최 일정</span><span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-violet-500" />해커톤</span><span><span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500" />신청 마감</span><span>필터가 달력과 목록에 함께 적용됩니다.</span></footer>
    </section>
  );
}
